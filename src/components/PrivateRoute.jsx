import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppStateContext } from 'context';

const PrivateRoute = ({ path, userState, component }) => {
  const [state] = useContext(AppStateContext);
  const { user, isLoading } = state;

  if (!user && (isLoading || isLoading === undefined)) return null;

  if (!user) return <Redirect to="/login" />;

  return <Route path={path} component={component} />;
};

export default PrivateRoute;
