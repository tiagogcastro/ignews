import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { api } from '@/services/api';

import styles from './styles.module.scss';

type CheckoutSessionPayload = {
  url: string | null;
};

type SubscribeErrorResponse = {
  error?: {
    message?: string;
  };
};

export function SubscribeButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubscribing, setIsSubscribing] = useState(false);

  async function handleSubscribe() {
    if (!session) {
      signIn();
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts');
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await api.post<CheckoutSessionPayload>('/subscribe');
      const checkoutUrl = response.data.url;

      if (!checkoutUrl) {
        throw new Error('Checkout session did not return a URL.');
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      if (axios.isAxiosError<SubscribeErrorResponse>(error)) {
        alert(error.response?.data?.error?.message ?? 'Subscription failed');
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Subscription failed');
      }
    } finally {
      setIsSubscribing(false);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
      disabled={isSubscribing}
    >
      Subscribe now
    </button>
  );
}
