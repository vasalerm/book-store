import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import AuthorizationPage from './pages/Authorization';
import RegistrationPage from './pages/Registration';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authorization" element={<AuthorizationPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
