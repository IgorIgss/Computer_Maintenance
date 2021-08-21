import React from 'react';

import CreateCalled from '../CreateCalled';
import UpdateCalled from '../UpdateCalled';
import ShowUsersOnline from '../ShowUsersOnline';
import Logout from '../Logout';

import logo from '../../assets/computer.svg';

import { Container } from './styles';

export default function Header() {
  return (
    <Container>
      <div>
        <img src={logo} alt="Logo" />
        <header>Chamados sendo verificados em tempo real</header>
      </div>
      <section>
        <ShowUsersOnline />
        <CreateCalled />
        <UpdateCalled />
        <Logout />
      </section>
    </Container>
  );
}
