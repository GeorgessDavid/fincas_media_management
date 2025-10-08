'use client';

import { useState, useContext, createContext, useEffect } from 'react';

interface LoggedProviderProps {
    children: React.ReactNode;
    initialData?: {
        logged: boolean;
        id: string;
        username: string;
    }
}


export const LoggedContext = createContext({ logged: false, setLogged: (logged: boolean) => { }, id: '', setId: (id: string) => { }, username: '', setUsername: (username: string) => { } });
export const useLogged = () => {
    const context = useContext(LoggedContext);
    if (!context) {
        throw new Error('useLogged must be used within a LoggedProvider');
    }
    return context;
}

export const LoggedProvider = ({ children, initialData }: LoggedProviderProps) => {
    const [logged, setLogged] = useState<boolean>(initialData?.logged || false);
    const [id, setId] = useState<string>(initialData?.id || '');
    const [username, setUsername] = useState<string>(initialData?.username || '');
    
    useEffect(() => {
        if (initialData) {
            setLogged(initialData.logged);
            setId(initialData.id);
            setUsername(initialData.username);
        }
    }, [initialData]);

    return (
        <LoggedContext.Provider value={{ logged, setLogged, id, setId, username, setUsername }}>
            {children}
        </LoggedContext.Provider>
    );
}