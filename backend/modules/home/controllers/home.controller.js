const HomeQueries = require('../queries/home.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getHome = async (req, res) => {
    try {
        const data = await HomeQueries.getHomePayload();
        return successResponse(res, data, 'Home data fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getCollectionProducts = async (req, res) => {
    try {
        const { category, search = '' } = req.query;
        const collectionProducts = await HomeQueries.getCollectionProducts(category, search);
        const features = await HomeQueries.getFeatures();
        return successResponse(
            res,
            { collectionProducts, features },
            'Collection page data fetched successfully'
        );
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const searchProducts = async (req, res) => {
    try {
        const { query = '' } = req.query;
        const products = await HomeQueries.searchProducts(query);
        return successResponse(res, products, 'Search results fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getHome,
    getCollectionProducts,
    searchProducts,
};
