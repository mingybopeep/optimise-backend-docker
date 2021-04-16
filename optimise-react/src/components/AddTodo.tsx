import React, { useState, ChangeEvent, useEffect} from 'react';
import { FetchButton } from './FetchButton';
import './AddTodo.scss';

export const AddTodo: React.FC<{ update: () => void; list_id: number }> = ({ update, list_id }) => {

    const [taskname, setTaskname] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');

    return (
        <div className='AddTodo'>
            <input placeholder='Task Name' onChange={(e: ChangeEvent<HTMLInputElement>)=>setTaskname(e.currentTarget.value)}/>
            <input placeholder='Task Description' onChange={(e: ChangeEvent<HTMLInputElement>)=>setDescription(e.currentTarget.value)}/>
            <input type='date' placeholder='Task Deadline' onChange={(e: ChangeEvent<HTMLInputElement>)=>setDeadline(e.currentTarget.value)}/>
            <FetchButton
                url={`http://localhost:3001/todos/${list_id}`}
                label='Add Todo'
                method='post'
                disabled={taskname == '' || description == '' || deadline == ''}
                body={{taskname, description, deadline}}
                setter={update}
            />
        </div>
    )
}
