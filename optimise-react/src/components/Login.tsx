import React, { useState, useContext, Dispatch, SetStateAction } from 'react';
import { LoginContext } from '../context/LoginContext';
import axios from 'axios';
import './Login.scss';
import { FetchButton } from './FetchButton';

export const Login: React.FC = () => {

    const loginContext = useContext(LoginContext);
    const [mode, setMode] = useState<string>('login');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userCreated, setUserCreated] = useState<any>(false); 

    const changeHandler = (e: React.FormEvent<HTMLInputElement>, setter: Dispatch<SetStateAction<string>>) => {
        setter(e.currentTarget.value);
    }

    const modeToggler = () => {
        if (mode == 'login') {
            setMode('signup');
        } else {
            setMode('login');
        }
    }

    const loginHandler = (res: {data: { token: string}}) => {
       loginContext.setState({
           token: res.data.token, 
           loggedIn: true
       })
    }; 

    return (
        <div className='Login'>
            <h2>{mode}</h2>
            <input onChange={e => changeHandler(e, setUsername)} placeholder='Username' />
            <input onChange={e => changeHandler(e, setPassword)} placeholder='Password' type='password' />
            {
                mode == 'login' ?
                    <FetchButton
                        label='Login'
                        body={{ username, password }}
                        method='post'
                        setter={loginHandler}
                        url='http://localhost:3001/login'
                        disabled={password.length == 0 || username.length == 0 ? true : false}
                    /> :
                    <FetchButton
                        label='Sign Up'
                        body={{ username, password }}
                        method='post'
                        setter={setUserCreated}
                        url='http://localhost:3001/signup'
                        disabled={password.length == 0 || username.length == 0 ? true : false}
                    />
            }
            <button onClick={modeToggler}>
                Switch to {mode == 'login' ? 'Sign Up' : 'Login'}
            </button>
            {userCreated ? <div className='modal'>New user successfully created</div> : null}
        </div>
    )
}
