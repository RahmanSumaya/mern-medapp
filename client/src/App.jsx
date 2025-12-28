import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Account from './pages/Account';
import Signup from './pages/Signup';
import Login from './pages/Login'; 
import AdminDashboard from './pages/AdminDashboard';
import HealthLibrary from './pages/HealthLibrary';
import ArticleDetail from './pages/ArticleDetail';
import AllDoctors from './pages/AllDoctors';
import PatientDashboard from './pages/PatientDashboard'; // <--- ADD THIS LINE
import DoctorDashboard from './pages/DoctorDashboard'; // <--- ADD THIS LINE
import ChatBot from './pages/ChatBot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/all-doctors" element={<AllDoctors />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/dashboard_doctor" element={<DoctorDashboard />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/library" element={<HealthLibrary />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/aichatbot" element={<ChatBot/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;