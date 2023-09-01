import ContactUsComp from "../component/contactUsComp";
import Header from "../component/header";

function ContactUsPage(){
    return(
        <div className="body">
            <>
            <Header activePage={"contact-us"} />
            <ContactUsComp />
            </>
        </div>
    )
}

export default ContactUsPage;