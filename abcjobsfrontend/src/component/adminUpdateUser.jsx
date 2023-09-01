import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditUserModal = ({ show, onHide, selectedUser }) => {
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;



    const handleClose = (e) => {
        window.location.reload()
    }

 
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
    };
  
    
  
    // Component state
    const [formData, setFormData] = useState({
      userName: selectedUser.userName,
      age: selectedUser.userDetails.age,
      university: selectedUser.userDetails.university,
      education: selectedUser.userDetails.education,
      address: selectedUser.userDetails.address,
      phoneNumber: selectedUser.userDetails.phoneNumber,
      experience: selectedUser.userDetails.experience,
      bio: selectedUser.userDetails.bio,
    });
  
    // Function to update the formData state when fields change
    const handleFieldChange = (field, value) => {
      setFormData(prevFormData => ({
        ...prevFormData,
        [field]: value,
      }));
    };
  
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const updatedProfileData = {
        userName: formData.userName,
        age: parseInt(formData.age),
        university: formData.university,
        education: formData.education,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        experience: formData.experience,
        bio: formData.bio,
      };
  
      const formDataToSend = new FormData();
  
    for (const key in updatedProfileData) {
      formDataToSend.append(key, updatedProfileData[key]);
    }
     
      axios
        .post(`http://localhost:8080/user/edit-profile?email=${selectedUser.email}`, formDataToSend, config)
        .then((response) => {
          console.log('UPDATED', response.data);
  
          
  
  
  
        })
        .catch((error) => {
          console.error(error.response);
          Swal.fire('Error', 'Profile update failed!', 'error');
        })
        .finally(() => {
          Swal.fire({
            icon: 'success',
            title: 'Profile updated!',
            footer: '',
            confirmButtonColor: '#127d3f',
            confirmButtonText: 'Ok',
            preConfirm: () => {
              return new Promise((resolve) => {
                onHide();
                window.location.reload();
                resolve();
              });
            },
          });
  
          
  
        });;
    };

    return (
        <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title>Profile Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
              <div className="mb-3 px-3">
              <small className="lead">Username</small>
              
              <Form.Floating className='mt-2' >
                  
                  <Form.Control placeholder= "Name" controlId="userName" type="text" value={formData.userName} onChange={(e) => handleFieldChange('userName', e.target.value)} />
                  <label htmlFor="userName">Name</label>
              </Form.Floating>
              </div>
  
              <div className="mb-3 px-3">
              <small className="lead">Age</small>
              <Form.Floating className='mt-2'>
                  
                  <Form.Control placeholder="Age" controlId="age" type="number" value={formData.age} onChange={(e) => handleFieldChange('age', e.target.value)} />
                  <label htmlFor="age">Age</label>
              </Form.Floating>
              </div>
          
              <div className="mb-3 px-3">
              <small className="lead">University</small>
              
              <Form.Floating className='mt-2' >
                  
                  <Form.Control placeholder="University" controlId="university" type="text" value={formData.university} onChange={(e) => handleFieldChange('university', e.target.value)} />
                  <label htmlFor="university">University</label>
              </Form.Floating>
              </div>
              
              <div className="mb-3 px-3">
              <small className="lead">Education</small>
              
              <Form.Floating className='mt-2' >
                  
                  <Form.Control placeholder="Education" controlId="education" type="text" value={formData.education} onChange={(e) => handleFieldChange('education', e.target.value)} />
                  <label htmlFor="education">Education</label>
              </Form.Floating>
              </div>
  
              <div className="mb-3 px-3">
              <small className="lead">Address</small>
              
              <Form.Floating className='mt-2' >
                  
                  <Form.Control placeholder="Address" controlId="address" type="text" value={formData.address} onChange={(e) => handleFieldChange('address', e.target.value)} />
                  <label htmlFor="address">Address</label>
              </Form.Floating>
              </div>
  
              <div className="mb-3 px-3">
              <small className="lead">Phone Number</small>
              
              <Form.Floating className='mt-2' >
                  
                  <Form.Control placeholder="Phone Number" controlId="phoneNumber" type="text" value={formData.phoneNumber} onChange={(e) => handleFieldChange('phoneNumber', e.target.value)} />
                  <label htmlFor="phoneNumber">Phone Number</label>
              </Form.Floating>
              </div>
  
              <div className="mb-3 px-3">
              <small className="lead">Experience</small>
              
              <Form.Floating className='mt-2' >
                  
                  <Form.Control placeholder="Experience" controlId="experience" type="text" value={formData.experience} onChange={(e) => handleFieldChange('experience', e.target.value)} />
                  <label htmlFor="experience">Experience</label>
              </Form.Floating>
              </div>
  
              <div className="mb-3 px-3">
              <small className="lead">About user</small>
              
              <Form.Floating className='mt-2' >
                  
                  <Form.Control placeholder="About you" controlId="bio" type="text" value={formData.bio} onChange={(e) => handleFieldChange('bio', e.target.value)} />
                  <label htmlFor="bio">About user</label>
              </Form.Floating>
              </div>
  
  
  
          </Form>
        </Modal.Body>
        <Modal.Footer className='col-12'>
          <Button variant="outline-danger" className='' onClick={handleClose}>Cancel</Button>
          <Button variant="" className='col-4 btnBiru' onClick={handleSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    );
};

export default EditUserModal;
