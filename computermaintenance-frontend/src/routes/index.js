import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import ComputerMaintenanceCalled from '../pages/ComputerMaintenanceCalled';

export default function Routes() {
  return (
    <Switch>
      <Route path="/register" component={SignUp} />
      <Route path="/login" component={SignIn} />
      <Route path="/" exact component={ComputerMaintenanceCalled} isPrivate />
    </Switch>
  );
}
