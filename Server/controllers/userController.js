import {User} from '../models/User.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { sendMail } from '../middlesware/sendMail.js';

export const registerUser = async (req,res) => {
    try{
        const {name,email,password} = req.body;

        const person = await User.findOne({email});

        if(person){
            return res.status(400).json({message:"Email already exists"})
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        
        const generatedOTP = Math.floor(Math.random() * 1000000);

        const tokenPayload = {
            userId: user._id, // Store only the user ID (or minimal data)
            name: user.name,
            email: user.email,
            password: user.password,
            otp: generatedOTP.toString(),
        };

        const verifyToken = jwt.sign(tokenPayload, process.env.Activation_Sec,
            {
                expiresIn: "10m",
            });

        await sendMail(email,"Voting_System",generatedOTP);

        res.json({
            message: "OTP sent to your mail",
            verifyToken,
            generatedOTP
        });

    }catch(err){
        return res.status(500).json({success:false,message:err.message})
    }
}

export const verifyUser = async (req, res) => {
    try {
        const { otp, verifyToken } = req.body;

        // 1. Validate input exists
        if (!otp || !verifyToken) {
            // User.findByIdAndDelete({email});
            return res.status(400).json({
                success: false,
                message: "Both OTP and verification token are required",
            });
        }

        // 2. Verify environment variables exist
        if (!process.env.Activation_Sec || !process.env.jwt_Sec) {
            // User.findByIdAndDelete({email});
            throw new Error("Missing JWT secret configuration");
        }

        // 3. Verify the token
        const decoded = jwt.verify(verifyToken, process.env.Activation_Sec);

        // 4. Validate decoded content
        if (!decoded?.otp || !decoded?.userId) {
            // User.findByIdAndDelete({email});
            return res.status(400).json({
                success: false,
                message: "Invalid token payload",
            });
        }

        // 5. Compare OTPs
        if (decoded.otp !== otp) { // Ensure string comparison
            // User.findByIdAndDelete({email});
            return res.status(400).json({
                success: false,
                message: "Incorrect OTP",
            });
        }

        // 6. Create new auth token
        const authToken = jwt.sign(
            { _id: decoded.userId, email: decoded.email },
            process.env.jwt_Sec,
            { expiresIn: '7d' }
        );

        // console.log(decoded);

        const user = new User({
            name: decoded.name,
            email: decoded.email,
            password: decoded.password
        })

        user.save();

        return res.json({
            success: true,
            message: "Verification successful",
            user: decoded.userId,
            token: authToken
        });

    } catch (err) {
        console.error("Verification error:", err);

        const statusCode = err.name === 'JsonWebTokenError' ? 401 : 500;
        const message = err.name === 'JsonWebTokenError' 
            ? "Invalid or expired verification token" 
            : "Verification failed";

        return res.status(statusCode).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export const loginUser = async (req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);  
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign({ userId: user._id, name: user.name, email:
            user.email }, process.env.jwt_Sec, {
                expiresIn: '7d',
        });

        return res.json({
            success: true,
            message: "Login successful",
            token
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }

}

export const fetchUser = async (req,res) => {
    
    try {
        const {token} = req.body;
        const decoded = jwt.verify(token, process.env.jwt_Sec);

        if(!decoded){
            return res.json({
                success: false,
                message: "Invalid token"
            })
        }

        const user = await User.findById(decoded.userId);

        if(!user){
            return res.json({
                success: false,
                message: "User not found"
                })
        }

        return res.status(200).json({
            success: true,
            message: "User found",
            user
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}