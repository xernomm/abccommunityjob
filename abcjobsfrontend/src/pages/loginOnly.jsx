import Header from "../component/header";
import LoginForm from "../component/loginForm";

function LoginPage(){
    return(
        <>
        <Header activePage={""} />
        <LoginForm />
        </>
    )
}

export default LoginPage;