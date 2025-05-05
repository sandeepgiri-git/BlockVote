import express from "express";
import { createElection, getAllElections } from "../controllers/electionController.js";
const router = express.Router()

router.get('/get-election', getAllElections);
router.post('/create-election', createElection);


export default router;