import logo from './logo.svg';
import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Footer from './component/footer';
import React from 'react';
// import './css/style.css'
import './css/responsive.css'
import GetStarted from './pages/getStarted';
import LoginPage from './pages/loginOnly';
import ForgotPasswordPage from './pages/forgotPasswordPage';
import DashboardPage from './pages/dashboardPage';
import Profile from './pages/profile';
import CommentPage from './pages/commentPage';
import CommentSection from './component/commentSection';
import PostThreadPage from './pages/postThreadPage';
import JobPage from './pages/jobPage';
import PostJob from './pages/postJob';
import NotFoundPage from './pages/404Page';
import AdminAllUserPage from './pages/adminAllUserPage';
import AdminAllJobsPage from './pages/adminAllJobsPage';
import AdminAllThreadsPage from './pages/adminAllThreadsPage';
import AdminAllCommentsPage from './pages/adminAllCommentsPage';
import EditThreadPage from './pages/editThreadPage';
import PublicProfilePage from './pages/publicProfilePage';
import AdminActiveWorkers from './pages/adminActiveWorkersPage';
import AboutUsPage from './pages/aboutUsPage';
import ContactUsPage from './pages/contactUs';
import AdminAllMessagesPage from './pages/adminAllMessages';



function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />}/>
        <Route path='/*' element={<NotFoundPage />}/>
        <Route path='/home' element={<LandingPage />}/>
        <Route path='/getStarted' element={<GetStarted />}/>
        <Route path='/about-us' element={<AboutUsPage />}/>
        <Route path='/contact-us' element={<ContactUsPage />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/forgotPassword' element={<ForgotPasswordPage />}/>
        <Route path='/dashboard' element={<DashboardPage />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/jobs' element={<JobPage />}/>
        <Route path="/comment/:threadId" element={<CommentPage />} />
        <Route path="/postThread" element={<PostThreadPage />} />
        <Route path="/editThread/:threadId" element={<EditThreadPage />} />
        <Route path="/postJob" element={<PostJob />} />
        <Route path="/profile/:userId" element={<PublicProfilePage />} />



        {/* ADMIN */}
        <Route path="/adminAllUser" element={<AdminAllUserPage />} />
        <Route path="/adminAllJobs" element={<AdminAllJobsPage />} />
        <Route path="/adminAllThreads" element={<AdminAllThreadsPage />} />
        <Route path="/adminAllComments" element={<AdminAllCommentsPage />} />
        <Route path="/adminAllActiveWorkers" element={<AdminActiveWorkers />} />
        <Route path="/adminAllMessages" element={<AdminAllMessagesPage />} />
      </Routes>
    <Footer />

    </>
  );
}

export default App;
