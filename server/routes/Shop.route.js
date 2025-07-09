import express from 'express';
import { 
    getSellerShop,
    getShopById,
    getShopsByCategory,
    updateShop,
    getPendingShops,
    getApprovedShops,
    approveShop,
    rejectShop,
    getAllShops,
    getPublicShops,
    toggleShopStatus
} from '../controller/Shop.controller.js';
import { verifyToken, verifyAdmin } from '../utils/VerfiyUser.js';

const router = express.Router();

// Admin routes (require admin authentication)
router.get('/admin/pending', verifyToken, verifyAdmin, getPendingShops);
router.get('/admin/approved', verifyToken, verifyAdmin, getApprovedShops);
router.get('/admin/all', verifyToken, verifyAdmin, getAllShops);
router.put('/admin/approve/:shopId', verifyToken, verifyAdmin, approveShop);
router.put('/admin/reject/:shopId', verifyToken, verifyAdmin, rejectShop);

// Protected routes (require authentication)
router.get('/my-shop', verifyToken, getSellerShop);
router.put('/update', verifyToken, updateShop);
router.put('/toggle-status', verifyToken, toggleShopStatus);

// Public routes
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Shop routes are working' });
});
router.get('/public', getPublicShops);
router.get('/:shopId', getShopById);
router.get('/category/:category', getShopsByCategory);

export default router;
