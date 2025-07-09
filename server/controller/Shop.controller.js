import Shop from '../models/Shop.model.js';
import Item from '../models/Item.model.js';
import { errorHandle } from '../utils/error.js';

// Public: Get all approved shops for browsing
export const getPublicShops = async (req, res, next) => {
    try {
        console.log('getPublicShops called with query:', req.query);
        
        const { category, floor, search, sortBy } = req.query;
        
        // Base filter - only approved shops
        const filter = { isApproved: true };
        
        // Add category filter
        if (category && category !== 'all') {
            filter.category = category;
        }
        
        // Add floor filter  
        if (floor && floor !== 'all') {
            filter.floorNumber = floor;
        }
        
        // Add search filter
        if (search && search.trim()) {
            filter.shopName = { $regex: search.trim(), $options: 'i' };
        }
        
        console.log('Filter applied:', filter);
        
        // Determine sort criteria
        let sortCriteria = { createdAt: -1 }; // default: newest first
        if (sortBy === 'name') {
            sortCriteria = { shopName: 1 };
        } else if (sortBy === 'category') {
            sortCriteria = { category: 1, shopName: 1 };
        } else if (sortBy === 'floor') {
            sortCriteria = { floorNumber: 1, stallNumber: 1 };
        }
        
        console.log('Sort criteria:', sortCriteria);
        
        // First try to get all shops to see if there are any
        const allShops = await Shop.find();
        console.log('Total shops in database:', allShops.length);
        
        const shops = await Shop.find(filter)
            .populate('sellerId', 'username')
            .sort(sortCriteria)
            .select('-rejectionReason') // Don't expose rejection reasons to public
            .lean(); // Use lean for better performance
        
        console.log('Filtered shops found:', shops.length);
        
        res.status(200).json({
            success: true,
            shops,
            count: shops.length,
            totalShops: allShops.length
        });
    } catch (error) {
        console.error('Error in getPublicShops:', error);
        console.error('Error stack:', error.stack);
        next(error);
    }
};

// Test route to check if basic shop fetching works
export const testShops = async (req, res, next) => {
    try {
        console.log('Test shops endpoint called');
        const shops = await Shop.find({});
        console.log('Total shops in database:', shops.length);
        console.log('Sample shop:', shops[0] || 'No shops found');
        
        const approvedShops = await Shop.find({ isApproved: true });
        console.log('Approved shops:', approvedShops.length);
        
        res.status(200).json({
            success: true,
            totalShops: shops.length,
            approvedShops: approvedShops.length,
            sampleShop: shops[0] || null
        });
    } catch (error) {
        console.error('Error in testShops:', error);
        next(error);
    }
};

// Admin: Get all pending shops for approval
export const getPendingShops = async (req, res, next) => {
    try {
        const shops = await Shop.find({ isApproved: false })
            .populate('sellerId', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            shops
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get all approved shops
export const getApprovedShops = async (req, res, next) => {
    try {
        const shops = await Shop.find({ isApproved: true })
            .populate('sellerId', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            shops
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Approve a shop
export const approveShop = async (req, res, next) => {
    try {
        const { shopId } = req.params;
        
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(errorHandle(404, 'Shop not found'));
        }

        shop.isApproved = true;
        await shop.save();

        res.status(200).json({
            success: true,
            message: 'Shop approved successfully',
            shop
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Reject/disapprove a shop
export const rejectShop = async (req, res, next) => {
    try {
        const { shopId } = req.params;
        const { reason } = req.body;
        
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(errorHandle(404, 'Shop not found'));
        }

        shop.isApproved = false;
        shop.rejectionReason = reason || 'No reason provided';
        await shop.save();

        res.status(200).json({
            success: true,
            message: 'Shop rejected successfully',
            shop
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get all shops with pagination
export const getAllShops = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const filter = {};
        if (req.query.status) {
            filter.isApproved = req.query.status === 'approved';
        }
        if (req.query.category) {
            filter.category = req.query.category;
        }

        const shops = await Shop.find(filter)
            .populate('sellerId', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Shop.countDocuments(filter);

        res.status(200).json({
            success: true,
            shops,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get seller's shop
export const getSellerShop = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        
        const shop = await Shop.findOne({ sellerId }).populate('sellerId', 'username email');
        
        if (!shop) {
            return next(errorHandle(404, 'Shop not found'));
        }

        res.status(200).json({
            success: true,
            shop
        });
    } catch (error) {
        next(error);
    }
};

// Get shop by ID
export const getShopById = async (req, res, next) => {
    try {
        const { shopId } = req.params;
        
        const shop = await Shop.findById(shopId).populate('sellerId', 'username email');
        
        if (!shop) {
            return next(errorHandle(404, 'Shop not found'));
        }

        res.status(200).json({
            success: true,
            shop
        });
    } catch (error) {
        next(error);
    }
};

// Get all shops by category
export const getShopsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        
        const shops = await Shop.find({ 
            category, 
            isActive: true, 
            isApproved: true 
        }).populate('sellerId', 'username email');

        res.status(200).json({
            success: true,
            shops
        });
    } catch (error) {
        next(error);
    }
};

// Update shop
export const updateShop = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const updates = req.body;

        const shop = await Shop.findOne({ sellerId });
        
        if (!shop) {
            return next(errorHandle(404, 'Shop not found'));
        }

        const updatedShop = await Shop.findByIdAndUpdate(
            shop._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Shop updated successfully',
            shop: updatedShop
        });
    } catch (error) {
        next(error);
    }
};

// Seller: Toggle shop open/closed status
export const toggleShopStatus = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        
        const shop = await Shop.findOne({ sellerId });
        if (!shop) {
            return next(errorHandle(404, 'Shop not found'));
        }
        
        // Toggle the isOpen status
        shop.isOpen = !shop.isOpen;
        await shop.save();
        
        res.status(200).json({
            success: true,
            message: `Shop ${shop.isOpen ? 'opened' : 'closed'} successfully`,
            shop: {
                _id: shop._id,
                shopName: shop.shopName,
                isOpen: shop.isOpen
            }
        });
    } catch (error) {
        console.error('Error toggling shop status:', error);
        next(error);
    }
};
