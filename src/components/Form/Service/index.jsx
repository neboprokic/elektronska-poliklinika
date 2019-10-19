import React, { useContext } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { AppStateContext } from 'context';
import { saveService, closeModal } from 'redux/actions';

function ServiceForm({ service = {}, onSubmit }) {
  const [, dispatch] = useContext(AppStateContext);

  return (
    <Formik
      initialValues={{
        name: service.name || '',
        price: service.price || 0,
        from: service.from || '07:00',
        to: service.to || '21:00',
        duration: service.duration || 15,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        await saveService(dispatch, { ...service, ...values });
        closeModal(dispatch);

        if (onSubmit) onSubmit();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <FormGroup>
            <Label>Naziv</Label>
            <Field
              name="name"
              render={({ field }) => <Input {...field} required />}
            />
          </FormGroup>
          <FormGroup>
            <Label>od</Label>
            <Field
              name="from"
              render={({ field }) => (
                <Input
                  {...field}
                  type="time"
                  min="07:00"
                  max="17:00"
                  required
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Label>do</Label>
            <Field
              name="to"
              render={({ field }) => (
                <Input
                  {...field}
                  type="time"
                  min="10:00"
                  max="21:00"
                  required
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Label>Trajanje usluge (u minutima)</Label>
            <Field
              name="duration"
              render={({ field }) => <Input {...field} type="number" min="10" max="120" />}
            />
          </FormGroup>
          <FormGroup>
            <Label>Cena (RSD)</Label>
            <Field
              name="price"
              render={({ field }) => <Input {...field} type="number" min="0" />}
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

export default ServiceForm;
