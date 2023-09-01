import { icon } from '@fortawesome/fontawesome-svg-core';
import { Navbar, Nav, NavDropdown, Container, Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

function LogoutButton(props) {

  const[userName, setUserName] = useState(null)
  const[userEmail, setUserEmail] = useState(null)

  useEffect(() => {
    const user = sessionStorage.getItem('loginFormData');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserEmail(parsedUser.email);
      setUserName(parsedUser.name)
    }
  }, []);

  const logout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "All sessions will be cleared!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sign Out'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        window.localStorage.clear();
        
        Swal.fire(
          'Logged out!',
          'Your session has been cleared.',
          'success'
        ).then(() => {
          window.location.href = '/';
        });;
      }
    });
  };



  return (


    <NavDropdown className='my-auto' title={userEmail} id="collasible-nav-dropdown">
      <NavDropdown.Item className='teksprimary' href="/profile"><Icon.PersonFill className='icon'/> {userName}</NavDropdown.Item>
      <NavDropdown.Item className='text-danger' onClick={() => logout()} href="#"><Icon.BoxArrowRight className='icon'/> Sign Out</NavDropdown.Item>
    </NavDropdown>





  )
}

export default LogoutButton;