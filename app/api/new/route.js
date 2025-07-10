import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import cloudinary from "@/lib/cloudinary";

const prisma = new PrismaClient();

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  console.log(userId)
  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("url");
    const poseFlags = formData.get("poseFlags");

    console.log("Raw poseFlags received:", poseFlags);

    let flags = [];
    try {
      if (poseFlags) {
        const parsed = JSON.parse(poseFlags);
        if (Array.isArray(parsed)) flags = parsed;
      }
    } catch (e) {
      console.warn("Failed to parse poseFlags JSON", e);
    }

    let videourl = "";

    if (file && typeof file.arrayBuffer === "function") {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "posture-app" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      videourl = uploaded.secure_url;
    } else {
      return NextResponse.json({ error: "No video file found" }, { status: 400 });
    }

    const newVideo = await prisma.video.create({
      data: {
        url: videourl,
        poseFlags: flags,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    console.log("Video and poseFlags saved:", newVideo);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Error uploading and saving video:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
