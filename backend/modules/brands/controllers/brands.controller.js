const { BrandQueries } = require('../../categories/queries/categories.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getAllBrands = async (req, res) => {
    try {
        const brands = await BrandQueries.getAllBrands();
        return successResponse(res, brands, 'Brands fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const addBrand = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return errorResponse(res, 'Name is required', 400);
        }

        const brandId = await BrandQueries.createBrand(req.body);
        return successResponse(res, { id: brandId }, 'Brand added successfully', 201);
    } catch (err) {
        console.error('Error in addBrand:', err);
        return errorResponse(res, err.message);
    }
};

const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await BrandQueries.updateBrand(id, req.body);
        if (!success) {
            return errorResponse(res, 'Brand not found or no changes made', 404);
        }
        return successResponse(res, null, 'Brand updated successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await BrandQueries.deleteBrand(id);
        if (!success) {
            return errorResponse(res, 'Brand not found', 404);
        }
        return successResponse(res, null, 'Brand deleted successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getAllBrands,
    addBrand,
    updateBrand,
    deleteBrand
};
