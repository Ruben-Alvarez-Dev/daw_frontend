import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-text">
                    {new Date().getFullYear()} Restaurant Manager. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
