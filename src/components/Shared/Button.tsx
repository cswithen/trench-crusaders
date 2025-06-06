
import * as React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useButton } from 'react-aria';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export default function Button({ children, variant = 'primary', className = '', ...props }: Props) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({
    isDisabled: props.disabled,
    onPress: props.onClick as (() => void) | undefined,
    type: props.type,
    'aria-label': props['aria-label'],
  }, ref);
  const variantClass = variant === 'secondary' ? styles['button--secondary'] : '';
  return (
    <button {...buttonProps} ref={ref} className={styles.button + (variantClass ? ' ' + variantClass : '') + (className ? ' ' + className : '')}>
      {children}
    </button>
  );
}
