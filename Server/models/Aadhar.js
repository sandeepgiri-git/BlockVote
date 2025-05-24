import mongoose from "mongoose";

const aadharSchema = new mongoose.Schema({
    aadharNumber: {
        type: String,
        required : true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps:true});

export const Aadhar = mongoose.models.Aadhar || mongoose.model('Aadhar', aadharSchema);
