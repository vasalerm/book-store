import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, Column, MasterDetail  } from 'devextreme-react/data-grid';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            navigate("/authorization");
        } else {
            fetch('http://localhost/profile.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedToken}` // Отправка токена в заголовке
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUser(data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });

            fetch('http://localhost/orders.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedToken}` // Отправка токена в заголовке
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                setLoading(false);
            });
        }
    }, [navigate]);

    const fetchOrderDetails = (orderId) => {
        // Здесь делайте GET-запрос к серверу для получения данных о заказе по его ID
        console.log(orderId)
        fetch(`http://localhost/order_detail.php?order_id=${orderId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                setSelectedOrder(data); // Установка данных о заказе в состояние компонента
            })
            .catch(error => {
                console.error('Error fetching order details:', error);
            });
            
    };


    const onRowClick = (e) => {
        const orderId = e.data.order_id;
        fetchOrderDetails(orderId);
        e.component.collapseAll(-1);
        e.component.expandRow(e.key);
    };

    const renderDetail = () => {
        if (!selectedOrder) {
            return null;
        }

        return (
            <div className="order-details">
                <h2>Детали заказа</h2>
                <DataGrid
                dataSource={selectedOrder}>
                    <Column dataField="book_name" caption="Название книги" />
                    <Column dataField='quantity' caption="Количество" />
                    <Column dataField='price' caption='Цена' />
                </DataGrid>
            </div>
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Error loading profile</p>;
    }

    return (
        <div>
            <h1>{user.first_name} {user.last_name}</h1>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <DataGrid dataSource={orders}
            onRowClick={onRowClick}>
                <Column dataField="order_id" caption="Order ID" />
                <Column dataField="order_time" caption="Order Time" dataType="datetime" />
                <Column dataField="total_amount" caption="Total Amount" format={{ type: 'currency', currency: 'RUB' }} />
                <MasterDetail enabled={false} autoExpandAll={true} render={renderDetail} />
            </DataGrid>
        </div>
    );
};

export default Profile;
