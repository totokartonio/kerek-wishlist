import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return;

    // Skip version segment (v123456) if present
    const afterUpload = parts.slice(uploadIndex + 1);
    const publicIdParts =
      afterUpload[0]?.startsWith("v") && /^v\d+$/.test(afterUpload[0])
        ? afterUpload.slice(1)
        : afterUpload;

    // Remove file extension
    const publicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
  }
};

export { cloudinary, deleteImage };
