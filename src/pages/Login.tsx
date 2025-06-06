


import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import Button from '../components/Shared/Button';
import Input from '../components/Shared/Input';



function Login() {
  const { signIn, signUp, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
        setMessage('Sign up successful! Please check your email to confirm your account.');
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message || 'Authentication error');
      } else {
        setMessage('Authentication error');
      }
    }
  };

  return (
    <>
      <div className={styles.login}>
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            label="Email"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            label="Password"
          />
          {isSignUp && (
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
            />
          )}
          <Button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
        </form>
        <Button type="button" onClick={() => { setIsSignUp(s => !s); setMessage(null); }}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
        {message && <div role="alert" style={{ marginTop: 12 }}>{message}</div>}
      </div>
    </>
  );
}

export default Login;
