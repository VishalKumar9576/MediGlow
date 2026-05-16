const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const socketModule = require('./shared/socket');
require('./config/db');
const authRoutes = require('./modules/auth/routes/auth.routes');
const productRoutes = require('./modules/products/routes/products.routes');
const categoryRoutes = require('./modules/categories/routes/categories.routes');
const brandRoutes = require('./modules/brands/routes/brands.routes');
const bannerRoutes = require('./modules/banners/routes/banners.routes');
const cartRoutes = require('./modules/cart/routes/cart.routes');
const orderRoutes = require('./modules/orders/routes/orders.routes');
const historyRoutes = require('./modules/history/routes/history.routes');
const homeRoutes = require('./modules/home/routes/home.routes');
const dashboardRoutes = require('./modules/dashboard/routes/dashboard.routes');
const userRoutes = require('./modules/users/routes/user.routes');
const blogRoutes = require('./modules/blogs/routes/blogs.routes');
const paymentRoutes = require('./modules/payments/routes/payments.routes');
const adminRoutes = require('./modules/admin/routes/admin.routes');


const app = express();
const server = http.createServer(app);

// Initialize Socket.io
socketModule.init(server);

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'x-rtb-fingerprint-id', 'request-id'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Running"
  });
});


const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process and restart backend.`);
        process.exit(1);
    }

    throw error;
});
