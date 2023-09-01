import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons'
import Swal from 'sweetalert2';
import EditUserModal from './adminUpdateUser';

const AdminAllUsersComponent = () => {
    const [usersData, setUsersData] = useState([]);
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData')); // Get user data from sessionStorage
    const token = sessionUser.token


    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleShowEditModal = (user) => {
        if ( user) {
            setSelectedUser(user);
            setShowEditModal(true);
        }
    };
    

    const headers = {
      Authorization: `Bearer ${token}`,
    };

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

    const handleDeleteUser = (userId) => {
        axios.delete(`http://localhost:8080/user/deleteUser/${userId}`, { headers })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'User deleted',
                    text: 'User deleted successfully',
                  });
                setUsersData(prevUsersData => prevUsersData.filter(user => user.userId !== userId));
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete user',
                  });
                console.error(error);
            });
    };
    const handleSuspendUser = (userId) => {
        axios.put(`http://localhost:8080/user/suspendUser/${userId}`, null, { headers })
            .then(response => {
                console.log(response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'User suspended',
                    text: 'User suspended successfully',
                });
                setUsersData(prevUsersData => prevUsersData.filter(user => user.userId !== userId));
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to suspend user',
                });
                console.error(error);
            });
    };

    const handleUnsuspendUser = (userId) => {
        axios.put(`http://localhost:8080/user/unSuspendUser/${userId}`, null, { headers })
            .then(response => {
                console.log(response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'User unsuspended',
                    text: 'User unsuspended successfully',
                });
                setUsersData(prevUsersData => prevUsersData.map(user => {
                    if (user.userId === userId) {
                        return { ...user, suspended: false };
                    }
                    return user;
                }));
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to unsuspend user',
                });
                console.error(error);
            });
    };
    
    

    return (
        <div>
            <div className="body">
            <h1 className="display-3 mb-4">Manage Users</h1>
            <br />
            <div className="overflowContent">
            {usersData.map(user => (
    // Check if roleId is 2 before rendering the user
                    user.roleId === 2 && user.suspended === false &&(
                        <div key={user.userId} className="aUser col-12">
                            <hr />
                            <div className='d-flex col-12'>
                                <div className="my-auto col-8">
                                    <p className="lead fw-bold">
                                    User ID: {user.userId}
                                    </p>
                                    <p className="lead mb-1 col-12"> {user.userName}</p>
                                </div>
                                <div className="col-4 my-auto">
                                    <Button variant='' className='btn btn-danger col-10 mx-auto mb-2' onClick={() => handleDeleteUser(user.userId)}>Delete <Icon.TrashFill className='mb-1' /></Button>
                                    <br />
                                    <Button variant='' className='btn btn-secondary col-10 mx-auto mb-2' onClick={() => handleSuspendUser(user.userId)}>Suspend <Icon.LockFill className='mb-1' /></Button>
                                    <br />
                                    <Button variant='' className='btnBiru col-10 mx-auto mb-2' onClick={() => handleShowEditModal(user)}>Edit  <Icon.Pencil className='mb-1' /></Button>
                                </div>
                            </div>
                        </div>
                    )
                ))}

                {selectedUser && <EditUserModal show={showEditModal} onHide={() => setShowEditModal(false)} selectedUser={selectedUser} />}
            </div>

            <br />
            <h1 className="display-3 mb-4">Suspended Users</h1>
            <br />
            <div className="overflowContent">
            {usersData.map(user => (
    // Check if roleId is 2 before rendering the user
                    user.roleId === 2 && user.suspended === true &&(
                        <div key={user.userId} className="aUser col-12">
                            <hr />
                            <div className='d-flex col-12'>
                                <div className="my-auto col-8">
                                    <p className="lead fw-bold">
                                    User ID: {user.userId}
                                    </p>
                                    <p className="lead mb-1 col-12"> {user.userName}</p>
                                </div>
                                <div className="col-4 my-auto">
                                    <Button variant='' className='btn btn-danger col-10 mx-auto mb-2' onClick={() => handleDeleteUser(user.userId)}>Delete <Icon.TrashFill className='mb-1' /></Button>
                                    <br />
                                    <Button variant='' className='btn btn-success col-10 mx-auto mb-2' onClick={() => handleUnsuspendUser(user.userId)}>Activate <Icon.Lock className='mb-1' /></Button>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
                </div>
        </div>
                
    );
};

export default AdminAllUsersComponent;
