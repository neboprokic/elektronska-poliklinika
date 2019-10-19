import React, { useContext, useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { AppStateContext } from 'context';
import { saveAppointment, closeModal } from 'redux/actions';

const getPaddedTime = (hrs, mins) =>
  `${hrs < 10 ? `0${hrs}` : hrs}:${mins < 10 ? `0${mins}` : mins}`;

const getTime = slotIndex => {
  const minutes = 7 * 60 + slotIndex * 15;
  return getPaddedTime(Math.floor(minutes / 60), minutes % 60);
};

const addMinutes = (time, minutes) => {
  const date = new Date();
  date.setHours(time.split(':')[0]);
  date.setMinutes(parseInt(time.split(':')[1], 10) + minutes);

  return getPaddedTime(date.getHours(), date.getMinutes());
};

// by default every 15 min is available time slot
const slots = new Array((21 - 7) * 4)
  .fill(null)
  .map((value, index) => getTime(index));

const getDate = date => new Date(date).toISOString().split('T')[0];

const getSpecialists = ({ specialists, service }) => {
  const serviceSpecialists = specialists.filter(({ services, from, to }) => {
    return (
      services.includes(service.id) &&
      ((from >= service.from && from < service.to) ||
        (to <= service.to && to > service.from) ||
        (from <= service.from && to > service.from) ||
        (to >= service.to && from < service.to))
    );
  });

  // console.log('specialists', service, specialists, serviceSpecialists);

  return serviceSpecialists;
};

let initialState = {};

function AppointmentForm({ appointment, onSubmit }) {
  const [{ appointments, staff, services, patients }, dispatch] = useContext(
    AppStateContext,
  );
  const specialists = staff.filter(
    ({ role, status }) => role === 'dr' && status === 'active',
  );

  const getSlots = ({ specialist, service, date }) => {
    if (!specialist) return [];

    const foundAppointments = (specialist.appointments[date] || [])
      .map(id => appointments.find(appointment => id === appointment.id))
      .filter(({ status }) => status !== 'cancelled')
      .map(appointment => ({
        ...appointment,
        service: services.find(({ id }) => appointment.service === id),
      }));
    let availableSlots = slots.filter(time => {
      const endTime = time + service.duration;

      return (
        time >= specialist.from &&
        time >= service.from &&
        endTime <= service.to &&
        endTime <= specialist.to
      );
    });

    // console.log(availableSlots, date, services, specialist, foundAppointments);

    availableSlots = availableSlots.filter(slotTime => {
      if (appointment.time === slotTime) return true;

      const availables = foundAppointments.filter(
        ({ time }) =>
          addMinutes(slotTime, service.duration) <= time ||
          slotTime >= addMinutes(time, service.duration),
      );

      return availables.length === foundAppointments.length;
    });

    // console.log(availableSlots);

    return availableSlots;
  };

  initialState.service = appointment.service
    ? services.find(({ id }) => id === appointment.service)
    : services[0];
  initialState.specialists = getSpecialists({
    service: initialState.service,
    specialists,
  });
  initialState.specialist = appointment.specialist
    ? specialists.find(({ id }) => id === appointment.specialist)
    : initialState.specialists[0];
  initialState.date = getDate(appointment.date || new Date());
  initialState.slots = getSlots({
    specialist: initialState.specialist,
    service: initialState.service,
    date: initialState.date,
  });
  initialState.time = appointment.time || initialState.slots[0];
  initialState.symptoms = appointment.symptoms || '';

  const [state, setState] = useState(initialState);

  // console.log('init', initialState, appointment.time, initialState.slots[0]);

  const handleServiceChange = ({ target }) => {
    const serviceId = target.value;
    const service = services.find(({ id }) => id === serviceId);
    const serviceSpecialists = getSpecialists({ service, specialists });
    const specialist = serviceSpecialists[0];
    const availableSlots = getSlots({
      specialist,
      service,
      date: state.date,
    });

    // console.log('service change', service, availableSlots, specialist);

    setState({
      ...state,
      service,
      specialists: serviceSpecialists,
      specialist: serviceSpecialists[0],
      slots: availableSlots,
      time: availableSlots[0],
    });
  };

  const handleSpecialistChange = ({ target }) => {
    const specialistId = target.value;
    const { service, specialists, date } = state;
    const specialist = specialists.find(({ id }) => id === specialistId);
    const availableSlots = getSlots({ specialist, service, date });

    // console.log(specialist, state);

    setState({
      ...state,
      specialist,
      slots: availableSlots,
      time: availableSlots[0],
    });
  };

  const handleDateChange = ({ target }) => {
    const date = target.value;
    const { specialist, service } = state;
    const availableSlots = getSlots({ specialist, service, date });

    // console.log(date, state);

    setState({
      ...state,
      date,
      slots: availableSlots,
      time: availableSlots[0],
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const { service, specialist, date, time, symptoms } = state;
    const payload = {
      ...appointment,
      service: service.id,
      specialist: specialist.id,
      date,
      time,
      symptoms,
    };

    // console.log('submit', state, payload);

    await saveAppointment(dispatch, payload);
    closeModal(dispatch);

    if (onSubmit) onSubmit();
  };

  // console.log('state', state, appointment, state.slots);

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Usluga</Label>
        <Input
          name="service"
          type="select"
          value={state.service.id}
          onChange={handleServiceChange}
        >
          {services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label>Specijalista</Label>
        <Input
          name="specialist"
          type="select"
          value={state.specialist.id}
          onChange={handleSpecialistChange}
        >
          {state.specialists.map(specialist => (
            <option key={specialist.id} value={specialist.id}>
              {`${specialist.firstName} ${specialist.lastName}`}
            </option>
          ))}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label>Datum</Label>
        <Input
          name="date"
          type="date"
          min={getDate(new Date())}
          value={state.date}
          onChange={handleDateChange}
        />
      </FormGroup>
      <FormGroup>
        <Label>Termin</Label>
        <Input
          name="time"
          type="select"
          value={state.time}
          onChange={({ target }) => setState({ ...state, time: target.value })}
        >
          {state.slots.map(slot => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label>Simptomi</Label>
        <Input
          name="simptoms"
          type="textarea"
          rows="5"
          value={state.symptoms}
          onChange={({ target }) =>
            setState({ ...state, symptoms: target.value })
          }
        />
      </FormGroup>
      <Button
        type="submit"
        block
        size="lg"
        color="primary"
        disabled={!state.time}
      >
        Sacuvaj
      </Button>
    </Form>
  );
}

export default AppointmentForm;
