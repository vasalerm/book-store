import React, { useEffect, useState } from 'react';
import { TextBox, NumberBox } from 'devextreme-react';

const Homepage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState(() => {
        // Инициализация корзины из localStorage
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        fetch('http://localhost/book.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setBooks(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const addToCart = (book) => {
        const updatedCart = [...cart];
        const bookIndex = updatedCart.findIndex(item => item.book_id === book.book_id);

        if (bookIndex > -1) {
            // Если книга уже в корзине, увеличиваем количество
            updatedCart[bookIndex].quantity += 1;
        } else {
            // Иначе добавляем книгу с количеством 1
            updatedCart.push({ ...book, quantity: 1 });
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const updateCartQuantity = (book, quantity) => {
        const updatedCart = [...cart];
        const bookIndex = updatedCart.findIndex(item => item.book_id === book.book_id);

        if (bookIndex > -1) {
            // Если книга уже в корзине, обновляем количество
            updatedCart[bookIndex].quantity = quantity;

            // Удаляем книгу из корзины, если количество равно 0
            if (quantity === 0) {
                updatedCart.splice(bookIndex, 1);
            }
        } else if (quantity > 0) {
            // Иначе добавляем книгу с заданным количеством
            updatedCart.push({ ...book, quantity: quantity });
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const getCartQuantity = (bookId) => {
        const bookInCart = cart.find(item => item.book_id === bookId);
        return bookInCart ? bookInCart.quantity : 0;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading books: {error.message}</p>;

    return (
        <div className='book'>
            <div className="search">
                <TextBox
                    placeholder="Поиск..."
                    width={'500px'}
                /> 
            </div>
            <div className="book-list">
                {books.map(book => (
                    <div key={book.book_id} className="book-card">
                        <h3>{book.book_name}</h3>
                        <p>Автор: {`${book.author_first_name} ${book.author_middle_name || ''} ${book.author_last_name}`}</p>
                        <p>Цена: {book.price} ₽</p>
                        <p>Количество: {book.quantity - getCartQuantity(book.book_id)}</p>
                        <div className='button'>
                            <button onClick={() => addToCart(book)}>Добавить в корзину</button>
                        </div>
                        <div className="cart-quantity">
                            <NumberBox
                                value={getCartQuantity(book.book_id)}
                                min={0}
                                onValueChanged={(e) => updateCartQuantity(book, e.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Homepage;
