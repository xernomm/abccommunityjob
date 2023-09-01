import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import jobImg from '../img/job.jpg'
import Swal from "sweetalert2";
import * as Icon from "react-bootstrap-icons"
import terms from '../img/terms.png'
import ApplicantsList from "./allApplicantsList";

const JobListAdmin = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // To store selected job details
  const [showModal, setShowModal] = useState(false);

  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

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



  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleViewDetails = (jobId) => {
    axios.get(`http://localhost:8080/user/job/${jobId}`, { headers })
      .then((response) => {
        console.log(response.data)
        setSelectedJob(response.data);
        setShowModal(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  const handleDeleteJob = (jobId) => {
    axios.delete(`http://localhost:8080/user/deleteJob/${jobId}`, { headers })
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Job deleted',
          text: 'Job deleted successfully',
        });
        setJobs(prevJobs => prevJobs.filter(job => job.jobId !== jobId));
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete job',
        });
        console.error(error);
      });
  };

  


  useEffect(() => {
    axios.get("http://localhost:8080/user/all-jobs", { headers })
      .then((response) => {
        console.log(response.data)
        setJobs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="body">
        <h1 className="display-3 mb-4">Manage Jobs <span>
                <Button href='/postJob' variant='outline' className=' btnPrimary btnPls'><Icon.Plus className='plusBtn lead'/></Button>
                </span></h1>
            <br />
            <div className="d-flex col-12">
              <div className="col-3 px-4 my-auto">
                <Button variant="" className="btnPrimary col-12 mb-3" onClick={handleBack}>Jobs</Button>
                <Button variant="" className="btn-outline-success col-12 mb-3" onClick={handleClick}>Applicants</Button>
              </div>
            <div className="col-9 px-5 overflowContent">
            {!showReplacement ? (

              <div>
              {jobs.map((job) => (
        <div key={job.jobId}>
            <hr />
            <div  className="job d-flex col-12 px-5">
            <div className="col-4 d-flex justify-content-center">
                <img src={jobImg} alt="" className="col-12" />
            </div>
            <div className="col-4 my-auto px-3">
                <h1 className="lead fw-bold">Job ID: {job.jobId}</h1>
                <hr />
                <h1 className="lead fw-bold">{job.jobName}</h1>
                <p className="lead">{job.company}</p>
                <p className="text-muted">${job.salary}/month</p>
                
            </div>
            <div className="col-4 my-auto mx-4">
            <Button variant="" className="btnBiru col-10 mx-auto mb-2" onClick={() => handleViewDetails(job.jobId)}>
                    View <Icon.Eye className="mb-1"/>
            </Button>
            <Button variant="" className="btn-danger col-10 mx-auto" onClick={() => handleDeleteJob(job.jobId)}>
                    Delete <Icon.TrashFill className="mb-1" />
            </Button>
            </div>
            </div>
        </div>
      ))}
              </div>
            ):(
              <div>
                <ApplicantsList />
                </div>
            )}
        </div>
            </div>


      <Modal className="" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Job details</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="body">
              
              <p className="lead mb-2"><span className="fw-bold">Job name:</span> {selectedJob?.jobName}</p>
          <p className="lead mb-2"><span className="fw-bold">Company:</span> {selectedJob?.company}</p>
          <p className="lead mb-2" ><span className="fw-bold">Job Description:</span> {selectedJob?.jobDescription}</p>
          <p className="lead mb-2"><span className="fw-bold">Contact Mail: </span>{selectedJob?.companyMail}</p>
          <p className="lead mb-2"><span className="fw-bold">Contact Phone: </span>{selectedJob?.companyContact}</p>
          <p className="lead mb-2"><span className="fw-bold">Salary rate: </span>${selectedJob?.salary}/month</p>
          <p className="lead mb-2"><span className="fw-bold">Quota available: </span>{selectedJob?.quota}</p>
          
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobListAdmin;
