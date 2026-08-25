import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface ActiveLinkProps extends LinkProps {
  children: ReactNode;
  activeClassName: string;
}

export function ActiveLink({
  children,
  activeClassName,
  href,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();

  const isActive = asPath === href;

  return (
    <Link href={href} {...rest} className={isActive ? activeClassName : undefined}>
      {children}
    </Link>
  );
}
