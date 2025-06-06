
import * as React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useButton } from 'react-aria';
import styles from './Button.module.scss';


type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function Button({ children, ...props }: Props) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({
    isDisabled: props.disabled,
    onPress: props.onClick as (() => void) | undefined,
    type: props.type,
    'aria-label': props['aria-label'],
  }, ref);
  return (
    <button {...buttonProps} ref={ref} className={styles.button}>
      {children}
    </button>
  );
}
