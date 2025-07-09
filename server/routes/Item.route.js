import express from 'express';
import { 
    createItem,
    getSellerItems,
    getItemsByShop,
    getItemById,
    updateItem,
    deleteItem,
    applyDiscount
} from '../controller/Item.controller.js';
import { verifyToken } from '../utils/VerfiyUser.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/create', verifyToken, createItem);
router.get('/my-items', verifyToken, getSellerItems);
router.put('/:itemId', verifyToken, updateItem);
router.delete('/:itemId', verifyToken, deleteItem);
router.patch('/:itemId/discount', verifyToken, applyDiscount);

// Public routes
router.get('/shop/:shopId', getItemsByShop);
router.get('/:itemId', getItemById);

export default router;
