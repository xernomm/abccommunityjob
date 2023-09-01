import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import axios from "axios";
import Swal from "sweetalert2";

function AdminAllCommentsComponent() {
  const [comments, setComments] = useState([]);
  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get("http://localhost:8080/user/all-comments", { headers })
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDeleteComment = (commentId) => {
    axios.delete(`http://localhost:8080/user/deleteComment/${commentId}`, { headers })
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
            setComments(prevUsersData => prevUsersData.filter(comment => comment.commentId !== commentId));
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
    <div className="body">
      <h1 className="display-3 mb-4">Manage Comments</h1>
            <br />
      <div className="overflowContent px-4">
        {comments.map((comment) => (
          <div key={comment.commentId} className="comment">
            <hr />
            <div className="d-flex col-12">
              <div className="col-6">
                <p className="lead fw-bold">Comment ID: {comment.commentId}</p>
                <p className="lead">"{comment.comment}"</p>
                <p className="lead"><span className="fw-bold">Uploaded by:</span> {comment.user.userName},<br /> <span className="fw-bold">User ID:</span> {comment.user.userId}</p>

              </div>
              <div className="col-3 my-auto">
                <p className="lead fw-bold">Thread ID: {comment.threadEntity.threadId}</p>
              </div>
              <div className="col-3 d-flex justify-content-center">
                <Button variant="" className="btn-danger col-6 my-auto" onClick={() => handleDeleteComment(comment.commentId)}>
                  Delete <Icon.Trash className="mb-1"/>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminAllCommentsComponent;
