import { Button, Form } from 'react-bootstrap';
import profil from '../img/profile.jpg'
import richie from '../img/profile.jpg'
import React, { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import EditProfileModal from './editProfileModal';
import axios from 'axios';
import Swal from 'sweetalert2';
import AllUsersComponent from './allUserComp';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';


const ProfileComp = () => {


const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const user = sessionStorage.getItem('loginFormData');
  const parsedUser = JSON.parse(user);
  const token = parsedUser.token;

  const [userInfo, setUserInfo] = useState(null); 
  const[userEmail, setUserEmail] = useState(null)
  const[userName, setUserName] = useState(null)
  const[bio, setUserBio] = useState(null)
  const[university, setUserUniversity] = useState(null)
  const[education, setUserEduation] = useState(null)
  const[phoneNumber, setUserPhoneNumber] = useState(null)
  const[address, setUserAddress] = useState(null)
  const[age, setUserAge] = useState(null)
  const[experience, setUserExperience] = useState(null)
  const[showAlert, setShowAlert] = useState(false)
  const[roleId, setRoleId] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [threads, setThreads] = useState([]);
  const [usersData, setUsersData] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  
  useEffect(() => {
    axios.get(`http://localhost:8080/user/get-details-user/${parsedUser.email}`, { headers })
      .then((response) => {
        console.log(response.data);
  
        setUserInfo(response.data);
  
        if (response.data.userDetails) {
          setUserEmail(response.data.email);
          setUserAddress(response.data.userDetails.address || '');
          setUserAge(response.data.userDetails.age || '');
          setUserPhoneNumber(response.data.userDetails.phoneNumber || '');
          setUserEduation(response.data.userDetails.education || '');
          setUserUniversity(response.data.userDetails.university || '');
          setUserBio(response.data.userDetails.bio || '');
          setUserExperience(response.data.userDetails.experience || '');
          setRoleId(response.data.roleId);
          setUserName(response.data.userName);
          
          // Check if any of the user details fields are null or empty
          setShowAlert(
            !response.data.userDetails.age ||
            !response.data.userDetails.university ||
            !response.data.userDetails.education ||
            !response.data.userDetails.address ||
            !response.data.userDetails.phoneNumber ||
            !response.data.userDetails.experience
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  


  



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
  


  useEffect(() => {
    const user = sessionStorage.getItem('loginFormData');
    if (user) {
        const parsedUser = JSON.parse(user);
        
    }
}, []);

useEffect(() => {
    if (roleId === 2 && showAlert) {
        Swal.fire({
            title: `Hi ${userName}!`,
            html: `You still got some empty fields in your profile right there.. Set it up by clicking the <span class="fw-bold">Edit profile</span> button.`,
            icon: 'info'
        });
    }
}, [showAlert, userName]);

const handleDeleteThread = (threadId) => {
    axios.delete(`http://localhost:8080/user/deleteThread/${threadId}`, { headers })
        .then(response => {

            Swal.fire({
                icon: 'success',
                title: 'Thread deleted',
                text: 'Thread deleted successfully',
                confirmButtonColor: "#127d3f",
                    confirmButtonText: "Ok",
                    preConfirm: () => {
                      return new Promise((resolve) => {
                        window.location.reload();
                        resolve()
                      });
                    },
              });
            setUsersData(prevUsersData => prevUsersData.filter(thread => thread.threadId !== threadId));
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete thread',
                confirmButtonColor: "#127d3f",
                    confirmButtonText: "Ok",
                    preConfirm: () => {
                      return new Promise((resolve) => {
                        window.location.reload();
                        resolve()
                      });
                    },
              });
            console.error(error);
        });
};


    return(
        <div className="body">
            <div className="col-12 d-flex">
              {userInfo && (
               <div className="col-8 px-3">
               <div className="d-flex justify-content-center mb-3">
                   <div className="col-12 profileBox bg-light">
                       <div className="col-12 topImg">
                       </div>
                       <div className="col-12 profilePadding">
                       {/* {`data:image/jpeg;base64,${parsedUser.userDetails.profilePicture}`} */}
                       {userInfo.profilePicture && (
                               <img src={`data:image/jpeg;base64,${userInfo.profilePicture}`} alt="" className="col-8 my-auto profileDash" />

                       )}
                       {!userInfo.profilePicture && (
                               <img src={profil} alt="" className="col-8 my-auto profileDash" />

                       )}
                               {/* userName */}

                               {userName &&(
                           <p className="display-6 mt-3 ">{userName}</p> 
                               )}

                           {/* bio */}
                           {experience &&(
                           <p className="lead">{experience}</p>
                           )}
                           <div className="my-auto">
                           <hr />
                           {age&& userName &&(
                           <p className="lead mt-3"><Icon.Person/> {userName}, <span className="fw-bold teksprimary">{age} years old</span>.</p>
                           )}
                           {!age&&(
                               <p className="lead mt-3"> </p>
                           )}
                           {university &&(
                           <p className="lead mt-5"><Icon.Award/> Educated in <span className="fw-bold teksprimary">{university}</span>,</p>
                           )}
                           {education&&(
                           <p className="lead mt-1 mb-5"><Icon.Book/> Taking <span className="fw-bold teksprimary">{education} </span>Course.</p>
                           )}
                           {address &&(
                           <p className="lead mt-3 mb-5"><Icon.House/> {address}</p>
                           )}
                           <p className="lead mt-5 fw-bold teksprimary">Contacts</p>
                           <hr />
                           {/* email */}
                           <p className="lead mt-3 teksprimary"><Icon.EnvelopeAt/> {userEmail}</p>
                           {phoneNumber &&(
                           <p className="lead mt-3 teksprimary"><Icon.Telephone/> {phoneNumber}</p>
                           )}


                           
                           </div>
                           {(!age || !university || !education || !address || !phoneNumber || !experience || age || university || education || address || phoneNumber || experience) && (
                               <div>
                                   <Button variant="" onClick={handleShowModal} className="col-3 btnBiru mt-4">Edit Profile</Button>
                                   <EditProfileModal show={showModal} onHide={handleCloseModal} />
                               </div>
                           )}


                       </div>
                       
                   </div>
               </div>


               {bio && (
               <div>
               <div className="d-flex justify-content-center mb-3 mt-1">
                   <div className="col-12 loginBox bg-light my-auto">
                 <p className="display-6 mb-4">About Me</p>
                    <p className="lead">
                    {bio}
                    </p>
                   </div>
               </div>
               </div>
               )}






            <div className="d-flex justify-content-center col-12">
            <div className="threadBox bg-light px-5 col-12">
            <p className="display-6 mb-4">My Posts</p>
            <div className="col-12 overflowContent ">
            {threads.map(thread => {
              if (thread.user.email === userEmail) {
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

                      {thread.user.email === userEmail && (
                      <div className="d-flex col-2">
                      <Link to={`/editThread/${thread.threadId}`} className="linkprimary col-6">
                      <Icon.PencilFill className="lead text-center" />
                      </Link>

                      <Link onClick={() => handleDeleteThread(thread.threadId)} className="text-danger col-6">
                      <Icon.TrashFill className="lead text-center" />
                      </Link>
                      </div>
                      )}

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
            {threads.filter(thread => thread.user.email === userEmail).length === 0 && (
              <div style={{padding:"20%"}} className="col-12 overflowContent text-center">
                <p className="lead"><span className="teksprimary fw-bold">{userName}</span> haven't posted anything. </p>
                <Button variant='' href='/postThread' className='btnPrimary col-6'>Add Post <Icon.PlusLg className='mb-1' /></Button>
              </div>
            )}
            </div>
            </div>

            </div>


           </div>
              )}
 
                
                <div className="col-4">
                    <div className="d-flex justify-content-center">
                    <a className='linkprimary' href="/jobs">
                    <div className="col-12 jobBox checkJobs">
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
                    <Button href='/dashboard' variant='' className='btnPrimary col-12 my-3 mx-auto'>My Dashboard <Icon.MenuButtonWideFill /></Button>


<div className="mt-2 px-3">
<p className="lead fw-bold teksprimary mb-4">People you might know</p>
            <div className="overflowContent">

            <AllUsersComponent />

            </div>
</div>

                </div>
            </div>
        </div>
        
    )
}

export default ProfileComp;