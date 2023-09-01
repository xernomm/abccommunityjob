import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Swal from 'sweetalert2';

const ActiveWorkersComponent = () => {
    const [applicants, setApplicants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState({});
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    useEffect(() => {
      axios.get('http://localhost:8080/user/all-workers/admin', { headers })
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

    const closeModal = () => {
        setIsModalOpen(false);
      };

      const handleResignApplicant = (applicantId, email, jobId) => {
        axios.put(`http://localhost:8080/user/resign/${applicantId}/${email}/${jobId}`, null, { headers })
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "User resigned!",
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
              text: 'Failed to resign applicant',
            });
            console.error(error);
          });
      };

    return(

        <div className="body">
        <h1 className="display-3">Active workers</h1>
        <div className='overflowContent p-4'>
        {applicants
          .filter(applicant => applicant.accepted === true)
          .map(filteredApplicant => (
            <div key={filteredApplicant.applyingId}>
              <hr />
              <div className="col-12 d-flex">
                <div className="col-4 px-3">
                  <p className="lead fw-bold">
                    Worker: <span className="lead">{filteredApplicant.user.userName}</span>
                  </p>
                  <p className="lead fw-bold">
                    User ID: <span className="lead">{filteredApplicant.user.userId}</span>
                  </p>
                </div>
                <div className="col-4 px-3">
                  <p className="lead fw-bold">
                    Job: <span className="lead">{filteredApplicant.jobs.jobName}</span>
                  </p>
                  <p className="lead fw-bold">
                    Job ID: <span className="lead">{filteredApplicant.jobs.jobId}</span>
                  </p>
                </div>
                <div className="col-4 px-3">
                 <div className="d-flex col-12 justify-content-center">
                    <Button className='col-6 btn-danger' onClick={() => handleResignApplicant(filteredApplicant.applyingId, filteredApplicant.user.email, filteredApplicant.jobs.jobId)}>Resign <Icon.SlashCircle className="mb-1" /></Button>
                    <Button variant="" className='btnBiru col-6 ms-2' onClick={() => handleViewDetails(filteredApplicant)}>Details <Icon.EyeFill className="mb-1 lead" /></Button>

                 </div>
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
                <p className="lead">User ID: {selectedUserDetails.user.userId}</p>
                <p className="lead">User Name: {selectedUserDetails.user.userName}</p>
                <p className="lead">Education: {selectedUserDetails.user.userDetails?.education}</p>
                <p className="lead">Experience: {selectedUserDetails.user.userDetails?.experience}</p>
                <p className="lead">Bio: {selectedUserDetails.user.userDetails?.bio}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="" className="btn-secondary" onClick={closeModal}>
              Close
            </Button>
            {/* <Button variant='' className='btn-danger' onClick={() => handleDeleteApplicant(selectedUserDetails.applyingId)}>Decline</Button> */}
          </Modal.Footer>
        </Modal>
      </div>
        </div>

      
    )
}

export default ActiveWorkersComponent;