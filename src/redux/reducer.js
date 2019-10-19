export const initialState = {
  staff: [],
  expenses: [],
  services: [],
  medicaments: [],
  patients: [],
  appointments: [],
};

export const init = () => ({ ...initialState });

export function reducer(state, { type, payload }) {
  switch (type) {
    case 'REQUEST':
      return { ...state, isLoading: true };
    case 'ERROR':
      return { ...state, isLoading: false };
    case 'USER_SUCCESS':
      return { ...state, isLoading: false, user: payload };
    case 'EXPENSES_SUCCESS':
      return { ...state, isLoading: false, expenses: payload };
    case 'MEDICAMENTS_SUCCESS':
      return { ...state, isLoading: false, medicaments: payload };
    case 'PATIENTS_SUCCESS':
      return { ...state, isLoading: false, patients: payload };
    case 'PATIENT_SUCCESS':
      return { ...state, isLoading: false, patient: payload };
    case 'APPOINTMENTS_SUCCESS':
      return { ...state, isLoading: false, appointments: payload };
    case 'SERVICES_SUCCESS':
      return { ...state, isLoading: false, services: payload };
    case 'STAFF_SUCCESS':
      return { ...state, isLoading: false, staff: payload };
    case 'STAFF_MEMBER_SUCCESS':
      return { ...state, isLoading: false, member: payload };
    case 'MODAL_OPEN':
      return { ...state, isModalOpen: true, modal: payload };
    case 'MODAL_CLOSE':
      return { ...state, isModalOpen: false, modal: undefined };
    case 'LOGOUT':
      return init();
    default:
      return state;
  }
}
