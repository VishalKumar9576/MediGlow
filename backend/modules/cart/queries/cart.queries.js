const pool = require("../../../config/db");

const CartQueries = {
  getCartByUserId: async (userId) => {
    const [rows] = await pool.execute(
      `
            SELECT c.*, 
                   MAX(p.name) as name, 
                   MAX(p.price) as price, 
                   MAX(p.slug) as slug, 
                   MAX(p.size) as size, 
                   MAX(p.rating) as rating, 
                   MAX(pi.image_url) as image_url
            FROM carts c
            JOIN products p ON c.product_id = p.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE c.user_id = ?
            GROUP BY c.id
        `,
      [userId],
    );
    return rows;
  },

  addToCart: async (userId, productId, quantity = 1) => {
    const [existing] = await pool.execute(
      "SELECT * FROM carts WHERE user_id = ? AND product_id = ?",
      [userId, productId],
    );
    if (existing.length > 0) {
      await pool.execute(
        "UPDATE carts SET quantity = quantity + ? WHERE id = ?",
        [quantity, existing[0].id],
      );
      return existing[0].id;
    } else {
      const [result] = await pool.execute(
        "INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, productId, quantity],
      );
      return result.insertId;
    }
  },

  updateCartQuantity: async (cartId, quantity) => {
    await pool.execute("UPDATE carts SET quantity = ? WHERE id = ?", [
      quantity,
      cartId,
    ]);
  },

  removeFromCart: async (cartId) => {
    await pool.execute("DELETE FROM carts WHERE id = ?", [cartId]);
  },

  clearCart: async (userId) => {
    await pool.execute("DELETE FROM carts WHERE user_id = ?", [userId]);
  },
};

const OrderQueries = {
  createOrder: async (userId, totalAmount, items) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const [orderResult] = await connection.execute(
        "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
        [userId, totalAmount],
      );
      const orderId = orderResult.insertId;

      for (const item of items) {
        await connection.execute(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, item.product_id, item.quantity, item.price],
        );
      }

      // Create history entry
      await connection.execute(
        "INSERT INTO order_history (user_id, order_id, action, details) VALUES (?, ?, ?, ?)",
        [
          userId,
          orderId,
          "purchased",
          `Ordered ${items.length} items for ₹${totalAmount}`,
        ],
      );

      await connection.commit();
      return orderId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = {
  CartQueries,
  OrderQueries,
};
