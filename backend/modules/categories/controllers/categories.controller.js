const { CategoryQueries } = require('../queries/categories.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryQueries.getAllCategories();
        return successResponse(res, categories, 'Categories fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const addCategory = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return errorResponse(res, 'Title is required', 400);
        }

        const categoryId = await CategoryQueries.createCategory(req.body);
        return successResponse(res, { id: categoryId }, 'Category added successfully', 201);
    } catch (err) {
        console.error('Error in addCategory:', err);
        return errorResponse(res, err.message);
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await CategoryQueries.updateCategory(id, req.body);
        if (!success) {
            return errorResponse(res, 'Category not found or no changes made', 404);
        }
        return successResponse(res, null, 'Category updated successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await CategoryQueries.deleteCategory(id);
        if (!success) {
            return errorResponse(res, 'Category not found', 404);
        }
        return successResponse(res, null, 'Category deleted successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
};
