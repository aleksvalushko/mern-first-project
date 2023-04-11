import React, {useEffect, useState, useContext} from 'react';
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/auth.context";

export const AuthPage = () => {

    const auth = useContext(AuthContext);
    const { loading, error, request, clearErrors } = useHttp();
    const message = useMessage();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        message(error);
        clearErrors();
    }, [error, message, clearErrors])

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        window.M.updateTextFields();
    }, []);


    const registrationHandler = async () => {
        try {
            const data = await request('/api/auth/registration', 'POST', { ...form });
            message(data.message);
        } catch (error) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', { ...form });
            auth.login(data.token, data.id);
        } catch (error) {}
    }

  return (
      <div className='row'>
        <div className="col s6 offset-s3">
            <h1>Сократи ссылку</h1>
            <div className="card blue darken-1">
                <div className="card-content white-text">
                    <span className="card-title">Авторизация</span>
                    <div>

                        <div className="input-field">
                            <input
                                placeholder="Введите e-mail"
                                id="email"
                                type="text"
                                name="email"
                                className="yellow-input"
                                value={form.email}
                                onChange={changeHandler} />
                                <label htmlFor="first_name">E-mail</label>
                        </div>

                        <div className="input-field">
                            <input
                                placeholder="Введите пароль"
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={changeHandler}/>
                                <label htmlFor="first_name">Пароль</label>
                        </div>

                    </div>
                </div>
                <div className="card-action">
                    <button
                        className='btn yellow darken-4'
                        style={{ marginRight: '10px' }}
                        disabled={loading}
                        onClick={loginHandler}
                    >
                        Войти
                    </button>
                    <button
                        className='btn grey lighten-1 black-text'
                        disabled={loading}
                        onClick={registrationHandler}
                    >
                        Регистрация
                    </button>
                </div>
            </div>
        </div>
      </div>
  )
};