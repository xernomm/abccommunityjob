import React, { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import profil from '../img/profile.jpg'
import { Button, Form } from 'react-bootstrap';
import AllUsersComponent from './allUserComp';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';


const PublicProfileComp = ({ selectedUser }) => {

  const [commentCounts, setCommentCounts] = useState({});
  const [threads, setThreads] = useState([]);
  const [usersData, setUsersData] = useState([]);
  
  const user = sessionStorage.getItem('loginFormData');
  const parsedUser = JSON.parse(user);
  const token = parsedUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const {
    userName
  } = selectedUser; // Destructure user's profile information
  console.log(selectedUser)

  useEffect(() => {
    axios.get('http://localhost:8080/user/all-threads', { headers })
      .then(response => {
        const sortedThreads = response.data.sort((a, b) => new Date(b.threadDate) - new Date(a.threadDate));
        setThreads(sortedThreads);

        // Initialize likedThreads state based on the number of threads
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const fetchCommentCounts = () => {
      const threadIds = threads.map(thread => thread.threadId);
  
      axios.all(
        threadIds.map(threadId =>
          axios.get(`http://localhost:8080/user/comments/${threadId}/count`, { headers })
        )
      )
        .then(responses => {
          const counts = {};
          responses.forEach((response, index) => {
            counts[threadIds[index]] = response.data;
          });
          setCommentCounts(counts);
        })
        .catch(error => {
          console.error(error);
        });
    };
  
    fetchCommentCounts();
  }, [threads]);
  

  return (
    <div className="body">
      <div className="col-12 d-flex">
        <div className="col-8">
          <div className="d-flex justify-content-center mb-4">
          <div className="col-11 profileBox bg-light">
          <div className="col-12 topImg">
          </div>
          <div className="col-12 profilePaddingPublic">
           <img src={profil} alt="" className="col-8 profileDash" />

            {userName && <p className="display-6 mt-3 ">{userName}</p>}

            {/* Experience */}
            {selectedUser.userDetails.experience && <p className="lead">{selectedUser.userDetails.experience}</p>}

            {/* Basic profile information */}
            <div className="my-auto">
              <hr />
              {selectedUser.userDetails.age && (
                <p className="lead mt-3">
                  <Icon.Person /> {userName},{' '}
                  <span className="fw-bold teksprimary">{selectedUser.userDetails.age} years old</span>.
                </p>
              )}
              {!selectedUser.userDetails.age &&(
                                    <p className="lead mt-3"> </p>
                                )}

                                {selectedUser.userDetails.university &&(
                                <p className="lead mt-5"><Icon.Award/> Educated in <span className="fw-bold teksprimary">{selectedUser.userDetails.university}</span>,</p>
                                )}
                                {selectedUser.userDetails.education &&(
                                <p className="lead mt-1 mb-5"><Icon.Book/> Taking <span className="fw-bold teksprimary">{selectedUser.userDetails.education} </span>Course.</p>
                                )}
                                {selectedUser.userDetails.address &&(
                                <p className="lead mt-3 mb-5"><Icon.House/> {selectedUser.userDetails.address}</p>
                                )}
              {/* Add more profile information here... */}

              {/* Contacts */}
              <p className="lead mt-5 fw-bold teksprimary">Contacts</p>
              <hr />
              {/* Email */}
              <p className="lead mt-3 teksprimary">
                <Icon.EnvelopeAt /> {selectedUser.email}
              </p>
              {selectedUser.userDetails.phoneNumber && (
                <p className="lead mt-3 teksprimary">
                  <Icon.Telephone /> {selectedUser.userDetails.phoneNumber}
                </p>
              )}
            </div>

            {/* Bio */}
           
          </div>
        </div>
          </div>

          {selectedUser.userDetails.bio && (
            <div>
            <p className="display-6 mt-3 ms-4">About {userName}</p>
              <div className="d-flex justify-content-center mb-4">
                <div className="col-11 loginBox bg-light my-auto">
                  <p className="lead">{selectedUser.userDetails.bio}</p>
                </div>
              </div>
            </div>
          )}



            <p className="display-6 mt-3 ms-4">{userName}'s Posts</p>
            <div className="d-flex justify-content-center">
              <div className="col-11 threadBox bg-light overflowContent px-5">
      {threads.map(thread => {
        if (thread.user.email === selectedUser.email) {
          return (
            <div key={thread.threadId} className="thread bg-white mb-4">
            <div className="headerThread mb-3 d-flex">
                <img src={profil} alt="" className="mightKnow col-2" />
                <p className="lead fw-bold text-dark my-auto mx-3 col-7">{thread.user.userName}</p>
                <small className=" text-muted text-center my-auto ">{formatDistanceToNow(new Date(thread.threadDate), { addSuffix: true })}</small>

            </div>

            
            <br />
            <div className="headerThread d-flex">

                <h1 className="lead fw-bold mb-3 col-10">
                {thread.threadHeader}
                </h1>

                

                </div>
            <div className="threadBody">
                <p className="lead">
                {thread.threadBody}
                </p>


                {/* Display the image */}
            {thread.threadImage && (
            <div className="threadImage d-flex justify-content-center">
                <img className='col-12 rounded-4' src={`data:image/jpeg;base64,${thread.threadImage}`} alt="Thread" />
            </div>
            )}
            </div>
            <div className='d-flex justify-content-end mt-4'>

                <Link className='linkprimary ' to={`/comment/${thread.threadId}`}>
                <Icon.ChatDots
                    className="teksprimary mb-1"
                /><span className="teksprimary ms-2 me-2 mt-1">{commentCounts[thread.threadId] || 0} comments</span>
                </Link>
                
            </div>
            </div>
          );
        }
        return null;
      })}
      {threads.filter(thread => thread.user.email === selectedUser.email).length === 0 && (
        <div style={{padding:"20%"}} className="text-center">
          <p className="lead"><span className="teksprimary fw-bold">{userName}</span> haven't posted anything. </p>
        </div>
      )}

              </div>
            </div>
        </div>
        <div className="col-4">
                    <div className="d-flex justify-content-center">
                    <a className='linkprimary' href="/jobs">
                    <div className="col-10 jobBox checkJobs">
                        <div className="boxBlur p-5">
                        <p className="display-5 text-white">
                            ABC JOBS
                        </p>
                        <hr className='border-white'/>

                        <p className="display-6 fw-bold text-white linkprimary">
                            Check the latest available jobs.
                        </p>
                        </div>
                        
                    </div>
                    </a>
                    </div>
                    <Button href='/dashboard' variant='' className='btnPrimary col-10 my-3'>My Dashboard <Icon.MenuButtonWideFill /></Button>


<div className="p-5">
<p className="lead fw-bold teksprimary mb-4">People you might know</p>
            <div className="overflowContent ">

            <AllUsersComponent />

            </div>
</div>

                </div>
      </div>
    </div>
  );
};

export default PublicProfileComp;
