import mongoose from 'mongoose';

const Schema = mongoose.Schema

const PromotionSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    itemImage: {
        type: String,
        required: true
    },
    oldPrice: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    stallNumber: {
        type: Number,
        required: true
    },
    floorNumber: {
        type: Number,
        required: true
    },
    discountRate: {
        type: String,
        required: true
    },
    newPrice: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },

}, {
    timestamps: true
})

const promotions = mongoose.model('promotions', PromotionSchema)

export default promotions;