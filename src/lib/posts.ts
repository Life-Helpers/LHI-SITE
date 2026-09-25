export function readingTime(content: string) {
  return `${Math.max(1, Math.round(content.split(/\s+/).length / 200))} min read`;
}

export function formatPostDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** The fields a post card needs. Client components get these instead of full posts, so article bodies aren't shipped in listing pages. */
export interface PostCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  tags: string[];
  featuredImage?: string;
  readingTime: string;
}

export function toPostCard(post: Omit<PostCard, "readingTime"> & { content: string }): PostCard {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    date: post.date,
    author: post.author,
    tags: post.tags,
    featuredImage: post.featuredImage,
    readingTime: readingTime(post.content),
  };
}
