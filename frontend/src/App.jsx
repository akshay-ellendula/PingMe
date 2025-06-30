import { Link, Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OnBoarding from './pages/OnBoarding.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import PageLoading from './components/PageLoading.jsx'
import useAuthUser from './hooks/useAuthUser.js'
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
function App() {

  const { authUser, isLoading } = useAuthUser();

  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnboarded;


  if (isLoading) return <PageLoading />

  return (
    <>
      <div className="h-screen" data-theme={theme}>
        <Routes>
          <Route path="/"
            element={isAuthenticated && isOnBoarded ? <Layout showSidebar={true}> <HomePage /> </Layout> : <Navigate to={!isAuthenticated ? "/signup" : "/onBoarding"} />} />
          <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnBoarded ? "/onBoarding" : "/"} />} />
          <Route path="/onBoarding" element={isAuthenticated ? (isOnBoarded ? <Navigate to="/" /> : <OnBoarding />) : <Navigate to="/login" />} />
          <Route path="/notifications" element={isAuthenticated && isOnBoarded ? <Layout showSidebar={true}>  <NotificationsPage /></Layout> : <Navigate to={isAuthenticated ? '/onBoarding' : '/login'} />} />
          <Route path="/chat/:id" element={isAuthenticated ? <Layout showSidebar={true}> <ChatPage /></Layout> : <Navigate to="/login" />} />
          <Route path="/call/:id" element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
