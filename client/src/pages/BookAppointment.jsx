import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableDates, setAvailableDates] = useState([]);

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toISOString().split('T')[0], 
        display: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
      });
    }
    setAvailableDates(dates);

    const fetchDoc = async () => {
      const res = await axios.get(`http://localhost:5000/api/admin/doctor/${doctorId}`);
      setDoctor(res.data);
    };
    fetchDoc();
  }, [doctorId]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return alert("Please select date and time");
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/appointments/book', 
        { doctorId, date: selectedDate, time: selectedTime },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert("Request sent to doctor! Please wait for approval.");
      navigate('/my-appointments');
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (!doctor) return <div className="p-10 text-center">Loading Doctor Details...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-white">
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <div className="flex items-center gap-3 mt-4">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><User /></div>
             <div>
               <p className="font-bold text-lg leading-none">{doctor.name}</p>
               <p className="text-indigo-100 text-sm">{doctor.specialization}</p>
             </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* DATE SELECTION */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 font-bold mb-4"><Calendar size={18}/> Select Date</label>
            <div className="grid grid-cols-3 gap-2">
              {availableDates.map((date) => (
                <button
                  key={date.full}
                  onClick={() => setSelectedDate(date.full)}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                    selectedDate === date.full ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {date.display}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-slate-700 font-bold mb-4"><Clock size={18}/> Select Time</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                    selectedTime === slot ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl flex gap-3 border border-amber-100">
            <AlertCircle className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 italic">
              After booking, the doctor must approve your request before you can proceed to payment.
            </p>
          </div>

          <button 
            onClick={handleBooking}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
          >
            CONFIRM REQUEST
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;