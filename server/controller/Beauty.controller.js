import Beauty from "../models/Beauty.model.js";

import { errorHandle } from "../utils/error.js";

export const Beautycreate = async (req, res, next) => {
  const { stallNumber, FloorNumber, name, image, Des } = req.body;

  const newbeaty = new Beauty({
    name,
    image,
    stallNumber,
    FloorNumber,
    Des,
  });
  try {
    const savedbeaty = await newbeaty.save();
    res.status(201).json(savedbeaty);
  } catch (error) {
    next(error);
  }
};

export const getBeuty = async (req, res, next) => {
  try {
    const getbeaty = await Beauty.find();

    if (getbeaty.length > 0) {
      res.json({
        message: "From details retrieved successfully",
        getbeaty,
      });
    } else {
      return next(errorHandle(404, " data not fonud "));
    }
  } catch (error) {
    console.log(error.message);

    next(error);
  }
};

export const deleteBeauty = async (req, res, next) => {
  try {
    await Beauty.findByIdAndDelete(req.params.BeautyId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateBeauty = async (req, res, next) => {
  try {
    const updateBeauty = await Beauty.findByIdAndUpdate(
      req.params.BeatyId,
      {
        $set: {
          name: req.body.name,
          image: req.body.image,
          quantity: req.body.quantity,
          Des: req.body.Des,
        },
      },
      { new: true }
    );
    res.status(200).json(updateBeauty);
  } catch (error) {
    next(error);
  }
};

export const getBeutyById = async (req, res, next) => {
  try {
    const getbeaty = await Beauty.findById(req.params.BeautyId);

    if (
      getbeaty
    ) {
      res.json(getbeaty);
    }
  }
  catch (error) {
    next(error);
  }
}
