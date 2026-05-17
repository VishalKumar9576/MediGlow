const pool = require("../../../config/db");

const firstImageSql = `(SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order, pi.id LIMIT 1)`;

async function getProductCardRows(whereClause, params = []) {
  const sql = `
        SELECT p.id, p.name, p.slug, p.price, p.old_price, p.rating, p.review_count,
               p.badge, p.is_doctor_choice, ${firstImageSql} AS image
        FROM products p
        WHERE ${whereClause}
    `;
  const [rows] = await pool.execute(sql, params);
  return rows;
}

const HomeQueries = {
  getHomePayload: async () => {
    const [
      [categories],
      [brands],
      [featureRows],
      [promoBanners],
      [dualBanners],
      [topRows],
      [essRows],
      [trendRows],
      [concernList]
    ] = await Promise.all([
      pool.execute("SELECT id, title, image FROM categories ORDER BY id"),
      pool.execute("SELECT id, name, image FROM brands ORDER BY id"),
      pool.execute("SELECT id, title, subtitle, image_url AS image FROM features ORDER BY id"),
      pool.execute("SELECT id, image_url AS image, alt_text AS alt FROM banners WHERE type = ? ORDER BY sort_order, id", ["promo"]),
      pool.execute("SELECT id, image_url AS image, alt_text AS alt FROM banners WHERE type = ? ORDER BY sort_order, id", ["dual"]),
      pool.execute(`
            SELECT p.id, p.name, p.price, p.old_price AS oldPrice, p.rating, p.review_count AS reviews,
                   p.slug,
                   ${firstImageSql} AS image
            FROM home_section_products h
            JOIN products p ON p.id = h.product_id
            WHERE h.section = 'top_seller'
            ORDER BY h.sort_order
        `),
      pool.execute(`
            SELECT p.id, p.name, p.price, p.old_price AS oldPrice, p.rating, p.review_count,
                   p.slug,
                   p.badge, p.is_doctor_choice AS doctorChoice,
                   ${firstImageSql} AS image
            FROM home_section_products h
            JOIN products p ON p.id = h.product_id
            WHERE h.section = 'essentials'
            ORDER BY h.sort_order
        `),
      pool.execute(`
            SELECT p.id, p.name, p.price, p.old_price AS oldPrice, p.review_count AS reviews,
                   p.slug,
                   ${firstImageSql} AS image
            FROM home_section_products h
            JOIN products p ON p.id = h.product_id
            WHERE h.section = 'trending'
            ORDER BY h.sort_order
        `),
      pool.execute("SELECT id, name FROM concerns ORDER BY id")
    ]);

    const concernProducts = {};
    const concernQueries = concernList.map(c => 
      pool.execute(
        `
                SELECT p.id, p.name, p.price, p.old_price AS oldPrice, p.rating, p.review_count AS reviews,
                      p.slug,
                      ${firstImageSql} AS image
                FROM concern_products cp
                JOIN products p ON p.id = cp.product_id
                WHERE cp.concern_id = ?
                ORDER BY cp.id
            `,
        [c.id],
      ).then(([cRows]) => {
        concernProducts[c.name] = cRows;
      })
    );
    
    await Promise.all(concernQueries);

    const concernTabs = concernList.map((c) => c.name);

    return {
      categories,
      topSellers: topRows,
      brands,
      concernTabs,
      concernProducts,
      promoBanners,
      essentialsProducts: essRows.map((r) => {
        const { doctorChoice, ...rest } = r;
        return { ...rest, doctorChoice: Boolean(doctorChoice) };
      }),
      dualPromoBanners: dualBanners,
      trendingProducts: trendRows,
      features: featureRows,
    };
  },

  getCollectionProducts: async (categoryId = null, search = "") => {
    let sql = `
            SELECT p.id, p.slug, p.display_category AS category, p.name, p.description, p.rating,
                   p.price, p.old_price AS oldPrice, p.badge, p.badge_type AS badgeType,
                   p.is_doctor_choice AS doctorChoice, p.is_sold_out AS isSoldOut,
                   p.show_buy_now AS showBuyNow,
                   ${firstImageSql} AS image
            FROM products p
        `;
    const params = [];
    const whereParts = [];

    if (categoryId) {
      whereParts.push("p.category_id = ?");
      params.push(categoryId);
    } else if (!search) {
      // Default collection view when no search/category
      whereParts.push("p.collection_sort IS NOT NULL");
    }

    if (search) {
      whereParts.push(`
        (
          LOWER(p.name) LIKE ?
          OR LOWER(p.description) LIKE ?
          OR LOWER(p.display_category) LIKE ?
        )
      `);
      const keyword = `%${search.toLowerCase()}%`;
      params.push(keyword, keyword, keyword);
    }

    if (whereParts.length > 0) {
      sql += ` WHERE ${whereParts.join(" AND ")}`;
    }

    sql += ` ORDER BY p.collection_sort, p.id`;

    const [rows] = await pool.execute(sql, params);
    return rows.map((r) => ({
      ...r,
      doctorChoice: Boolean(r.doctorChoice),
      isSoldOut: Boolean(r.isSoldOut),
      showBuyNow: Boolean(r.showBuyNow),
    }));
  },

  searchProducts: async (searchTerm = "") => {
    if (!searchTerm || !searchTerm.trim()) {
      return [];
    }

    const keyword = `%${searchTerm.toLowerCase()}%`;
    const [rows] = await pool.execute(
      `
      SELECT p.id, p.name, p.slug, p.price, p.old_price AS oldPrice, p.rating,
             p.display_category AS category,
             ${firstImageSql} AS image
      FROM products p
      WHERE LOWER(p.name) LIKE ?
         OR LOWER(p.description) LIKE ?
         OR LOWER(p.display_category) LIKE ?
      ORDER BY
        CASE WHEN LOWER(p.name) LIKE ? THEN 0 ELSE 1 END,
        p.name ASC
      LIMIT 12
      `,
      [keyword, keyword, keyword, keyword],
    );

    return rows;
  },

  getFeatures: async () => {
    const [rows] = await pool.execute(
      "SELECT id, title, subtitle, image_url AS image FROM features ORDER BY id",
    );
    return rows;
  },
};

module.exports = HomeQueries;
