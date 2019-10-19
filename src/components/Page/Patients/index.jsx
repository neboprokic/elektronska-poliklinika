import React, { useContext, useEffect, useState } from 'react';
import {
  FormGroup,
  Label,
  Table,
  Button,
  Jumbotron,
  Input,
  Col,
} from 'reactstrap';
import { AppStateContext } from 'context';
import { forwardTo } from 'utils/route';
import { fetchPatients, openModal } from 'redux/actions';
import PatientForm from 'components/Form/Patient';
import PageContainer from 'components/Page/PageContainer';

function PatientsPage() {
  const [{ search }, setState] = useState({ search: '' });
  const [{ patients }, dispatch] = useContext(AppStateContext);
  const searchTerm = search.toLowerCase();

  const handleAddClick = patient => {
    openModal(dispatch, {
      header: 'Dodajte novog pacijenta',
      body: (
        <PatientForm
          onSubmit={() => fetchPatients(dispatch)}
          patient={patient}
        />
      ),
    });
  };

  const getFilteredItems = item => {
    if (!searchTerm) return true;

    let isFound = false;

    ['username', 'password', 'firstName', 'lastName'].forEach(key => {
      if (item[key].toLowerCase().includes(searchTerm)) isFound = true;
    });

    return isFound;
  };

  useEffect(() => {
    fetchPatients(dispatch);
  }, [dispatch]);

  return (
    <PageContainer>
      <h2>Pacijenti</h2>
      <div className="noprint">
        <Button
          onClick={() => handleAddClick()}
          color="primary"
          style={{ marginBottom: '20px' }}
        >
          Dodaj novog pacijenta
        </Button>
        <FormGroup row>
          <Label style={{ margin: '5px 0 0 20px' }}>Brza pretraga:</Label>
          <Col sm={4}>
            <Input
              value={search}
              onChange={({ target }) => setState({ search: target.value })}
            />
          </Col>
        </FormGroup>
      </div>
      {patients.length ? (
        <Table striped>
          <thead>
            <tr>
              <th>JMBG</th>
              <th className="noprint">Broj kartona</th>
              <th>Ime</th>
              <th>Prezime</th>
              <th className="noprint"></th>
            </tr>
          </thead>
          <tbody>
            {patients.filter(getFilteredItems).map(patient => (
              <tr key={patient.username}>
                <td>{patient.username}</td>
                <td className="noprint">{patient.password}</td>
                <td>{patient.firstName}</td>
                <td>{patient.lastName}</td>
                <td style={{ width: '200px' }} className="noprint">
                  <Button
                    onClick={() => handleAddClick(patient)}
                    style={{ marginRight: '20px' }}
                  >
                    izmeni
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => forwardTo(`/pacijenti/${patient.id}`)}
                  >
                    detalji
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Jumbotron>Nemate nijednog registrovanog pacijenta</Jumbotron>
      )}
    </PageContainer>
  );
}

export default PatientsPage;
