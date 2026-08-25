import { CmsProvider, PostContent, PostSummary } from './types';

type SandboxPost = PostContent & { excerpt: string };

function paragraph(text: string): string {
  return `<p>${text}</p>`;
}

const POSTS: SandboxPost[] = [
  {
    slug: 'react-server-components-in-2026',
    title: 'React Server Components in practice',
    updatedAt: '2026-08-10T12:00:00.000Z',
    excerpt:
      'Server Components change how we think about data fetching and bundle size. Here is what matters.',
    contentHtml: [
      '<h2>Why Server Components exist</h2>',
      paragraph(
        'React Server Components move rendering work to the server so that heavy dependencies never reach the browser bundle. The result is less JavaScript shipped to users and simpler data loading.',
      ),
      paragraph(
        'A Server Component runs once per request, reads from databases or file systems directly, and serializes its output to the client.',
      ),
      '<h2>Where they shine</h2>',
      '<ul><li>Content driven pages such as blogs and marketing sites</li><li>Dashboards with large dependency trees</li><li>Any page where SEO and first paint matter</li></ul>',
      paragraph(
        'Client Components still handle interactivity. The key skill is drawing the boundary between the two intentionally instead of defaulting everything to the client.',
      ),
    ].join(''),
    previewHtml: [
      '<h2>Why Server Components exist</h2>',
      paragraph(
        'React Server Components move rendering work to the server so that heavy dependencies never reach the browser bundle. The result is less JavaScript shipped to users and simpler data loading.',
      ),
    ].join(''),
  },
  {
    slug: 'stripe-subscriptions-deep-dive',
    title: 'Building subscription billing with Stripe',
    updatedAt: '2026-07-28T09:30:00.000Z',
    excerpt:
      'Checkout Sessions, webhooks and idempotent state machines: how to wire subscriptions safely.',
    contentHtml: [
      '<h2>The happy path</h2>',
      paragraph(
        'A subscription flow has three moving parts: a Checkout Session created on the server, a redirect handled by Stripe, and webhooks that keep your database in sync with reality.',
      ),
      paragraph(
        'Never trust the success redirect alone. The webhook for checkout.session.completed is the source of truth for entitlements.',
      ),
      '<h2>Handling webhook events</h2>',
      paragraph(
        'Verify signatures, persist events idempotently by their ids, and model subscriptions with an upsert keyed on the Stripe subscription id so retries converge to the same row.',
      ),
    ].join(''),
    previewHtml: [
      '<h2>The happy path</h2>',
      paragraph(
        'A subscription flow has three moving parts: a Checkout Session created on the server, a redirect handled by Stripe, and webhooks that keep your database in sync with reality.',
      ),
    ].join(''),
  },
  {
    slug: 'prismic-and-isr',
    title: 'Incremental Static Regeneration with a headless CMS',
    updatedAt: '2026-06-15T14:00:00.000Z',
    excerpt: 'ISR gives you static speed with fresh content. The revalidate window is a product decision.',
    contentHtml: [
      '<h2>Static when possible</h2>',
      paragraph(
        'With ISR pages are built once and served from the edge, then regenerated in the background after the revalidate window expires. Readers always get fast responses while content stays fresh.',
      ),
      paragraph(
        'Pick the window based on how often editors publish and how stale content hurts conversion, not based on technical convenience.',
      ),
      '<h2>Fallback strategies</h2>',
      paragraph(
        'Using blocking fallback keeps URLs consistent at the cost of a slower first visit, while fallback true renders a skeleton first. Choose deliberately per route.',
      ),
    ].join(''),
    previewHtml: [
      '<h2>Static when possible</h2>',
      paragraph(
        'With ISR pages are built once and served from the edge, then regenerated in the background after the revalidate window expires. Readers always get fast responses while content stays fresh.',
      ),
    ].join(''),
  },
];

export const sandboxCms: CmsProvider = {
  async listPosts(): Promise<PostSummary[]> {
    return POSTS.map(({ slug, title, excerpt, updatedAt }) => ({
      id: slug,
      slug,
      title,
      excerpt,
      updatedAt,
    }));
  },

  async getPostBySlug(slug: string): Promise<PostContent | null> {
    const post = POSTS.find((candidate) => candidate.slug === slug);
    if (!post) {
      return null;
    }

    const { slug: postSlug, title, contentHtml, previewHtml, updatedAt } = post;
    return { slug: postSlug, title, contentHtml, previewHtml, updatedAt };
  },
};
