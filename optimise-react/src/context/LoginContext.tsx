import React, { createContext, useState, Dispatch, SetStateAction } from 'react';

interface Props {
    children: React.ReactNode
}

interface Login {
    loggedIn: boolean;
    token: string;
    
};

const initialState: Login = {
    loggedIn: false,
    token: ''
}

interface LoginContextType {
    state: Login;
    setState: Dispatch<SetStateAction<Login>>;
}

export const LoginContext = createContext<LoginContextType>({state: {loggedIn: false, token: ''}, setState: ()=>{}});

export const LoginContextProvider: React.FC<Props> = ({ children }) => {

    const [state, setState] = useState<Login>(initialState);

    return (
        <LoginContext.Provider value={{ state, setState }}>
            { children}
        </LoginContext.Provider>
    );
}