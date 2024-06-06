import React, { useEffect, useState } from 'react';
import { SelectBox, Popup, Button, TextBox, NumberBox, FileUploader, DataGrid } from 'devextreme-react';
import {SearchPanel } from 'devextreme-react/data-grid'
import { Validator, RequiredRule } from 'devextreme-react/validator';
import { Chart, Series, ArgumentAxis, Label, Tooltip } from 'devextreme-react/chart';
import { useNavigate } from 'react-router-dom';
import { Column } from 'devextreme-react/cjs/data-grid';



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
    const [coverImage, setCoverImage] = useState('');
    const [isAuthorPopupVisible, setIsAuthorPopupVisible] = useState(false);
    const [isAddBookPopupVisible, setBookPopupVisible] = useState(false);
    const [earningsData, setEarningsData] = useState([]);
    const [days, setDays] = useState("7");
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate("/authorization");
                    return;
                }

                const response = await fetch('http://localhost/admin.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: token })
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    if(!data.access){
                        navigate("/home");
                    }
                } else {
                    navigate("/home");
                }
            } catch (error) {
                console.error('Error fetching access:', error);
                navigate("/home");
            }
        };

        fetchAccess();
    }, []);

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

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const period = 7; 
                const response = await fetch('http://localhost/statistic.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ period: period })
                });
    
                if (response.ok) {
                    const data = await response.json();
                    const formattedData = data.map(item => ({
                        date: item.date,
                        earnings: parseInt(item.earnings) || 0
                    }));
                    setEarningsData(formattedData);
                } else {
                    throw new Error('Failed to fetch earnings data');
                }
            } catch (error) {
                console.error('Error fetching earnings data:', error);
            }
        };
    
        fetchEarnings();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
          try {
            const response = await fetch('http://localhost/book.php');
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            
            setBooks(data);
          } catch (error) {
            console.error('Error fetching books:', error);
          }
        };
    
        fetchBooks();
      }, []);

    const getStatisticByDays  = async (e) => {
        setDays(e.value)
       
        const days = e.value;

        try {
           
            const response = await fetch('http://localhost/statistic.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ period: days })
            });

            if (response.ok) {
                const data = await response.json();
                const formattedData = data.map(item => ({
                    date: item.date,
                    earnings: parseInt(item.earnings) || 0
                }));
                setEarningsData(formattedData);
            } else {
                throw new Error('Failed to fetch earnings data');
            }
        } catch (error) {
            console.error('Error fetching earnings data:', error);
        }
        

    }  

    const handleSubmitAuthorForm = async (e) => {
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
        <div className="AdminPage">
            <h2>Страница администрации</h2>
            <Button text="Добавить книгу" onClick={() => handleSetBookPopupVisible(true)} />
            <Button text="Добавить автора" onClick={() => handleSetAuthorPopupVisible(true)} />
            <div className='statistic'>
                <div className='selectBox'>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Выберите период
                        </label>
                        <SelectBox
                            id="daysSelectBox"
                            width={200}
                            items={[
                                { value: '7', text: 'Последние 7 дней' },
                                { value: '14', text: 'Последние 14 дней' }
                            ]}
                            valueExpr="value"
                            value={days}
                            displayExpr="text"
                            onValueChanged={getStatisticByDays}
                        />
                    </div>
                </div>
                <div className="diagram">
                <Chart
                    dataSource={earningsData}
                    title="Объем продаж по датам"
                    id="chartContainer"
                >
                    <ArgumentAxis>
                        <Label wordWrap="breakWord" overlappingBehavior="rotate" rotationAngle={45} />
                    </ArgumentAxis>
                    <Series
                        valueField="earnings"
                        argumentField="date"
                        type="bar"
                        showInLegend={false}
                    >
                        <Label visible={true}>
                            <Tooltip enabled={true} />
                        </Label>
                    </Series>
                </Chart>
                </div>
                <div style={{width: '100%', display: 'flex',justifyContent: 'end'}}>
                    <DataGrid
                        style={{marginTop: '20px'}}
                        width={550}
                        height={400}
                        dataSource={books}>
                            <SearchPanel visible={true} width={240} placeholder="Поиск" />
                            <Column dataField="book_name" caption="Название книги" />
                            <Column width={100} dataField='quantity' caption='Количество'/>
                            
                    </DataGrid>
                </div>
            </div>
            
            <Popup
                title='Добавление новой книги'
                width={500}
                height={450}
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
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Автор
                        </label>
                        <SelectBox
                            width={150}
                            placeholder='Автор'
                            displayExpr="value"
                            valueExpr="key"
                            dataSource={authorData}
                            onValueChange={handleAuthorChange}
                        />                        
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Количество
                        </label>
                        <NumberBox
                            onValueChanged={handleSetBookQuantity}
                            min={0}
                            showSpinButtons={true}
                            placeholder='Количество'
                        />
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Цена
                        </label>
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
