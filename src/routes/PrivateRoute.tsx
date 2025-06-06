
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  return user ? <Outlet /> : <Navigate to="/login" />;
}
