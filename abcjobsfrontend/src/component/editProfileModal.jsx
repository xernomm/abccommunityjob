import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Icon from 'react-bootstrap-icons';
import { parse } from 'date-fns';

const EditProfileModal = ({ show, onHide }) => {

 
  const user = sessionStorage.getItem('loginFormData');
  const parsedUser = JSON.parse(user);
  const token = parsedUser.token;

  const [userInfo, setUserInfo] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  



  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/get-details-user/${parsedUser.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUserInfo(response.data);
        if(userInfo !== null){
          setFormData({
            userName: response.data.userName,
            age: response.data.userDetails.age || '',
            university: response.data.userDetails.university || '',
            education: response.data.userDetails.education || '',
            address: response.data.userDetails.address || '',
            phoneNumber: response.data.userDetails.phoneNumber || '',
            experience: response.data.userDetails.experience || '',
            bio: response.data.userDetails.bio || '',
          });
        }
        
      })
      .catch((error) => {
        console.error(error);
      });
  }, [parsedUser.email, token]);

// {parsedUser.userDetails && (
  const [formData, setFormData] = useState({
    userName: parsedUser.name || '',
    age: parsedUser.userDetails ? parsedUser.userDetails.age || '' : '',
    university: parsedUser.userDetails ? parsedUser.userDetails.university || '' : '',
    education: parsedUser.userDetails ? parsedUser.userDetails.education || '' : '',
    address: parsedUser.userDetails ? parsedUser.userDetails.address || '' : '',
    phoneNumber: parsedUser.userDetails ? parsedUser.userDetails.phoneNumber || '' : '',
    experience: parsedUser.userDetails ? parsedUser.userDetails.experience || '' : '',
    bio: parsedUser.userDetails ? parsedUser.userDetails.bio || '' : '',
  });
  
  
// )}


  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };


  const handleFieldChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };
  
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);

    if (imageFile) {
      const imageURL = URL.createObjectURL(imageFile);
      setImagePreview(imageURL);
    }
  };

  const handleCancelImage = (event) => {
    setSelectedImage(null);
    setImagePreview(null);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    // Append profile picture if selected
    if (selectedImage) {
      formDataToSend.append('profilePicture', selectedImage);
    }



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
   
    axios
      .post(`http://localhost:8080/user/edit-profile?email=${parsedUser.email}`, formDataToSend, config)
      .then((response) => {
        console.log('UPDATED', response.data);

        const updatedUserDetails = {
          ...parsedUser.userDetails,
          ...updatedProfileData,
        };

        const updatedUser = {
          ...parsedUser,
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

        if (parsedUser.userDetails.age < 18) {
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



  

  

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Profile Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {userInfo && (
          
          <Form onSubmit={handleSubmit}>
            <div className='mb-3 px-3'>
            {imagePreview &&
        <div className="">
          <p className="display-6 mb-3">Preview</p>
          <div className="col-12  d-flex justify-content-center">
            <div className="col-10 ">
            <div className="d-flex mx-auto">
            <p className="lead mb-2 col-11"> {selectedImage.name.toString()} </p>
            <Icon.X  className="display-6 text-center col-1 mb-1" onClick={handleCancelImage}/>
            </div>
            <div className="d-flex justify-content-center mx-auto">
            <img src={imagePreview} style={{scale:"100%"}} className="col-12 profileDash " alt="Preview" />
            </div>
            </div>
            
          </div>
        </div>
        }
         <Form.Group className="mb-3">
          <Form.Label>Choose a profile image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Group>
            </div>

<div className="mb-3 px-3">
<small className="lead">Username</small>

<Form.Floating className='mt-2' >
    
    <Form.Control placeholder="Name" controlId="userName" type="text" value={formData.userName} onChange={(e) => handleFieldChange('userName', e.target.value)} />
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
<small className="lead">About you</small>

<Form.Floating className='mt-2' >
    
    <Form.Control style={{height:"120px"}} placeholder="About you" controlId="bio" as="textarea" value={formData.bio} onChange={(e) => handleFieldChange('bio', e.target.value)} />
    <label htmlFor="bio">About you</label>
</Form.Floating>
</div>



</Form>
        )}
        
      </Modal.Body>
      <Modal.Footer className='col-12'>
        <Button variant="outline-danger" className='' onClick={onHide}>Cancel</Button>
        <Button variant="" className='col-4 btnBiru' onClick={handleSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
