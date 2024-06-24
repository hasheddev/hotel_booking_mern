import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { body } from "express-validator";
import Hotel from "../models/hotels";
import { HotelType } from "../shared/types";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1025 //5MB 
    },
});

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const base64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + base64;
        const response = await cloudinary.v2.uploader.upload(dataURI);
        return response.url;
    });
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}



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
            const imageUrls = await uploadImages(imageFiles);
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

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels);
    } catch (error) {
        return res.status(500).json({ message: "error fetching hotels" });
    }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({ userId: req.userId, _id: id });
        res.json(hotel);
    } catch (error) {
        return res.status(500).json({ message: "error fetching hotels" });
    }
});


router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async (req: Request, res: Response) => {
    const id = req.params.hotelId.toString();
    try {
        const updatedHotel: HotelType = req.body;
        updatedHotel.lastUpdated = new Date();
        const hotel = await Hotel.findOneAndUpdate({ userId: req.userId, _id: id }, updatedHotel, { new: true });
        if (!hotel) {
            return res.status(404).json({ message: "hotel not found" });
        }
        const imageFiles = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(imageFiles);
        hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];
        await hotel.save();
        res.status(201).json(hotel);
    } catch (error) {
        return res.status(500).json({ message: "something went wrong" });
    }
});


export default router;