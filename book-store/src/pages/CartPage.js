import React, { useState, useEffect } from 'react';
import { NumberBox, Button} from 'devextreme-react'
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const navigate = useNavigate();

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const removeItem = (bookIdToRemove) => {
        const updatedCart = cart.filter(item => item.book_id !== bookIdToRemove);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    

    const handleOrder = async () => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            navigate("/authorization");
        }
        else{
            try {
                const response = await fetch('http://cv32565.tw1.ru/orders.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: savedToken, books: cart }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to place order');
                }
    
                localStorage.removeItem('cart');
                setCart([]);
                alert('Заказ оформлен');
            } catch (error) {
                console.error('Error placing order:', error);
                alert('Произошла ошибка при оформлении заказа');
            }
        }
    };
    

    const updateQuantity = (bookId, newQuantity) => {
        const updatedCart = cart.map(item => {
            if (item.book_id === bookId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
    
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    

    if (cart.length === 0) return <p>Корзина пуста</p>;

    return (
        <div className="cart-page">
            <h1>Корзина</h1>
            <div style={{maxHeight: '1000px', overflowY: 'auto'}}>
                <ul>
                    {cart.map(item => (
                        <li key={item.book_id}>
                            <h3>{item.book_name}</h3>
                            <p>Автор: {`${item.author_first_name} ${item.author_middle_name || ''} ${item.author_last_name}`}</p>
                            <p>Цена: {item.price} ₽</p>
                            <NumberBox
                                width={100}
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
            </div>
            <p>Итого: {calculateTotal()} ₽</p>
            <button onClick={handleOrder}>Оформить заказ</button>
        </div>
    );
};

export default CartPage;
