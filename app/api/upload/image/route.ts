import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Get original filename and sanitize it
    const originalName = file.name;
    const sanitizedName = originalName
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9.-]/g, ""); // Remove special characters

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const ext = path.extname(sanitizedName);
    const nameWithoutExt = path.basename(sanitizedName, ext);
    const uniqueFilename = `${nameWithoutExt}-${timestamp}${ext}`;

    // Determine upload directory (default to uploads)
    const uploadDir = path.join(process.cwd(), "public", "images", "uploads");

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, uniqueFilename);

    await writeFile(filePath, buffer);

    // Generate alt text from filename (remove extension and replace hyphens with spaces)
    const altText = nameWithoutExt
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word

    // Return public URL path
    const publicUrl = `/images/uploads/${uniqueFilename}`;

    return NextResponse.json({
      url: publicUrl,
      alt: altText,
      filename: uniqueFilename,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
