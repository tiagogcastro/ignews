export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

export type PostContent = {
  slug: string;
  title: string;
  contentHtml: string;
  previewHtml: string;
  updatedAt: string;
};

export interface CmsProvider {
  listPosts(): Promise<PostSummary[]>;
  getPostBySlug(slug: string): Promise<PostContent | null>;
}
