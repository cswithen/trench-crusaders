import * as React from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.scss';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: ReactNode;
    error?: ReactNode;
    className?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => (
        <label
            className={
                styles['input-wrapper'] + (className ? ' ' + className : '')
            }
        >
            {label && <span className={styles.label}>{label}</span>}
            <input ref={ref} className={styles.input} {...props} />
            {error && <span className={styles.error}>{error}</span>}
        </label>
    )
);
Input.displayName = 'Input';

export default Input;
