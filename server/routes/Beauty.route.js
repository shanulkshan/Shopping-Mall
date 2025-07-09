import express from "express";
import { verifyToken } from "../utils/VerfiyUser.js";
import {
  Beautycreate,
  deleteBeauty,
  getBeuty,
  updateBeauty,
  getBeutyById
} from "../controller/Beauty.controller.js";

const router = express.Router();

router.post("/Bcreate", Beautycreate);
router.get("/BgetAll", getBeuty);
router.get("/:BeautyId", getBeutyById);
router.put("/Beauty/:BeatyId", updateBeauty);
router.delete("/deletebeauty/:BeautyId", deleteBeauty);

export default router;
