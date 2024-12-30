import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [userActive, setUserActive] = useState(null);
    const [cardActive, setCardActive] = useState(null);
    const [cardsShown, setCardsShown] = useState([]);

    const clearUserActive = () => setUserActive(null);

    const activateCard = (title) => {
        if (cardsShown.includes(title)) {
            setCardActive(title);
        }
    };

    const clearCardActive = () => {
        if (cardsShown.length > 1) {
            const nextCard = cardsShown.find(card => card !== cardActive);
            setCardActive(nextCard);
        }
    };

    const showCard = (title) => {
        if (!cardsShown.includes(title)) {
            setCardsShown(prev => [...prev, title]);
            if (!cardActive) {
                setCardActive(title);
            }
        }
    };

    const hideCard = (title) => {
        setCardsShown(prev => prev.filter(t => t !== title));
        if (cardActive === title) {
            const remaining = cardsShown.filter(t => t !== title);
            if (remaining.length > 0) {
                setCardActive(remaining[0]);
            } else {
                setCardActive(null);
            }
        }
    };

    const clearCardsShown = () => {
        setCardsShown([]);
        setCardActive(null);
    };

    return (
        <AppContext.Provider value={{ 
            userActive,
            setUserActive,
            clearUserActive,
            cardActive,
            activateCard,
            clearCardActive,
            cardsShown,
            showCard,
            hideCard,
            clearCardsShown
        }}>
            {children}
        </AppContext.Provider>
    );
};

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp debe usarse dentro de un AppProvider');
    }
    return context;
};
