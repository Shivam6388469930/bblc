
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Management */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Management</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/monthly-fees" className="text-blue-600 hover:underline">Monthly Fees</Link>
            </li>
            <li>
              <Link href="/admin/register" className="text-blue-600 hover:underline">Registration Fees</Link>
            </li>
          </ul>
        </div>
        {/* System */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">System</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/settings" className="text-blue-600 hover:underline">Settings</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
