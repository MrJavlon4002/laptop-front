
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LaptopsPage from './pages/LaptopsPage';
import LaptopDetailPage from './pages/LaptopDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CreateLaptopPage from './pages/CreateLaptopPage'; // New Import
import EditLaptopPage from './pages/EditLaptopPage';   // New Import
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/laptops" element={<LaptopsPage />} />
          <Route path="/laptops/:id" element={<LaptopDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/laptops/new" element={ // New Route for Create
            <ProtectedRoute requiredRole="admin">
              <CreateLaptopPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/laptops/edit/:id" element={ // New Route for Edit
            <ProtectedRoute requiredRole="admin">
              <EditLaptopPage />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default App;