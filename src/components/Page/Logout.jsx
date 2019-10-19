import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AppStateContext } from 'context';
import { logout } from 'redux/actions';

const LogoutPage = () => {
  const [, dispatch] = useContext(AppStateContext);

  useEffect(() => {
    logout(dispatch);
  }, [dispatch]);

  return <Redirect to="/login" />;
};

export default LogoutPage;
