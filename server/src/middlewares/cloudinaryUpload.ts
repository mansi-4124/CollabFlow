import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Express.Request, file: Express.Multer.File) => {
    return {
      folder: "collabflow/tasks",
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: "auto",
    };
  },
});

const parser = multer({ storage });
export default parser;
