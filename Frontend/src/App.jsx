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
import ResultPage from './pages/election/Result'
// import PageLoader from './components/PageLoading'

export const server = "http://localhost:3000/api/user"
export const electionServer = "http://localhost:3000/api/election"

function App() {
  const {isAuth} = UserData();

  return (  
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/dashboard" element={isAuth ? <HomePage/> : <VotingDashboard/>} />
          <Route path="/login" element={isAuth ? <HomePage/> :<LoginPage/>} />
          <Route path="/register" element={isAuth ? <HomePage/> : <RegisterPage/>} />

          <Route path="/elections" element={<ElectionsPage/>}/> 
          <Route path="/create-election" element={<CreateElection/>} />
          <Route path="/result" element={<ResultPage/>} />
          
          {/* <Route path="/loading" element={<PageLoader/>} /> */}
        </Routes>
      </Router>
  )
}

export default App
