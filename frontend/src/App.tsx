import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EndpointProvider } from './context/EndpointContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EndpointProvider>
          <AppRoutes />
        </EndpointProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}