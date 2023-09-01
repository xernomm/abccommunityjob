import Header from "../component/header";
import ProfileComp from "../component/profileComp";

function Profile(){
    return(
        <>
        <Header activePage={"dashboard"} />
        <ProfileComp />
        </>
    )
}

export default Profile;