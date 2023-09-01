import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import * as Icon from 'react-bootstrap-icons';
import Swal from "sweetalert2";


const PostThread = () => {
  const [threadHeader, setThreadHeader] = useState("");
  const [threadBody, setThreadBody] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

    useEffect(() => {
      const user = sessionStorage.getItem('loginFormData');
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserEmail(parsedUser.email);
        setUserName(parsedUser.name)
      }
    }, []);

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);

        if (imageFile) {
          const imageURL = URL.createObjectURL(imageFile);
          setImagePreview(imageURL);
        }
      };

      const handleCancleImage = (event) => {
        setSelectedImage(null);
        setImagePreview(null);
      }
      

      const handleSubmit = (event) => {
        event.preventDefault();
        if (!threadBody && !threadHeader && !selectedImage && !hashtags) {
          Swal.fire({
            icon: 'error',
            title: 'Oops.. Sorry',
            text: 'You cannot upload an empty content',
          });
          return;
        }
      
        const formData = new FormData();
            formData.append("threadHeader", threadHeader);
            formData.append("threadBody", threadBody);
            formData.append("hashtags", hashtags);

            if (selectedImage) {
                formData.append("threadImage", selectedImage);
            }
      
        axios.post(`http://localhost:8080/user/post-thread?email=${userEmail}`, formData, config)
          .then(response => {
            Swal.fire({
              icon: "success",
              title: "Thread posted!",
              footer: "",
              confirmButtonColor: "#127d3f",
              confirmButtonText: "Go to dashboard",
              preConfirm: () => {
                return new Promise((resolve) => {
                  window.location.href = "/dashboard";
                  resolve();
                });
              },
            });
            console.log("Thread uploaded:", response.data);
          })
          .catch(error => {
            // Handle error, e.g., show an error message
            console.error("Error uploading thread:", error);
          });
      };
      

  return (
    <div className="body">
        <div className="p-5">
        <h1 className="display-6">What's on your mind, {userName}?</h1>
      <hr />
      <p className="lead mb-2">Uploading as <span className="fw-bold teksprimary">{userEmail}</span>.</p>


      <Form className="" onSubmit={handleSubmit}>
        <div className="d-flex col-12">
          <div className="col-6 my-auto pt-3">
          <Form.Floating className="threadForm mb-2">
          <Form.Control
            inputMode="text"
            placeholder="What are you thinking today?"
            value={threadHeader}
            onChange={e => setThreadHeader(e.target.value)}
          />
          <label>What are you thinking today?</label>
        </Form.Floating>
        <Form.Floating className="mb-3 threadForm">
          <Form.Control
          style={{height:"200px"}}
            as="textarea"
            placeholder="Anything to describe?"
            value={threadBody}
            onChange={e => setThreadBody(e.target.value)}
          />
          <label>Anything to describe?</label>
        </Form.Floating>

        <Form.Floating className="mb-3 threadForm">
          <Form.Control
          style={{height:"100px"}}
            as="textarea"
            placeholder="Add tags.. ex #fyp #trending.."
            value={hashtags}
            onChange={e => setHashtags(e.target.value)}
          />
          <label>Add tags.. ex #fyp #trending..</label>
        </Form.Floating>
          </div>

          <div className="col-6 ps-5">
          {imagePreview &&
        <div className="d-flex justify-content-center">
          <div className="col-11 mx-auto">
            <div className="d-flex">
            <p className="lead mb-2 col-11"> {selectedImage.name.toString()} </p>
            <Icon.X  className="display-6 text-center col-1 mb-1" onClick={handleCancleImage}/>
            </div>
          <img src={imagePreview} style={{scale:"70%"}} className="col-12 rounded-5" alt="Preview" />
          </div>
        </div>
        }
          <Form.Group className="mb-3">
          <Form.Label>Attach file</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Group>

  
          </div>
        </div>





        <div className="d-flex justify-content-end">
        <Button variant="" className="mt-2 btnBiru col-2" type="submit">Post <Icon.SendFill className="ms-2 mb-1"/></Button>
        </div>
      </Form>
        </div>

    </div>
  );
};

export default PostThread;
