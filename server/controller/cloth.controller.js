import bookShop from "../models/bookShop.model.js";
import clothing from "../models/clothing.model.js";

import { errorHandle } from "../utils/error.js";

export const clothcreate = async (req, res, next) => {
  const { name,
    image,
    stallNumber,
    FloorNumber,
    Des, } = req.body;

  const newcloth = new clothing({
    name,
    image,
    stallNumber,
    FloorNumber,
    Des,
  });
  try {
    const savedcloth = await newcloth.save();
    res.status(201).json(savedcloth);
  } catch (error) {
    next(error);
  }
};

export const getcloth = async (req, res, next) => {
  try {
    const getcloth = await clothing.find();

    if (getcloth.length > 0) {
      res.json({
        message: "From details retrieved successfully",
        getcloth,
      });
    } else {
      return next(errorHandle(404, " data not fonud "));
    }
  } catch (error) {
    console.log(error.message);

    next(error);
  }
};

export const deletecloth = async (req, res, next) => {
  try {
    await clothing.findByIdAndDelete(req.params.cloothId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatecloth = async (req, res, next) => {
  try {
    const updatecloth = await clothing.findByIdAndUpdate(
      req.params.clothId,
      {
        $set: {
          name: req.body.name,
          image: req.body.image,
          quantity: req.body.quantity,
          color: req.body.color,
          size: req.body.size,
          Des: req.body.Des,
        },
      },
      { new: true }
    );
    res.status(200).json(updatecloth);
  } catch (error) {
    next(error);
  }
};

export const getclothById = async (req, res, next) => {
  try {
    const getcloth = await clothing.findById(req.params.clothId);
    res.status(200).json(getcloth);
  } catch (error) {
    next(error);
  }
};

