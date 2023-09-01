import { useParams } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react'
import PublicProfileComp from '../component/publicProfileComponent';
import Header from '../component/header';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;
  
          const headers = {
            Authorization: `Bearer ${token}`,
          };

    axios.get(`http://localhost:8080/user/find/${userId}`, { headers })
      .then(response => {
        setSelectedUser(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [userId]);

  if (!selectedUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Header activePage={"dashboard"} />
      <PublicProfileComp selectedUser={selectedUser} />
    
    </>
  );
};

export default PublicProfilePage;