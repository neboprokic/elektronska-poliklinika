import api from 'api';
import { stripEmptyValues } from 'utils/helpers';

function request(dispatch, action) {
  try {
    dispatch({ type: 'REQUEST' });

    return action();
  } catch (error) {
    console.log(error);
    dispatch({ type: 'ERROR', error });
  }
}

export const fetchExpenses = (dispatch, payload) =>
  request(dispatch, async () => {
    dispatch({
      type: 'EXPENSES_SUCCESS',
      payload: await api.get('/expenses', payload),
    });
  });

export const saveExpense = (dispatch, payload) =>
  request(dispatch, async () => {
    await api.post('/expenses', payload);

    fetchExpenses(dispatch);
  });

export const deleteExpense = (dispatch, id) =>
  request(dispatch, async () => {
    await api.delete(`/expenses/${id}`);

    fetchExpenses(dispatch);
  });

export const fetchAppointments = (dispatch, payload) =>
  request(dispatch, async () => {
    dispatch({
      type: 'APPOINTMENTS_SUCCESS',
      payload: await api.get('/appointments', stripEmptyValues(payload)),
    });
  });

export const saveAppointment = (dispatch, payload) =>
  request(dispatch, async () => {
    await api.post(`/appointments/${payload.id || ''}`, payload);

    fetchAppointments(dispatch);
  });

export const deleteAppointment = (dispatch, { id, ...payload }) =>
  request(dispatch, async () => {
    await api.delete(`/appointments/${id}`, payload);

    fetchAppointments(dispatch);
  });

export const fetchServices = dispatch =>
  request(dispatch, async () => {
    dispatch({ type: 'SERVICES_SUCCESS', payload: await api.get('/services') });
  });

export const saveService = (dispatch, payload) =>
  request(dispatch, async () => {
    await api.post(`/services/${payload.id || ''}`, payload);

    fetchServices(dispatch);
  });

export const deleteService = (dispatch, id) =>
  request(dispatch, async () => {
    await api.delete(`/services/${id}`);

    fetchServices(dispatch);
  });

export const fetchMedicaments = dispatch =>
  request(dispatch, async () => {
    dispatch({
      type: 'MEDICAMENTS_SUCCESS',
      payload: await api.get('/medicaments'),
    });
  });

export const saveMedicament = (dispatch, payload) =>
  request(dispatch, async () => {
    console.log(payload);

    await api.post(`/medicaments/${payload.id || ''}`, payload);

    fetchMedicaments(dispatch);
  });

export const deleteMedicament = (dispatch, id) =>
  request(dispatch, async () => {
    await api.delete(`/medicaments/${id}`);

    fetchMedicaments(dispatch);
  });

export const fetchUser = (actionType, dispatch, id) =>
  request(dispatch, async () => {
    dispatch({
      type: actionType,
      payload: await api.get(`/users/${id}`),
    });
  });

export const fetchPatients = dispatch =>
  request(dispatch, async () => {
    dispatch({
      type: 'PATIENTS_SUCCESS',
      payload: await api.get('/users', { role: 'patient' }),
    });
  });

export const fetchPatient = (...props) =>
  fetchUser('PATIENT_SUCCESS', ...props);

export const savePatient = (dispatch, payload) =>
  request(dispatch, async () => {
    dispatch({
      type: 'PATIENT_SUCCESS',
      payload: await api.post(`/users/${payload.id || ''}`, {
        ...payload,
        role: 'patient',
      }),
    });
  });

export const fetchStaff = dispatch =>
  request(dispatch, async () => {
    dispatch({ type: 'STAFF_SUCCESS', payload: await api.get('/users') });
  });

export const saveStaff = (dispatch, payload) =>
  request(dispatch, async () => {
    await api.post(`/users/${payload.id || ''}`, payload);

    fetchStaff(dispatch);
  });

export const fetchStaffMember = (...props) =>
  fetchUser('STAFF_MEMBER_SUCCESS', ...props);

export const fetchMe = dispatch =>
  request(dispatch, async () => {
    const user = await api.get('/user');

    if (!user) {
      logout(dispatch);
    } else {
      dispatch({ type: 'USER_SUCCESS', payload: user });
    }
  });

export const login = (dispatch, params) =>
  request(dispatch, async () => {
    const user = await api.post('/user', params);

    if (!user) return false;

    localStorage.setItem('token', user.token);
    dispatch({ type: 'USER_SUCCESS', payload: user });

    return true;
  });

export const logout = dispatch => {
  localStorage.removeItem('token');
  dispatch({ type: 'LOGOUT' });
};

export const openModal = (dispatch, payload) => {
  dispatch({ type: 'MODAL_OPEN', payload });
};

export const closeModal = dispatch => {
  dispatch({ type: 'MODAL_CLOSE' });
};
