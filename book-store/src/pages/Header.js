import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li><Link to="/home">Главная</Link></li>
                    <li><Link to="/cart">Корзина</Link></li>
                    <li><Link to="/profile">Профиль</Link></li>
                    
                </ul>
            </nav>
        </header>
    );
};

export default Header;
