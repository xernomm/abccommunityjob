import { Button, Form } from "react-bootstrap"
import * as Icon from "react-bootstrap-icons"
import React, { useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2";


function ContactUsComp(){

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formData = {
        email: email,
        message: message,
      };

      if(formData.email === "" || formData.message === ""){
        Swal.fire('Error', 'Please fill a message.', 'error');
        return;
      }
      axios.post('http://localhost:8080/user/contactUs/send', formData)
      .then((response) => {
        Swal.fire('Message Sent!', 'Thank you for contacting us! please check your email within 24 hours.', 'success');
        console.log(response.data);
      })
      .catch((error) => {
        Swal.fire('Error Occurred', 'Something went wrong.', 'error');
        console.error(error);
      });
    
    };
    return(
        <div className="body">
            <div className="col-12 d-flex justify-content-center">
                <div className="col-6 px-5">
                    <h1 className="display-6 fw-bold teksprimary">
                        Contact us
                    </h1>
                    <hr />
                    <p className="lead teksprimary"><a href="#" className="linkprimary "><Icon.EnvelopeAtFill className="lead me-2"/> aj@jobs.com</a></p>
                    <p className="lead teksprimary"><a href="#" className="linkprimary"><Icon.TelephoneFill className="lead me-2"/> +65 04433 9911</a></p>
                    <p className="lead teksprimary"><a href="#" className="linkprimary"><Icon.Instagram className="lead me-2"/> @ajobsofficial</a></p>
                    <p className="lead teksprimary"><a href="#" className="linkprimary"><Icon.Linkedin className="lead me-2"/> AJ. Job Portal</a></p>
                    <p className="lead teksprimary"><a href="#" className="linkprimary"><Icon.Facebook className="lead me-2"/> @ajobportal</a></p>
                    <p className="lead teksprimary"><a href="#" className="linkprimary"><Icon.Youtube className="lead me-2"/> AJ Job Portal Official</a></p>
                </div>

                <div className="col-6 px-3">
                <h1 className="display-6 fw-bold teksprimary">
                       Send us a message
                    </h1>
                    <hr />
                    <Form onSubmit={handleSubmit}>
                        <Form.Floating className="mb-3">
                            <Form.Control 
                            type="email"
                            name="userName"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="">Email Address</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control 
                            style={{height:"200px"}}
                            as="textarea"
                            placeholder="Any issue you are experiencing?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            />
                            <label htmlFor="">Any issue you are experiencing?</label>
                        </Form.Floating>

                        <Button type="submit" variant="" className="btnBiru col-6">Submit <Icon.SendFill className="ms-2 mb-1" /></Button>
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default ContactUsComp;