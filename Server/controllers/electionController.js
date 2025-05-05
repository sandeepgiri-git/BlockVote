import { Election } from "../models/Election.js";

export const getAllElections = async (req, res) => {
    try {
        const elections = await Election.find();
        return res.json(elections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createElection = async (req, res) => {
    const { title, startDate, endDate,description,candidates,status } = req.body;
    const election = new Election({ title, startDate, endDate,description,candidates,status });
    try {
        await election.save();
        res.status(201).json(election);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}