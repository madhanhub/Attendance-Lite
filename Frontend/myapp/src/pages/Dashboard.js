import { useState, useEffect } from "react";
import API from "../api";

export default function Dashboard() {
  const [log, setLog] = useState(null);
  const userId = localStorage.getItem("userId");

  const markInTime = async () => {
    await API.post("/inTime", { userId });
    fetchLogs();
  };

  const markOutTime = async () => {
    await API.post("/outTime");
    fetchLogs();
  };

  const breakStart = async () => {
    await API.post("/breakStart");
    fetchLogs();
  };

  const breakEnd = async () => {
    await API.post("/breakEnd");
    fetchLogs();
  };

  const downloadExcel = async () => {
    const res = await API.get("/excel", {
      responseType: "blob",
      data: { userId },
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  const fetchLogs = async () => {
    const res = await API.post("/userAttendance", { userId });
    setLog(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex flex-col items-center p-8 text-white">
    <h2 className="text-3xl font-bold mb-6">Employee Dashboard</h2>

    <div className="flex gap-4 mb-6">
      {/* Buttons stay same but with shadow pop on dark bg */}
      <button
        onClick={markInTime}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        In Time
      </button>
      <button
        onClick={markOutTime}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Out Time
      </button>
      <button
        onClick={breakStart}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Break Start
      </button>
      <button
        onClick={breakEnd}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Break End
      </button>
      <button
        onClick={downloadExcel}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Download Excel
      </button>
    </div>

    {log && (
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">In Time</th>
              <th className="px-6 py-3 text-left">Out Time</th>
              <th className="px-6 py-3 text-left">Break Start</th>
              <th className="px-6 py-3 text-left">Break End</th>
              <th className="px-6 py-3 text-left">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-100">
              <td className="px-6 py-3">{log.date}</td>
              <td className="px-6 py-3">{log.inTime}</td>
              <td className="px-6 py-3">{log.outTime}</td>
              <td className="px-6 py-3">{log.breakStart}</td>
              <td className="px-6 py-3">{log.breakEnd}</td>
              <td className="px-6 py-3">{log.totalHours}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )}
  </div>
);
}