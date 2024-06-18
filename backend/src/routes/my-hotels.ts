import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { body, validationResult } from "express-validator";
import Hotel, { HotelType } from "../models/hotels";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1025 //5MB 
    },
});


const validators = [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("adultCount")
        .notEmpty()
        .isNumeric()
        .withMessage("AdultCount is required and must be a number"),
    body("childCount")
        .notEmpty()
        .isNumeric()
        .withMessage("ChildCount is required and must be a number"),
    body("facilities")
        .notEmpty()
        .isArray()
        .withMessage("Facilities is required and must be an array"),
    body("pricePerNight")
        .notEmpty()
        .isNumeric()
        .withMessage("Price Per Night is required and must be a number"),
];

//poperty name imageFiles in form field
router.post(
    "/",
    verifyToken,
    validators,
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;
            const uploadPromises = imageFiles.map(async (image) => {
                const base64 = Buffer.from(image.buffer).toString("base64");
                let dataURI = "data:" + image.mimetype + ";base64," + base64;
                const response = await cloudinary.v2.uploader.upload(dataURI);
                return response.url;
            });
            const imageUrls = await Promise.all(uploadPromises);
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;
            const hotel = new Hotel(newHotel);
            await hotel.save();
            return res.status(210).send(hotel);
        } catch (error) {
            console.log("Error creating hotel", error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    });

export default router;