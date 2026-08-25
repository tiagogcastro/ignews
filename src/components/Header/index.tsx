import { ActiveLink } from '@/components/ActiveLink';
import { SignInGithubButton } from '@/components/SignInGithubButton';
import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            Home
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            Posts
          </ActiveLink>
        </nav>
        <SignInGithubButton />
      </div>
    </header>
  );
}