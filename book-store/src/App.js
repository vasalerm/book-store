import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import './style/dx.generic.custom-scheme.css'


import AuthorizationPage from './pages/Authorization';
import RegistrationPage from './pages/Registration';
import AdminPage from './pages/AdminPage';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authorization" element={<AuthorizationPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
