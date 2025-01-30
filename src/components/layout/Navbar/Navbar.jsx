import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../common/Button/Button";
import "./Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">
                    RestaurantApp
                </Link>
            </div>
            <div className="navbar-user">
                {user ? (
                    <>
                        <span className="user-info">
                            {user.name} ({user.role})
                        </span>
                        <Button 
                            onClick={logout}
                            variant="danger"
                            label="Cerrar Sesión"
                        />
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <Button variant="primary" label="Iniciar Sesión" />
                        </Link>
                        <Link to="/register">
                            <Button variant="secondary" label="Registrarse" />
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
