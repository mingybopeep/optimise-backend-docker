import React, { Dispatch, useState, SetStateAction, useContext, useEffect } from 'react';

import axios from 'axios';
import './FetchButton.scss';

import { LoginContext } from '../context/LoginContext';


interface Props {
    label: string;
    url: string;
    method: string;
    body: {};
    setter: Dispatch<SetStateAction<any>> | (() => {});
    disabled: boolean;
}

export const FetchButton: React.FC<Props> = ({ label, url, method, body, setter, disabled }) => {

    const loginContext = useContext(LoginContext);
    const [err, setErr] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (err) {
            console.log(err.response);
        }
    }, [err])

    const handleRequest = () => {
        if (disabled) {
            return
        }
        setLoading(true);
        if (method == 'get' || !method) {
            axios.get(url, { headers: { token: loginContext.state.token } })
                .then(res => {
                    setter(res);
                    setLoading(false);
                    setErr(false);
                }).catch(err => {
                    setErr(err);
                    setLoading(false);
                });
        } else if (method == 'post') {
            axios.post(url, body, { headers: { token: loginContext.state.token } })
                .then(res => {
                    setter(res);
                    setLoading(false);
                    setErr(false);
                }).catch(err => {
                    setErr(err);
                    setLoading(false);
                });
        } else if (method == 'delete') {
            console.log('delete')
            axios(url, {
                headers: {
                    token: loginContext.state.token
                },
                method: 'DELETE',
                data: {
                    ...body
                }
            })
                .then(res => {
                    setter(res);
                    setLoading(false);
                    setErr(false);
                }).catch(err => {
                    setErr(err);
                    setLoading(false);
                });
        } else if (method == 'put') {
            axios.put(url, body, { headers: { token: loginContext.state.token } })
                .then(res => {
                    setter(res);
                    setLoading(false);
                    setErr(false);
                }).catch(err => {
                    setErr(err);
                    setLoading(false);
                });
        }
    }

    return (
        <div className={disabled ? 'FetchButton Disabled' : 'FetchButton'}>
            {
                err ?
                    <div className='error'>{err.response && err.response.data || 'error'}</div> :
                    null
            }
            { loading && <span>Loading...</span>}
            <button
                onClick={handleRequest}>
                {label}
            </button>
        </div>
    )
}
