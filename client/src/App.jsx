import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} /> 
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path='/search' element={<Search />} />
            <Route element={<PrivateRoute/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<OnlyAdminPrivateRoute/>}>
              <Route path='/create-post' element={<CreatePost/>}/>
              <Route path='/update-post/:postId' element={<UpdatePost/>}/>
            </Route>
            <Route path="/projects" element={<Projects />} />
            <Route path='/post/:postSlug' element = {<PostPage/>}/>
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}