import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    comments: z.boolean().default(true),
    access: z.enum(['public', 'code']).default('public'),
  }),
});

const sermons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/sermons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    scripture: z.string().optional(),
    location: z.string().optional(),
    comments: z.boolean().default(true),
    access: z.enum(['public', 'code']).default('public'),
  }),
});

export const collections = { blog, sermons };
