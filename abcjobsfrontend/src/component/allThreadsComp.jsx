import profil from '../img/profile.jpg';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Swal from 'sweetalert2';


const AllThreads = ({ searchResults }) => {
  const [threads, setThreads] = useState([]);
  const [likedThreads, setLikedThreads] = useState({});
  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;
  const [commentCounts, setCommentCounts] = useState({});
  const [usersData, setUsersData] = useState([]);

  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const[roleId, setRoleId] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem('loginFormData');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserEmail(parsedUser.email);
      setUserName(parsedUser.name)
      setRoleId(parsedUser.roleId)
    }
  }, []);


  const headers = {
    Authorization: `Bearer ${token}`,
  };

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


return (
    <div className="threadList">
      {threads.map(thread => (
        <div key={thread.threadId} className="thread mb-5">
          <div className="headerThread mb-3 d-flex">
            <img src={profil} alt="" className="mightKnow col-2" />
            <p className="lead fw-bold text-dark my-auto mx-3 col-7">{thread.user.userName}</p>
            <small className=" text-muted text-center my-auto ">{formatDistanceToNow(new Date(thread.threadDate), { addSuffix: true })}</small>

          </div>

         
          <br />
          <div className="headerThread d-flex">

            <h1 className="lead fw-bold mb-3 col-9">
              {thread.threadHeader}
            </h1>

            {thread.user.email === userEmail && (
              <div className="d-flex col-3">
            <Link to={`/editThread/${thread.threadId}`} className="linkprimary col-6">
            <Icon.PencilFill className="lead text-center" />
            </Link>

            <Link onClick={() => handleDeleteThread(thread.threadId)} className="btn-danger col-6">
            <Icon.Trash2Fill className="lead text-center" />
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
  );
  

}

export default AllThreads;
