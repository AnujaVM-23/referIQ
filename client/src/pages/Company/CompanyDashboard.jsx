// client/src/pages/Company/CompanyDashboard.jsx
import React, { useState, useEffect } from 'react';
import { scoreAPI } from '../../services/api';
import Leaderboard from '../../components/dashboard/Leaderboard';
import Input from '../../components/common/Input';

const CompanyDashboard = () => {
  const [company, setCompany] = useState('');
  const [period, setPeriod] = useState('all');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Company Dashboard</h1>
        <p className="text-gray-600">Track referral performance across your organization</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Google, Amazon"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Total Active Referrers</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">42</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Referrals This Period</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">156</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Successful Hires</p>
          <p className="text-3xl font-bold text-green-600 mt-2">28</p>
        </div>
      </div>

      {/* Leaderboard */}
      <Leaderboard company={company || undefined} limit={50} />

      {/* ROI Info */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold mb-3">Referral ROI Benefits</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ 40% lower cost-per-hire compared to recruiters</li>
          <li>✓ 4x better employee retention rates</li>
          <li>✓ 50% faster hiring process</li>
          <li>✓ Better cultural fit and performance</li>
        </ul>
      </div>
    </div>
  );
};

export default CompanyDashboard;
