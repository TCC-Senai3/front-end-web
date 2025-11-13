import React, { useState } from 'react';
import './style.css';

const PasswordField = ({ 
    placeholder, 
    value, 
    onChange, 
    required = false,
    className = "",
    icon = "fas fa-lock",
    minLength = 6,
    title = ""
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isInvalid = value && value.length > 0 && value.length < minLength;
    
    return (
        <div className={`custom-password-field ${className}`}>
            <div className={`input-field ${isInvalid ? 'invalid' : ''}`}>
                <i className={icon} style={{
                    color: isInvalid ? '#ff4444' : '#acacac',
                    transition: 'color 0.3s ease'
                }}></i>
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={placeholder} 
                    value={value}
                    onChange={onChange}
                    required={required}
                    minLength={minLength}
                    title={title}
                    style={{
                        background: 'none',
                        outline: 'none',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: isInvalid ? '#ff4444' : '#333',
                        flex: 1,
                        paddingRight: '50px',
                        height: '100%',
                        width: '100%',
                        margin: 0,
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none',
                        boxSizing: 'border-box'
                    }}
                />
                <button 
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        margin: 0,
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'all 0.3s ease',
                        color: showPassword ? '#4CAF50' : (isInvalid ? '#ff4444' : '#acacac'),
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                    }}
                >
                    <i 
                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        style={{
                            fontSize: '1rem'
                        }}
                    ></i>
                </button>
            </div>
            {isInvalid && (
                <div className="custom-password-hint">
                    Mínimo {minLength} caracteres
                </div>
            )}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .custom-password-field .password-toggle:hover {
                    background-color: #e0e0e0;
                    color: #666 !important;
                }
                
                .custom-password-field .password-toggle:focus {
                    outline: none;
                    background-color: #e0e0e0;
                    color: #666 !important;
                }
                
                .custom-password-field input::placeholder {
                    color: #aaa;
                    font-weight: 500;
                }
                
                /* Estilo para o input-field quando inválido */
                .input-field.invalid {
                    background-color: #fff5f5 !important;
                    border: 2px solid #ff4444 !important;
                }
                
                /* Garantir que o container ocupe toda a largura */
                .custom-password-field {
                    width: 100%;
                    max-width: 380px;
                    margin: 10px 0 5px;
                }
            `}</style>
        </div>
    );
};

export default PasswordField;
