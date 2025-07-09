import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        required: true
    }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    size: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    material: {
        type: String,
        trim: true
    },
    weight: {
        type: String,
        trim: true
    },
    dimensions: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
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

// Calculate discounted price before saving
itemSchema.pre('save', function(next) {
    if (this.discount > 0) {
        this.price = this.originalPrice - (this.originalPrice * this.discount / 100);
    } else {
        this.price = this.originalPrice;
    }
    next();
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
