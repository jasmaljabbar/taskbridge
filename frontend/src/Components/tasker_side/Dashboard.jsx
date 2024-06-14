// src/components/Dashboard.js
import React from 'react';


const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Clients</h2>
          <p className="text-2xl font-bold">512</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Sales</h2>
          <p className="text-2xl font-bold">$7,770</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Performance</h2>
          <p className="text-2xl font-bold">256%</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow mt-6">
        <h2 className="text-xl">Performance</h2>
        {/* Placeholder for chart */}
        <div className="h-64 bg-gray-100 mt-4"></div>
      </div>
    </div>
  );
};

export default Dashboard;
