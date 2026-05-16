const OrderQueries = require('../queries/orders.queries');
const { CartQueries } = require('../../cart/queries/cart.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');
const PDFDocument = require('pdfkit');

const buildInvoicePdfBuffer = (order) => new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const createdDate = new Date(order.created_at).toLocaleDateString('en-IN');
    const subtotal = order.items.reduce(
        (sum, item) => sum + (Number(item.price) * Number(item.quantity)),
        0
    );

    doc.fontSize(20).text('DERMAWALA - TAX INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Invoice No: INV-ORD-${order.id}`);
    doc.text(`Order No: ORD-${order.id}`);
    doc.text(`Date: ${createdDate}`);
    doc.text(`Customer: ${order.customer_name || 'N/A'}`);
    doc.text(`Email: ${order.customer_email || 'N/A'}`);
    doc.text(`Status: ${order.status || 'pending'}`);
    doc.moveDown();
    doc.text('Items:', { underline: true });
    doc.moveDown(0.5);

    order.items.forEach((item, index) => {
        const lineTotal = Number(item.price) * Number(item.quantity);
        doc.text(
            `${index + 1}. ${item.product_name} | Qty: ${item.quantity} | Price: Rs.${item.price} | Total: Rs.${lineTotal.toFixed(2)}`
        );
    });

    doc.moveDown();
    doc.text(`Subtotal: Rs.${subtotal.toFixed(2)}`);
    doc.font('Helvetica-Bold').text(`Grand Total: Rs.${Number(order.total_amount).toFixed(2)}`);
    doc.font('Helvetica');
    doc.moveDown();
    doc.text('Thank you for shopping with DermaWala.');

    doc.end();
});

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await CartQueries.getCartByUserId(userId);

        if (cartItems.length === 0) {
            return errorResponse(res, 'Cart is empty', 400);
        }

        const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        const orderId = await OrderQueries.createOrder(userId, totalAmount, cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        })));

        // Clear cart after successful order
        await CartQueries.clearCart(userId);

        return successResponse(res, { orderId }, 'Order placed successfully', 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user.id;
        
        let orders;
        if (userRole === 'admin') {
            orders = await OrderQueries.getAllOrders();
        } else {
            orders = await OrderQueries.getUserOrders(userId);
        }
        
        return successResponse(res, orders, 'Orders fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderId = Number(req.params.orderId);
        if (!orderId) {
            return errorResponse(res, 'Invalid order id', 400);
        }

        const order = await OrderQueries.getOrderById(orderId, req.user.id, req.user.role);
        if (!order) {
            return errorResponse(res, 'Order not found', 404);
        }

        return successResponse(res, order, 'Order details fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const downloadInvoice = async (req, res) => {
    try {
        const orderId = Number(req.params.orderId);
        if (!orderId) {
            return errorResponse(res, 'Invalid order id', 400);
        }

        const order = await OrderQueries.getOrderById(orderId, req.user.id, req.user.role);
        if (!order) {
            return errorResponse(res, 'Order not found', 404);
        }

        const pdfBuffer = await buildInvoicePdfBuffer(order);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-ORD-${order.id}.pdf`);
        res.setHeader('Content-Length', pdfBuffer.length);
        return res.status(200).send(pdfBuffer);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    placeOrder,
    getUserOrders,
    getOrderById,
    downloadInvoice
};
