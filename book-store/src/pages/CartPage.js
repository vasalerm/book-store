import React, { useState, useEffect } from 'react';

const CartPage = () => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleOrder = () => {
        // Логика оформления заказа
        console.log('Order placed:', cart);
        // Очистка корзины
        localStorage.removeItem('cart');
        setCart([]);
        alert('Заказ оформлен');
    };

    if (cart.length === 0) return <p>Корзина пуста</p>;

    return (
        <div className="cart-page">
            <h1>Корзина</h1>
            <ul>
                {cart.map(item => (
                    <li key={item.book_id}>
                        <h3>{item.book_name}</h3>
                        <p>Автор: {`${item.author_first_name} ${item.author_middle_name || ''} ${item.author_last_name}`}</p>
                        <p>Цена: {item.price} ₽</p>
                        <p>Количество: {item.quantity}</p>
                    </li>
                ))}
            </ul>
            <p>Итого: {calculateTotal()} ₽</p>
            <button onClick={handleOrder}>Оформить заказ</button>
        </div>
    );
};

export default CartPage;
