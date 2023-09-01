import AllMessageAdmin from "../component/allMessage";
import Header from "../component/header";
import React, { useEffect, useState } from 'react';
import NotFoundPage from "./404Page";

function AdminAllMessagesPage(){
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [roleId, setRoleId] = useState(null);
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        const user = sessionStorage.getItem('loginFormData');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserEmail(parsedUser.email);
          setUserName(parsedUser.name)
          setRoleId(parsedUser.roleId)
        }
      }, []);


    return(
        <>
        {roleId === 1 && (
        <div>
        <Header activePage={"adminAllMessages"} />
        <AllMessageAdmin />
        </div>
        )}
        {roleId === 2 && (
                <div>
                    <NotFoundPage />
                </div>
        )}

        </>
    )
}

export default AdminAllMessagesPage;