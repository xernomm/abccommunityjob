import AboutUsComp from "../component/aboutUsComp";
import Header from "../component/header";

function AboutUsPage(){
    return(
        <>
        
        <Header activePage={"about-us"} />
        <AboutUsComp />
        </>
    )
}

export default AboutUsPage;