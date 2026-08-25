import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import { signIn, signOut, useSession } from 'next-auth/react';

import styles from './styles.module.scss';

const devLoginEnabled = process.env.NEXT_PUBLIC_AUTH_DEV_LOGIN === 'true';

export function SignInGithubButton() {
  const { data: session } = useSession();

  const providerId = devLoginEnabled ? 'dev' : 'github';

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <FaGithub color="#04d361" />
      {session.user?.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn(providerId)}
    >
      <FaGithub color="#eba417" />
      Sign in
      <span className={styles.longText}>&nbsp;with Github</span>
    </button>
  );
}
