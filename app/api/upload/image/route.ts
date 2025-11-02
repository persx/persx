import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

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
    const ext = sanitizedName.substring(sanitizedName.lastIndexOf('.'));
    const nameWithoutExt = sanitizedName.substring(0, sanitizedName.lastIndexOf('.'));
    const uniqueFilename = `${nameWithoutExt}-${timestamp}${ext}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage using admin client to bypass RLS
    const supabase = createAdminClient();
    const { error: uploadError } = await supabase.storage
      .from('content-images')
      .upload(uniqueFilename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        {
          error: "Failed to upload to storage",
          details: uploadError.message
        },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('content-images')
      .getPublicUrl(uniqueFilename);

    // Generate alt text from filename (remove extension and replace hyphens with spaces)
    const altText = nameWithoutExt
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word

    return NextResponse.json({
      url: publicUrl,
      alt: altText,
      filename: uniqueFilename,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
