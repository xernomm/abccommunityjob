import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import profil from '../img/profile.jpg'
import axios from 'axios';

const AllUsersComponent = () => {
    const [usersData, setUsersData] = useState([]);
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData')); // Get user data from sessionStorage
    const token = sessionUser.token

    const headers = {
      Authorization: `Bearer ${token}`,
    };

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

    return (
        <div>
                {usersData.map(user => (
                    user.roleId === 2 && user.email !== userEmail && (
                        <div  key={user.userId} className="aUser col-12">
                        <hr />
                        <div className=' d-flex col-12'>
                            {user.profilePicture && (
                            <img src={`data:image/jpeg;base64,${user.profilePicture}`} alt="" className="col-6 mightKnow my-auto" />
                            )}
                            {!user.profilePicture && (
                            <img src={profil} alt="" className="col-6 mightKnow my-auto" />
                            )}
                            <div className="my-auto ms-4 col-6">
                             <p className="fw-bold mb-1">{user.userName}</p>
                             <Button variant='outline' href={`/profile/${user.userId}`} className='btnPrimary col-10'><small>View profile</small></Button>
                            </div>
                         </div>
                     </div>
                    )
                ))}
        </div>
                
    );
};

export default AllUsersComponent;
