import Header from "../component/header";
import Landing from "../component/landing";

function LandingPage(){
    return(
        <>
        <Header activePage={"/"} />
        <Landing />
        </>
    )
}
export default LandingPage;