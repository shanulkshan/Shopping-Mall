import User from '../models/User.model.js';
import Shop from '../models/Shop.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandle } from '../utils/error.js';

// Register new user
export const register = async (req, res, next) => {
    try {
        const { 
            username, 
            email, 
            password, 
            userType,
            // Seller-specific fields
            shopName,
            category,
            stallNumber,
            floorNumber,
            description
        } = req.body;

        // Get uploaded file path if exists
        const shopLogo = req.file ? req.file.filename : '';

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return next(errorHandle(400, 'User with this email or username already exists'));
        }

        // Validate seller fields if user type is seller
        if (userType === 'seller') {
            if (!shopName || !category || !stallNumber || !floorNumber || !description) {
                return next(errorHandle(400, 'All shop details are required for seller registration'));
            }
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = bcryptjs.hashSync(password, saltRounds);

        // Create new user
        const userData = {
            username,
            email,
            password: hashedPassword,
            userType: userType || 'customer'
        };

        // Add seller-specific fields if registering as seller
        if (userType === 'seller') {
            userData.shopName = shopName;
            userData.category = category;
            userData.stallNumber = stallNumber;
            userData.floorNumber = floorNumber;
            userData.description = description;
            userData.shopLogo = shopLogo || '';
        }

        const newUser = new User(userData);
        await newUser.save();

        // Create shop entry if user is a seller
        if (userType === 'seller') {
            const newShop = new Shop({
                sellerId: newUser._id,
                shopName,
                category,
                stallNumber,
                floorNumber,
                description,
                shopLogo: shopLogo || ''
            });
            await newShop.save();
        }

        // Remove password from response
        const { password: pass, ...userWithoutPassword } = newUser._doc;

        res.status(201).json({
            success: true,
            message: `${userType === 'seller' ? 'Seller' : 'User'} registered successfully${userType === 'seller' ? '. Your shop is pending approval.' : ''}`,
            user: userWithoutPassword
        });

    } catch (error) {
        next(error);
    }
};

// Login user
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandle(401, 'Invalid credentials'));
        }

        // Check if user is active
        if (!user.isActive) {
            return next(errorHandle(401, 'Account is deactivated'));
        }

        // Check password
        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) {
            return next(errorHandle(401, 'Invalid credentials'));
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from response
        const { password: pass, ...userWithoutPassword } = user._doc;

        // Set cookie and send response
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).status(200).json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        next(error);
    }
};

// Logout user
export const logout = (req, res) => {
    try {
        res.clearCookie('access_token')
           .status(200)
           .json({
               success: true,
               message: 'Logout successful'
           });
    } catch (error) {
        next(error);
    }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return next(errorHandle(404, 'User not found'));
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
    try {
        const { username, email, avatar } = req.body;
        const userId = req.user.id;

        // Check if email or username already exists (excluding current user)
        if (email || username) {
            const existingUser = await User.findOne({
                $and: [
                    { _id: { $ne: userId } },
                    {
                        $or: [
                            ...(email ? [{ email }] : []),
                            ...(username ? [{ username }] : [])
                        ]
                    }
                ]
            });

            if (existingUser) {
                return next(errorHandle(400, 'Email or username already exists'));
            }
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    ...(username && { username }),
                    ...(email && { email }),
                    ...(avatar && { avatar })
                }
            },
            { new: true, select: '-password' }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        next(error);
    }
};

// Change password
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Get user with password
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandle(404, 'User not found'));
        }

        // Verify current password
        const isCurrentPasswordValid = bcryptjs.compareSync(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return next(errorHandle(400, 'Current password is incorrect'));
        }

        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = bcryptjs.hashSync(newPassword, saltRounds);

        // Update password
        await User.findByIdAndUpdate(userId, {
            password: hashedNewPassword
        });

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        next(error);
    }
};

// Create admin user (for initial setup)
export const createAdmin = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if admin already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return next(errorHandle(400, 'User with this email or username already exists'));
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = bcryptjs.hashSync(password, saltRounds);

        // Create admin user
        const adminUser = new User({
            username,
            email,
            password: hashedPassword,
            userType: 'admin',
            role: 'admin'
        });

        await adminUser.save();

        // Remove password from response
        const { password: pass, ...userWithoutPassword } = adminUser._doc;

        res.status(201).json({
            success: true,
            message: 'Admin user created successfully',
            user: userWithoutPassword
        });

    } catch (error) {
        next(error);
    }
};
