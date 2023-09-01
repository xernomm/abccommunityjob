import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const PostJobForm = () => {
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


  const [formData, setFormData] = useState({
    jobName: "",
    company: "",
    companyMail: "",
    jobDescription: "",
    companyContact: "",
    salary: 0,
    quota: 0,
  });

  const sessionUser = JSON.parse(sessionStorage.getItem("loginFormData"));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
        !formData.jobName ||
        !formData.company ||
        !formData.companyMail ||
        !formData.jobDescription ||
        !formData.companyContact || formData.salary === 0 ||
        formData.quota === 0 // You might want to validate quota separately if it's not required
      ) {
        Swal.fire('Oops... Fields are still empty', 'Please fill in all the fields to post the job', 'error');
        return;
      }

    axios
      .post(`http://localhost:8080/user/post-job?email=${userEmail}`, formData, {
        headers: headers,
      })
      .then((response) => {
        console.log(response.data);
        Swal.fire({
            icon: "success",
            title: "Job posted!",
            footer: "",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Go to Job dashboard",
            preConfirm: () => {
              return new Promise((resolve) => {
                window.location.href = "/adminAllJobs";
                resolve();
              });
            },
          });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Something went wrong', 'try again', 'error');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="body">
      <div className="p-5 bg-light threadBox">


<h1 className="display-4 mb-5">Posting a job, <span className="teksprimary">{userName}</span>?</h1>

<Form onSubmit={handleSubmit} className="px-5">
          <Form.Floating className="mb-2">
            <Form.Control
              type="text"
              id="jobName"
              name="jobName"
              placeholder="Job name"
              value={formData.jobName}
              onChange={handleChange}
            />
            <label htmlFor="jobName">Job name</label>
          </Form.Floating>

          <Form.Floating className="mb-2">
            <Form.Control
              type="text"
              name="company"
              id="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
            />
            <label htmlFor="company">Company</label>
          </Form.Floating>

          <Form.Floating className="mb-2">
            <Form.Control
              type="email"
              name="companyMail"
              id="companyMail"
              placeholder="Company Mail"
              value={formData.companyMail}
              onChange={handleChange}
            />
            <label htmlFor="companyMail">Company Mail</label>
          </Form.Floating>

          <Form.Floating className="mb-2">
            <Form.Control style={{height:"100px"}}
              as="textarea"
              rows={4}
              name="jobDescription"
              id="jobDescription"
              placeholder="Job Description"
              value={formData.jobDescription}
              onChange={handleChange}
            />
            <label htmlFor="jobDescription">Job Description</label>
          </Form.Floating>

          <Form.Floating className="mb-2">
            <Form.Control
              type="text"
              name="companyContact"
              id="companyContact"
              placeholder="Company Contact"
              value={formData.companyContact}
              onChange={handleChange}
            />
            <label htmlFor="companyContact">Company Contact</label>
          </Form.Floating>

          <Form.Floating className="mb-2">
            <Form.Control
              type="number"
              name="salary"
              id="salary"
              placeholder="Salary($/Month)"
              value={formData.salary}
              onChange={handleChange}
            />
            <label htmlFor="quota">Salary($/Month)</label>
          </Form.Floating>

          <Form.Floating className="mb-2">
            <Form.Control
              type="number"
              name="quota"
              id="quota"
              placeholder="Quota"
              value={formData.quota}
              onChange={handleChange}
            />
            <label htmlFor="quota">Quota</label>
          </Form.Floating>

        <div className="d-flex justify-content-end">
        <Button variant="" className="btnBiru col-3 mt-4" type="submit">Post Job</Button>
        </div>

        </Form>
      </div>
    </div>
  );
};

export default PostJobForm;
