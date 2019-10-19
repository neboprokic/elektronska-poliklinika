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
import { roles } from 'globalConstants';
import { forwardTo } from 'utils/route';
import { saveStaff, fetchStaff, fetchServices, openModal } from 'redux/actions';
import StaffForm from 'components/Form/Staff';
import PageContainer from 'components/Page/PageContainer';

function StaffPage() {
  const [{ staff, services }, dispatch] = useContext(AppStateContext);
  const [{ search }, setState] = useState({ search: '' });
  const searchTerm = search.toLowerCase();

  const handleAddClick = member => {
    openModal(dispatch, {
      header: 'Dodajte novog clana osoblja',
      body: <StaffForm onSubmit={() => fetchStaff(dispatch)} member={member} />,
    });
  };

  const handleToggleStatusClick = async member => {
    await saveStaff(dispatch, {
      ...member,
      status: member.status === 'active' ? 'inactive' : 'active',
    });
    fetchStaff(dispatch);
  };

  const getFilteredItems = item => {
    if (!searchTerm) return true;

    let isFound = false;

    ['username', 'firstName', 'lastName'].forEach(key => {
      if (item[key].toLowerCase().includes(searchTerm)) isFound = true;
    });

    if (!isFound) {
      item.services
        .map(id => services.find(service => service.id === id))
        .forEach(({ name }) => {
          if (name.toLowerCase().includes(searchTerm)) isFound = true;
        });
    }

    return isFound;
  };

  useEffect(() => {
    fetchStaff(dispatch);
    fetchServices(dispatch);
  }, [dispatch]);

  return (
    <PageContainer>
      <h2>Osoblje</h2>
      <div className="noprint">
        <Button
          onClick={() => handleAddClick()}
          color="primary"
          style={{ marginBottom: '20px' }}
        >
          Dodaj novog clana osoblja
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
      {staff.length ? (
        <Table striped>
          <thead>
            <tr>
              <th>Zvanje</th>
              <th className="noprint">JMBG</th>
              <th className="noprint">Broj kartona</th>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Radno vreme</th>
              <th>Usluge</th>
              <th>Status</th>
              <th className="noprint"></th>
            </tr>
          </thead>
          <tbody>
            {staff.filter(getFilteredItems).map(member => {
              const memberServices = services.filter(({ id }) =>
                member.services.includes(id),
              );

              return (
                <tr key={member.username}>
                  <td>{roles.find(({ id }) => id === member.role).name}</td>
                  <td className="noprint">{member.username}</td>
                  <td className="noprint">{member.password}</td>
                  <td>{member.firstName}</td>
                  <td>{member.lastName}</td>
                  <td>{`${member.from} - ${member.to}`}</td>
                  <td>{memberServices.map(({ name }) => name).join(', ')}</td>
                  <td>
                    {member.status === 'active' ? 'aktivan' : 'neaktivan'}
                  </td>
                  <td style={{ width: '400px' }} className="noprint">
                    <Button
                      onClick={() => handleAddClick(member)}
                      style={{ marginRight: '20px' }}
                    >
                      izmeni
                    </Button>
                    <Button
                      onClick={() => handleToggleStatusClick(member)}
                      style={{ marginRight: '20px' }}
                    >
                      {member.status === 'active' ? 'suspenduj' : 'aktiviraj'}
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => forwardTo(`/osoblje/${member.id}`)}
                    >
                      detalji
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <Jumbotron>Nemate nijednog registrovanog clana osoblja</Jumbotron>
      )}
    </PageContainer>
  );
}

export default StaffPage;
