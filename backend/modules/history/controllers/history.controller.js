const HistoryQueries = require('../queries/history.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getHistory = async (req, res) => {
    try {
        const history = await HistoryQueries.getUserHistory(req.user.id);
        return successResponse(res, history, 'Purchase history fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const deleteHistory = async (req, res) => {
    try {
        const { historyId } = req.params;
        await HistoryQueries.deleteHistoryEntry(historyId, req.user.id);
        return successResponse(res, null, 'History entry deleted successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getHistory,
    deleteHistory
};
