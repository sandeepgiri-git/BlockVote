import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status:{
        type:String,
        default:"Not provided"
    },
    candidates: [
        {
            name: {type: String, required: true},
            // party: {type: String, required: true},
            votes: {type: Number, default: 0}
        }
    ]
}, {timestamps:true});

export const Election = mongoose.models.Election || mongoose.model('Election', electionSchema);
