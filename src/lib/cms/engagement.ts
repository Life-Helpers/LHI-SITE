import "server-only";

import { randomUUID } from "node:crypto";

import type { PostComment } from "@/lib/cms/schema";
import { readSettings, readStore, updateStore } from "@/lib/cms/store";
import { notifyPendingComment } from "@/lib/email/notifications";

const MAX_COMMENTS = 20000;

export async function getEngagement(slug: string) {
  const [likes, comments] = await Promise.all([readStore("likes"), readStore("comments")]);
  return {
    likes: likes.find((l) => l.id === slug)?.likes ?? 0,
    comments: comments
      .filter((c) => c.slug === slug && c.status === "approved")
      .map(({ id, name, body, createdAt }) => ({ id, name, body, createdAt })),
  };
}

/** Adds (delta 1) or removes (delta -1) a like and returns the new total. */
export async function changeLikes(slug: string, delta: 1 | -1) {
  return (
    (await updateStore("likes", (items) => {
      const existing = items.find((l) => l.id === slug);
      const likes = Math.max(0, (existing?.likes ?? 0) + delta);
      const next = existing ? items.map((l) => (l.id === slug ? { ...l, likes } : l)) : [...items, { id: slug, likes }];
      return { items: next, result: likes };
    })) ?? 0
  );
}

export async function addComment(input: Omit<PostComment, "id" | "status" | "createdAt">) {
  const { engagement } = await readSettings();
  const comment: PostComment = {
    ...input,
    id: randomUUID(),
    status: engagement.autoApproveComments ? "approved" : "pending",
    createdAt: new Date().toISOString(),
  };
  await updateStore("comments", (items) => ({ items: [comment, ...items].slice(0, MAX_COMMENTS) }));
  if (comment.status === "pending") await notifyPendingComment(comment);
  return comment;
}
