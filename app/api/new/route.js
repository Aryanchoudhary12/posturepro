import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
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
    const url = formData.get("url");
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

    const newVideo = await prisma.video.create({
      data: {
        url: url ,
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
