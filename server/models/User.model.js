import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userType: {
        type: String,
        enum: ['customer', 'seller', 'admin'],
        default: 'customer'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg'
    },
    // Seller-specific fields
    shopName: {
        type: String,
        required: function() { return this.userType === 'seller'; },
        trim: true
    },
    category: {
        type: String,
        enum: ['Cloth', 'Beauty', 'Book', 'Food', 'Tech', 'Other'],
        required: function() { return this.userType === 'seller'; }
    },
    stallNumber: {
        type: String,
        required: function() { return this.userType === 'seller'; },
        trim: true
    },
    floorNumber: {
        type: String,
        required: function() { return this.userType === 'seller'; },
        trim: true
    },
    description: {
        type: String,
        required: function() { return this.userType === 'seller'; },
        trim: true
    },
    shopLogo: {
        type: String, // Will store the image URL/path
        required: function() { return this.userType === 'seller'; }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: function() { return this.userType === 'customer'; } // Auto-approve customers, sellers need approval
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
