import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='footer'>
             <div className="footer-contact">
                    <h4>Контакты</h4>
                    <p>Email: support@bookstore.com</p>
                    <p>Телефон: +7 (123) 456-7890</p>
                </div>
                <div className="footer-bottom">
                <p>&copy; 2024 Bookstore. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default Footer;
