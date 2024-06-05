import { Button } from 'devextreme-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Authorization = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/authorization.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await response.json();

      if (response.status === 200 && data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/'; 
      } else {
        throw new Error('Failed to retrieve token');
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Authorization</h2>
      <form onSubmit={handleSubmit} className='form-container'>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Пароль"
          required
        />
        <button type="submit">Войти</button>
        <button
        type="button"
        style={{marginTop: '10px'}}
        onClick={() => {navigate('/registration')}}
        >
          Регистрация
        </button>
      </form>
    </div>
  );
};

export default Authorization;
