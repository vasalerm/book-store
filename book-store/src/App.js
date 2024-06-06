import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './style/dx.generic.custom-scheme.css';
import './App.css';

import AuthorizationPage from './pages/Authorization';
import RegistrationPage from './pages/Registration';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import Header from './pages/Header';
import Footer from './pages/Footer'
import Profile from './pages/Profile';

const App = () => {
    const [cart, setCart] = useState([]);

    const addToCart = (book) => {
        setCart(prevCart => [...prevCart, book]);
    };

    return (
        <BrowserRouter>
            <Header />
            <div className='app-container'>
                <Routes>
                    <Route path="/authorization" element={<AuthorizationPage />} />
                    <Route path="/registration" element={<RegistrationPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/home" element={<HomePage addToCart={addToCart} />} />
                    <Route path="/cart" element={<CartPage cart={cart} />} />
                    <Route path="/" element={<HomePage addToCart={addToCart} />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
            <Footer />
        </BrowserRouter>
    );
};

export default App;
