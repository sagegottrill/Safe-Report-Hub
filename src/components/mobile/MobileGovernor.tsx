import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Shield, 
  BarChart3, 
  FileText, 
  Users, 
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function MobileGovernor() {
  const { reports, user } = useAppContext();
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regions = ['all', 'Lagos', 'Kano', 'Kaduna', 'Rivers', 'Borno'];
  
  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Cases',
      value: reports.filter(r => r.status !== 'resolved').length,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Resolved',
      value: reports.filter(r => r.status === 'resolved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'High Priority',
      value: reports.filter(r => r.urgency === 'high').length,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const filteredReports = selectedRegion === 'all' 
    ? reports 
    : reports.filter(r => r.region === selectedRegion);

  const reportTypes = [
    'gender_based_violence',
    'child_protection', 
    'food_insecurity',
    'water_sanitation',
    'shelter_issues',
    'health_emergencies',
    'education_issues'
  ];

  const typeStats = reportTypes.map(type => ({
    type,
    count: filteredReports.filter(r => r.type === type).length
  })).filter(stat => stat.count > 0);

  return (
    <div className="mobile-container py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Governor Panel</h1>
        <p className="text-gray-600">
          Welcome, {user?.name || 'Governor'}
        </p>
      </div>

      {/* Region Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Region
        </label>
        <div className="flex space-x-2 overflow-x-auto">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedRegion === region
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {region === 'all' ? 'All Regions' : region}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bgColor} rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Types Breakdown */}
      {typeStats.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Reports by Type
          </h2>
          <div className="space-y-3">
            {typeStats.map((stat) => (
              <div key={stat.type} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {stat.type.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {stat.count} report{stat.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {stat.count}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((stat.count / filteredReports.length) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Reports ({filteredReports.length})
        </h2>
        
        {filteredReports.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reports found for this region</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.slice(0, 5).map((report) => (
              <div key={report.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 capitalize">
                      {report.type.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-gray-600">{report.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'under-review' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {report.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {report.region || 'Unknown'}
                  </span>
                  {report.urgency && (
                    <span className={`px-2 py-1 rounded ${
                      report.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      report.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.urgency} priority
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Total reports in selected region: {filteredReports.length}</p>
          <p>• Average response time: 2.3 days</p>
          <p>• Resolution rate: {filteredReports.length > 0 ? ((reports.filter(r => r.status === 'resolved').length / reports.length) * 100).toFixed(1) : 0}%</p>
        </div>
      </div>
    </div>
  );
} 