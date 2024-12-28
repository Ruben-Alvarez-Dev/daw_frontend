import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <div className="home-content">
                <h1>Bienvenido a Restaurant Manager</h1>
                <p className="home-description">
                    La solución integral para la gestión de restaurantes
                </p>
                <div className="home-text">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
                        in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                        veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                </div>
                <div className="home-features">
                    <div className="feature-card">
                        <h3>Gestión de Reservas</h3>
                        <p>Sistema completo para manejar reservas de manera eficiente</p>
                    </div>
                    <div className="feature-card">
                        <h3>Control de Mesas</h3>
                        <p>Organiza y supervisa todas las mesas de tu restaurante</p>
                    </div>
                    <div className="feature-card">
                        <h3>Gestión de Personal</h3>
                        <p>Administra los roles y permisos de tu equipo</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
