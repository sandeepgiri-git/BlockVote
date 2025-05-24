import express from "express";
import { createAadharData, findAadharData } from "../controllers/aadharController.js";
const router = express.Router()

router.post('/', createAadharData);
router.post('/find', findAadharData);

// router.post('/verify', verifyUser);
// router.get("/me", userAuth, myProfile);

export default router;