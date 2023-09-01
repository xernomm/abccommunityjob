import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Icon from 'react-bootstrap-icons';

const EditProfileModal = ({ show, onHide }) => {

  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [bio, setUserBio] = useState(null);
  const [university, setUserUniversity] = useState(null);
  const [education, setUserEducation] = useState(null);
  const [phoneNumber, setUserPhoneNumber] = useState(null);
  const [address, setUserAddress] = useState(null);
  const [age, setUserAge] = useState(null);
  const [experience, setUserExperience] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem('loginFormData');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserEmail(parsedUser.email);
      setUserAddress(parsedUser.userDetails.address);
      setUserAge(parsedUser.userDetails.age);
      setUserPhoneNumber(parsedUser.userDetails.phoneNumber);
      setUserEducation(parsedUser.userDetails.education);
      setUserUniversity(parsedUser.userDetails.university);
      setUserBio(parsedUser.userDetails.bio);
      setUserExperience(parsedUser.userDetails.experience);
      setUserName(parsedUser.name);
    }

    
  }, []);

  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData')); // Get user data from sessionStorage
  const token = sessionUser.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
  };

  

  // Component state
  const [formData, setFormData] = useState({
    userName: sessionUser.name,
    age: sessionUser.userDetails.age,
    university: sessionUser.userDetails.university,
    education: sessionUser.userDetails.education,
    address: sessionUser.userDetails.address,
    phoneNumber: sessionUser.userDetails.phoneNumber,
    experience: sessionUser.userDetails.experience,
    bio: sessionUser.userDetails.bio,
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
      .post(`http://localhost:8080/user/edit-profile?email=${sessionUser.email}`, formDataToSend, config)
      .then((response) => {
        console.log('UPDATED', response.data);

        const updatedUserDetails = {
          ...sessionUser.userDetails,
          ...updatedProfileData,
        };

        const updatedUser = {
          ...sessionUser,
          userDetails: updatedUserDetails,
          name: updatedProfileData.userName,
        };

        sessionStorage.setItem('loginFormData', JSON.stringify(updatedUser));



      })
      .catch((error) => {
        console.error(error.response);
        Swal.fire('Error', 'Profile update failed!', 'error');
      })
      .finally(() => {

        if (sessionUser.userDetails.age < 18) {
          Swal.fire({
            title: 'Oops.. Sorry',
            text: 'Something went wrong',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              sessionStorage.clear();
              window.localStorage.clear();
              window.location.href = '/';
            }
          });
        }

        
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



  const handleCancelImage = (event) => {
    setSelectedImage(null);
    setImagePreview(null);
  };


  

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Profile Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

            <div className="mb-3 px-3">
            <small className="lead">Username</small>
            
            <Form.Floating className='mt-2' >
                
                <Form.Control placeholder={userName} controlId="userName" type="text" value={formData.userName} onChange={(e) => handleFieldChange('userName', e.target.value)} />
                <label htmlFor="userName">{userName}</label>
            </Form.Floating>
            </div>

            <div className="mb-3 px-3">
            <small className="lead">Age</small>
            <Form.Floating className='mt-2'>
                
                <Form.Control placeholder={age} controlId="age" type="number" value={formData.age} onChange={(e) => handleFieldChange('age', e.target.value)} />
                <label htmlFor="age">{age}</label>
            </Form.Floating>
            </div>
        
            <div className="mb-3 px-3">
            <small className="lead">University</small>
            
            <Form.Floating className='mt-2' >
                
                <Form.Control placeholder={university} controlId="university" type="text" value={formData.university} onChange={(e) => handleFieldChange('university', e.target.value)} />
                <label htmlFor="university">{university}</label>
            </Form.Floating>
            </div>
            
            <div className="mb-3 px-3">
            <small className="lead">Education</small>
            
            <Form.Floating className='mt-2' >
                
                <Form.Control placeholder={education} controlId="education" type="text" value={formData.education} onChange={(e) => handleFieldChange('education', e.target.value)} />
                <label htmlFor="education">{education}</label>
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
                
                <Form.Control placeholder={phoneNumber} controlId="phoneNumber" type="text" value={formData.phoneNumber} onChange={(e) => handleFieldChange('phoneNumber', e.target.value)} />
                <label htmlFor="phoneNumber">{phoneNumber}</label>
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
            <small className="lead">About you</small>
            
            <Form.Floating className='mt-2' >
                
                <Form.Control placeholder="About you" controlId="bio" type="text" value={formData.bio} onChange={(e) => handleFieldChange('bio', e.target.value)} />
                <label htmlFor="bio">About you</label>
            </Form.Floating>
            </div>



        </Form>
      </Modal.Body>
      <Modal.Footer className='col-12'>
        <Button variant="outline-danger" className='' onClick={onHide}>Cancel</Button>
        <Button variant="" className='col-4 btnBiru' onClick={handleSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
