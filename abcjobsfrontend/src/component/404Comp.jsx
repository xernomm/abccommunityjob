function NotFoundComp(){
    return(
        <div className="body my-auto mx-auto">
            <h1 className="text-center display-3 mb-3">404</h1>
            <hr />
            <p className="display-6 text-center mb-3">Page not found.</p>
            <p className="text-center">
            <a href="/" className="linkprimary lead mx-auto text-center">Return to home</a>

            </p>
            <div style={{paddingBottom:"200px"}}></div>
        </div>
    )
}
export default NotFoundComp;