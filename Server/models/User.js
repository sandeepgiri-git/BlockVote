import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true,minLength :8},
    aadharNumber:{type: String, required: true,unique: true},
})


userSchema.methods.correctPassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if model already exists before defining
export const User = mongoose.models.User || mongoose.model('User', userSchema);
