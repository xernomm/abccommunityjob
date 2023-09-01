import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Swal from 'sweetalert2';


function ApplicantsList() {
  const [applicants, setApplicants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState({});
  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get('http://localhost:8080/user/all-applicants/admin', { headers })
      .then(response => {
        console.log(response.data)
        setApplicants(response.data);
      })
      .catch(error => {
        console.error('Error fetching applicants:', error);
      });
  }, []);

  const handleViewDetails = (applicant) => {
    axios.get(`http://localhost:8080/user/applicantDetails/${applicant.applyingId}`, { headers })
      .then((response) => {
        console.log(response.data)
        setSelectedUserDetails(response.data);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  

  const handleDeleteApplicant = (applyingId) => {
    axios.delete(`http://localhost:8080/user/rejectApplicant/${applyingId}`, { headers })
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Applicant rejected',
          text: 'Applicant rejected successfully',
        });
        setApplicants(prevApplicants => prevApplicants.filter(applicants => applicants.applyingId !== applyingId));
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to reject',
        });
        console.error(error);
      });
  };

  const handleAcceptApplicant = (applicantId, email, jobId) => {
    axios.put(`http://localhost:8080/user/accept/${applicantId}/${email}/${jobId}`, null, { headers })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "User accepted!",
          footer: "",
          confirmButtonColor: "#127d3f",
          confirmButtonText: "Ok",
          preConfirm: () => {
            return new Promise((resolve) => {
              window.location.reload();
              resolve()
            });
          },
        });
        // You might want to update the applicants list after successful acceptance
        // You can call an API request here to get the updated list
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to accept applicant',
        });
        console.error(error);
      });
  };
  
  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {applicants.map(applicant => (
        <div key={applicant.applyingId}>
          <hr />
          <div className="col-12 d-flex">
            <div className="col-4 px-3">
              <p className="lead fw-bold">
                Applicant: <span className="lead"> {applicant.user.userName}</span>
              </p>
              <p className="lead fw-bold">
                User ID: <span className="lead"> {applicant.user.userId}</span>
              </p>
            </div>
            <div className="col-4 px-3">
              <p className="lead fw-bold">
                Applied for: <span className="lead">  {applicant.jobs.jobName}</span>
              </p>
            </div>
            <div className="col-4 px-3">
              <Button variant="" className=' btn-success col-12 mb-2' onClick={() => handleAcceptApplicant(applicant.applyingId, applicant.user.email, applicant.jobs.jobId)}>
                Accept <Icon.Check className="mb-1 lead " />
              </Button>
              <Button variant="" className='btn-danger col-12 mb-2'onClick={() => handleDeleteApplicant(applicant.applyingId)} >Decline <Icon.X className="mb-1 lead " /></Button>
              <Button variant="" className='btnBiru col-12 mb-2' onClick={() => handleViewDetails(applicant)}>Details <Icon.EyeFill className="mb-1 lead" /></Button>

            </div>
          </div>
        </div>
      ))}
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        {selectedUserDetails.user && (
  <div className="body">
    <p className='lead'>User ID: {selectedUserDetails.user.userId}</p>
    <p className='lead'>User Name: {selectedUserDetails.user.userName}</p>
    <p className='lead'>Education: {selectedUserDetails.user.userDetails?.education}</p>
    <p className='lead'>Experience: {selectedUserDetails.user.userDetails?.experience}</p>
    <p className='lead'>Bio: {selectedUserDetails.user.userDetails?.bio}</p>
  </div>
)}

        </Modal.Body>
        
        <Modal.Footer>
          <Button variant='' className='btn-secondary' onClick={closeModal}>Close</Button>
          <Button variant='' className='btn-danger' onClick={() => handleDeleteApplicant(selectedUserDetails.applyingId)}>Decline</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ApplicantsList;
