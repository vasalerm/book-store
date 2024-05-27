import React, { useEffect, useState } from 'react';
import { TextBox } from 'devextreme-react';

const Homepage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);

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
                        <p>Количество: {book.quantity}</p>
                        <div className='button'>
                            <button>Добавить в корзину</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Homepage;
