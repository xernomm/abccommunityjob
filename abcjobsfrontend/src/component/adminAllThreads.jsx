import profil from '../img/profile.jpg';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const AdminAllThreads = () => {
  const [threads, setThreads] = useState([]);
  const [likedThreads, setLikedThreads] = useState({});
  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;
  const [commentCounts, setCommentCounts] = useState({});
  const [usersData, setUsersData] = useState([]);



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



// ... (previous code)

return (

    <div className="body">
        <h1 className="display-3 mb-4">Manage Threads</h1>
            <br />
    <div className="threadList overflowContent px-4">
      {threads.map(thread => (
        <div key={thread.threadId} className="thread d-flex">

          <div className="col-2 my-auto px-4">
            <p className="lead fw-bold text-dark">Thread ID : {thread.threadId}</p>
            <small className=" text-muted text-center ">{formatDistanceToNow(new Date(thread.threadDate), { addSuffix: true })}</small>
          </div>

         <div className="col-4 px-4 my-auto">
         <p className="lead fw-bold text-dark">{thread.user.userName}</p>
<hr />
            <h1 className="lead fw-bold">
              {thread.threadHeader}
            </h1>
            <p className="lead">
              {thread.threadBody}
            </p>

         </div>

         <div className="col-3 px-2 my-auto">
         {thread.threadImage && (
          <div className="threadImage">
            <img className='col-12 rounded-4' src={`data:image/jpeg;base64,${thread.threadImage}`} alt="Thread" />
          </div>
        )}
         </div>

         <div className="col-2 my-auto ms-5">
            <Button variant='' className='btn-danger col-12' onClick={() => handleDeleteThread(thread.threadId)}>Delete <Icon.Trash className='mb-1' /></Button>
         </div>


        </div>
      ))}
    </div>
    </div>

  );
  

}

export default AdminAllThreads;
