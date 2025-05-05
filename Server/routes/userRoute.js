import express from "express";
import { fetchUser, loginUser, registerUser, verifyUser } from "../controllers/userController.js";
const router = express.Router()

router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post('/me', fetchUser);
// router.post('/verify', verifyUser);
// router.get("/me", userAuth, myProfile);

export default router;