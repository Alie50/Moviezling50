import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const story = formData.get("story") as string;
    const duration = formData.get("duration") as string;
    const stars = formData.get("stars") as string;
    const rating = formData.get("rating") as string;
    const link = formData.get("link") as string;
    const posterUrl = formData.get("posterUrl") as string | null;
    const posterFile = formData.get("posterFile") as File | null;

    let poster: string | undefined;

    if (posterFile && posterFile.size > 0) {
      const bytes = await posterFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      poster = `data:${posterFile.type};base64,${base64}`;
    } else if (posterUrl) {
      poster = posterUrl;
    }

    const movie = await prisma.movie.create({
      data: {
        name,
        story,
        duration,
        stars,
        rating,
        link,
        poster,
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { error: "Failed to create movie" },
      { status: 500 }
    );
  }
}
