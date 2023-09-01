import Header from "../component/header"
import Jobs from "../component/jobs"

function JobPage(){
    return(
        <>
        <Header activePage={""} />
        <Jobs />
        </>
    )
}

export default JobPage;