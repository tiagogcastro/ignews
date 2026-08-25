import { createPrismicCms } from './prismic';
import { sandboxCms } from './sandbox';
import { CmsProvider } from './types';

export function getCmsProvider(): CmsProvider {
  const provider = process.env.CMS_PROVIDER
    ?? (process.env.PRISMIC_ENDPOINT ? 'prismic' : 'sandbox');

  return provider === 'prismic' && process.env.PRISMIC_ENDPOINT ? createPrismicCms() : sandboxCms;
}

export const cms = getCmsProvider();

export type { CmsProvider, PostContent, PostSummary } from './types';
