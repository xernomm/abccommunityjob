import { useParams } from 'react-router-dom';
import CommentSection from "../component/commentSection"
import Header from "../component/header"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommentPage(){
    const { threadId } = useParams();
    const [selectedThread, setSelectedThread] = useState(null);
  
    useEffect(() => {
  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

        const headers = {
          Authorization: `Bearer ${token}`,
        };
    
        axios.get(`http://localhost:8080/user/thread/${threadId}`, { headers })
          .then(response => {
            setSelectedThread(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }, [threadId]);
  
    if (!selectedThread) {
      return <div>Loading...</div>;
    } // Get threadId from URL parameters

    return (
        <>
            <Header activePage={"dashboard"} />
            <CommentSection threadId={selectedThread} /> {/* Pass the threadId */}
        </>
    );
}

export default CommentPage;
