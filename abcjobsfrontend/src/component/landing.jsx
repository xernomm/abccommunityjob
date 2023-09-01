import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import homeImg from '../img/homeabcjobs.png'

function Landing(){
    const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem('loginFormData');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserEmail(parsedUser.name);
    }
  }, []);
  
    return(
        <div className="body">
            <div className="col-12 d-flex bg-white">
                <div className="col-6 px-4 my-auto">
                    <h1 style={{fontSize:"100px"}} className="display-1 fw-bold teksprimary mb-3">
                        AJ.<span className="display-6 fw-bold"> JOB PORTAL</span>
                    </h1>
                    <p style={{fontSize:"27px"}} className=" lead text-dark mb-5">
                    Connect talent with opportunities, <br />Empower dreams.
                    </p>
              {!userEmail && (
                    <Button href="/getStarted" variant="outline-primary" className="mb-2 btn btnPrimary col-10 mx-auto p-2">Get Started</Button>
              )}

                {!userEmail && (
                    <Button href="/login" className="mb-2 btn btn-secondary col-10 mx-auto p-2">Login</Button>
              )}

              {userEmail && (
                  <p className="lead">
                    Welcome, {userEmail}
                  </p>
              )}

              {userEmail && (
                    <Button href="/dashboard" variant="" className="mb-2 btn btnBiru col-10 mx-auto p-2">Dashboard</Button>
              )}
                            {userEmail && (
                    <Button href="/profile" variant="" className="mb-2 btn btn-outline-secondary col-10 mx-auto p-2">Profile</Button>
              )}


                
                

                </div>
                <div className="col-6 px-4">
                  <a href="/about-us">
                  <img src={homeImg} alt="" className="homeImg col-12 mx-auto my-auto" />
                  </a>
                </div>
            </div>
        </div>
    )
}

export default Landing;