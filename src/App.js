import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from './components/loginForm';
import RegistrationForm from './components/registrationForm';
import AdminPage from './components/adminPage';
import PredictPage from './components/predictPage';
import './css/Message.css';

const App = () => {
    const navigate = useNavigate();
    const [isLoginView, setIsLoginView] = useState(true);
    const [loginMessage, setLoginMessage] = useState('');
    const [isLoginError, setIsLoginError] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [isRegistrationError, setIsRegistrationError] = useState(false);

    const handleLogin = async (formData) => {
        setLoginMessage('');
        setIsLoginError(false);
        try {
            const response = await fetch('http://localhost:5001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                setLoginMessage('Login successful! Welcome ' + data.username + '!');
                navigate(data.role === 'admin' ? '/admin' : '/predict');
            } else {
                setIsLoginError(true);
                const errorText = await response.text();
                console.error('Login failed:', errorText);
                setLoginMessage('Incorrect email or password. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            setIsLoginError(true);
            setLoginMessage('Network error, please try again later.');
        }
    };

    const handleRegister = async (formData) => {
        setRegistrationMessage('');
        setIsRegistrationError(false);
        try {
            const response = await fetch('http://localhost:5001/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registration successful:', data);
                setRegistrationMessage('Registration successful! You can now log in.');
                navigate('/');
            } else {
                console.error('Registration failed:', data);
                setIsRegistrationError(true);
                setRegistrationMessage('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            setIsRegistrationError(true);
            setRegistrationMessage('Network error, please try again later.');
        }
    };

    const toggleView = () => setIsLoginView(!isLoginView);

    return (
        <div className="App">
            
                <Routes>
                    <Route path="/login" element={
                        isLoginView ? (
                            <LoginForm 
                                onLogin={handleLogin}
                                toggleView={toggleView} 
                                loginMessage={loginMessage} 
                                isLoginError={isLoginError} 
                            />
                        ) : (
                            <RegistrationForm 
                                onRegister={handleRegister} 
                                toggleView={toggleView} 
                                registrationMessage={registrationMessage} 
                                isRegistrationError={isRegistrationError} 
                            />
                        )
                    } />
                    <Route path="/register" element={
                        <RegistrationForm 
                            onRegister={handleRegister} 
                            toggleView={toggleView} 
                            registrationMessage={registrationMessage} 
                            isRegistrationError={isRegistrationError} 
                        />
                    } />
                    <Route path="/predict" element={<PredictPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            
        </div>
    );
};

export default App;
