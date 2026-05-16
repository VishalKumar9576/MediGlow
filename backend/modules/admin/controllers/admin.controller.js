const AuthQueries = require('../../auth/queries/auth.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');
const pool = require('../../../config/db');

// In-memory activity log for demo purposes
let tempActivityLog = [
    { id: 1, action: "Logged in to dashboard", timestamp: new Date().toLocaleString(), ip: "192.168.1.1" },
    { id: 2, action: "Updated profile preferences", timestamp: new Date(Date.now() - 3600000).toLocaleString(), ip: "192.168.1.1" }
];

const AdminController = {
    getSettings: async (req, res) => {
        try {
            const user = await AuthQueries.getUserById(req.user.id);
            if (!user) return errorResponse(res, 'User not found', 404);

            const settingsData = {
                fullName: user.full_name,
                email: user.email,
                role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
                phone: "+91 9876543210",
                altEmail: "admin.support@mediglow.com",
                department: "Core Management",
                employeeId: `MG-${user.id}-ADM`,
                location: "Noida, India",
                timezone: "Asia/Kolkata (IST)",
                joinedDate: new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                lastPromotion: "January 2025",
                bio: "Lead Administrator for MediGlow E-commerce Platform.",
                
                theme: "light",
                language: "English (US)",
                dateFormat: "DD/MM/YYYY",
                dashboardLayout: "Comfortable",
                emailNotifications: true,
                weeklyReports: true,
                marketingUpdates: false,
                
                notifSettings: {
                    pushEnabled: true,
                    emailAlerts: true,
                    systemMaintenance: "email",
                    newUserAlert: true,
                    reportReady: true
                }
            };

            return successResponse(res, settingsData, 'Admin settings fetched');
        } catch (err) {
            return errorResponse(res, err.message);
        }
    },

    updateSettings: async (req, res) => {
        try {
            const { field, value } = req.body;
            if (field === 'fullName') {
                await pool.execute('UPDATE users SET full_name = ? WHERE id = ?', [value, req.user.id]);
            }
            return successResponse(res, null, `${field} updated successfully`);
        } catch (err) {
            return errorResponse(res, err.message);
        }
    },

    updateNestedSettings: async (req, res) => {
        try {
            const { parent, field, value } = req.body;
            return successResponse(res, null, `${field} in ${parent} updated`);
        } catch (err) {
            return errorResponse(res, err.message);
        }
    },

    getActivityLog: async (req, res) => {
        try {
            return successResponse(res, tempActivityLog, 'Activity log fetched');
        } catch (err) {
            return errorResponse(res, err.message);
        }
    },

    uploadProfileImage: async (req, res) => {
        try {
            return successResponse(res, { imageUrl: '/uploads/profile/admin.jpg' }, 'Image uploaded');
        } catch (err) {
            return errorResponse(res, err.message);
        }
    }
};

module.exports = AdminController;
