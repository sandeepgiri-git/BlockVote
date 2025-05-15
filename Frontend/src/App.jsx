import VotingDashboard from './pages/Dashboard'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/Home'
import { UserData } from './contexts/UserContext'
import CreateElection from './pages/election/ElectionPage'
import ElectionsPage from './pages/election/ElectionList'
import ResultPage from './pages/election/Result'
import CompletedElectionSummary from './pages/election/SingleElection'
import { ElectionData } from './contexts/ElectionContext'
// import PageLoader from './components/PageLoading'

export const server = "http://localhost:3000/api/user"
export const electionServer = "http://localhost:3000/api/election"

function App() {
  const {isAuth} = UserData();
  const {isWalletConnected} = ElectionData();

  return (  
      <Router>
        <Routes>
          <Route path="/" element={isAuth ? <HomePage/> : <LoginPage/>} />
          <Route path="/dashboard" element={isAuth ? <HomePage/> : <VotingDashboard/>} />
          <Route path="/login" element={isAuth ? <HomePage/> :<LoginPage/>} />
          <Route path="/register" element={isAuth ? <HomePage/> : <RegisterPage/>} />

          <Route path="/elections" element={isAuth && <ElectionsPage/>}/> 
          <Route path="/create-election" element={isAuth ? <CreateElection/>  : <LoginPage/>} />
          <Route path="/result" element={isAuth ? <ResultPage/> : <LoginPage/>} />
          <Route path="/result/:id" element={isAuth ?<CompletedElectionSummary/>  : <LoginPage/>} />
          
          {/* <Route path="/loading" element={<PageLoader/>} /> */}
        </Routes>
      </Router>
  )
}

export default App
