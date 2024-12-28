import './Display.css';

const Display = ({ children }) => {
    return (
        <div className="display">
            <div className="display-content">
                {children}
            </div>
        </div>
    );
};

export default Display;
