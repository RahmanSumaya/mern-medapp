import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Account from './pages/Account';
import Signup from './pages/Signup';
import Login from './pages/Login'; 
import AdminDashboard from './pages/AdminDashboard';
import HealthLibrary from './pages/HealthLibrary';
import ArticleDetail from './pages/ArticleDetail';
import AllDoctors from './pages/AllDoctors';
import BookAppointment from './pages/BookAppointment';
import DoctorDetails from './pages/DoctorDetails';
import PatientDashboard from './pages/PatientDashboard'; 
import DoctorDashboard from './pages/DoctorDashboard'; 
import Chatbot from './pages/Chatbot'; 
import DatasetLibrary from './pages/datasetLibrary';
import DoctorPatientView from './pages/DoctorPatientView';
import PatientRecords from './pages/PatientRecords';

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Get role saved during login

  if (!token) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required and user doesn't have it, send them home
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/library" element={<HealthLibrary />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/all-doctors" element={<AllDoctors />} />
        <Route path="/account" element={<Account/>} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/datasets" element={<DatasetLibrary />} />
        <Route path="/doctor/patient-history/:patientId" element={<DoctorPatientView />} />
        <Route path="/patientRecords" element={<PatientRecords/>} />
        <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
        {/* Patient Only Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRole="user">
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chatwithai" 
          element={
            <ProtectedRoute allowedRole="user">
              <Chatbot />
            </ProtectedRoute>
          } 
        />
        {/* Doctor Only Routes */}
        <Route 
          path="/dashboard_doctor" 
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Admin Only Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;