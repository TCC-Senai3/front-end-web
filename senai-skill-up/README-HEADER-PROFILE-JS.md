```jsx
{/* Perfil do Usuário */}
<div className="user-profile" ref={userProfileDropdownRef} onClick={toggleUserProfile}>
    <img 
        src={require("../../assets/images/user-profile 1.png")} 
        alt="Avatar" 
        className="avatar" 
    />
    <span className="username">{userData?.nome || 'USUARIO'}</span>
    <span className="dropdown-arrow">▼</span>
    
    {/* Dropdown Menu do Perfil */}
    {isUserProfileOpen && (
        <div className="user-profile-dropdown">
            <div className="user-dropdown-arrow"></div>
            <div className="user-dropdown-content">
                <div 
                    className="user-dropdown-item" 
                    onClick={() => handleUserProfileClick('MINHA CONTA')}
                >
                    MINHA CONTA
                </div>
                <div 
                    className="user-dropdown-item" 
                    onClick={() => handleUserProfileClick('USUÁRIOS')}
                >
                    USUÁRIOS
                </div>
                {/* Opção de administrador pode ser adicionada baseada no tipo de usuário */}
                <div 
                    className="user-dropdown-item admin-item" 
                    onClick={() => handleUserProfileClick('GERENCIAR USUÁRIOS')}
                >
                    GERENCIAR USUÁRIOS
                </div>
            </div>
        </div>
    )}
</div>

{/* TESTE: Sempre mostrar para debug */}
<div className="points-section">
    <img 
        src={require("../../assets/images/image 33.png")} 
        alt="Medalha" 
        className="medal-icon" 
    />
    <span className="points-number">{userData ? userData.pontuacao : '0'}</span>
</div>
```
