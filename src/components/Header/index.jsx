import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'reactstrap';
import { AppStateContext } from 'context';
import './styles.scss';

const renderLink = ({ to, label, ...props }) => (
  <NavItem {...props}>
    <NavLink to={to} className="nav-link">
      {label}
    </NavLink>
  </NavItem>
);

function Header() {
  const [state] = useContext(AppStateContext);
  const { user } = state;

  if (!user) return null;

  return (
    <Navbar color="light" light expand="md" className="AppHeader">
      <Nav style={{ width: '100%' }} navbar>
        {user.role !== 'patient' && (
          <>
            {renderLink({ to: '/usluge', label: 'Usluge' })}
            {renderLink({ to: '/medikamenti', label: 'Medikamenti' })}
            {renderLink({ to: '/troskovi', label: 'Troskovi' })}
            {renderLink({ to: '/pacijenti', label: 'Pacijenti' })}
            {renderLink({ to: '/osoblje', label: 'Osoblje' })}
          </>
        )}
        {renderLink({
          to: '/logout',
          label: 'Izlogujte se',
          style: { marginLeft: 'auto' },
        })}
      </Nav>
    </Navbar>
  );
}

export default Header;
