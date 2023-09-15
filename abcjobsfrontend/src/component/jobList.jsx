import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import jobImg from '../img/job.jpg'
import Swal from "sweetalert2";
import terms from '../img/terms.png'

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // To store selected job details
  const [showModal, setShowModal] = useState(false);

  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

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


  const handleApplyJob = (jobId) => {
    axios
      .put(`http://localhost:8080/user/${sessionUser.email}/applying/${jobId}`, null, {
        headers,
      })
      .then((response) => {
        console.log(response.data); // Successful application
        Swal.fire({
          icon: 'success',
          title: 'Apply request sent!',
          text: 'please wait for your approval.',
        });
        return;
      })
      .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: "Already Applied!",
            text: 'You have already applied to this job.',
          });
        return;
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
    <div>
      {jobs.map((job) => (
        job.full === false && (
          <div key={job.jobId}>
          
          <div  className="loginBox bg-white job d-flex col-12 px-5">
          <div className="col-4 d-flex justify-content-center">
              <img src={jobImg} alt="" className="col-12" />
          </div>
          <div className="col-4 my-auto">
              <h1 className="lead fw-bold">{job.jobName}</h1>
              <p className="lead">{job.company}</p>
              <p className="text-muted">${job.salary}/month</p>
              
          </div>
          <div className="col-4 my-auto">
          <Button variant="" className="btn-secondary col-10 mx-auto mb-2" onClick={() => handleViewDetails(job.jobId)}>
                  View
          </Button>
          <Button variant="" className="btnPrimary col-10 mx-auto" onClick={() => handleApplyJob(job.jobId)}>
                  Apply
          </Button>
          </div>
          </div>
      </div>
        )

      ))}
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
          <Button variant="" className="btnPrimary" onClick={() => handleApplyJob(selectedJob?.jobId)}>
                    Apply
            </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobList;
