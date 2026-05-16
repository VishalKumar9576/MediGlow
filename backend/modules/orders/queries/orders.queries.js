const pool = require("../../../config/db");

const firstImageSql = `(SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order, pi.id LIMIT 1)`;

const normalizeOrders = (orders = []) => {
  return orders.map((order) => {
    let parsedItems = order.items;

    if (typeof parsedItems === "string") {
      try {
        parsedItems = JSON.parse(parsedItems);
      } catch {
        parsedItems = [];
      }
    }

    return {
      ...order,
      items: Array.isArray(parsedItems) ? parsedItems : [],
    };
  });
};

const OrderQueries = {
  createOrder: async (userId, totalAmount, items, shipping = 0, tax = 0) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const [orderResult] = await connection.execute(
        "INSERT INTO orders (user_id, total_amount, shipping_amount, tax_amount) VALUES (?, ?, ?, ?)",
        [userId, totalAmount, shipping, tax],
      );
      const orderId = orderResult.insertId;

      for (const item of items) {
        await connection.execute(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, item.product_id, item.quantity, item.price],
        );
      }

      await connection.execute(
        "INSERT INTO order_history (user_id, order_id, action, details) VALUES (?, ?, ?, ?)",
        [
          userId,
          orderId,
          "purchased",
          `Ordered ${items.length} items for Rs.${totalAmount}`,
        ],
      );

      await connection.commit();
      return orderId;
    } catch (err) {
      if (connection) await connection.rollback();
      throw err;
    } finally {
      if (connection) connection.release();
    }
  },

  getUserOrders: async (userId) => {
    // Fetch orders
    const [orders] = await pool.execute(
      "SELECT o.* FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC",
      [userId],
    );

    if (!orders || orders.length === 0) return [];

    const orderIds = orders.map((o) => o.id);
    // Fetch items for these orders
    const [items] = await pool.execute(
      `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price, p.name as product_name, (
                SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order, pi.id LIMIT 1
            ) as image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id IN (${orderIds.map(() => "?").join(",")})`,
      orderIds,
    );

    // Attach items to orders
    const ordersById = {};
    orders.forEach((o) => {
      ordersById[o.id] = { ...o, items: [] };
    });
    items.forEach((it) => {
      if (ordersById[it.order_id]) {
        ordersById[it.order_id].items.push({
          id: it.id,
          product_id: it.product_id,
          quantity: it.quantity,
          price: it.price,
          product_name: it.product_name,
          image_url: it.image_url,
        });
      }
    });

    return Object.values(ordersById);
  },

  getAllOrders: async () => {
    const [orders] = await pool.query(
      "SELECT o.*, u.full_name as customer_name, u.email as customer_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC",
    );
    if (!orders || orders.length === 0) return [];
    const orderIds = orders.map((o) => o.id);

    const [items] = await pool.execute(
      `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price, p.name as product_name, (
                SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order, pi.id LIMIT 1
            ) as image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id IN (${orderIds.map(() => "?").join(",")})`,
      orderIds,
    );

    const ordersById = {};
    orders.forEach((o) => {
      ordersById[o.id] = { ...o, items: [] };
    });
    items.forEach((it) => {
      if (ordersById[it.order_id]) {
        ordersById[it.order_id].items.push({
          id: it.id,
          product_id: it.product_id,
          quantity: it.quantity,
          price: it.price,
          product_name: it.product_name,
          image_url: it.image_url,
        });
      }
    });

    return Object.values(ordersById);
  },

  getOrderById: async (orderId, userId, userRole) => {
    // Validate access
    if (!orderId) return null;
    const params = [orderId];
    let orderQuery =
      "SELECT o.id, o.user_id, o.status, o.total_amount, o.shipping_amount, o.tax_amount, o.created_at, u.full_name as customer_name, u.email as customer_email FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = ?";
    if (userRole !== "admin") {
      orderQuery += " AND o.user_id = ?";
      params.push(userId);
    }

    const [orders] = await pool.execute(orderQuery + " LIMIT 1", params);
    if (!orders || orders.length === 0) return null;
    const order = orders[0];

    const [items] = await pool.execute(
      `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price, p.name as product_name, (
                SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order, pi.id LIMIT 1
            ) as image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?`,
      [orderId],
    );

    return {
      ...order,
      items: items.map((it) => ({
        id: it.id,
        product_id: it.product_id,
        quantity: it.quantity,
        price: it.price,
        product_name: it.product_name,
        image_url: it.image_url,
      })),
    };
  },
};

module.exports = OrderQueries;
