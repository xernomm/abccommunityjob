import React, { useEffect, useState, useMemo } from 'react';
import profil from '../img/profile.jpg';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns';


const CommentSection = () => {
  const { threadId } = useParams();
  const [selectedThread, setSelectedThread] = useState(null);
  const [newComment, setNewComment] = useState("");
  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [commentReplies, setCommentReplies] = useState({}); 
  const [commentRepliesCount, setCommentRepliesCount] = useState({});

  const toggleReplyForm = (commentId) => {
    setShowReplyForm(prevCommentId => {
      if (prevCommentId === commentId) {
        return null; // Hide the form if it's already shown
      } else {
        return commentId; // Show the form for the selected comment
      }
    });
  };
  const toggleRepliesList = (commentId) => {
    if (visibleReplies.includes(commentId)) {
      setVisibleReplies(visibleReplies.filter(id => id !== commentId));
    } else {
      setVisibleReplies([...visibleReplies, commentId]);
    }
  };
  
  const headers = useMemo(() => {
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const fetchThreadData = async () => {
    try {
      const threadResponse = await axios.get(`http://localhost:8080/user/thread/${threadId}`, { headers });
      console.log(threadResponse.data)
      setSelectedThread(threadResponse.data);
  
      const repliesPromises = threadResponse.data.comments.map(comment => {
        return axios.get(`http://localhost:8080/user/comments/${threadId}/${comment.commentId}/replies`, { headers });

      });

  
      const repliesResponses = await Promise.all(repliesPromises);
      const repliesObj = {};
      
      repliesResponses.forEach((response, index) => {
        const commentId = threadResponse.data.comments[index].commentId;
        repliesObj[commentId] = response.data;
      });
  
      setCommentReplies(repliesObj);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCommentRepliesCount = async () => {
      if (selectedThread && selectedThread.comments) {
        const commentIds = selectedThread.comments.map(comment => comment.commentId);
        const counts = {};
  
        await Promise.all(
          commentIds.map(async commentId => {
            try {
              const response = await axios.get(`http://localhost:8080/user/replies/${commentId}/count`, { headers });
              counts[commentId] = response.data;
              console.log(response.data)
            } catch (error) {
              console.error(error);
              counts[commentId] = 0; // Default count to 0 in case of an error
            }
          })
        );
  
        setCommentRepliesCount(counts);
      }
    };
  
    fetchCommentRepliesCount();
  }, [selectedThread, headers]);
  

  
  
  
  

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    if(newComment === ""){
      Swal.fire({
        icon: 'error',
        title: 'Enter a comment',
        text: 'Please enter a comment before sending',
      });
      return
    }

    const commentData = {
      threadComment: newComment,
    };

    axios.put(`http://localhost:8080/user/${userEmail}/comment/${threadId}`, commentData, { headers })
      .then(response => {

        fetchThreadData();
        setNewComment(""); // Clear the input field
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    const user = sessionStorage.getItem('loginFormData');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserEmail(parsedUser.email);
      setUserName(parsedUser.name)
    }
  }, []);

  useEffect(() => {
    fetchThreadData();
  }, [threadId]);

  const handleCommentReply = (event, commentId) => {
    event.preventDefault();
  
    if (replyText === "") {
      Swal.fire({
        icon: 'error',
        title: 'Enter a reply',
        text: 'Please enter a reply before sending',
      });
      return;
    }
  
    const replyData = {
      commentReply: replyText,
    };
  
    axios.put(`http://localhost:8080/user/${userEmail}/reply/${commentId}`, replyData, { headers })
      .then(response => {
        fetchThreadData();
        setReplyText(""); // Clear the reply input field
      })
      .catch(error => {
        console.error(error);
      });
  };
  

  if (!selectedThread) {
    return <div>Loading...</div>;
  }

  
  return (
    <div className="body">
      <div className="d-flex justify-content-center">
        <div className="col-7 px-2 container lines">
            <p className="lead">Uploaded by</p>
          <div className="col-12 d-flex">
            <img src={profil} alt="" className="mightKnow col-2" />
            <p className="lead fw-bold text-dark my-auto mx-3 col-7">{selectedThread.thread.user.userName}</p>
            <small className="text-muted my-auto text-center lead col-4">{formatDistanceToNow(new Date(selectedThread.thread.threadDate), { addSuffix: true })}</small>
            {/*  */}
          </div>
         <hr />
  <div className="col-10 mx-auto">
  <div className='mx-auto'>
  <div className="mt-5">
            <h1 className="display-6 fw-bold mb-4">
              {selectedThread.thread.threadHeader}
            </h1>
          </div>
          <div className="my-3 d-flex justify-content-center">
            <img src={`data:image/jpeg;base64,${selectedThread.thread.threadImage}`} alt="" className="col-12 rounded-5" />
            {/*  */}
          </div>
          <div className="mb-5">
            <p className="lead">
              {selectedThread.thread.threadBody}
            </p>
            <p className="lead linkprimary mt-3">
            {selectedThread.thread.hashtags}
            </p>
          </div>
  </div>

  </div>



          <br />
          <br />
 


        </div>
        <div className="col-5 ms-4 px-2 pt-5">
        <div className="comments ">
            <p className="display-6">Comments</p>
            <br />
            <div className="col-12  d-flex justify-content-center">
                <div className="col-12 mx-auto">
                <p className="">Commenting as <span className='fw-bold teksprimary'>{userName}</span>.</p>

                <Form className='col-12 d-flex ' onSubmit={handleCommentSubmit}>
                <Form.Floating className='col-9'>
                  <Form.Control
                    type="text"
                    id="comment"
                    name="comment"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <label htmlFor="comment">Add a comment...</label>
                </Form.Floating>
                <Button type='submit' variant='' className='col-2 mx-1 btnPrimary'><Icon.SendFill className='mb-1' /></Button>
              </Form>
                </div>

            </div>
            <div className="overflowContent mt-5">
              
              {selectedThread.comments.map(comment => (
                <div key={comment.commentId} className="comment">
                    <hr />
                  <div className="commentHeader d-flex p-2">
                    <img src={profil} alt="" className="mightKnow col-2" />
                    <p className=" fw-bold text-dark my-auto mx-3 col-7">{comment.user.userName}</p>
                  </div>
                  <div className="commentBody pt-1 px-4">
                    <p className="">{comment.comment}</p>
                    <div className="d-flex mt-2">
                      <div className="col-6">
                        <div className={`${visibleReplies.includes(comment.commentId) ? 'visible' : 'hidden'}`}>
                        <Form className="d-flex" onSubmit={(e) => handleCommentReply(e, comment.commentId)}>
                    <Form.Floating  className="col-12">
                      <Form.Control 
                        type="text"
                        placeholder="Add reply..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                       
                      />
                      <label>Add reply...</label>
                    </Form.Floating>

                  </Form>
                        </div>

                      </div>
                   
                  <div className="col-6 d-flex justify-content-end">
                  <a className="linkprimary ms-2" onClick={() => toggleRepliesList(comment.commentId)}>
                    Reply
                  </a>
                  <a  className="linkprimary text-secondary mx-2 " onClick={() => toggleRepliesList(comment.commentId)}>
                    Replies {visibleReplies.includes(comment.commentId) ? <Icon.CaretUpFill /> : <Icon.CaretDownFill />} ({commentRepliesCount[comment.commentId] || 0})
                  </a>
                  </div>
                    </div>

                    <div className={`px-2 replyComments mt-3 ${visibleReplies.includes(comment.commentId) ? 'visible' : 'hidden'}`}>
                      {commentReplies[comment.commentId]?.map(reply => (
                      <div key={reply.commentReplyId} className="reply">
                        <br />
                        <div className='d-flex'>
                          <img src={profil} alt="" className="mightKnow col-2" />
                          <p className=" ms-2 my-auto">{reply.user.userName}</p>
                        </div>
                        {/* Display reply content */}
                        <p className=" my-3 ms-4"><span className="teksprimary fw-bold">@{reply.threadComments.user.userName} </span>{reply.commentReply}</p>
                        {/* Additional reply details if needed */}
                      </div>
                    ))}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommentSection;
