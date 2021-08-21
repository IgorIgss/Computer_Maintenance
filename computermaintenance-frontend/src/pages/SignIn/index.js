import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import cogoToast from 'cogo-toast';

import api from '../../services/api';
import history from '../../services/history';

import { userDataSuccess } from '../../store/modules/userData/actions';

import backgroundAuth from '../../assets/backgroundAuth.svg';

export default function SignIn() {
  const dispatch = useDispatch();

  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  function fieldValidation(fields) {
    const validation = Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string().required(),
    });

    return validation.isValid(fields);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const data = {
      username: usernameValue.trim(),
      password: passwordValue.trim(),
    };

    const formDataIsValid = await fieldValidation(data);

    if (!formDataIsValid) {
      return cogoToast.error('Erro de validação, tente novamente!', {
        position: 'top-right',
      });
    }

    try {
      const login = await api.post('/login', data);

      if (!login) {
        return cogoToast.error('Erro ao logar usuário.', {
          position: 'top-right',
        });
      }

      setUsernameValue('');
      setPasswordValue('');

      const { username } = login.data;

      cogoToast.success(`Bem-vindo ${username}`, {
        position: 'top-right',
      });

      dispatch(userDataSuccess(login.data));

      return history.push('/');
    } catch (err) {
      const { error } = err.response.data;

      return cogoToast.error(error, {
        position: 'top-right',
      });
    }
  }

  return (
    <>
      <section>
        <div>
          <h1>Manutenção de Computadores</h1>
          <p>Entre para verificar as tratativas em tempo real</p>
        </div>
        <form onSubmit={handleFormSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Nome de usuário"
            autoComplete="off"
            onChange={(e) => setUsernameValue(e.target.value)}
            value={usernameValue}
          />
          <input
            name="agent"
            type="password"
            placeholder="Senha"
            autoComplete="off"
            onChange={(e) => setPasswordValue(e.target.value)}
            value={passwordValue}
          />
          <button type="submit">Entrar</button>
        </form>
        <Link to="/register">Criar conta</Link>
      </section>
      <section>
        <img src={backgroundAuth} alt="Background Auth" />
      </section>
    </>
  );
}
