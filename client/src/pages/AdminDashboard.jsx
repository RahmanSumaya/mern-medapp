// Add 'Calendar' to your lucide-react imports at the top
import { UserPlus, BookOpen, LogOut, LayoutDashboard, Calendar, CheckCircle } from 'lucide-react';
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    DoctorApproved: "bg-blue-100 text-blue-700 border-blue-200",
    Paid: "bg-purple-100 text-purple-700 border-purple-200",
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

// Usage in your list:
// <td><StatusBadge status={app.status} /></td>
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  // ... (keep your existing logout logic)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 text-indigo-400">MedConnect Admin</div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === 'overview' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /> Overview
          </button>
          {/* NEW TAB FOR APPOINTMENTS */}
          <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === 'appointments' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <Calendar size={20} /> Appointments
          </button>
          <button onClick={() => setActiveTab('doctor')} className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === 'doctor' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <UserPlus size={20} /> Add Doctor
          </button>
          <button onClick={() => setActiveTab('article')} className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === 'article' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <BookOpen size={20} /> Create Article
          </button>
        </nav>
        {/* ... (keep logout) */}
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && <OverviewStats />}
        {activeTab === 'appointments' && <AdminAppointmentManager />}
        {activeTab === 'doctor' && <AddDoctorForm />}
        {activeTab === 'article' && <AddArticleForm />}
      </div>
    </div>
  );
};

// --- NEW SUB-COMPONENT: ADMIN APPOINTMENT MANAGER ---
const AdminAppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/appointments/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    };
    fetchAll();
  }, []);

  const handleAdminConfirm = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/appointments/admin-confirm/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Payment Verified & Appointment Confirmed!");
      setAppointments(appointments.map(app => app._id === id ? { ...app, status: 'Confirmed' } : app));
    } catch (err) {
      alert("Verification failed. Ensure status is 'Paid'");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Global Appointment Manager</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-slate-400 text-sm">
              <th className="pb-3">Patient</th>
              <th className="pb-3">Doctor</th>
              <th className="pb-3">Date/Time</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {appointments.map(app => (
              <tr key={app._id} className="border-b last:border-0">
                <td className="py-4 font-medium">{app.patient?.name}</td>
                <td className="py-4">{app.doctor?.name}</td>
                <td className="py-4 text-sm">{app.date} at {app.time}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Paid' ? 'bg-blue-100 text-blue-600' : 
                    app.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-4">
                  {app.status === 'Paid' && (
                    <button 
                      onClick={() => handleAdminConfirm(app._id)}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700"
                    >
                      <CheckCircle size={14} /> Confirm Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};