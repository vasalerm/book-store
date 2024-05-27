import React, { useState, useEffect } from 'react';
import { NumberBox, Button} from 'devextreme-react'

const CartPage = () => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const removeItem = (bookIdToRemove) => {
        const updatedCart = cart.filter(item => item.book_id !== bookIdToRemove);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    

    const handleOrder = async () => {
        try {
            const response = await fetch('http://localhost/orders.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: localStorage.getItem('token'), books: cart }),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            // Очистка корзины
            localStorage.removeItem('cart');
            setCart([]);
            alert('Заказ оформлен');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Произошла ошибка при оформлении заказа');
        }
    };

    const updateQuantity = (bookId, newQuantity) => {
        console.log(bookId)
        console.log(newQuantity)
        const updatedCart = cart.map(item => {
            if (item.book_id === bookId) {
                return { ...item, quantity: newQuantity };
            }
            console.log(cart)
            return item;
        });
    
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
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
                        <NumberBox
                            min={0}
                            showSpinButtons={true}
                            value={item.quantity}
                            onValueChange={(e) => {
                                updateQuantity(item.book_id, e)
                            }                        
                                
                            }
                        ></NumberBox>
                         <Button onClick={() => removeItem(item.book_id)}>Удалить</Button>
                    </li>
                ))}
            </ul>
            <p>Итого: {calculateTotal()} ₽</p>
            <button onClick={handleOrder}>Оформить заказ</button>
        </div>
    );
};

export default CartPage;
