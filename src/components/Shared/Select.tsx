import * as React from 'react';
import styles from './Select.module.scss';

export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: Option[];
  value: string | number | undefined;
  onChange: (value: string) => void;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, value, onChange, error, required, disabled, className = '', ...props }, ref) => {
    const selectId = React.useId();
    return (
      <div className={styles['select-wrapper']}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
            {required && <span aria-hidden="true" className={styles.required}>*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={
            styles.select +
            (error ? ' ' + styles['select--error'] : '') +
            (className ? ' ' + className : '')
          }
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = 'Select';

export default Select;
