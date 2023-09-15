import { Button, Form } from 'react-bootstrap';
import profil from '../img/profile.jpg'
import * as Icon from 'react-bootstrap-icons';
import React, { useEffect, useState } from 'react';
import AllUsersComponent from './allUserComp';
import AllThreads from './allThreadsComp';
import users from '../img/users.jpg'
import jobsImg from '../img/job.jpg'
import commentImg from '../img/commentImg.jpg'
import threadImg from '../img/threadImg.jpg'
import workers from '../img/workers.jpg'
import messages from '../img/info.jpg'
import NotFoundComp from './404Comp';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';


const DashboardComp = () => {
    const user = sessionStorage.getItem('loginFormData');
    const parsedUser = JSON.parse(user);
    const token = parsedUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
      };


    
    // const [userEmail, setUserEmail] = useState(null);
    // const [userName, setUserName] = useState(null);
    // const [roleId, setRoleId] = useState(null);
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:8080/user/all-user', { headers })
          .then(response => {
              console.log(response.data)
              setUsersData(response.data);
          })
          .catch(error => {
              console.error(error);
          });
  }, []);


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



  
  useEffect(() => {
    axios.get(`http://localhost:8080/user/get-details-user/${parsedUser.email}`, { headers })
      .then((response) => {
        console.log(response.data)
        setUserInfo(response.data);
        
          setUserEmail(response.data.email);
          setUserAddress(response.data.userDetails.address);
          setUserAge(response.data.userDetails.age);
          setUserPhoneNumber(response.data.userDetails.phoneNumber);
          setUserEduation(response.data.userDetails.education);
          setUserUniversity(response.data.userDetails.university);
          setUserBio(response.data.userDetails.bio);
          setUserExperience(response.data.userDetails.experience);
          setRoleId(response.data.roleId)
          setUserName(response.data.userName);
  
          setShowAlert( !response.data.userDetails.age || !response.data.userDetails.university || !response.data.userDetails.education || !response.data.userDetails.address || !response.data.userDetails.phoneNumber || !response.data.userDetails.experience);
       
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

    const [counts, setCounts] = useState({
        users: 0,
        jobs: 0,
        threads: 0,
        comments: 0,
      });

      useEffect(() => {
        axios.get('http://localhost:8080/user/all-user/admin', { headers })
          .then(response => {
            console.log(response.data)
            setCounts(prevCounts => ({ ...prevCounts, users: response.data.usersCount }));
          })
          .catch(error => {
            console.error(error);
          });
    
        axios.get('http://localhost:8080/user/all-jobs/admin', { headers })
          .then(response => {
            console.log(response.data)

            setCounts(prevCounts => ({ ...prevCounts, jobs: response.data.jobsCount
            }));
          })
          .catch(error => {
            console.error(error);
          });
    
        axios.get('http://localhost:8080/user/all-threads/admin', { headers })
          .then(response => {
            console.log(response.data)

            setCounts(prevCounts => ({ ...prevCounts, threads: response.data.threadsCount }));
          })
          .catch(error => {
            console.error(error);
          });
    
        axios.get('http://localhost:8080/user/all-comments/admin', { headers })
          .then(response => {
            console.log(response.data)

            setCounts(prevCounts => ({ ...prevCounts, comments: response.data.commentsCount }));
          })
          .catch(error => {
            console.error(error);
          });
      }, []);

      
      // THREADS
      const [threads, setThreads] = useState([]);
  const [likedThreads, setLikedThreads] = useState({});
  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const [commentCounts, setCommentCounts] = useState({});


  useEffect(() => {
    const user = sessionStorage.getItem('loginFormData');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserEmail(parsedUser.email);
      setUserName(parsedUser.name)
      setRoleId(parsedUser.roleId)
    }
  }, []);


  useEffect(() => {
    axios.get('http://localhost:8080/user/all-threads', { headers })
      .then(response => {
        const sortedThreads = response.data.sort((a, b) => new Date(b.threadDate) - new Date(a.threadDate));
        setThreads(sortedThreads);

        // Initialize likedThreads state based on the number of threads
        const initialLikedState = {};
        sortedThreads.forEach(thread => {
          initialLikedState[thread.threadId] = {
            thumbsUp: false,
            chat: false,
            bookmark: false
          };
        });
        setLikedThreads(initialLikedState);
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
  

  const handleLike = (threadId) => {
    setLikedThreads((prevLikedThreads) => ({
      ...prevLikedThreads,
      [threadId]: {
        ...prevLikedThreads[threadId],
        thumbsUp: !prevLikedThreads[threadId]?.thumbsUp,
      },
    }));
  };
  const handleChat = (threadId) => {
    setLikedThreads(prevState => ({
      ...prevState,
      [threadId]: {
        ...prevState[threadId],
        chat: !prevState[threadId].chat
      }
    }));
  };

  const handleBookmark = (threadId) => {
    setLikedThreads(prevState => ({
      ...prevState,
      [threadId]: {
        ...prevState[threadId],
        bookmark: !prevState[threadId].bookmark
      }
    }));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryFilled, setSearchQueryFilled] = useState('');
  const [searchResults, setSearchResults] = useState({
    threads: [],
    users: []
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(!searchQuery){
      e.preventDefault()
      return
    }
  
    const filteredUsers = usersData.filter(user => (
      user.roleId === 2 && user.email !== userEmail &&
      user.userName.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  
    const filteredThreads = threads.filter(thread => {
      const threadHeaderLower = thread.threadHeader.toLowerCase();
      const threadBodyLower = thread.threadBody.toLowerCase();
      const hashtags = thread.hashtags?.toLowerCase();
      const searchQueryLower = searchQuery.toLowerCase();
  
      return threadHeaderLower.includes(searchQueryLower) || threadBodyLower.includes(searchQueryLower) || (hashtags && hashtags.includes(searchQueryLower));
    });
  
    setSearchResults({
      threads: filteredThreads,
      users: filteredUsers
    });

    setSearchQueryFilled("You searched for " + searchQuery)
  };
  

return(
    <div>

        {!parsedUser && (
            <NotFoundComp />
        )}

{roleId === 2 && userInfo &&(
<div className="user body col-12 d-flex justify-content-center bg-light">
<div className="col-3 me-3  ">
            <div className=" my-auto threadBox p-5 bg-white">
                <div className="d-flex justify-content-center">

                {userInfo.profilePicture && (
                <img src={`data:image/jpeg;base64,${userInfo.profilePicture}`} alt="" className="mb-4 col-10 mx-auto profileDash" />

                )}
                
                {!userInfo.profilePicture && (
                <img src={profil} alt="" className="mb-4 col-10 mx-auto profileDash" />
                )}
                
                
                </div>
                <h1 className="lead teksprimary text-center fw-bold mb-4 ">{userName}</h1>
                <p className="lead mb-1">Hi <span className="teksprimary">{userName}</span>! <br /> you are signed-<span className="teksprimary">In</span> as,</p>
                <p className=" fw-bold col-10 teksprimary mb-4">{userEmail}<span className="lead">.</span></p>
                <hr />
                <Button variant='outline' href='/profile' className='btnBiru col-12 mb-2'>My Profile <Icon.PersonFill className='icon'/></Button>
                <Button variant='outline' href='/postThread' className='btn btn-outline-secondary col-12'>Write <Icon.PencilFill className='mb-1 ms-1'/></Button>
                <div className='py-5'>
                </div>

          
                
            </div>
        </div>

        <div className="col-7 px-5">
          <div className="loginBox mb-4">
          <h1 className="display-6">
                What's on your mind? <span>
                <Button href='/postThread' style={{borderRadius:"50%"}} variant='outline' className=' btnPrimary btnPls ms-1 '><Icon.Plus className='plusBtn'/></Button>
                </span>
            </h1>
          </div>

            <div className="col-12 d-flex mb-4">
            <Form className='col-12 d-flex' onSubmit={handleSearchSubmit}>
          <Form.Floating className='col-10'>
            <Form.Control
              type="search"
              id="search"
              name="search"
              placeholder="Explore..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <label htmlFor="email">Explore...</label>
          </Form.Floating>
          <Button type='submit' variant='outline' className='col-2 mx-1 btnBiru'><Icon.Search className='lead '/></Button>
        </Form>
            </div>

            <div>
   
            </div>

            {searchResults.threads?.length > 0 && (
              

            <div className="searchResults">
                
              <p className="lead mb-3">Threads</p>
              <hr />

              <div className="overflowContent">
                
              {searchResults.threads.map(thread => (
              
    
              <div key={thread.threadId} className="thread mb-5">
              <div className="headerThread mb-3 d-flex">
                <img src={`data:image/jpeg;base64,${thread.user.profilePicture}`} alt="" className="mightKnow col-2" />
                <a href={`/profile/${thread.user.userId}`} className="lead fw-bold linkprimary text-dark my-auto mx-3 col-7">{thread.user.userName}</a>
                <small className=" text-muted text-center my-auto ">{formatDistanceToNow(new Date(thread.threadDate), { addSuffix: true })}</small>
              </div>
              <br />
              <div className="headerThread d-flex">
                <h1 className="lead fw-bold mb-3 col-11">
                  {thread.threadHeader}
                </h1>
                {thread.user.email === userEmail && (
                <Link to={`/editThread/${thread.threadId}`} className="linkprimary">
                <Icon.PencilFill className="lead text-center" />
              </Link>
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
            {thread.hashtags && (
            <p className="mt-3 lead linkprimary">
            {thread.hashtags}
            </p>
            )}

              </div>
              <div className='d-flex justify-content-end mt-4'>
              {likedThreads[thread.threadId]?.thumbsUp ? (
                <Link className='linkprimary '>
    
                  <Icon.HandThumbsUpFill
                    className={`like mx-2 teksprimary`}
                    onClick={() => handleLike(thread.threadId)}
                  />
                  </Link>
                ) : (
                <Link className='linkprimary '>
                  <Icon.HandThumbsUp
                    className={`like mx-2 ${likedThreads[thread.threadId]?.thumbsUp ? 'teksprimary' : ''}`}
                    onClick={() => handleLike(thread.threadId)}
                  />
                  </Link>
                )}
                <Link className='linkprimary ' to={`/comment/${thread.threadId}`}>
                  <Icon.ChatDots
                    className={`like ms-2 ${likedThreads[thread.threadId]?.chat ? 'teksprimary' : ''}`}
                    onClick={() => handleChat(thread.threadId)}
                  /><span className="teksprimary ms-2 me-2 mt-1">{commentCounts[thread.threadId] || 0} comments</span>
                </Link>
                {likedThreads[thread.threadId]?.bookmark ? (
                <Link className='linkprimary '>
    
                  <Icon.BookmarkFill
                    className={`like mx-2 text-warning`}
                    onClick={() => handleBookmark(thread.threadId)}
                  />
                  </Link>
                ) : (
                <Link className='linkprimary '>
    
                  <Icon.Bookmark
                    className={`like mx-2 ${likedThreads[thread.threadId]?.bookmark ? 'teksprimary' : ''}`}
                    onClick={() => handleBookmark(thread.threadId)}
                  />
                  </Link>
                )}
                
              </div>
            </div>
    ))}
              </div>



              





              <br />
              <br />
              <br />

</div>


            )}

            {searchResults.users?.length > 0 && (
              <div>
                <p className="lead mb-3">Users</p>
                <div className="overflowContent p-3">
                  <div>
                    {searchResults.users.map(user => (
                      user.roleId === 2 && user.email !== userEmail && (
                        <div key={user.userId} className="loginBox col-12 bg-white mb-3">
                          <div className='d-flex col-12'>
                            {!user.profilePicture && (
                            <img src={profil} alt="" className="col-6 mightKnow my-auto" />
                            )}
                            {user.profilePicture && (
                            <img src={`data:image/jpeg;base64,${user.profilePicture}`} alt="" className="col-6 mightKnow my-auto" />
                            )}
                            <div className="my-auto ms-4 col-6">
                              <p className="fw-bold mb-1 ">{user.userName}</p>
                              <div className="d-flex col-12">
                              <Button variant='outline' href={`/profile/${user.userId}`} className='btn-outline-secondary col-7 mx-3'><small>View profile <Icon.PersonFill className='lead' /></small></Button>
                              <Button variant='outline' className='btnBiru col-7 mx-auto'><small>Follow <Icon.PersonFillAdd className='mb-1 lead' /></small></Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                <br />
                <br />
                <br />
              </div>
            )}


            {!searchQuery && (
            <div className='overflowContent2'>
            <div className="threadList">
      {threads.map(thread => (
        <div key={thread.threadId} className="thread mb-5">
          <div className="headerThread mb-3 d-flex">

            {thread.user.profilePicture && (
            <img src={`data:image/jpeg;base64,${thread.user.profilePicture}`} alt="" className="mightKnow col-2" />

            )}
            {!thread.user.profilePicture && (
            <img src={profil} alt="" className="mightKnow col-2" />

            )}
            
            
            <a href={`/profile/${thread.user.userId}`} className="lead fw-bold linkprimary text-dark my-auto mx-3 col-7">{thread.user.userName}</a>
            <small className=" text-muted text-center my-auto ">{formatDistanceToNow(new Date(thread.threadDate), { addSuffix: true })}</small>

          </div>

         
          <br />
          <div className="headerThread d-flex">

            <h1 className="lead fw-bold mb-3 col-11">
              {thread.threadHeader}
            </h1>

            {thread.user.email === userEmail && (
            <Link to={`/editThread/${thread.threadId}`} className="linkprimary">
            <Icon.PencilFill className="lead text-center" />
          </Link>
          
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
                    <p className="mt-3 lead linkprimary">
            {thread.hashtags}
            </p>
          </div>
          <div className='d-flex justify-content-end mt-4'>
          {likedThreads[thread.threadId]?.thumbsUp ? (
            <Link className='linkprimary '>

              <Icon.HandThumbsUpFill
                className={`like mx-2 teksprimary`}
                onClick={() => handleLike(thread.threadId)}
              />
              </Link>
            ) : (
            <Link className='linkprimary '>
              <Icon.HandThumbsUp
                className={`like mx-2 ${likedThreads[thread.threadId]?.thumbsUp ? 'teksprimary' : ''}`}
                onClick={() => handleLike(thread.threadId)}
              />
              </Link>
            )}
            <Link className='linkprimary ' to={`/comment/${thread.threadId}`}>
              <Icon.ChatDots
                className={`like ms-2 ${likedThreads[thread.threadId]?.chat ? 'teksprimary' : ''}`}
                onClick={() => handleChat(thread.threadId)}
              /><span className="teksprimary ms-2 me-2 mt-1">{commentCounts[thread.threadId] || 0} comments</span>
            </Link>
            {likedThreads[thread.threadId]?.bookmark ? (
            <Link className='linkprimary '>

              <Icon.BookmarkFill
                className={`like mx-2 text-warning`}
                onClick={() => handleBookmark(thread.threadId)}
              />
              </Link>
            ) : (
            <Link className='linkprimary '>

              <Icon.Bookmark
                className={`like mx-2 ${likedThreads[thread.threadId]?.bookmark ? 'teksprimary' : ''}`}
                onClick={() => handleBookmark(thread.threadId)}
              />
              </Link>
            )}
            
          </div>
        </div>
      ))}
    </div> 
            </div>
            
            )}


            
        </div>

        <div className="col-3 ">
        <div className="d-flex justify-content-center">
                    <a className='linkprimary' href="/jobs">
                    <div className="col-10 jobBox checkJobs">
                        <div className="boxBlur p-5">
                        <p className="display-6 text-white">
                            ABC JOBS
                        </p>
                        <hr className='border-white'/>

                        <p className="lead fw-bold text-white linkprimary">
                            Check the latest available jobs.
                        </p>
                        </div>
                        
                    </div>
                    </a>
                    </div>

        <div className="mt-5">
                    <p className="lead fw-bold teksprimary mb-4">People you might know</p>
                <div className="overflowContent p-2">
                    <AllUsersComponent />
                </div>
            </div>
        </div>
</div>
)}

{roleId === 1 && userInfo && (
    <div className="admin body col-12 d-flex justify-content-center bg-light">
        <div className="col-3 me-3">
                <div className="loginBox p-5 bg-white">
                    <div className='d-flex justify-content-center mb-4'>
                        <img src={`data:image/jpeg;base64,${userInfo.profilePicture}`} alt="" className="col-10 profileDash" />
                    </div>
                <h1 className="lead teksprimary text-center fw-bold mb-4">{userName}</h1>
                <p className="lead mb-1">Hi <span className="teksprimary">{userName}</span>! <br /> you are signed-<span className="teksprimary">In</span> as,</p>
                <p className="lead fw-bold teksprimary mb-4">{userEmail}<span className="lead">.</span></p>
                <hr />
                <Button variant='outline' href='/profile' className='btnBiru col-12 mb-2'>Admin <Icon.PersonFill className='icon'/></Button>
                <div className='py-5'>
                </div>
                </div>


          
                
        </div>

        <div className="col-7 px-5">
        <h1 className="display-6 mb-4">
                Welcome,<span className="fw-bold teksprimary"> Admin</span> 
            </h1>
            <hr />
            <div className="overflowContent pt-5">
                <div className="d-flex col-12 mb-5">

                <a className='linkprimary col-5 mx-auto' href="/adminAllUser">
                <div className="adminBox rounded-5 col-12 my-auto bg-white">
                                        <img src={users} alt="" className="col-12 rounded-5" />
                                    </div>
                                <p className="lead text-center">Manage user</p>    
                </a>

                <a className='linkprimary col-5 mx-auto' href="adminAllJobs">
                <div className="adminBox rounded-5 col-12 my-auto bg-white">
                                        <img src={jobsImg} alt="" className="col-12 rounded-5" />
                                    </div>
                                <p className="lead text-center">Manage jobs</p>    
                </a>


                </div>
                <div className="d-flex col-12 mb-5">

                    <a className='linkprimary col-5 mx-auto' href="/adminAllThreads">
                    <div className="adminBox rounded-5 col-12 my-auto bg-white">
                                            <img src={threadImg} alt="" className="col-12 rounded-5" />
                                        </div>
                                    <p className="lead text-center">Manage threads</p>    
                    </a>

                    <a className='linkprimary col-5 mx-auto' href="/adminAllComments">
                    <div className="adminBox rounded-5 col-12 my-auto bg-white">
                                            <img src={commentImg} alt="" className="col-12 rounded-5" />
                                        </div>
                                    <p className="lead text-center">Manage comments</p>    
                    </a>


                    </div>

                    <div className="d-flex col-12 mb-5">

                      <a className='linkprimary col-5 mx-auto' href="/adminAllActiveWorkers">
                      <div className="adminBox rounded-5 col-12 my-auto bg-white">
                                              <img src={workers} alt="" className="col-12 rounded-5" />
                                          </div>
                                      <p className="lead text-center">Manage Active Workers</p>    
                      </a>

                      <a className='linkprimary col-5 mx-auto' href="/adminAllMessages">
                      <div className="adminBox rounded-5 col-12 my-auto bg-white">
                                              <img src={messages} alt="" className="col-12 rounded-5" />
                                          </div>
                                      <p className="lead text-center">Manage Reports</p>    
                      </a>


                   </div>
                </div>
            

            
        </div>

        <div className="col-2 mx-auto my-auto ">
      <div className="loginBox p-4 my-3">
        <p className="lead fw-bold">Total users</p>
        <hr />
        <p className="display-6 fw-bold">{counts.users}<span className="lead"> user(s)</span></p>
      </div>
      <div className="loginBox p-4 my-3">
        <p className="lead fw-bold">Total jobs</p>
        <hr />
        <p className="display-6 fw-bold">{counts.jobs}<span className="lead"> job(s)</span></p>
      </div>
      <div className="loginBox p-4 my-3">
        <p className="lead fw-bold">Total threads</p>
        <hr />
        <p className="display-6 fw-bold">{counts.threads}<span className="lead"> thread(s)</span></p>
      </div>
      <div className="loginBox p-4 my-3">
        <p className="lead fw-bold">Total comments</p>
        <hr />
        <p className="display-6 fw-bold">{counts.comments}<span className="lead"> comment(s)</span></p>
      </div>
      
    </div>




</div>
)}


    </div>
)
}

export default DashboardComp;