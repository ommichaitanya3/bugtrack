import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function GuestRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to='/' replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path='/login' element={<GuestRoute><Login /></GuestRoute>} />
      <Route path='/register' element={<GuestRoute><Register /></GuestRoute>} />
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Dashboard />} />
      </Route>
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}
