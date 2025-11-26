import React, { createContext, useContext, useState } from 'react';

const ScrollContext = createContext({
    lenis: null,
    setLenis: () => { },
});

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }) => {
    const [lenis, setLenis] = useState(null);

    return (
        <ScrollContext.Provider value={{ lenis, setLenis }}>
            {children}
        </ScrollContext.Provider>
    );
};
