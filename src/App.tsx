import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/Routes';
import './styles/global.scss';
import { OverlayProvider } from 'react-aria';

const queryClient = new QueryClient();

export default function App() {
    return (
        <OverlayProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </AuthProvider>
            </QueryClientProvider>
        </OverlayProvider>
    );
}
