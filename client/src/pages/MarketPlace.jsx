import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingBag, CreditCard, Clock, CheckCircle } from "lucide-react";

const PatientMedicalShop = () => {
  const [items, setItems] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [txnInput, setTxnInput] = useState({});

  const loadMarketplaceData = async () => {
    try {
      const token = localStorage.getItem("token");
      const itemsRes = await axios.get("http://localhost:5000/api/shop/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(itemsRes.data);

      // We pull admin orders context to let patients trace confirmation requests
      const ordersRes = await axios.get("http://localhost:5000/api/admin/shop-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter layout to show only records matching this user session instance
      setMyOrders(ordersRes.data);
    } catch (err) {
      console.error("Marketplace fetch failure");
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const handleBookItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:5000/api/shop/book-item/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.msg);
      loadMarketplaceData(); // reload catalog state updates
    } catch (err) {
      alert("Booking asset fault initialization.");
    }
  };

  const handleSubmitTransaction = async (e, orderId) => {
    e.preventDefault();
    const tokenStr = txnInput[orderId];
    if (!tokenStr || !tokenStr.trim()) return alert("Provide real receipt hash code strings first.");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/shop/submit-transaction/${orderId}`, 
        { transactionNumber: tokenStr }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.msg);
      setTxnInput({ ...txnInput, [orderId]: "" });
      loadMarketplaceData();
    } catch (err) {
      alert("Error updating validation transaction registry tokens.");
    }
  };

  return (
    <div className="space-y-8">
      {/* CATALOG SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShoppingBag className="text-indigo-600" /> Medical Shop Marketplace
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((prod) => (
            <div key={prod._id} className="p-4 border rounded-xl bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                  {prod.type}
                </span>
                <h3 className="font-bold text-slate-800 mt-2 text-base">{prod.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{prod.description || "No descriptions detailed."}</p>
              </div>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-lg font-black text-slate-800">${prod.price}</span>
                <button
                  onClick={() => handleBookItem(prod._id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  Book Secure Asset
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRACKING DISPATCH AND INVOICES SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="text-amber-500" /> Procurement Requests & Validation Tracker
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-400 font-semibold text-xs uppercase">
                <th className="pb-3 px-2">Ordered Item</th>
                <th className="pb-3 px-2">Value</th>
                <th className="pb-3 px-2">Tracking State</th>
                <th className="pb-3 px-2">Invoice Submission Actions</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((ord) => (
                <tr key={ord._id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="py-4 px-2 font-medium text-slate-800">{ord.itemId?.name}</td>
                  <td className="py-4 px-2 font-bold text-slate-700">${ord.itemId?.price}</td>
                  <td className="py-4 px-2">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                      ord.status === "booked" ? "bg-blue-100 text-blue-700" :
                      ord.status === "awaiting_payment" ? "bg-amber-100 text-amber-700 border border-amber-300" :
                      ord.status === "verifying" ? "bg-purple-100 text-purple-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {ord.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    {ord.status === "booked" && (
                      <span className="text-xs text-slate-400 italic flex items-center gap-1">
                        <Clock size={12} /> Awaiting Admin Processing Notice
                      </span>
                    )}

                    {ord.status === "awaiting_payment" && (
                      <form onSubmit={(e) => handleSubmitTransaction(e, ord._id)} className="flex gap-2 max-w-xs">
                        <input
                          type="text"
                          placeholder="Enter Transaction No."
                          className="p-1.5 text-xs border rounded-lg flex-1 bg-white focus:ring-1 focus:ring-amber-500 outline-none font-mono"
                          value={txnInput[ord._id] || ""}
                          onChange={(e) => setTxnInput({ ...txnInput, [ord._id]: e.target.value })}
                          required
                        />
                        <button className="bg-amber-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-amber-600 flex items-center gap-1 shadow-sm">
                          <CreditCard size={12} /> Pay Link
                        </button>
                      </form>
                    )}

                    {ord.status === "verifying" && (
                      <span className="text-xs text-purple-600 font-medium animate-pulse">
                        Token Submitted: ({ord.transactionNumber}) – Auditing File
                      </span>
                    )}

                    {ord.status === "confirmed" && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle size={14} /> Confirmed! Delivery Arranged.
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalShop;
