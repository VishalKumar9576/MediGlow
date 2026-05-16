const { CartQueries } = require('../queries/cart.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');
const { emitToUser } = require('../../../shared/socket.js');

const getCart = async (req, res) => {
    try {
        const cart = await CartQueries.getCartByUserId(req.user.id);
        return successResponse(res, cart, 'Cart fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cartId = await CartQueries.addToCart(req.user.id, productId, quantity);
        
        // Notify via socket
        emitToUser(req.user.id, 'cart_updated', { message: 'Item added to cart', productId });

        return successResponse(res, { cartId }, 'Item added to cart');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const updateCart = async (req, res) => {
    try {
        const { cartId, quantity } = req.body;
        await CartQueries.updateCartQuantity(cartId, quantity);
        return successResponse(res, null, 'Cart updated successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        await CartQueries.removeFromCart(cartId);
        return successResponse(res, null, 'Item removed from cart');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCart,
    removeFromCart
};
