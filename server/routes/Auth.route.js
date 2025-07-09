import express from 'express';
import { 
    register, 
    login, 
    logout, 
    getCurrentUser, 
    updateProfile, 
    changePassword,
    createAdmin
} from '../controller/Auth.controller.js';
import { verifyToken } from '../utils/VerfiyUser.js';
import upload from '../utils/upload.js';

const router = express.Router();

// Public routes
router.post('/register', upload.single('shopLogo'), register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/create-admin', createAdmin); // For initial admin setup

// Protected routes
router.get('/me', verifyToken, getCurrentUser);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

export default router;
