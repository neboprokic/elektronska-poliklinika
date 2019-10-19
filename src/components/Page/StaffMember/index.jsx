import React, { useContext, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody } from 'reactstrap';
import { AppStateContext } from 'context';
import {
  saveStaff,
  fetchStaffMember,
  fetchServices,
  openModal,
} from 'redux/actions';
import StaffForm from 'components/Form/Staff';
import PageContainer from 'components/Page/PageContainer';
import AppointmentsTable from 'components/AppointmentsTable';

function StaffMemberPage({ match }) {
  const { id } = match.params;
  const [{ member = {} }, dispatch] = useContext(AppStateContext);

  const handleEditClick = () => {
    openModal(dispatch, {
      header: 'Unesite izmene',
      body: (
        <StaffForm
          onSubmit={() => fetchStaffMember(dispatch, id)}
          member={member}
        />
      ),
    });
  };

  const handleToggleStatusClick = async () => {
    await saveStaff(dispatch, {
      ...member,
      status: member.status === 'active' ? 'inactive' : 'active',
    });
    fetchStaffMember(dispatch, id);
  };

  useEffect(() => {
    fetchStaffMember(dispatch, id);
    fetchServices(dispatch);
  }, [dispatch, id]);

  return (
    <PageContainer>
      <Card style={{ width: '400px', marginBottom: '30px' }}>
        <CardHeader>Osnovni podaci o clanu osoblja</CardHeader>
        <CardBody>
          <div>
            JMBG: <b>{member.username}</b>
          </div>
          {member.password !== undefined && (
            <div className="noprint">
              Broj kartona: <b>{member.password}</b>
            </div>
          )}
          <div>
            Ime: <b>{member.firstName}</b>
          </div>
          <div>
            Prezime: <b>{member.lastName}</b>
          </div>
          <Button
            onClick={handleEditClick}
            color="primary"
            style={{ margin: '20px 20px 0 0' }}
            className="noprint"
          >
            izmeni
          </Button>
          <Button
            onClick={handleToggleStatusClick}
            color="primary"
            style={{ marginTop: '20px' }}
            className="noprint"
          >
            {member.status === 'active' ? 'suspenduj' : 'aktiviraj'}
          </Button>
        </CardBody>
      </Card>
      {member.role === 'dr' && <AppointmentsTable memberId={member.id} />}
    </PageContainer>
  );
}

export default StaffMemberPage;
