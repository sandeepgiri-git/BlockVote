import VotingDashboard from './pages/Dashboard'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/Home'
import { UserData } from './contexts/UserContext'
import CreateElection from './pages/election/ElectionPage'
import ElectionsPage from './pages/election/ElectionList'
import PageLoader from './components/PageLoading'
import { ElectionData } from './contexts/ElectionContext'
// import PageLoader from './components/PageLoading'

export const server = "http://localhost:3000/api/user"
export const electionServer = "http://localhost:3000/api/election"

function App() {
  const {isAuth} = UserData();
  const {isLoading} = ElectionData();

  return (  
      <Router>
        <Routes>
          <Route path="/" element={isAuth ? <HomePage/> : <PageLoader/>} />
          <Route path="/dashboard" element={isAuth ? <HomePage/> : <VotingDashboard/>} />
          <Route path="/login" element={isAuth ? <HomePage/> :<LoginPage/>} />
          <Route path="/register" element={isAuth ? <HomePage/> : <RegisterPage/>} />

          <Route path="/elections" element={isLoading ? <PageLoader/> : <ElectionsPage/>}/> 
          <Route path="/create-election" element={<CreateElection/>} />
          
          {/* <Route path="/loading" element={<PageLoader/>} /> */}
        </Routes>
      </Router>
  )
}

export default App
