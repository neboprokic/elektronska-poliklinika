import React, { useContext } from 'react';
import { Button, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { AppStateContext } from 'context';
import { saveMedicament, closeModal } from 'redux/actions';

function MedicamentForm({ medicament = {}, onSubmit }) {
  const [, dispatch] = useContext(AppStateContext);

  return (
    <Formik
      initialValues={{
        name: medicament.name || '',
        price: medicament.price || 0,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        await saveMedicament(dispatch, { ...medicament, ...values });
        closeModal(dispatch);

        if (onSubmit) onSubmit();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Row form>
            <Col md={9}>
              <FormGroup>
                <Label>Naziv</Label>
                <Field
                  name="name"
                  render={({ field }) => <Input {...field} required />}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Cena (RSD)</Label>
                <Field
                  name="price"
                  render={({ field }) => (
                    <Input {...field} type="number" min="0" />
                  )}
                />
              </FormGroup>
            </Col>
          </Row>
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

export default MedicamentForm;
