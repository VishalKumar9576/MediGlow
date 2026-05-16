const BannerQueries = require('../queries/banners.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getAllBanners = async (req, res) => {
    try {
        const banners = await BannerQueries.getAllBanners();
        return successResponse(res, banners, 'Banners fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getBannersByType = async (req, res) => {
    try {
        const { type } = req.params;
        const banners = await BannerQueries.getBannersByType(type);
        return successResponse(res, banners, `${type} banners fetched successfully`);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getAllBanners,
    getBannersByType
};
