import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png'; // Импортируем изображение

const Header = () => {
    return (
        <header>
            <nav>
                <Link to="/home">
                    <img src={logo} alt="Логотип" /> {/* Вставляем логотип */}
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
