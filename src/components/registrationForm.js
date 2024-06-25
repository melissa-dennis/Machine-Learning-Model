import React, { useState } from 'react';
import '../css/RegistrationForm.css'; 
import '../css/Message.css';

const RegistrationForm = ({ onRegister, toggleView, registrationMessage, isRegistrationError,}) => {
    const [formData, setFormData] = useState({
      username:'',
      email: '',
      password: '',
      role: '', 
    });

    const [error, setError] = useState('');
const [visibleMessage, setVisibleMessage] = useState('');
    // Handle changes in form inputs
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
      if (error) setError('');
    };

    // Handle form submission
    const handleSubmit = (event) => {
      event.preventDefault();
      // Check if a role has been chosen
      if (!formData.role) {
        setError('Please select a role.');
        return;
      }
      // If everything's okay, clear the error and submit
      setError('');
      onRegister(formData);
    };

    return (
      <div className="registration-form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="registration-form">
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

          {/* Radio buttons for role selection */}
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
          {/* Display registration message if available */}
          {registrationMessage && (
            <div className={`message ${isRegistrationError ? 'error-message' : 'success-message'}`}>
              {registrationMessage}
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="signup-btn">Sign up</button>
        </form>
        <div className="signin-link">
          Already have an account? <span onClick={toggleView} style={{ color: 'blue', cursor: 'pointer' }}>Log In</span>
        </div>
      </div>
    );
};

export default RegistrationForm;
