import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FetchButton } from './FetchButton';
import { AddTodo } from './AddTodo';
import './Lists.scss';

interface Todo {
    completed: number;
    creator: string;
    list_id: number;
    list_name: string;
    parent_list: number;
    todo_deadline: string;
    todo_id: number;
    todo_name: string;
    todo_description: string;
}

export const Lists: React.FC<{ token: string, reload: boolean }> = ({ token, reload }) => {
    const [data, setData] = useState<Todo[] | null>(null);
    const [listNames, setListNames] = useState<Array<{ list_name: string, list_id: number }> | null>(null);
    const [update, setUpdate] = useState(0);
    const [selectedTodos, setSelectedTodos] = useState<Array<number>>([]);
    const [newList, setNewList] = useState<string>('');

    useEffect(() => {
        axios.get('http://localhost:3001/todos', { headers: { token } })
            .then(res => {
                setData(res.data);
            })

        axios.get('http://localhost:3001/list', { headers: { token } })
            .then(res => {
                setListNames(
                    res.data.map((l: { list_name: string; list_id: number }) => {
                        return { list_name: l.list_name, list_id: l.list_id }
                    }))
            })
            .catch(err => {
                console.log(err);
            })
    }, [update, reload]);

    const handleTodoClick = (todo_id: number) => {
        if (selectedTodos.includes(todo_id)) {
            setSelectedTodos(selectedTodos.filter(id => id != todo_id));
        } else {
            setSelectedTodos([...selectedTodos, todo_id]);
        }
    }


    const moveTodos = () => {
        let included = data?.map(i => {
            if (selectedTodos.includes(i.todo_id)) {
                return (
                    {
                        todoId: i.todo_id,
                        listId: newList,
                        taskname: i.todo_name,
                        description: i.todo_description,
                        deadline: i.todo_deadline.slice(0, 10)
                    }
                )
            }
        });

        return { todos: included }
    }

    return (
        <div className='Lists'>
            <h2>My Lists</h2>
            {
                selectedTodos.length != 0 &&
                <>
                    <h3>Modify Selected Items</h3>
                    <h4>Move to list</h4>
                    <select onChange={e => setNewList(e.currentTarget.value)}>
                        {
                            listNames &&
                            listNames.map(ln => {
                                return (
                                    <option value={ln.list_id}>
                                        {ln.list_name}
                                    </option>
                                )
                            })
                        }
                    </select>
                    <FetchButton
                        url='http://localhost:3001/todos'
                        method='put'
                        body={moveTodos()}
                        label='move todos'
                        disabled={newList == ''}
                        setter={() => { setUpdate(update + 1); setSelectedTodos([]) }}
                    />
                    <FetchButton
                        url='http://localhost:3001/todos'
                        method='delete'
                        body={{ todos: selectedTodos }}
                        label='delete'
                        disabled={false}
                        setter={() => { setUpdate(update + 1); setSelectedTodos([]) }}
                    />
                </>
            }
            {
                listNames && data != null && listNames
                    .map(list => {
                        return (
                            <div key={list.list_id} className='List'>
                                <h3>{list.list_name}</h3>
                                {data.map(todo => {
                                    if (todo.list_id == list.list_id) {
                                        return (
                                            <ListItem
                                                clicked={selectedTodos.includes(todo.todo_id)}
                                                onClick={() => handleTodoClick(todo.todo_id)}
                                                update={() => setUpdate(update + 1)}
                                                key={todo.todo_id}
                                                todo={todo} />
                                        )
                                    }
                                })}
                                <AddTodo
                                    list_id={list.list_id}
                                    update={() => { setUpdate(update + 1) }} />
                                <FetchButton
                                    url='http://localhost:3001/list'
                                    method='delete'
                                    body={{ listIds: [list.list_id] }}
                                    label='delete list'
                                    disabled={false}
                                    setter={() => setUpdate(update + 1)}
                                />
                            </div>
                        )
                    })
            }
        </div>
    )
}


const ListItem: React.FC<{ todo: Todo, update: () => void, onClick: any, clicked: boolean }> = ({ todo, update, onClick, clicked }) => {

    const [edit, setEdit] = useState(false);
    const [newName, setNewName] = useState(todo.todo_name);
    const [newDescription, setNewDescription] = useState(todo.todo_description);
    const [newDeadline, setNewDeadline] = useState(todo.todo_deadline.slice(0, 10));

    useEffect(() => {
        setNewName(todo.todo_name);
        setNewDescription(todo.todo_description);
        setNewDeadline(todo.todo_deadline.slice(0, 10));
    }, [edit]);

    const handleUpdate = () => {
        update();
        setEdit(false);
    }

    const checkFields = () => {
        return newName == todo.todo_name && newDescription == todo.todo_description && newDeadline == todo.todo_deadline.slice(0, 10)
    }

    return (
        <div className='Todo' >
            <div onClick={onClick} className={clicked ? 'clicked' : 'box'}>
            </div>
            {
                !edit &&
                <>
                    <p>{todo.todo_name}</p>
                    <p>{'description: ' + todo.todo_description}</p>
                    <p>{'due: ' + todo.todo_deadline.slice(0, 10)}</p>
                </>
            }
            {
                edit &&
                <>
                    <input value={newName} onChange={e => setNewName(e.currentTarget.value)} />
                    <input value={newDescription} onChange={e => setNewDescription(e.currentTarget.value)} />
                    <input type='date' value={newDeadline} onChange={e => setNewDeadline(e.currentTarget.value)} />
                    <FetchButton
                        url='http://localhost:3001/todos'
                        method='put'
                        body={{
                            todos: [{
                                todoId: todo.todo_id,
                                listId: todo.list_id,
                                taskname: newName,
                                description: newDescription,
                                deadline: newDeadline
                            }
                            ]
                        }}
                        label='save edit'
                        disabled={checkFields()}
                        setter={handleUpdate}
                    />
                </>
            }
            <button onClick={() => setEdit(!edit)}>
                {edit ? 'cancel' : 'edit'}
            </button>
            {
                todo.completed == 0 ?
                <FetchButton
                    url='http://localhost:3001/todo/complete'
                    method='put'
                    body={{ id: todo.todo_id }}
                    label='Complete task'
                    disabled={false}
                    setter={handleUpdate}
                /> : <span>completed</span>

            }

        </div>
    )
}