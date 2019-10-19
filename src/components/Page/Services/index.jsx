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
import { fetchServices, deleteService, openModal } from 'redux/actions';
import { priceFormatter } from 'utils/helpers';
import ServiceForm from 'components/Form/Service';
import PageContainer from 'components/Page/PageContainer';

function ServicesPage() {
  const [{ services }, dispatch] = useContext(AppStateContext);
  const [{ search }, setState] = useState({ search: '' });
  const searchTerm = search.toLowerCase();

  const handleAddClick = service => {
    openModal(dispatch, {
      header: 'Dodajte novu uslugu',
      body: (
        <ServiceForm
          onSubmit={() => fetchServices(dispatch)}
          service={service}
        />
      ),
    });
  };

  useEffect(() => {
    fetchServices(dispatch);
  }, [dispatch]);

  return (
    <PageContainer>
      <h2>Usluge</h2>
      <div className="noprint">
        <Button
          onClick={() => handleAddClick()}
          color="primary"
          style={{ marginBottom: '20px' }}
        >
          Dodaj novu uslugu
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
      {services.length ? (
        <Table striped>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Vreme pruzanja usluge</th>
              <th>Cena</th>
              <th>Duzina</th>
              <th className="noprint"></th>
            </tr>
          </thead>
          <tbody>
            {services
              .filter(
                ({ name }) =>
                  !searchTerm || name.toLowerCase().includes(searchTerm),
              )
              .map(service => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{`${service.from} - ${service.to}`}</td>
                  <td>{priceFormatter.format(service.price)}</td>
                  <td>{service.duration}</td>
                  <td style={{ width: '200px' }} className="noprint">
                    <Button
                      onClick={() => handleAddClick(service)}
                      style={{ marginRight: '20px' }}
                    >
                      izmeni
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => deleteService(dispatch, service.id)}
                    >
                      ukloni
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      ) : (
        <Jumbotron>Nemate nijednu sacuvanu uslugu</Jumbotron>
      )}
    </PageContainer>
  );
}

export default ServicesPage;
