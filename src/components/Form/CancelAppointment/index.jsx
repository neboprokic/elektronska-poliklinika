import React, { useContext } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { AppStateContext } from 'context';
import { deleteAppointment, closeModal } from 'redux/actions';

function CancelAppointmentForm({ appointment, onSubmit }) {
  const [, dispatch] = useContext(AppStateContext);

  return (
    <Formik
      initialValues={{ comment: '' }}
      onSubmit={async (values, { setSubmitting }) => {
        await deleteAppointment(dispatch, { id: appointment.id, ...values });
        closeModal(dispatch);

        if (onSubmit) onSubmit();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <FormGroup>
            <Label>Razlog otkazivanja</Label>
            <Field
              name="comment"
              render={({ field }) => (
                <Input {...field} type="textarea" rows="5" required />
              )}
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

export default CancelAppointmentForm;
