import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { MAX_FILE_SIZE } from "./constants";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || "cloudinary";

async function ensureUploadDir(subfolder: string = "") {
  const uploadDir = path.join(process.cwd(), "public/uploads", subfolder);
  await mkdir(uploadDir, { recursive: true });
  return uploadDir;
}

export async function uploadFile(file: File, subfolder: string = ""): Promise<string> {
  if (!file) throw new Error("No file provided");

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (STORAGE_PROVIDER === "cloudinary") {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `skyblue/${subfolder}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      );
      uploadStream.end(buffer);
    });
  } 
  
  else {
    const uploadDir = await ensureUploadDir(subfolder);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = `${uniqueSuffix}-${cleanFileName}`;
    
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return subfolder ? `/uploads/${subfolder}/${filename}` : `/uploads/${filename}`;
  }
}

export async function uploadImage(file: File, subfolder: string = ""): Promise<string> {
  if (!file) throw new Error("No file provided");

  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Only images (JPG, PNG, WebP) are allowed.");
  }

  return await uploadFile(file, subfolder);
}

export async function deleteFile(fileUrl: string) {
  try {
    if (!fileUrl) return;

    if (STORAGE_PROVIDER === "cloudinary" && fileUrl.includes("res.cloudinary.com")) {
      const urlParts = fileUrl.split('/');
      const skyblueIndex = urlParts.indexOf('skyblue');
      if (skyblueIndex !== -1) {
        const pathWithExtension = urlParts.slice(skyblueIndex).join('/');
        const publicId = pathWithExtension.substring(0, pathWithExtension.lastIndexOf('.'));
        await cloudinary.uploader.destroy(publicId);
      }
    } 
    
    else if (fileUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), "public", fileUrl);
      await unlink(filePath);
    }
  } catch (error) {
    console.error("Failed to delete file:", fileUrl, error);
  }
}