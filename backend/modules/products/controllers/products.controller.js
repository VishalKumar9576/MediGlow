const ProductQueries = require('../queries/products.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getAllProducts = async (req, res) => {
    try {
        const filters = {
            category_id: req.query.category_id,
            brand_id: req.query.brand_id,
            condition: req.query.condition,
            is_doctor_choice: req.query.is_doctor_choice
        };
        const products = await ProductQueries.getAllProducts(filters);
        return successResponse(res, products, 'Products fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await ProductQueries.getProductBySlug(slug);
        
        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        return successResponse(res, product, 'Product detail fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const products = await ProductQueries.getFeaturedProducts(req.query.limit || 10);
        return successResponse(res, products, 'Featured products fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const addReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const reviewData = req.body;
        
        if (!reviewData.rating || !reviewData.name || !reviewData.comment) {
            return errorResponse(res, 'Missing required review fields', 400);
        }

        const insertId = await ProductQueries.addReview(productId, reviewData);
        return successResponse(res, { id: insertId }, 'Review submitted successfully', 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const addQuestion = async (req, res) => {
    try {
        const productId = req.params.id;
        const questionData = req.body;

        if (!questionData.name || !questionData.question) {
            return errorResponse(res, 'Missing required question fields', 400);
        }

        const insertId = await ProductQueries.addQuestion(productId, questionData);
        return successResponse(res, { id: insertId }, 'Question submitted successfully', 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const answerQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const { answer } = req.body;

        if (!answer) {
            return errorResponse(res, 'Answer is required', 400);
        }

        const updated = await ProductQueries.answerQuestion(questionId, answer);
        if (!updated) {
            return errorResponse(res, 'Question not found', 404);
        }

        return successResponse(res, null, 'Question answered successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const addProduct = async (req, res) => {
    try {
        const productData = req.body;
        if (!productData.name || !productData.price || !productData.category_id) {
            return errorResponse(res, 'Name, price, and category are required', 400);
        }

        // Generate slug
        const slug = productData.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + Date.now();

        console.log('Adding product (admin):', {
            name: productData.name,
            category_id: productData.category_id,
            brand_id: productData.brand_id,
            image_url: productData.image_url
        });

        const productId = await ProductQueries.createProduct({ ...productData, slug });

        console.log(`Product created id=${productId} slug=${slug} image_url=${productData.image_url}`);
        return successResponse(res, { id: productId, slug }, 'Product added successfully', 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        
        const success = await ProductQueries.updateProduct(id, productData);
        if (!success) {
            return errorResponse(res, 'Product not found or no changes made', 404);
        }
        
        return successResponse(res, null, 'Product updated successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await ProductQueries.deleteProduct(id);
        if (!success) {
            return errorResponse(res, 'Product not found', 404);
        }
        
        return successResponse(res, null, 'Product deleted successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getAllProducts,
    getProductBySlug,
    getFeaturedProducts,
    addReview,
    addQuestion,
    answerQuestion,
    addProduct,
    updateProduct,
    deleteProduct
};
