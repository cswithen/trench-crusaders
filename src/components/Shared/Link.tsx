import * as React from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';
import { useLink } from 'react-aria';
import styles from './Link.module.scss';

export type LinkProps = RouterLinkProps & {
  className?: string;
  children: React.ReactNode;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ className = '', children, ...props }, ref) => {
  const fallbackRef = React.useRef<HTMLAnchorElement>(null);
  const innerRef = (ref as React.RefObject<HTMLAnchorElement>) ?? fallbackRef;
  const { linkProps } = useLink({ elementType: 'a' }, innerRef);
  return (
    <RouterLink
      ref={innerRef}
      {...props}
      {...linkProps}
      className={styles.link + (className ? ' ' + className : '')}
    >
      {children}
    </RouterLink>
  );
});
Link.displayName = 'Link';

export default Link;
