import AllUsersComponent from "./allUserComp"
import JobList from "./jobList"
import { Button, Form } from 'react-bootstrap';
import profil from '../img/profile.jpg'
import * as Icon from 'react-bootstrap-icons';
import React, { useEffect, useState } from 'react';

const Jobs = () =>{

    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
      const user = sessionStorage.getItem('loginFormData');
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserEmail(parsedUser.email);
        setUserName(parsedUser.name)
      }
    }, []);


return(
    <div className="body">
        <div className="col-12 d-flex justify-content-center">
            <div className="col-8 ">
            <h1 className="display-4 teksprimary mb-4 col-12">Jobs </h1>
            <div className="overflowContent2 col-11">
            <JobList className="col-12 mx-auto" />
            </div>
            </div>
            <div className="col-3 my-auto">
            <div style={{paddingTop:"10%"}} className="col-12  bg-white">
                <h1 className="display-6 teksprimary fw-bold mb-4">ABC JOBS.</h1>
                    <p className="lead mb-1">Hi <span className="teksprimary">{userName}</span>! <br /> you are signed-<span className="teksprimary">In</span> as,</p>
                    <p className="lead fw-bold teksprimary mb-4">{userEmail}<span className="lead">.</span></p>
                <hr />
                <Button variant='outline' href='/profile' className='btnBiru col-12 mb-2'>My Profile <Icon.PersonFill className='icon'/></Button>
                <Button variant='outline' href='' className='btn btn-outline-secondary col-12'>My jobs <Icon.BriefcaseFill className='mb-1 ms-1'/></Button>
                <div className='py-5'>
                </div>
            </div>
            <p className="lead fw-bold teksprimary mb-4">People you might know</p>
            <div className="overflowContent">
            <AllUsersComponent />

            </div>
            </div>
        </div>
    </div>
)
}

export default Jobs;