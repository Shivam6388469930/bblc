'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AttendanceRecord {
  _id: string;
  userName: string;
  userEmail: string;
  date: string;
  value: 'present' | 'absent';
  createdAt: string;
}

export default function StudentAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Get user info from localStorage
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');

    if (email) {
      setUserEmail(email);
      setUserName(name || '');
      fetchAttendanceRecords(email);
    } else {
      setError('Please log in to view your attendance');
      setLoading(false);
    }
  }, [startDate, endDate]);

  const fetchAttendanceRecords = async (email: string) => {
    try {
      setLoading(true);
      let url = `/api/attendence?userEmail=${email}`;

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

  const getAttendanceStats = () => {
    const totalRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(r => r.value === 'present').length;
    const absentCount = totalRecords - presentCount;
    const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : '0';

    return { totalRecords, presentCount, absentCount, attendanceRate };
  };

  const getMonthlyAttendance = () => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });
  };

  const generateCalendarView = () => {
    const monthlyRecords = getMonthlyAttendance();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const calendar = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayRecord = monthlyRecords.find(record =>
        new Date(record.date).toDateString() === new Date(dateStr).toDateString()
      );

      calendar.push(
        <div key={day} className={`p-2 border rounded text-center text-sm ${
          dayRecord
            ? dayRecord.value === 'present'
              ? 'bg-green-100 text-green-800 border-green-300'
              : 'bg-red-100 text-red-800 border-red-300'
            : 'bg-gray-50 text-gray-500'
        }`}>
          <div className="font-medium">{day}</div>
          {dayRecord && (
            <div className="text-xs mt-1">
              {dayRecord.value === 'present' ? 'P' : 'A'}
            </div>
          )}
        </div>
      );
    }

    return calendar;
  };

  const stats = getAttendanceStats();
  const monthlyStats = getMonthlyAttendance();
  const monthlyPresent = monthlyStats.filter(r => r.value === 'present').length;
  const monthlyTotal = monthlyStats.length;
  const monthlyRate = monthlyTotal > 0 ? ((monthlyPresent / monthlyTotal) * 100).toFixed(1) : '0';

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to view your attendance records.</p>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <div className="w-full h-[300px] relative">
        <Image
          src="/heroimg/pexels-pixabay-159775.jpg"
          alt="Attendance Banner"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 mt-20"
        />
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-4xl font-extrabold">
          <h1>My Attendance</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {userName}!</h2>
          <p className="text-gray-600">Track your attendance and view your progress</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total Days</h3>
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

        {/* Monthly Calendar View */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Monthly Attendance: {monthlyPresent}/{monthlyTotal} ({monthlyRate}%)
            </p>
          </div>

          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-700 bg-gray-100 rounded">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarView()}
          </div>

          <div className="mt-4 flex justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-50 border border-gray-300 rounded mr-2"></div>
              <span>No Record</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Filter Records</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Attendance Records</h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading attendance records...</p>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attendance records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Recorded At</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.value === 'present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.value === 'present' ? '✓ Present' : '✗ Absent'}
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
    </>
  );
}
