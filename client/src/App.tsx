import React, {useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import UserService from "./service/UserService";
import {IUser} from "./models/IUser";

function App() {
    const {store} = useContext(Context)
    const [users, setUsers] = useState<IUser[]>([])
    console.log(users);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    const getUsers = async () => {
        try {
            const response = await UserService.fetchUsers()
            setUsers(response.data)
        } catch (e) {
            console.log(e);
        }
    }

    if(store.isLoading) {
        return <h1>Loading...</h1>
    }

    if (!store.isAuth) {
        return <LoginForm/>
    }

    return (
        <div className="App">
            <h1>Пользователь авторизован {store.user.email}</h1>
            <button onClick={() => store.logout()}>Logout</button>
            <button onClick={getUsers}>Get users</button>
            {users.map(user => <p key={user._id}>{user.email}</p>)}
        </div>
    );
}

export default observer(App);
