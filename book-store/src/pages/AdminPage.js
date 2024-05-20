import React, { useEffect, useState } from 'react';
import { SelectBox, Popup, Button, TextBox, NumberBox, FileUploader } from 'devextreme-react';
import { Validator, RequiredRule } from 'devextreme-react/validator';

const AdminPage = () => {
    const [authorData, setAuthorData] = useState([]);
    const [selectedAuthorId, setSelectedAuthorId] = useState(null);
    const [authorFirstName, setAuthorFirstName] = useState(null);
    const [authorMiddleName, setAuthorMiddleName] = useState(null);
    const [authorLastName, setAuthorLastName] = useState(null);
    const [bookName, setBookName] = useState(null);
    const [bookQuantity, setBookQuantity] = useState(null);
    const [bookPrice, setBookPrice] = useState(null);
    const [bookCover, setBookCover] = useState(null);
    const [coverImage, setCoverImage] = useState(''); // состояние для URL обложки
    const [isAuthorPopupVisible, setIsAuthorPopupVisible] = useState(false);
    const [isAddBookPopupVisible, setBookPopupVisible] = useState(false);

    // Fetch authors data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost/author.php');
                if (response.ok) {
                    const data = await response.json();
                    const formattedAuthors = data.authors.map(author => ({
                        key: author.id,
                        value: author.author
                    }));
                    setAuthorData(formattedAuthors);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleAuthorChange = (value) => {
        setSelectedAuthorId(value);
    };

    const handleSetAuthorPopupVisible = (value) => {
        setIsAuthorPopupVisible(value);
    };

    const handleSetBookPopupVisible = (value) => {
        setBookPopupVisible(value);
    };

    const handleSetAuthorFirstName = (e) => {
        const value = e.value;
        setAuthorFirstName(value);
    };

    const handleSetAuthorMiddleName = (e) => {
        const value = e.value;
        setAuthorMiddleName(value);
    };

    const handleSetAuthorLastName = (e) => {
        const value = e.value;
        setAuthorLastName(value);
    };

    const handleSetBookName = (e) => {
        const value = e.value;
        setBookName(value);
    };

    const handleSetBookQuantity = (e) => {
        const value = e.value;
        setBookQuantity(value);
    };

    const handleSetBookPrice = (e) => {
        const value = e.value;
        setBookPrice(value);
    };

    const handleSetBookCover = (e) => {
        const file = e.value[0];
        const reader = new FileReader();
        reader.onload = () => {
            setCoverImage(reader.result);
        };
        reader.readAsDataURL(file);
        setBookCover(file);
    };

    const handleSubmitBookForm = async (e) => {
        e.preventDefault();
        const bookData = {
            book_name: bookName,
            author_id: selectedAuthorId,
            price: bookPrice,
            quantity: bookQuantity,
            cover: bookCover,
        };

        try {
            const response = await fetch('http://localhost/book.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            });

            if (response.ok) {
                const result = await response.json();
                setBookPopupVisible(false);
            } else {
                throw new Error('Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

  

    const handleSubmitAuthorForm = async (e) => {
        console.log('a')
        e.preventDefault();
        const authorData = {
            first_name: authorFirstName,
            middle_name: authorMiddleName,
            last_name: authorLastName
        };

        try {
            const response = await fetch('http://localhost/author.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(authorData)
            });

            if (response.ok) {
                const result = await response.json();
                setIsAuthorPopupVisible(false);
            } else {
                throw new Error('Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div>
            <h2>Admin Page</h2>
            <Button text="Добавить книгу" onClick={() => handleSetBookPopupVisible(true)} />
            <p>Selected Author ID: {selectedAuthorId}</p>
            <Button text="Добавить автора" onClick={() => handleSetAuthorPopupVisible(true)} />
            <Popup
                visible={isAddBookPopupVisible}
                onHiding={() => handleSetBookPopupVisible(false)}
            >
                <form id='bookForm' onSubmit={handleSubmitBookForm}>
                    {coverImage && (
                        <div>
                            <h3>Предпросмотр обложки:</h3>
                            <img src={coverImage} alt="Обложка книги" style={{ maxWidth: '10%', height: 'auto' }} />
                        </div>
                    )}
                    <TextBox
                        onValueChanged={handleSetBookName}
                        placeholder='Название книги'
                    />
                    <div className='author'>
                        <SelectBox
                            width={150}
                            displayExpr="value"
                            valueExpr="key"
                            dataSource={authorData}
                            onValueChange={handleAuthorChange}
                        />
                        
                        
                        <NumberBox
                            onValueChanged={handleSetBookQuantity}
                            min={0}
                            showSpinButtons={true}
                            placeholder='Количество'
                        />
                        <NumberBox
                            onValueChanged={handleSetBookPrice}
                            min={0}
                            showSpinButtons={true}
                            placeholder='Цена'
                            format="#,##0.00 ₽"
                        />
                    </div>
                    <FileUploader
                        selectButtonText="Выберите изображение"
                        labelText=""
                        accept="image/*"
                        uploadMode="useForm"
                        onValueChanged={handleSetBookCover}
                    />
                    <Button text="Отрпавить" type="submit"  id='bookForm' useSubmitBehavior={true}/>
                </form>
            </Popup>
            
            <Popup
                title='Добавление нового автора'
                width={400}
                height={300}
                visible={isAuthorPopupVisible}
                onHiding={() => handleSetAuthorPopupVisible(false)}
            >
               <form onSubmit={handleSubmitAuthorForm} id='authorForm'>
                    <TextBox
                        onValueChanged={handleSetAuthorFirstName}
                        placeholder="Имя"
                    >
                    </TextBox>
                    <TextBox
                        onValueChanged={handleSetAuthorMiddleName}
                        placeholder="Отчество"
                    />
                    <TextBox
                        onValueChanged={handleSetAuthorLastName}
                        placeholder="Фамилия"
                    >
                    </TextBox>
                    <Button text="Отправить" type="submit" useSubmitBehavior={true} id='authorForm'/>
                </form>
            </Popup>
        </div>
    );
};

export default AdminPage;
