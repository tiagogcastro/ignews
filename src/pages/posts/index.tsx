import { useSession } from 'next-auth/react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { formatDate } from '@/lib/format';
import { cms, PostSummary } from '@/services/cms';

import styles from './styles.module.scss';

interface PostsProps {
  posts: PostSummary[];
}

export default function Posts({ posts }: PostsProps) {
  const { data: session } = useSession();

  function redirectToPost(post: PostSummary): string {
    return session?.activeSubscription
      ? `/posts/${post.slug}`
      : `/posts/preview/${post.slug}`;
  }

  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={redirectToPost(post)} key={post.id} className={styles.postLink}>
              <time>{formatDate(post.updatedAt)}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await cms.listPosts();

  return {
    props: {
      posts,
    },
    revalidate: 60 * 30,
  };
};
