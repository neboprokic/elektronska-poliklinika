import React, { useContext, useEffect, useCallback } from 'react';
import { Button, Card, CardHeader, CardBody } from 'reactstrap';
import { AppStateContext } from 'context';
import {
  fetchPatient,
  fetchAppointments,
  fetchStaff,
  openModal,
} from 'redux/actions';
import PatientForm from 'components/Form/Patient';
import AppointmentForm from 'components/Form/Appointment';
import PageContainer from 'components/Page/PageContainer';
import AppointmentsTable from 'components/AppointmentsTable';

function PatientPage({ match }) {
  const { id } = match.params;
  const [state, dispatch] = useContext(AppStateContext);
  const { patient = {} } = state;

  const handleEditClick = () => {
    openModal(dispatch, {
      header: 'Unesite izmene',
      body: (
        <PatientForm
          onSubmit={() => fetchPatient(dispatch, id)}
          patient={patient}
        />
      ),
    });
  };

  const handleAddAppointmentClick = () => {
    openModal(dispatch, {
      header: 'Zakazite pregled',
      body: (
        <AppointmentForm
          onSubmit={fetchData}
          appointment={{ patient: patient.id }}
        />
      ),
    });
  };

  const fetchData = useCallback(() => {
    fetchPatient(dispatch, id);
    fetchAppointments(dispatch);
    fetchStaff(dispatch);
  }, [dispatch, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PageContainer>
      <Card style={{ width: '400px', marginBottom: '30px' }}>
        <CardHeader>Osnovni podaci o pacijentu</CardHeader>
        <CardBody>
          <div>
            JMBG: <b>{patient.username}</b>
          </div>
          <div className="noprint">
            Broj kartona: <b>{patient.password}</b>
          </div>
          <div>
            Ime: <b>{patient.firstName}</b>
          </div>
          <div>
            Prezime: <b>{patient.lastName}</b>
          </div>
          <Button
            onClick={handleEditClick}
            color="primary"
            style={{ margin: '20px 20px 0 0' }}
            className="noprint"
          >
            izmeni
          </Button>
          <Button
            onClick={handleAddAppointmentClick}
            color="primary"
            style={{ marginTop: '20px' }}
            className="noprint"
          >
            zakazi pregled
          </Button>
        </CardBody>
      </Card>
      <AppointmentsTable patientId={patient.id} />
    </PageContainer>
  );
}

export default PatientPage;
