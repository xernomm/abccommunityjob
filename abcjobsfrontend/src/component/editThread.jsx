import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function EditThreadForm( { threadId }) {
  const [threadHeader, setThreadHeader] = useState('');
  const [threadBody, setThreadBody] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [existingThread, setExistingThread] = useState(null);
  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  


  // Use useEffect to fetch and set the existing thread details when the component mounts
  useEffect(() => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
    // Fetch the existing thread details using the threadId
    axios
      .get(`http://localhost:8080/user/thread/${threadId}`, config)
      .then((response) => {
        console.log(response.data.thread)
        
        const existingThread = response.data.thread;
        setExistingThread(existingThread)
        setThreadHeader(existingThread.threadHeader);
        setThreadBody(existingThread.threadBody);
        setHashtags(existingThread.hashtags)
        setImagePreview(`data:image/jpeg;base64,${existingThread.threadImage}`); // Convert base64 to URL
      })
      .catch((error) => {
        console.error('Error fetching thread details:', error);
      });
  }, [threadId]);







  const handleSubmit = (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('threadHeader', threadHeader);
    formData.append('threadBody', threadBody);
    formData.append('hashtags', hashtags);
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Add your token here
      },
    };
  
    axios
      .post(`http://localhost:8080/user/editThread?threadId=${threadId}`, formData, config)
      .then((response) => {
        console.log('Thread edited successfully');
        Swal.fire({
            icon: "success",
            title: "Thread updated!",
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
      })
      .catch((error) => {
        console.error('Error editing thread:', error);
        Swal.fire('Something went wrong', 'Try again', 'error');
      });
  };
  

  return (
    <div>
      <div className="body">
      <h1 className="display-6 mb-5 ms-5">Changing toughts, {sessionUser.name}?</h1>

      <div className="d-flex">
        <div className="col-6">
                <div className="d-flex justify-content-center">
                {existingThread && existingThread.threadImage ? (
                <img src={`data:image/jpeg;base64,${existingThread.threadImage}`} alt="" className="col-10 rounded-4" />
                ) : (
                <p className="my-5 lead col-10">No image</p>
                )}
                </div>

        </div>
        <div className="col-6 px-5 my-auto">
        <Form onSubmit={handleSubmit}>
        <Form.Floating controlId="threadHeader" className='mb-4'>
          
          <Form.Control
            type="text"
            value={threadHeader}
            placeholder='Changing toughts?'
            onChange={e => setThreadHeader(e.target.value)}
          />
          <label htmlFor="">Changing toughts?</label>
        </Form.Floating>

        <Form.Floating controlId="threadBody" className='mb-4'>
          <Form.Control
          style={{height:"200px"}}
            as="textarea"
            rows={4}
            value={threadBody}
            placeholder='Anything to describe..'
            onChange={e => setThreadBody(e.target.value)}
          />
          <label htmlFor="">Anything to describe..</label>
        </Form.Floating>

        <Form.Floating controlId="hashtags" className='mb-4'>
          <Form.Control
          style={{height:"100px"}}
            as="textarea"
            rows={4}
            value={hashtags}
            placeholder='Tags..'
            onChange={e => setHashtags(e.target.value)}
          />
          <label htmlFor="">Tags..</label>
        </Form.Floating>

        <div className="d-flex justify-content-end">
        <Button variant="" type="submit" className='btnBiru col-4 mb-4'>
                Edit Thread
                </Button>
        </div>

      </Form>
        </div>
      </div>

      </div>





    </div>
  );
}

export default EditThreadForm;
