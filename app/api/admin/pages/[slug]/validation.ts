import z from "zod";

const sectionItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  bullets: z.array(z.string()).nullable().optional().transform(val => val ?? []), 
  extraData: z.any().nullable().optional(),
  order: z.number().int().default(0),
});

const pageSectionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["INTRO", "GRID", "PROCESS", "CAROUSEL", "TABS", "STATS", "TEXT"]),
  order: z.number().int().default(0),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  badgeIcon: z.string().optional().nullable(),
  badgeTitle: z.string().optional().nullable(),
  badgeDesc: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),
  tags: z.array(z.string()).nullable().optional().transform(val => val ?? []),
  items: z.array(sectionItemSchema).nullable().optional().transform(val => val ?? []), 
});

export const dynamicPageSchema = z.object({
  heroTitle: z.string().min(1, "Hero title is required"),
  heroSubtitle: z.string().optional().nullable(),
  heroDesc: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  sections: z.array(pageSectionSchema).nullable().optional().transform(val => val ?? []), 
});