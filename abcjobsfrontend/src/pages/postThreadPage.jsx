import Header from "../component/header";
import PostThread from "../component/postThread";

function PostThreadPage(){
    return(
        <>
        <Header activePage={"dashboard"} />
        <PostThread />
        </>
    )

}

export default PostThreadPage;