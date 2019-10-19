import React, { useContext } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { AppStateContext } from 'context';
import { saveStaff, closeModal } from 'redux/actions';
import { roles } from 'globalConstants';

function StaffMemberForm({ member = {}, onSubmit }) {
  const [{ services, user }, dispatch] = useContext(AppStateContext);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        username: member.username || '',
        password: member.password || '',
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        from: member.from || '07:00',
        to: member.to || '14:00',
        services: member.services || [],
        role: member.role || roles[0].id,
      }}
      onSubmit={async values => {
        await saveStaff(dispatch, { ...member, ...values });
        closeModal(dispatch);

        if (onSubmit) onSubmit();
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <FormGroup>
            <Label>Zvanje</Label>
            <Field
              name="role"
              render={({ field }) => (
                <Input {...field} type="select">
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Input>
              )}
            />
          </FormGroup>
          <FormGroup>
            <Label>JMBG</Label>
            <Field
              name="username"
              render={({ field }) => <Input {...field} required />}
            />
          </FormGroup>
          {(user.role === 'admin' || user.id === member.id) && (
            <FormGroup>
              <Label>Broj kartona (lozinka)</Label>
              <Field
                name="password"
                render={({ field }) => <Input {...field} />}
              />
            </FormGroup>
          )}
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
          <FormGroup>
            <Label>od</Label>
            <Field
              name="from"
              render={({ field }) => (
                <Input
                  {...field}
                  type="time"
                  min="07:00"
                  max="14:00"
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
                  min="14:00"
                  max="21:00"
                  required
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Label>Usluge</Label>
            <Field
              name="services"
              render={({ field }) => (
                <Input
                  {...field}
                  type="select"
                  multiple
                  onChange={({ target }) => {
                    const { options } = target;
                    const selected = [];

                    for (let i = 0, l = options.length; i < l; i++) {
                      if (options[i].selected) selected.push(options[i].value);
                    }

                    setFieldValue('services', selected);
                  }}
                >
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Input>
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

export default StaffMemberForm;
