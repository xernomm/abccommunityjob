import Header from "../component/header";
import LoginOrRegis from "../component/loginOrRegis";

function GetStarted(){
    return(
        <>
        <Header activePage={""} />
        <LoginOrRegis />
        </>
    )
}

export default GetStarted;