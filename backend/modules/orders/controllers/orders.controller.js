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

    const BRAND_COLOR = '#00607a';
    const createdDate = new Date(order.created_at).toLocaleDateString('en-IN');
    const subtotal = order.items.reduce(
        (sum, item) => sum + (Number(item.price) * Number(item.quantity)),
        0
    );

    // --- Header Section ---
    doc.rect(0, 0, 612, 100).fill(BRAND_COLOR);
    doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text('MEDIGLOW', 50, 35);
    doc.fontSize(10).font('Helvetica').text('THE FUTURE OF SKINCARE', 50, 65);
    doc.fontSize(16).font('Helvetica-Bold').text('TAX INVOICE', 400, 45, { align: 'right' });

    doc.fillColor('#333333').moveDown(4);

    // --- Order Details Section ---
    doc.fontSize(10).font('Helvetica-Bold').text('Bill To:', 50, 120);
    doc.font('Helvetica').fontSize(12).text(order.customer_name || 'Valued Customer', 50, 135);
    doc.fontSize(10).text(order.customer_email || '', 50, 150);

    doc.font('Helvetica-Bold').text('Invoice Details:', 350, 120);
    doc.font('Helvetica').fontSize(10);
    doc.text(`Invoice No: INV-ORD-${order.id}`, 350, 135);
    doc.text(`Date: ${createdDate}`, 350, 150);
    doc.text(`Order Status: ${(order.status || 'pending').toUpperCase()}`, 350, 165);

    doc.moveDown(3);

    // --- Table Header ---
    const tableTop = 220;
    doc.rect(50, tableTop, 500, 20).fill(BRAND_COLOR);
    doc.fillColor('white').font('Helvetica-Bold').fontSize(10);
    doc.text('S.No', 60, tableTop + 5);
    doc.text('Product Name', 100, tableTop + 5);
    doc.text('Qty', 350, tableTop + 5);
    doc.text('Price (INR)', 400, tableTop + 5);
    doc.text('Total (INR)', 480, tableTop + 5);

    // --- Table Rows ---
    let currentY = tableTop + 25;
    doc.fillColor('#333333').font('Helvetica');

    order.items.forEach((item, index) => {
        const lineTotal = Number(item.price) * Number(item.quantity);
        
        // Alternate row background (light grey)
        if (index % 2 === 1) {
            doc.rect(50, currentY - 5, 500, 20).fill('#f9f9f9');
            doc.fillColor('#333333');
        }

        doc.text(index + 1, 60, currentY);
        doc.text(item.product_name, 100, currentY, { width: 240 });
        doc.text(item.quantity, 350, currentY);
        doc.text(Number(item.price).toFixed(2), 400, currentY);
        doc.text(lineTotal.toFixed(2), 480, currentY);

        currentY += 20;
    });

    // --- Totals Section ---
    const totalsY = currentY + 30;
    doc.moveTo(350, totalsY).lineTo(550, totalsY).stroke('#dddddd');
    
    doc.fontSize(10).font('Helvetica').text('Subtotal:', 350, totalsY + 10);
    doc.text(`Rs. ${subtotal.toFixed(2)}`, 480, totalsY + 10);

    doc.text('GST (18%):', 350, totalsY + 25);
    doc.text(`Rs. ${Number(order.tax_amount || 0).toFixed(2)}`, 480, totalsY + 25);

    doc.text('Shipping:', 350, totalsY + 40);
    doc.text(`Rs. ${Number(order.shipping_amount || 0).toFixed(2)}`, 480, totalsY + 40);

    doc.fontSize(12).font('Helvetica-Bold').fillColor(BRAND_COLOR).text('Grand Total:', 350, totalsY + 60);
    doc.text(`Rs. ${Number(order.total_amount).toFixed(2)}`, 480, totalsY + 60);

    // --- Footer ---
    doc.fillColor('#999999').fontSize(10).font('Helvetica').text(
        'Thank you for choosing MediGlow. For support, email us at support@mediglow.com',
        50,
        750,
        { align: 'center', width: 500 }
    );

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
