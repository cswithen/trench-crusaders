
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useButton, useLink } from 'react-aria';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.scss';

function getInitialDarkMode() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('tc-dark-mode');
    if (stored !== null) return stored === 'true';
    // Optionally, use prefers-color-scheme
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

export default function Navbar() {
  const [dark, setDark] = useState(getInitialDarkMode);
  const { user } = useAuth();

  useEffect(() => {
    document.body.classList.toggle('tc-dark', dark);
    localStorage.setItem('tc-dark-mode', String(dark));
  }, [dark]);

  // React-Aria for theme toggle button
  const themeToggleRef = useRef<HTMLButtonElement>(null);
  const { buttonProps: themeButtonProps } = useButton({
    onPress: () => setDark((d) => !d),
    'aria-label': dark ? 'Switch to light mode' : 'Switch to dark mode',
  }, themeToggleRef);

  function NavLink({ to, label }: { to: string; label: string }) {
    const ref = useRef<HTMLAnchorElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { linkProps } = useLink({
      elementType: 'a',
      isDisabled: location.pathname === to,
      onPress: () => navigate(to),
    }, ref);
    return (
      <a
        {...linkProps}
        ref={ref}
        href={to}
        aria-current={location.pathname === to ? 'page' : undefined}
        tabIndex={0}
        className={styles.link}
      >
        {label}
      </a>
    );
  }

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" label="Home" />
      {user && <NavLink to="/campaigns" label="Campaigns" />}
      {user && <NavLink to="/warbands" label="Warbands" />}
      {user && <NavLink to="/profile" label="Profile" />}
      <button
        {...themeButtonProps}
        ref={themeToggleRef}
        className={styles.themeToggle}
      >
        {dark ? '🌙 Dark' : '☀️ Light'}
      </button>
    </nav>
  );
}
