import React, { useContext } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { AppStateContext } from 'context';
import { savePatient, closeModal } from 'redux/actions';

function PatientForm({ patient = {}, onSubmit }) {
  const [, dispatch] = useContext(AppStateContext);

  return (
    <Formik
      initialValues={{
        username: patient.username || '',
        password: patient.password || '',
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
      }}
      onSubmit={async (values, { setSubmitting }) => {
        await savePatient(dispatch, { ...patient, ...values });
        closeModal(dispatch);

        if (onSubmit) onSubmit();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <FormGroup>
            <Label>JMBG</Label>
            <Field
              name="username"
              render={({ field }) => <Input {...field} required />}
            />
          </FormGroup>
          <FormGroup>
            <Label>Broj kartona</Label>
            <Field
              name="password"
              render={({ field }) => <Input {...field} required />}
            />
          </FormGroup>
          <FormGroup>
            <Label>Ime</Label>
            <Field
              name="firstName"
              render={({ field }) => <Input {...field} required />}
            />
          </FormGroup>
          <FormGroup>
            <Label>Prezime</Label>
            <Field
              name="lastName"
              render={({ field }) => <Input {...field} required />}
            />
          </FormGroup>
          <Button
            type="submit"
            block
            size="lg"
            color="primary"
            disabled={isSubmitting}
          >
            Sacuvaj
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default PatientForm;
