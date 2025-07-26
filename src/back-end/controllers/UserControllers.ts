import { type Request, type Response } from "express";
import { User } from "../models/User";

/**
 * DONE:
 * get User Visa Type by Id
 */
export async function getUserVisaTypeById(req: Request, res: Response) {
    const { id } = req.params;
    console.log('received id:', id);

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const visaType = user.employment?.visaTitle
    if (!visaType) {
        return res.status(404).json({
            success: false,
            message: "Visa type not found for this user",
            error: "Visa type not found for this user"
        });
    }
    return res.status(200).json({
        success: true,
        data: {
            visaType: visaType,
            userId: user.id
        },
        message: "Visa type retrieved successfully"
    });
}

export async function getUserData(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            message: "User data received successfully",
            data: user
        })
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ success: false, message: "Server error" })
    }
}
