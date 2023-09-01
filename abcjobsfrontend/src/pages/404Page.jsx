import NotFoundComp from "../component/404Comp"
import Header from "../component/header"

function NotFoundPage(){
    return(
        <>
        <Header activePage={""} />
        <NotFoundComp />
        </>
    )
}

export default NotFoundPage;