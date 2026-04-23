import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/uploads";
import { prisma } from "@/lib/prisma";
import z from "zod";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  published: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(false)),
  slug: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const imageFile = formData.get("thumbnail") as File | null;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ success: false, message: "Thumbnail is required" }, { status: 400 });
    }

    const validation = blogSchema.safeParse({
      title: formData.get("title"),
      category: formData.get("category"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      published: formData.get("published"),
      slug: formData.get("slug") || undefined,
    });

    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const { title, category, excerpt, content, published, slug: manualSlug } = validation.data;

    const baseForSlug = (manualSlug && manualSlug.trim().length > 0) ? manualSlug : title;
    const slug = baseForSlug.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const existingPost = await prisma.blogPost.findFirst({ where: { slug } });
    if (existingPost) {
      return NextResponse.json({ success: false, message: "Blog post with this slug already exists" }, { status: 400 });
    }

    const thumbnailPath = await uploadImage(imageFile, "blog");

    await prisma.blogPost.create({
      data: {
        title,
        category,
        excerpt,
        content,
        published,
        slug,
        thumbnail: thumbnailPath,
      },
    });

    return NextResponse.json({ success: true, message: "Blog post created successfully" }, { status: 201 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}