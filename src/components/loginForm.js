import React, { useState } from 'react';
import '../css/LoginForm.css'; 
import '../css/Message.css';

const LoginForm = ({ onLogin, toggleView, loginMessage, isLoginError }) => {
    const [formData, setFormData] = useState({
      username:'',
      email: '',
      password: '',
      role: '' 
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
      setMessage('');
      setIsError(false);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      if (!formData.role) {
        setMessage('Please select a role to continue.');
        return;
        setIsError(true);
      }
      if (typeof onLogin === 'function') {
        onLogin(formData, (result) => {
          if (result.success) {
            setMessage(`Login successful as ${formData.role}!`);
            setIsError(false);
          } else {
            setMessage('Incorrect username, password, or role.');
            setIsError(true);
          }
        });
      } else {
        console.error('onLogin is not a function');
      }
    };

    return (
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
        <div className="form-field">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="form-field">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
            />
          </div>
          <div className="form-field">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-field role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === 'user'}
                onChange={handleChange}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={handleChange}
              />
              Admin
            </label>
          </div>
          <button type="submit" className="login-btn">Log In</button>
        </form>
        {loginMessage && (
                <div className={isLoginError ? "error-message" : "success-message"}>
                    {loginMessage}
                </div>
            )}
        <div className="signup-link">
        Don't have an account? <span onClick={toggleView} style={{ color: 'blue', cursor: 'pointer' }}>Sign Up</span>
            </div>
      </div>
    );
};

export default LoginForm;
