import Promotions from "../models/PromotionModel.js";

export const Promotioncreate = async (req, res) => {
    try {
        const promotion = {
            itemName: req.body.itemName,
            itemImage: req.body.itemImage,
            oldPrice: req.body.oldPrice,
            shopName: req.body.shopName,
            stallNumber: req.body.stallNumber,
            floorNumber: req.body.floorNumber,
            discountRate: req.body.discountRate,
            newPrice: req.body.newPrice,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        }
        const newPromotion = new Promotions(promotion);
        await newPromotion.save()
        res.send(newPromotion);

    } catch (err) {
        res.send(err)
    }
};

export const getallPromotion = async (req, res) => {
    try {
        const promotion = await Promotions.find()
        res.send(promotion)

    } catch (err) {
        res.send(err)
    }
};

export const getPromotion = async (req, res) => {
    try {
        const id = req.params.id
        const promotion = await Promotions.findById(id)
        res.send(promotion)

    } catch (err) {
        res.send(err)
    }
};

export const deletePromotion = async (req, res, next) => {
    try {
        const id = req.params.id
        const promotion = await Promotions.findByIdAndDelete(id)
        res.send(promotion)

    } catch (err) {
        res.send(err)
    }
};

export const updatePromotion = async (req, res, next) => {
    try {
        const id = req.params.id
        const newPromotion = req.body
        const promotion = await Promotions.findByIdAndUpdate(id, newPromotion)
        res.send(promotion)

    } catch (err) {
        res.send(err)
    }
};