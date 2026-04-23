import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFile, uploadImage } from "@/lib/uploads";
import z from "zod";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  published: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(false)),
  slug: z.string().optional(),
});

export async function PUT( req: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const admin = await getAdmin();
    if (!admin){
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await req.formData();

    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
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
    const newSlug = baseForSlug.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const existingSlug = await prisma.blogPost.findUnique({ where: { slug: newSlug } });
    if (existingSlug && existingSlug.id !== id) {
      return NextResponse.json({ success: false, message: "Slug already taken" }, { status: 400 });
    }

    let thumbnailPath = existingPost.thumbnail;
    const imageFile = formData.get("thumbnail") as File | null;

    if (imageFile && imageFile.size > 0) {
      await deleteFile(existingPost.thumbnail);
      thumbnailPath = await uploadImage(imageFile, "blog");
    }

    await prisma.blogPost.update({
      where: { id },
      data: { title, category, excerpt, content, published, slug: newSlug, thumbnail: thumbnailPath },
    });

    return NextResponse.json({ success: true, message: "Blog updated successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE( req: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const admin = await getAdmin();
    if (!admin){
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    await deleteFile(post.thumbnail);

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Post deleted successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}