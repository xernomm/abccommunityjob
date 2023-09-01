import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
      });
    
      const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const handleSubmit = (event) => {
        event.preventDefault();
    
        axios
          .post('http://localhost:8080/user/change-password', formData)
          .then((response) => {
            console.log('Password change success:', response.data);
            Swal.fire({
                icon: "success",
                title: "Password changed!",
                footer: "",
                confirmButtonColor: "#127d3f",
                confirmButtonText: "Go to login",
                preConfirm: () => {
                  return new Promise((resolve) => {
                    window.location.href = "/login";
                    resolve();
                  });
                },
              });
          })
          .catch((error) => {
            console.error('Password change error:', error);
            if (error.response.data.message === 'Email not found!') {
              Swal.fire('Error', 'Email not found!', 'error');
            } else if (error.response.data.message === 'Password cannot be same') {
              Swal.fire('Error', 'Password cannot be the same!', 'error');
            } else {
              Swal.fire('Error', 'Password change failed!', 'error');
            }
          });
      };

    return(
        <div className="body">
            <div className="col-12 d-flex justify-content-center">
                <div className="col-5 my-auto px-3">
                    <h1 style={{fontSize:"80px"}} className="display-1 mb-4 fw-bold text-secondary">
                            Forgot<span className="teksprimary"> Password?</span>
                        </h1>
                    </div>

                <div className="col-5 loginBox">
                    <h1 className="display-6">Create new password</h1>
                    <br />
                    <Form className="floating-form" onSubmit={handleSubmit}>
                        <Form.Floating className='mb-3'>
                            <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            />
                            <Form.Label>Email</Form.Label>
                        </Form.Floating>


                        <Form.Floating className='mb-3'>
                            <Form.Control
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            />
                            <Form.Label>New Password</Form.Label>

                        </Form.Floating>
                        <Button variant="" className='btnBiru col-6 mt-4' type="submit">
                            Change Password
                        </Button>
                    </Form>
                </div>
            </div>


        </div>
    )
}

export default ForgotPassword;