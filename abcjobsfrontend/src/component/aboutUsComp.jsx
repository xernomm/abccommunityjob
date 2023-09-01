import richie from '../img/richie.png'

function AboutUsComp(){
    return(
        <div className="body">
            <br />
            <br />
            <div className="col-12 d-flex justify-content-center">
                <div className="col-5 my-auto">
                    <p className="display-1 mb-3">
                        What is <span style={{fontSize:"70px"}} className="teksprimary fw-bold">AJ. Job Portal</span>?
                    </p>
                </div>
                <div className="col-5 my-auto">
                    <p className="lead">
                    <span className="fw-bold teksprimary">AJ. Job Portal</span> or known as <span className="fw-bold teksprimary">ABC JOBS Job Portal</span>, is a versatile online platform that combines job searching and community engagement. It offers job seekers an intuitive interface to discover diverse job opportunities and allows them to connect directly with employers. <br /><br /> The portal hosts discussion forums, career advice blogs, and webinars to create a thriving professional community. For employers, it provides a space to post jobs, review candidate profiles, and engage in industry conversations. ABC Job Portal is where careers and connections converge.
                    </p>
                </div>
            </div>
            <hr />
            <div className="col-12 d-flex justify-content-center mt-5">
                
                <div className="col-5 my-auto">
                    <h1 className="display-4 teksprimary mb-4">
                        Developer
                    </h1>
                    <p class="lead">Introducing <span class="fw-bold teksprimary">Rafael Richie</span>, a dedicated student at Lithan Academy Singapore who conceptualized and developed this fully functional job portal website. His involvement spanned from meticulously crafting the back-end to intricately designing the front-end of this platform.
                    <br /><br /><span class="fw-bold teksprimary">Rafael Richie</span> embarked on this remarkable journey while being a committed student at Lithan Academy. In his capacity as the principal developer, his aspirations are aimed at the potential global utility of this website.
                    </p>

                </div>
                <div className="col-5 px-5 my-auto">
                    <img src={richie} alt="" className="col-12 aboutImg" />
                </div>
            </div>
        </div>
    )
}

export default AboutUsComp;