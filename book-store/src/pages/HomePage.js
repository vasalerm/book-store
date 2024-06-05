import React, { useEffect, useState } from 'react';
import { TextBox, NumberBox, Button, SelectBox } from 'devextreme-react';

const Homepage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState(() => {
        // Инициализация корзины из localStorage
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [searchText, setSearchText] = useState(null);
    const [paramForSearch, setParamForSearch] = useState('title');
    

    const [tempQuantity, setTempQuantity] = useState(1); // Локальное состояние для временного хранения количества книг в NumberBox

    const searchParam = [
        {id: 'author', text: 'Автор'},
        {id: 'title', text: 'Название'},
    ]

    const fetchBooks = () => {
        setLoading(true);
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
      };

    useEffect(() => {
        fetchBooks();
      }, []);

    const addToCart = (book) => {
        const updatedCart = [...cart];
        const bookIndex = updatedCart.findIndex(item => item.book_id === book.book_id);

        if (bookIndex > -1) {
            // Если книга уже в корзине, увеличиваем количество
            updatedCart[bookIndex].quantity += tempQuantity; // Используем временное значение из NumberBox
        } else {
            // Иначе добавляем книгу с количеством из NumberBox
            updatedCart.push({ ...book, quantity: tempQuantity });
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Сбрасываем временное значение количества после добавления в корзину
        setTempQuantity(1);
    };

    const removeFromCart = (bookId) => {
        const updatedCart = cart.filter(item => item.book_id !== bookId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const updateTempQuantity = (value) => {
        setTempQuantity(value); // Обновляем временное значение количества при изменении в NumberBox
    };

    const getCartQuantity = (bookId) => {
        const bookInCart = cart.find(item => item.book_id === bookId);
        return bookInCart ? bookInCart.quantity : 0;
    };


    const searchBook = (e) => {
        e.preventDefault();
    
        // Создаем объект с данными для отправки на сервер
        const searchData = {
            search_field: paramForSearch,
            search_query: searchText
        };
    
        // Опции запроса
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchData)
        };
    
        fetch('http://localhost/search.php', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Обработка полученных данных
                setBooks(data)
            })
            .catch(error => {
                // Обработка ошибок
                console.error('There was an error!', error);
            });
    }
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading books: {error.message}</p>;

    return (
        <div className='book'>
            
            <div className="search">
                <form onSubmit={searchBook}>
                
                    <TextBox
                        style={{marginRight: '5px'}}
                        placeholder="Поиск..."
                        width={'500px'}
                        onValueChange={(e) => setSearchText(e)}
                    />
                    <SelectBox
                        style={{marginRight: '5px'}}
                        dataSource={searchParam}
                        displayExpr="text"
                        valueExpr="id"
                        width={150}
                        defaultValue="title"
                        onValueChange={(e) => {
                            setParamForSearch(e)
                        }}>

                    </SelectBox>
                    <Button
                        style={{marginRight: '5px'}}
                        width={100}
                        type="save"
                        useSubmitBehavior={true}>Поиск
                    </Button> 
                    <Button
                        type="button"
                        width={100}
                        onClick={fetchBooks}>Сбросить
                    </Button>
                        </form>
              
                
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
                                max={book.quantity}
                                value={tempQuantity} // Используем временное значение
                                min={0}
                                onValueChanged={(e) => updateTempQuantity(e.value)} // Обновляем временное значение при изменении
                            />
                        </div>
                        <div className='button'>
                            <button onClick={() => removeFromCart(book.book_id)}>Удалить из корзины</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Homepage;
