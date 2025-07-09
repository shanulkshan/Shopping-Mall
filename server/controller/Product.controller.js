import Product from "../models/Product.model.js";

import { errorHandle } from "../utils/error.js";

export const Productcreate = async (req, res, next) => {
  const { shopId,
    title,
    image,
    desc,
    qrimage,
    quntity,
    price, } = req.body;

  const newbeaty = new Product({
    shopId,
    title,
    image,
    desc,
    qrimage,
    quntity,
    price,


  });
  try {
    const savedbeaty = await newbeaty.save();
    res.status(201).json(savedbeaty);
  } catch (error) {
    next(error);
  }
};



//get all product
export const getallproduct = async (req, res, next) => {
  try {
    const getproduct = await Product.find();

    if (getproduct.length > 0) {
      res.json({
        message: "From details retrieved successfully",
        getproduct,
      });
    } else {
      return next(errorHandle(404, " data not fonud "));
    }
  } catch (error) {
    console.log(error.message);

    next(error);
  }
};


export const getProudct = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    console.log(shopId)


    const items = await Product.find({ shopId });
    console.log(items)




    res.json(items);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.ProductId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updateBeauty = await Product.findByIdAndUpdate(
      req.params.ProdctId,
      {
        $set: {
          title: req.body.title,
          image: req.body.image,
          desc: req.body.desc,
          qrimage: req.body.qrimage,
          quntity: req.body.quntity,
          price: req.body.price,
        },
      },
      { new: true }
    );
    res.status(200).json(updateBeauty);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.ProdctId);
    if (!product) {
      return next(errorHandle(404, "Product not found"));
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}