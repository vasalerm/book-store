import React from 'react';

const CartPage = ({ cart }) => {
    return (
        <div className="cart-page">
            <h1>Корзина</h1>
            <ul>
                <li>
                    <h3>Собачье сердце</h3>
                    <p>Автор: Михаил Булгаков</p>
                    <p>Цена: 300 ₽</p>
                    <p>Количество: 1</p>
                </li>
                <li>
                    <h3>Ревизор</h3>
                    <p>Автор: Николай Гоголь</p>
                    <p>Цена: 560 ₽</p>
                    <p>Количество: 2</p>
                </li>
            </ul>
            <p>Итого: 860 ₽</p>
            <button>Оформить заказ</button>
        </div>
    );
};

export default CartPage;
