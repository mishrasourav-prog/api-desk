import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EndpointProvider } from './context/EndpointContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
    <Toaster
  position="top-center"
  toastOptions={{
    duration: 3000,
    style: {
      fontSize: "16px",
    },
  }}
/>
      <AuthProvider>
        <EndpointProvider>
          <AppRoutes />
        </EndpointProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}