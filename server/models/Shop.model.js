import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['Cloth', 'Beauty', 'Book', 'Food', 'Tech', 'Other'],
        required: true
    },
    stallNumber: {
        type: String,
        required: true,
        trim: true
    },
    floorNumber: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    shopLogo: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
