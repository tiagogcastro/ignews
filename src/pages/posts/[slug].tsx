import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

import { formatDate } from '@/lib/format';
import { cms } from '@/services/cms';

import styles from './post.module.scss';

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const slug = String(params?.slug ?? '');

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const remotePost = await cms.getPostBySlug(slug);

  if (!remotePost) {
    return {
      notFound: true,
    };
  }

  const post = {
    slug,
    title: remotePost.title,
    content: remotePost.contentHtml,
    updatedAt: formatDate(remotePost.updatedAt),
  };

  return {
    props: {
      post,
    },
  };
};
