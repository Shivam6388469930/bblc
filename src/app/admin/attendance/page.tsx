'use client';
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

interface User {
  _id: string;
  userName: string;
  userEmail: string;
}

interface AttendanceRecord {
  _id: string;
  userName: string;
  userEmail: string;
  date: string;
  value: 'present' | 'absent';
  createdAt: string;
}

export default function AdminAttendancePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [markingAttendance, setMarkingAttendance] = useState(false);

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        console.log('👥 Fetching users...');
        const res = await fetch('/api/admin/users');
        const data = await res.json();

        if (res.ok) {
          console.log('✅ Users fetched successfully:', data.users?.length || 0);
          setUsers(data.users || []);
        } else {
          console.error('❌ Failed to fetch users:', data);
          setError(`Failed to fetch users: ${data.message || 'Unknown error'}`);
        }
      } catch (error: any) {
        console.error('❌ Error fetching users:', error);
        setError(`Error fetching users: ${error.message || 'Network error'}`);
      }
    }
    fetchUsers();
  }, []);

  // Fetch attendance records
  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedUser, startDate, endDate]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      let url = `/api/attendence?isAdmin=true`;

      if (selectedUser !== 'all') {
        url += `&userEmail=${selectedUser}`;
      }

      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setAttendanceRecords(data.attendance || []);
      } else {
        setError(data.message || 'Failed to fetch attendance records');
      }
    } catch (error) {
      setError('Error fetching attendance records');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (userEmail: string, userName: string, status: 'present' | 'absent') => {
    try {
      setMarkingAttendance(true);
      setError(''); // Clear any previous errors

      console.log('📝 Marking attendance:', { userName, userEmail, date: selectedDate, status });

      const res = await fetch('/api/attendence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          userEmail,
          date: selectedDate,
          value: status,
        }),
      });

      const data = await res.json();
      console.log('📝 Response:', data);

      if (res.ok) {
        // Refresh attendance records
        await fetchAttendanceRecords();
        alert(`✅ Attendance marked as ${status} for ${userName}`);
      } else {
        const errorMessage = data.message || `Failed to mark attendance (Status: ${res.status})`;
        console.error('❌ Error response:', data);
        setError(errorMessage);
        alert(`❌ ${errorMessage}`);
      }
    } catch (error: any) {
      const errorMessage = `Error marking attendance: ${error.message || 'Network error'}`;
      console.error('❌ Network/Parse error:', error);
      setError(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setMarkingAttendance(false);
    }
  };

  const getTodayAttendance = (userEmail: string) => {
    return attendanceRecords.find(record =>
      record.userEmail === userEmail &&
      new Date(record.date).toDateString() === new Date(selectedDate).toDateString()
    );
  };

  const generateAttendanceReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('Attendance Report', 20, 20);

    // Date range
    doc.setFontSize(12);
    const dateRange = startDate && endDate ?
      `From: ${startDate} To: ${endDate}` :
      `Date: ${selectedDate}`;
    doc.text(dateRange, 20, 35);

    // Headers
    doc.setFontSize(10);
    doc.text('Name', 20, 50);
    doc.text('Email', 70, 50);
    doc.text('Date', 130, 50);
    doc.text('Status', 170, 50);

    // Records
    let yPosition = 60;
    attendanceRecords.forEach((record, index) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(record.userName, 20, yPosition);
      doc.text(record.userEmail, 70, yPosition);
      doc.text(new Date(record.date).toLocaleDateString(), 130, yPosition);
      doc.text(record.value.toUpperCase(), 170, yPosition);

      yPosition += 10;
    });

    doc.save('attendance-report.pdf');
  };

  const getAttendanceStats = () => {
    const totalRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(r => r.value === 'present').length;
    const absentCount = totalRecords - presentCount;
    const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : '0';

    return { totalRecords, presentCount, absentCount, attendanceRate };
  };

  const stats = getAttendanceStats();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h1>
        <p className="text-gray-600">Mark and manage student attendance records</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Records</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalRecords}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Present</h3>
          <p className="text-2xl font-bold text-green-600">{stats.presentCount}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Absent</h3>
          <p className="text-2xl font-bold text-red-600">{stats.absentCount}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Attendance Rate</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.attendanceRate}%</p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters & Controls</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mark Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user.userEmail}>
                  {user.userName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={generateAttendanceReport}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Mark Attendance Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Mark Attendance for {new Date(selectedDate).toLocaleDateString()}</h2>

        {users.length === 0 ? (
          <p className="text-gray-500">No users found. Please ensure users are registered.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Student Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Current Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const todayAttendance = getTodayAttendance(user.userEmail);
                  return (
                    <tr key={user._id} className="border-t">
                      <td className="px-4 py-2 text-sm text-gray-900">{user.userName}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{user.userEmail}</td>
                      <td className="px-4 py-2 text-sm">
                        {todayAttendance ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            todayAttendance.value === 'present'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {todayAttendance.value.toUpperCase()}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            NOT MARKED
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markAttendance(user.userEmail, user.userName, 'present')}
                            disabled={markingAttendance}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(user.userEmail, user.userName, 'absent')}
                            disabled={markingAttendance}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attendance Records */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading attendance records...</p>
          </div>
        ) : attendanceRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No attendance records found for the selected criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Student Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Recorded At</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{record.userName}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{record.userEmail}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.value === 'present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.value.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(record.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
