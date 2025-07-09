import express from "express";

import { Promotioncreate, getallPromotion, getPromotion, updatePromotion, deletePromotion } from "../controller/Promotion.controller.js";


const router = express.Router();

router.post('/', Promotioncreate);
router.get('/', getallPromotion);
router.get('/:id', getPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

export default router;