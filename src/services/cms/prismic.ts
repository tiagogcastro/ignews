import { asHTML, asText, createClient, filter, RichTextField } from '@prismicio/client';

import { CmsProvider, PostContent, PostSummary } from './types';

const POST_TYPE = 'posts';
const PREVIEW_BLOCK_COUNT = 3;

type PostDocumentData = {
  title: RichTextField;
  content: RichTextField;
};

type PostDocumentLike = {
  id: string;
  uid: string | null;
  last_publication_date: string;
  data: PostDocumentData;
};

function toPostDocument(document: unknown): PostDocumentLike {
  return document as PostDocumentLike;
}

function excerptFrom(content: RichTextField): string {
  for (const block of content) {
    if (block.type === 'paragraph' && 'text' in block) {
      return block.text;
    }
  }

  return '';
}

function previewFrom(content: RichTextField): string {
  return (
    asHTML(content.slice(0, PREVIEW_BLOCK_COUNT) as RichTextField) ?? ''
  );
}

export function createPrismicCms(): CmsProvider {
  const client = createClient(process.env.PRISMIC_ENDPOINT ?? '', {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return {
    async listPosts(): Promise<PostSummary[]> {
      const response = await client.get({
        filters: [filter.at('document.type', POST_TYPE)],
        fetch: [`${POST_TYPE}.title`, `${POST_TYPE}.content`],
        pageSize: 100,
      });

      return response.results.map((document) => {
        const post = toPostDocument(document);

        return {
          id: post.id,
          slug: post.uid ?? '',
          title: asText(post.data.title) ?? '',
          excerpt: excerptFrom(post.data.content),
          updatedAt: new Date(post.last_publication_date).toISOString(),
        };
      });
    },

    async getPostBySlug(slug: string): Promise<PostContent | null> {
      let document: unknown;

      try {
        document = await client.getByUID(POST_TYPE, slug, {});
      } catch {
        return null;
      }

      const post = toPostDocument(document);

      return {
        slug,
        title: asText(post.data.title) ?? '',
        contentHtml: asHTML(post.data.content) ?? '',
        previewHtml: previewFrom(post.data.content),
        updatedAt: new Date(post.last_publication_date).toISOString(),
      };
    },
  };
}
