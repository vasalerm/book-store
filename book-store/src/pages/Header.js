import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';

const Header = () => {
    return (
        <header>
            <nav>
                <Link to="/home">
                    <img src={logo} alt="Логотип" /> 
                </Link>
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
