import React, {useState, useContext} from 'react'; 
import {LoginContext} from '../context/LoginContext';

import {Login} from '../components/Login';
import {Lists} from '../components/Lists';

import './Home.scss';
import { AddList } from '../components/AddList';

export const Home: React.FC = () => {

    const loginContext = useContext(LoginContext); 
    const [reload, setReload] = useState<boolean>(false);
    
    console.log(loginContext.state.token)
    return (
        <div className='Home'>
            <h1>OPTIMISE TODO LIST APP</h1>
            {
                //if not logged in 
                !loginContext.state.token && <Login /> 
            }
            {
                //if logged in 
                loginContext.state.token &&
                <> 
                <Lists token={loginContext.state.token} reload={reload}/>
                <AddList token={loginContext.state.token} setter={()=>setReload(!reload)}/>
                </>
            }
        </div>
    )
}
