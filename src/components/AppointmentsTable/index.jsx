import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Jumbotron,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { AppStateContext } from 'context';
import {
  fetchAppointments,
  fetchServices,
  fetchStaff,
  fetchPatients,
  openModal,
} from 'redux/actions';
import { addDays, priceFormatter } from 'utils/helpers';
import AppointmentForm from 'components/Form/Appointment';
import CancelAppointmentForm from 'components/Form/CancelAppointment';

const getAppointmentStatus = ({ status, date }) => {
  if (status === 'cancelled') return 'otkazan';

  const today = new Date().toISOString().split('T')[0];

  return date > today ? 'zakazan' : 'obavljen';
};

function AppointmentsTable({ patientId, memberId }) {
  const [{ appointments, staff, services, patients }, dispatch] = useContext(
    AppStateContext,
  );
  const [from, setFrom] = useState(memberId ? addDays(0) : undefined);
  const [to, setTo] = useState(memberId ? addDays(1) : undefined);
  const id = memberId || patientId;
  const foundAppointments = appointments.filter(
    appointment => appointment[memberId ? 'specialist' : 'patient'] === id,
  );

  const handleEditClick = appointment => {
    openModal(dispatch, {
      header: 'Zakazite pregled',
      body: (
        <AppointmentForm
          onSubmit={fetchData}
          appointment={appointment}
        />
      ),
    });
  };

  const handleCancelClick = appointment => {
    openModal(dispatch, {
      header: 'Otkazite pregled',
      body: (
        <CancelAppointmentForm
          onSubmit={fetchData}
          appointment={appointment}
        />
      ),
    });
  };

  const fetchData = useCallback(
    () => {
      fetchAppointments(dispatch, { from, to });
      fetchStaff(dispatch);
    },
    [dispatch, from, to],
  );

  useEffect(() => {
    fetchData();
    fetchServices(dispatch);
    fetchPatients(dispatch);
  }, [dispatch, fetchData]);

  return (
    <div>
      {from && to && (
        <Form inline style={{ marginBottom: 20 }}>
          <FormGroup>
            <Label style={{ marginRight: 10 }}>od</Label>
            <Input
              name="from"
              type="date"
              value={from}
              onChange={({ target }) => setFrom(target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label style={{ margin: '0 10px' }}>do</Label>
            <Input
              name="to"
              type="date"
              value={to}
              onChange={({ target }) => setTo(target.value)}
            />
          </FormGroup>
        </Form>
      )}
      <div>
        {foundAppointments.length &&
        staff.length &&
        services.length &&
        patients.length ? (
          <Table striped>
            <thead>
              <tr>
                <th>Datum i vreme</th>
                <th>Duzina usluge</th>
                <th>Vrsta pregleda</th>
                <th>{memberId ? 'Pacijent' : 'Specijalista'}</th>
                <th>Cena</th>
                <th>Simptomi</th>
                <th>Status</th>
                <th>Komentar</th>
                <th className="noprint"></th>
              </tr>
            </thead>
            <tbody>
              {foundAppointments.map(appointment => {
                const specialist = staff.find(
                  ({ id }) => id === appointment.specialist,
                );
                const service = services.find(
                  ({ id }) => id === appointment.service,
                );
                const patient = patients.find(
                  ({ id }) => id === appointment.patient,
                );

                return (
                  <tr key={appointment.id}>
                    <td>{`${appointment.date} ${appointment.time}`}</td>
                    <td>{`${service.duration} min`}</td>
                    <td>{service.name}</td>
                    {!memberId && (
                      <td>{`${specialist.firstName} ${specialist.lastName}`}</td>
                    )}
                    {!patientId && (
                      <td>{`${patient.firstName} ${patient.lastName}`}</td>
                    )}
                    <td>{priceFormatter.format(service.price)}</td>
                    <td>{appointment.symptoms}</td>
                    <td>{getAppointmentStatus(appointment)}</td>
                    <td>{appointment.comment}</td>
                    <td style={{ width: '200px' }} className="noprint">
                      {appointment.status !== 'cancelled' && (
                        <>
                          <Button onClick={() => handleEditClick(appointment)}>
                            izmeni
                          </Button>
                          <Button
                            color="danger"
                            onClick={() => handleCancelClick(appointment)}
                            style={{ marginLeft: 20 }}
                          >
                            otkazi
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <Jumbotron>Nema zakazanih pregleda</Jumbotron>
        )}
      </div>
    </div>
  );
}

export default AppointmentsTable;
