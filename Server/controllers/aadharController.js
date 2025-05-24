import { Aadhar } from "../models/Aadhar.js";

export const createAadharData = async (req, res) => { 
    const {aadharNumber, email} = req.body;
    try {
        if(aadharNumber.length < 12){
            return res.json({
                success: false,
                message: "Aadhar number must have 12 digits",
                data: {
                    aadharNumber,
                    email
                }
            })
        }

        const user = new Aadhar({
            aadharNumber: aadharNumber,
            email: email,
        });

        await user.save();

        return res.json({
            success: true,
            message: "Data is saved successFully"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

export const findAadharData = async (req, res) => {
    const {aadharNumber} = req.body;

    if(aadharNumber.length < 12){
        res.json({
            success: false,
            message: "Aadhar number must have 12 digits",
        })
    }

    try {
        const user = await Aadhar.findOne({aadharNumber: aadharNumber});
        // console.log("User",user)
        if(!user){
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        return res.json({
            success: true,
            email: user.email,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}