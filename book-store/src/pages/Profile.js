import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, Column } from 'devextreme-react/data-grid';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
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
            <DataGrid dataSource={orders}>
                <Column dataField="order_id" caption="Order ID" />
                <Column dataField="order_time" caption="Order Time" dataType="datetime" />
                <Column dataField="total_amount" caption="Total Amount" format={{ type: 'currency', currency: 'RUB' }} />
            </DataGrid>
        </div>
    );
};

export default Profile;
