import React from "react";
import './Header.css';
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="app-header">
            <div className="header-left">
                <img src="image.png" alt="logo" className="header-logo" />
            </div>

            <div className="header-center">
                <nav className="header-nav">
                    <Link to="/">Inicio</Link>
                    <Link to="/tareas">Tareas</Link>
                    <Link to="/directorio">Directorio</Link>
                </nav>
            </div>
            <div className="header-right">
                <ThemeSwitcher />
            </div>
        </header>
    );
};

export default Header;