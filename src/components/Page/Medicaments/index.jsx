import React, { useContext, useEffect, useState } from 'react';
import {
  Table,
  Button,
  Jumbotron,
  FormGroup,
  Label,
  Col,
  Input,
} from 'reactstrap';
import { AppStateContext } from 'context';
import { fetchMedicaments, deleteMedicament, openModal } from 'redux/actions';
import { priceFormatter } from 'utils/helpers';
import MedicamentForm from 'components/Form/Medicament';
import PageContainer from 'components/Page/PageContainer';

function MedicamentsPage() {
  const [{ medicaments }, dispatch] = useContext(AppStateContext);
  const [{ search }, setState] = useState({ search: '' });
  const searchTerm = search.toLowerCase();

  const handleAddClick = medicament => {
    openModal(dispatch, {
      header: 'Dodajte novi medikament',
      body: (
        <MedicamentForm
          onSubmit={() => fetchMedicaments(dispatch)}
          medicament={medicament}
        />
      ),
    });
  };

  useEffect(() => {
    fetchMedicaments(dispatch);
  }, [dispatch]);

  return (
    <PageContainer>
      <h2>Medikamenti</h2>
      <div className="noprint">
        <Button
          onClick={() => handleAddClick()}
          color="primary"
          style={{ marginBottom: '20px' }}
        >
          Dodaj novi medikament
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
      {medicaments.length ? (
        <Table striped>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Cena</th>
              <th className="noprint"></th>
            </tr>
          </thead>
          <tbody>
            {medicaments
              .filter(
                ({ name }) =>
                  !searchTerm || name.toLowerCase().includes(searchTerm),
              )
              .map(medicament => (
                <tr key={medicament.id}>
                  <td>{medicament.name}</td>
                  <td>{priceFormatter.format(medicament.price)}</td>
                  <td style={{ width: '200px' }} className="noprint">
                    <Button
                      onClick={() => handleAddClick(medicament)}
                      style={{ marginRight: '20px' }}
                    >
                      izmeni
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => deleteMedicament(dispatch, medicament.id)}
                    >
                      ukloni
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      ) : (
        <Jumbotron>Nemate nijedan sacuvani medikament</Jumbotron>
      )}
    </PageContainer>
  );
}

export default MedicamentsPage;
