import React, { useContext } from 'react';
import { Button, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { AppStateContext } from 'context';
import { saveExpense, closeModal } from 'redux/actions';

function ExpenseForm({ expense = {}, onSubmit }) {
  const [state, dispatch] = useContext(AppStateContext);
  const { medicaments } = state;

  return (
    <Formik
      initialValues={{
        medicament: expense.medicament || medicaments[0].id,
        quantity: expense.quantity || 1,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        await saveExpense(dispatch, { ...expense, ...values });
        closeModal(dispatch);

        if (onSubmit) onSubmit();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Row form>
            <Col md={9}>
              <FormGroup>
                <Label>Medikament</Label>
                <Field
                  name="medicament"
                  render={({ field }) => (
                    <Input {...field} type="select">
                      {medicaments.map(medicament => (
                        <option key={medicament.id} value={medicament.id}>
                          {medicament.name}
                        </option>
                      ))}
                    </Input>
                  )}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Kolicina</Label>
                <Field
                  name="quantity"
                  render={({ field }) => (
                    <Input {...field} type="number" min="1" />
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

export default ExpenseForm;
