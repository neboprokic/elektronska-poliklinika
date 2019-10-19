import React, { useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Button,
  FormGroup,
  Label,
  FormFeedback,
  Input,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';
import { AppStateContext } from 'context';
import { forwardTo } from 'utils/route';
import { login, logout } from 'redux/actions';
import './styles.scss';

function LoginPage() {
  const [, dispatch] = useContext(AppStateContext);

  useEffect(() => {
    logout(dispatch);
  }, [dispatch]);

  return (
    <Card className="LoginForm">
      <CardHeader>Ulogujte se</CardHeader>
      <CardBody>
        <Formik
          initialValues={{ username: '', password: '' }}
          validate={values => {
            const errors = {};

            if (!values.username) {
              errors.username = 'Required';
            } else if (!values.password) {
              errors.password = 'Required';
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            const success = await login(dispatch, values);

            if (success) {
              forwardTo('/');
            } else {
              const error = 'Nepostojeci korisnik';

              setErrors({ username: error, password: error });
            }

            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <FormGroup>
                <Label>JMBG</Label>
                <Field
                  name="username"
                  render={({ field }) => (
                    <Input
                      {...field}
                      invalid={Boolean(
                        touched[field.name] && errors[field.name],
                      )}
                    />
                  )}
                />
                <ErrorMessage name="username">
                  {errorMsg => <FormFeedback>{errorMsg}</FormFeedback>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup>
                <Label>Broj zdravstvenog kartona</Label>
                <Field
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      invalid={Boolean(
                        touched[field.name] && errors[field.name],
                      )}
                    />
                  )}
                />
                <ErrorMessage name="password">
                  {errorMsg => <FormFeedback>{errorMsg}</FormFeedback>}
                </ErrorMessage>
              </FormGroup>
              <Button
                type="submit"
                block
                size="lg"
                color="primary"
                disabled={isSubmitting}
              >
                Prosledi
              </Button>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
}

export default LoginPage;
