import DashboardComp from "../component/dashboard";
import Header from "../component/header";

function DashboardPage(){
    return(
        <>
        <Header activePage={"dashboard"} />
        <DashboardComp />
        </>
    )
}
export default DashboardPage;