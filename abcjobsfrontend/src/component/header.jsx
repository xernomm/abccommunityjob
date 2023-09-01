import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';

const Header = ({ activePage }) => {
  const user = sessionStorage.getItem('loginFormData');
  const parsedUser = JSON.parse(user);

    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const[roleId, setRoleId] = useState(null);

    useEffect(() => {
      const user = sessionStorage.getItem('loginFormData');
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserEmail(parsedUser.email);
        setUserName(parsedUser.name)
        setRoleId(parsedUser.roleId)
      }
    }, []);

  return (
    <header className="fixed-top">
      <Navbar className="navbar-custom py-3" collapseOnSelect expand="lg" bg="light" variant="light">
        <Container className="col-12 d-flex justify-content-center">
          <Navbar.Brand className="col-4" href="/">
            <div className="d-flex justify-content-center">
              <p className="display-6 teksprimary fw-bold my-auto">
                AJ. <span className="teksprimary lead fw-bold">JOB PORTAL</span>
              </p>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
         
          {!userEmail && (
         
          <Nav className="col-7 d-flex mx-auto justify-content-center user">



          <NavLink exact to="/" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>
              Home
            </NavLink>

              <NavLink
                to="/getStarted"
                className={`nav-link ${activePage === 'getStarted' ? 'active' : ''}`}
              >
                Get Started
              </NavLink>

            <NavLink
              to="/about-us"
              className={`nav-link ${activePage === 'about-us' ? 'active' : ''}`}
              >
             About Us
            </NavLink>


            <NavLink
              to="/contact-us"
              className={`nav-link ${activePage === 'contact-us' ? 'active' : ''}`}
            >
              Contact Us
            </NavLink>
              </Nav>
              )}







            {roleId === 2 && (
            <Nav className="col-7 d-flex mx-auto justify-content-center user">
            <NavLink exact to="/" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>
              Home
            </NavLink>

            {userEmail && (
              <NavLink
                to="/jobs"
                className={`nav-link ${activePage === 'jobs' ? 'active' : ''}`}
              >
                Jobs
              </NavLink>
            )}

              <NavLink
              to="/about-us"
              className={`nav-link ${activePage === 'about-us' ? 'active' : ''}`}
              >
             About
            </NavLink>

            <NavLink
              to="/contact-us"
              className={`nav-link ${activePage === 'contact' ? 'active' : ''}`}
            >
              Contact
            </NavLink>


            {userEmail && (
              <>
                <NavLink
                  to="/dashboard"
                  className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </NavLink>
                
                <LogoutButton/>
              </>
            )}
          </Nav>
            )}










    {roleId === 1 && (
            <Nav className="col-7 d-flex mx-auto justify-content-center admin">
            <NavLink exact to="/" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>
              Home
            </NavLink>

            {userEmail && (
              <>
                <NavLink
                  to="/dashboard"
                  className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </NavLink>
                
              </>
            )}

            {!userEmail && (
              <NavLink
                to="/getStarted"
                className={`nav-link ${activePage === 'getStarted' ? 'active' : ''}`}
              >
                Get Started
              </NavLink>
            )}


            <NavLink
                          to="/adminAllUser"
                            className={`nav-link ${activePage === 'adminAllUser' ? 'active' : ''}`}
                          >
                            Users
               </NavLink>

            <NavLink
              to="/adminAllJobs"
              className={`nav-link ${activePage === 'adminAllJobs' ? 'active' : ''}`}
            >
              Jobs
            </NavLink>

            <NavLink
              to="/adminAllActiveWorkers"
              className={`nav-link ${activePage === 'adminAllActiveWorkers' ? 'active' : ''}`}
            >
              Workers
            </NavLink>

            <NavLink
              to="/adminAllThreads"
              className={`nav-link ${activePage === 'adminAllThreads' ? 'active' : ''}`}
            >
              Threads
            </NavLink>

            <NavLink
              to="/adminAllComments"
              className={`nav-link ${activePage === 'adminAllComments' ? 'active' : ''}`}
            >
              Comments
            </NavLink>

            
            <NavLink
              to="/adminAllMessages"
              className={`nav-link ${activePage === 'adminAllMessages' ? 'active' : ''}`}
            >
              Reports
            </NavLink>

            {/* adminAllActiveWorkers */}
            <LogoutButton/>



            
          </Nav>
      )}




          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
