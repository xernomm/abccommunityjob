import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from "axios"
import Swal from "sweetalert2";

const LoginOrRegis = () => {

    const [showReplacement, setShowReplacement] = useState(false);
    const [showForm, setShowForm] = useState(false);
  

    const handleClick = () => {
        if (!showReplacement) {
          setShowReplacement(true);
        } else {
          setShowForm(true);
        }
      };
    
      const handleBack = () => {
        setShowForm(false);
        setShowReplacement(false);
      };


    
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        address: '',
        phoneNumber: '',
        age: '',
        university: '',
        education: '',
        experience: '',
      });
      const [passwordError, setPasswordError] = useState(false);
      const [confirmPassword, setConfirmPassword] = useState("");

      const handleSubmit = (e) => {
        e.preventDefault();

        if(formData.userName === "" || formData.email === "" || formData.password === "" ){
          Swal.fire('Oops... Fields are still empty', 'please enter all the fields to register', 'error');
          return;
        }

        if(formData.age < 18){
          Swal.fire('Restricted', 'You have to be 18 or above!', 'error');
          return;
        }

        if (formData.password !== confirmPassword) {
          Swal.fire('Password not match', 'please enter the same password in the confirm password field', 'error');
          setPasswordError(true);
          return;
        }

        axios.post('http://localhost:8080/user/register', formData)
        .then((response) => {
          Swal.fire('Registration Success', '', 'success').then(() => {
            window.location.href = '/login';
          });
          console.log(response.data);
        })
        .catch((error) => {
          Swal.fire('Error Occurred', 'check your credentials.', 'error');
          console.error(error);
        });
        console.log(formData); 
        

      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };


      
        const [loginFormData, setLoginFormData] = useState({
          email: '',
          password: '',
        });
      
        const handleLogin = (e) => {
          e.preventDefault();
      
          axios.post('http://localhost:8080/auth/login', loginFormData)
            .then((response) => {
              console.log(response.data)
                sessionStorage.setItem("loginFormData", JSON.stringify(response.data));
              Swal.fire({
                icon: "success",
                title: "Login success!",
                footer: "",
                confirmButtonColor: "#127d3f",
                confirmButtonText: "Go to homepage",
                preConfirm: () => {
                  return new Promise((resolve) => {
                    window.location.href = "/dashboard";
                    resolve();
                  });
                },
              });
              console.log(response.data);
            })
            .catch((error) => {
                if (error.response.data.message === 'Invalid password.') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops... Sorry',
                      text: 'Incorrect password. Check your credentials',
                      footer: '<a href="/forgotPassword">Forgot password?</a>',
                    });
                  }
                  if (error.response.data.message === 'Email not found.') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops... Sorry',
                      text:
                        "We couldn't find your email. Please register if your email is not registered.",
                      footer: '<a href="/getStarted">Register</a>',
                    });
                  }
                  if (error.response.data.message === 'User suspended.') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Account Suspended',
                      text:
                        "Your account has been deactivated due to violations of our community guidelines. Repeated actions may result permanent deletion of your account.",
                      footer: '<a href="/contact-us">Report</a>',
                    });
                  }
            });
        };
      
        const handleLoginChange = (e) => {
          const { name, value } = e.target;
          setLoginFormData((prevData) => ({ ...prevData, [name]: value }));
        };

  


    return(
        <div className="body">
            <div className="col-12 d-flex">
                <div className="col-6 px-5 my-auto">
                    <h1 style={{fontSize:"80px"}} className="display-1 mb-4 fw-bold text-secondary">
                        Login<span className="teksprimary"> or Create Account</span>
                    </h1>
                    <p className="lead text-dark">
                        Create your profile and dive into our professional fields!
                    </p>
                </div>
                {/*  */}
                <div className="col-6 p-3 loginBox bg-light">
                  <div className="overflowContent p-4">
                  {!showReplacement ? (
                    <div className="regis col-12">
                      <h1 className="display-4">Register</h1>
                        <br />                    
                      <Form onSubmit={handleSubmit}>
                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="text"
                            id="userName"
                            name="userName"
                            placeholder="What's your name?"
                            value={formData.userName}
                            onChange={handleChange}
                            />
                            <label htmlFor="userName">What's your name?</label>
                        </Form.Floating>
                        
                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="number"
                            id="age"
                            name="age"
                            placeholder="How old are you?"
                            value={formData.age}
                            onChange={handleChange}
                            />
                            <label htmlFor="age">How old are you?</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            />
                            <label htmlFor="email">Email</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            />
                            <label htmlFor="password">Password</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Confirm Your Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <label htmlFor="password">Confirm Your Password</label>
                            {passwordError && (
                    <Form.Control.Feedback type="invalid">
                      Passwords do not match
                    </Form.Control.Feedback>
                  )}
                        </Form.Floating>
                        <br />
                        <hr />
                        <br />
                        <h1 className="display-6">Tell us about yourself</h1>
                        <br />

                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Where do you live?"
                            value={formData.address}
                            onChange={handleChange}
                            />
                            <label htmlFor="address">Where do you live?</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Contact number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            />
                            <label htmlFor="phoneNumber">Contact number</label>
                        </Form.Floating>



                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="text"
                            id="university"
                            name="university"
                            placeholder="What university you attend for your college education?"
                            value={formData.university}
                            onChange={handleChange}
                            />
                            <label htmlFor="university">What university you attend for your college education?</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="text"
                            id="education"
                            name="education"
                            placeholder=">What education did you take in your college?"
                            value={formData.education}
                            onChange={handleChange}
                            />
                            <label htmlFor="education">What education did you take in your college?</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="text"
                            id="experience"
                            name="experience"
                            placeholder="Do you have any experience in work?"
                            value={formData.experience}
                            onChange={handleChange}
                            />
                            <label htmlFor="experience">Do you have any work experiences before? (mention max 3)</label>
                        </Form.Floating>

                        <Button variant='outline' className='btnPrimary col-6 mt-3' type="submit">Register</Button>
                    </Form>
                    <br />
                    <p className="lead">
                        Already have an account? Click{" "}
                        <span>
                            <a className="teksprimary linkprimary" onClick={handleClick}>
                             here to Sign-In
                            </a>
                        </span>
                    </p>
                    </div>
                ) : (

                    <div className="login my-auto">
                     <h1 className="display-4">Login</h1>
                      <br />                    
                    <Form onSubmit={handleLogin}>
                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={loginFormData.email}
                            onChange={handleLoginChange}
                            />
                            <label htmlFor="email">Email</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={loginFormData.password}
                            onChange={handleLoginChange}
                            />
                            <label htmlFor="password">Password</label>
                        </Form.Floating>

                        <Button variant='outline' className='btnPrimary col-6 mt-3' type="submit">Login</Button>
                    </Form>
                    <p className="lead mt-3">
                        <span>
                            <a className="teksprimary linkprimary" href='/forgotPassword'>
                            Forgot Password?
                            </a>
                        </span>
                    </p>
                    
                    <p className="lead mt-3">
                        Don't have an account? Click{" "}
                        <span>
                            <a className="teksprimary linkprimary" onClick={handleBack}>
                                here to Sign-Up
                            </a>
                        </span>
                    </p>

                    </div>
                )}
                  </div>


                </div>
            </div>
        </div>
    )
}

export default LoginOrRegis;