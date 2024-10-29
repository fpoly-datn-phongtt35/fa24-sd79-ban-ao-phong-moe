import React, { createContext, useContext, useState } from 'react';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    return (
        <CustomerContext.Provider value={{ selectedCustomer, setSelectedCustomer }}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomer() {
    return useContext(CustomerContext);
}
