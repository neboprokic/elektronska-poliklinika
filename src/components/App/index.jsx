import React, { useReducer, useEffect } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { setHistory } from 'utils/route';
import { reducer, initialState, init } from 'redux/reducer';
import { fetchMe } from 'redux/actions';
import { AppStateContext } from 'context';
import Header from 'components/Header';
import Modal from 'components/Modal';
import PrivateRoute from 'components/PrivateRoute';
import DashboardPage from 'components/Page/Dashboard';
import LoginPage from 'components/Page/Login';
import LogoutPage from 'components/Page/Logout';
import './styles.css';

function App({ history }) {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  useEffect(() => {
    setHistory(history);

    fetchMe(dispatch);
  }, [history]);

  return (
    <AppStateContext.Provider value={[state, dispatch]}>
      <Header />
      <Modal />
      <Switch>
        <PrivateRoute path="/" exact component={DashboardPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/logout" component={LogoutPage} />
        <Redirect from="*" to="/" />
      </Switch>
    </AppStateContext.Provider>
  );
}

export default withRouter(App);
