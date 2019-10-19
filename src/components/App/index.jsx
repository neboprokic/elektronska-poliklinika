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
import PatientPage from 'components/Page/Patient';
import PatientsPage from 'components/Page/Patients';
import MedicamentsPage from 'components/Page/Medicaments';
import ExpensesPage from 'components/Page/Expenses';
import ServicesPage from 'components/Page/Services';
import StaffPage from 'components/Page/Staff';
import StaffMemberPage from 'components/Page/StaffMember';
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
        <PrivateRoute path="/pacijenti/:id" component={PatientPage} />
        <PrivateRoute path="/pacijenti" component={PatientsPage} />
        <PrivateRoute path="/medikamenti" component={MedicamentsPage} />
        <PrivateRoute path="/usluge" component={ServicesPage} />
        <PrivateRoute path="/osoblje/:id" component={StaffMemberPage} />
        <PrivateRoute path="/osoblje" component={StaffPage} />
        <PrivateRoute path="/troskovi" component={ExpensesPage} />
        <Redirect from="*" to="/" />
      </Switch>
    </AppStateContext.Provider>
  );
}

export default withRouter(App);
