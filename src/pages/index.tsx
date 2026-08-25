import { GetStaticProps } from 'next';
import Head from 'next/head';

import { SubscribeButton } from '@/components/SubscribeButton';
import { formatCurrencyFromCents } from '@/lib/format';
import { payments } from '@/services/payments';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

const SANDBOX_PRICE_ID = 'price_sandbox_ignews_monthly';

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the
            <span>React</span>
            world
          </h1>
          <p>
            Get access to all the publications
            {' '}
            <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await payments.getPrice(
    process.env.STRIPE_PRICE_ID || SANDBOX_PRICE_ID,
  );

  const product = {
    priceId: price.priceId,
    amount: formatCurrencyFromCents(price.unitAmount ?? 0),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};
