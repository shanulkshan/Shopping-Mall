import Item from '../models/Item.model.js';
import Shop from '../models/Shop.model.js';
import { errorHandle } from '../utils/error.js';

// Create new item
export const createItem = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const itemData = req.body;

        console.log('Creating item with data:', itemData);
        console.log('Seller ID:', sellerId);

        // Get seller's shop
        const shop = await Shop.findOne({ sellerId });
        if (!shop) {
            return next(errorHandle(404, 'Shop not found. Please contact admin.'));
        }

        if (!shop.isApproved) {
            return next(errorHandle(403, 'Your shop is not approved yet. Please wait for admin approval.'));
        }

        // Validate required fields
        const requiredFields = ['name', 'description', 'originalPrice', 'category', 'stock'];
        for (const field of requiredFields) {
            if (!itemData[field]) {
                return next(errorHandle(400, `${field} is required`));
            }
        }

        // Ensure images array exists
        if (!itemData.images || !Array.isArray(itemData.images) || itemData.images.length === 0) {
            itemData.images = ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgOTBDNjggOTAgOCAxNTAgOCAxNTBTNjggMjEwIDE1MCAyMTBTMjkyIDE1MCAyOTIgMTUwUzIzMiA5MCAxNTAgOTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNTAgMTcyLjVDMTYyLjQyNiAxNzIuNSAxNzIuNSAxNjIuNDI2IDE3Mi41IDE1MEMxNzIuNSAxMzcuNTc0IDE2Mi40MjYgMTI3LjUgMTUwIDEyNy41QzEzNy41NzQgMTI3LjUgMTI3LjUgMTM3LjU3NCAxMjcuNSAxNTBDMTI3LjUgMTYyLjQyNiAxMzcuNTc0IDE3Mi41IDE1MCAxNzIuNVoiIGZpbGw9IiM2MzY5NzUiLz4KPHR4dCB4PSIxNTAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdHh0Pgo8L3N2Zz4K'];
        }

        // Create new item
        const newItem = new Item({
            ...itemData,
            shopId: shop._id,
            sellerId,
            originalPrice: parseFloat(itemData.originalPrice),
            price: parseFloat(itemData.originalPrice), // Initial price same as original
            stock: parseInt(itemData.stock),
            discount: itemData.discount || 0
        });

        await newItem.save();

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            item: newItem
        });
    } catch (error) {
        console.error('Item creation error:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return next(errorHandle(400, `Validation failed: ${validationErrors.join(', ')}`));
        }
        next(error);
    }
};

// Get all items for seller's shop
export const getSellerItems = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        
        const items = await Item.find({ sellerId }).populate('shopId', 'shopName category');

        res.status(200).json({
            success: true,
            items
        });
    } catch (error) {
        next(error);
    }
};

// Get items by shop ID
export const getItemsByShop = async (req, res, next) => {
    try {
        const { shopId } = req.params;
        const { page = 1, limit = 10, category, search, sortBy = 'createdAt', order = 'desc' } = req.query;

        // Build filter
        const filter = { shopId, isActive: true };
        
        if (category && category !== 'all') {
            filter.category = category;
        }
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Build sort
        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        const items = await Item.find(filter)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('shopId', 'shopName category');

        const total = await Item.countDocuments(filter);

        res.status(200).json({
            success: true,
            items,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        next(error);
    }
};

// Get single item
export const getItemById = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        
        const item = await Item.findById(itemId)
            .populate('shopId', 'shopName category stallNumber floorNumber')
            .populate('sellerId', 'username email');

        if (!item) {
            return next(errorHandle(404, 'Item not found'));
        }

        // Increment view count
        await Item.findByIdAndUpdate(itemId, { $inc: { views: 1 } });

        res.status(200).json({
            success: true,
            item
        });
    } catch (error) {
        next(error);
    }
};

// Update item
export const updateItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const sellerId = req.user.id;
        const updates = req.body;

        // Check if item belongs to seller
        const item = await Item.findOne({ _id: itemId, sellerId });
        
        if (!item) {
            return next(errorHandle(404, 'Item not found or you do not have permission to update this item'));
        }

        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            item: updatedItem
        });
    } catch (error) {
        next(error);
    }
};

// Delete item
export const deleteItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const sellerId = req.user.id;

        // Check if item belongs to seller
        const item = await Item.findOne({ _id: itemId, sellerId });
        
        if (!item) {
            return next(errorHandle(404, 'Item not found or you do not have permission to delete this item'));
        }

        await Item.findByIdAndDelete(itemId);

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Apply discount to item
export const applyDiscount = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { discount } = req.body;
        const sellerId = req.user.id;

        if (discount < 0 || discount > 100) {
            return next(errorHandle(400, 'Discount must be between 0 and 100'));
        }

        // Check if item belongs to seller
        const item = await Item.findOne({ _id: itemId, sellerId });
        
        if (!item) {
            return next(errorHandle(404, 'Item not found or you do not have permission to modify this item'));
        }

        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            { 
                $set: { 
                    discount,
                    price: item.originalPrice - (item.originalPrice * discount / 100)
                }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Discount of ${discount}% applied successfully`,
            item: updatedItem
        });
    } catch (error) {
        next(error);
    }
};
