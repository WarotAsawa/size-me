import React from 'react';
import { Container, Navbar, Nav, NavDropdown} from 'react-bootstrap';
import history from './history';

function Topbar() {
  return (
    <Navbar bg="none" variant="dark" className="navbar-expand-md" >
      <Container>
        <Navbar.Brand onClick={() => history.push('/')}>
          <img
            alt=""
            src="/assets/img/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top mx-1"
        />{' '}
          SIZE ME
        </Navbar.Brand>
        <Nav></Nav>
        <Nav>
          <NavDropdown variant='dark' className='bg-dark' style={{fontWeight:'900'}} title="SIZER MENU" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={() => history.push('/vm-sizer')}>Virtualization Sizer</NavDropdown.Item>
            <NavDropdown.Item onClick={() => history.push('/container-sizer')}>Container Sizer</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Topbar;
