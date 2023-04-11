import React, {useState, useEffect, useContext} from 'react';
import {useHttp} from '../hooks/http.hook';
import {AuthContext} from "../context/auth.context";
import {useNavigate} from "react-router-dom";

export const CreatePage = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [link, setLink] = useState('');
    const {request} = useHttp();

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const pressHandler = async (event) => {
        if (event.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', { from: link },
                    { Authorization: `Bearer ${auth.token}` });
                navigate(`/detail/${data.link._id}`);
            } catch (error) {
            }
        }
    }

    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <div className="input-field">
                    <input
                        placeholder="Вставьте ссылку"
                        id="link"
                        type="text"
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link">Введите ссылку</label>
                </div>
            </div>
        </div>
    )
};