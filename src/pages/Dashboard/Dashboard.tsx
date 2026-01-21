import React from 'react';
import type { TDeal } from '@/types/types';
import { stats, deals } from '@/data/index';
import Breadcrumb from '@/components/DashboardAdmin/components/Breadcrumb';



const Home: React.FC = () => {
  const items = {
    Dashboard: '/dashboard',
  };

  const getBadgeClass = (status: TDeal['status']) => {
    switch (status) {
      case 'Delivered':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-500';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-400';
      case 'Rejected':
        return 'bg-red-200 text-red-500';
      default:
        return 'bg-gray-100 text-black';
    }
  };

  return (
    <div className="py-3 px-4">
      <Breadcrumb items={items}/>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl py-3 px-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h2 className="text-2xl font-bold">{stat.value}</h2>
              </div>
              <div className="p-3 rounded-full">
                <img src={stat.icon} alt="icon" className="w-10 h-10 object-contain" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-1">
              <img
                src={stat.trend.type === 'up' ? '/image/dashboard/up.png' : '/image/dashboard/down.png'}
                alt="trend"
                className="w-5 h-auto"
              />
              <p className={`text-sm font-medium ${stat.trend.type === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend.value}
              </p>
              <p className="text-sm text-gray-500">{stat.trend.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deals Table */}
      <div className="p-6 mt-6 bg-white shadow-md rounded-md">
        <h2 className="text-lg font-semibold mb-4">Deals Details</h2>
        <div className="overflow-x-auto rounded-md">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-cyan-600 text-white text-left text-sm">
                <th className="py-2 px-4">Product Name</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Date – Time</th>
                <th className="py-2 px-4">Piece</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal, idx) => (
                <tr key={idx} className="border-b border-borderGray text-[#202224] font-semibold text-left text-[15px] font-lato">
                  <td className="py-2 px-4 flex items-center gap-4">
                    <img src={deal.picture} alt={deal.product_name} className="w-14 h-14 object-cover rounded" />
                    <span className="max-w-[150px] text-left">{deal.product_name}</span>
                  </td>
                  <td className="py-2 px-4">{deal.location}</td>
                  <td className="py-2 px-4">{deal.date_time}</td>
                  <td className="py-2 px-4">{deal.piece}</td>
                  <td className="py-2 px-4">Rp. {deal.amount}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`text-center min-w-[100px] inline-block px-3 py-1 text-sm font-semibold rounded-full ${getBadgeClass(
                        deal.status
                      )}`}
                    >
                      {deal.status}
                    </span>
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

export default Home;
