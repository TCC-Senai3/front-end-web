import React, { useState } from 'react';
import './style.css';

const PasswordField = ({ 
    placeholder, 
    value, 
    onChange, 
    required = false,
    className = "",
    icon = "fas fa-lock"
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`input-field ${className}`}>
            <i className={icon}></i>
            <input 
                type={showPassword ? "text" : "password"} 
                placeholder={placeholder} 
                value={value}
                onChange={onChange}
                required={required}
            />
            <button 
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
        </div>
    );
};

export default PasswordField;
