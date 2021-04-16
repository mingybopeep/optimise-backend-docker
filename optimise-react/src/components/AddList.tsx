import React, {useState, ChangeEvent}from 'react'; 
import './AddList.scss';
import {FetchButton} from './FetchButton';

export const AddList: React.FC<{token: string, setter: ()=>void}> = ({token, setter}) => {

    const [listName, setListName] = useState<string>('');

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setListName(e.currentTarget.value); 
    }

    return (
        <div className='AddList'>
            <h2>Create List</h2>
            <input placeholder='List Name' onChange={e=>inputHandler(e)}/>
            <FetchButton
                url='http://localhost:3001/list'
                method='post'
                body={{listName}}
                label='Create list'
                setter={setter}
                disabled={listName == ''} />
        </div>
    )
}
