import React, { useState } from 'react';
import { useJobs, useAgents, useSubmitJobToPrinter } from '../../hooks/useApi';
import { Printer, FileText, Clock, CheckCircle, XCircle, AlertTriangle, Play } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { PrinterAgent, PrintJob } from '../../types';

const ClerkDashboard: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<PrinterAgent | null>(null);
  
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const submitJobMutation = useSubmitJobToPrinter();

  const handleSubmitJob = async () => {
    if (!selectedJob || !selectedAgent) return;
    
    try {
      await submitJobMutation.mutateAsync({
        jobId: selectedJob.id,
        agentId: selectedAgent.id,
      });
      setSelectedJob(null);
      setSelectedAgent(null);
    } catch (error) {
      console.error('Failed to submit job:', error);
    }
  };

  const getStatusIcon = (status: PrintJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: PrintJob['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgentStatusColor = (status: PrinterAgent['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (jobsLoading || agentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const pendingJobs = jobs?.filter(job => job.status === 'pending') || [];
  const processingJobs = jobs?.filter(job => job.status === 'processing') || [];
  const onlineAgents = agents?.filter(agent => agent.status === 'online') || [];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{pendingJobs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">{processingJobs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Printer className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Online Agents</p>
              <p className="text-2xl font-bold text-gray-900">{onlineAgents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{jobs?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Jobs */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pending Jobs</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingJobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className={cn(
                    'p-4 border rounded-lg cursor-pointer transition-colors',
                    selectedJob?.id === job.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{job.fileName}</p>
                      <p className="text-sm text-gray-500">{job.customerName}</p>
                      <div className="flex items-center mt-2">
                        {getStatusIcon(job.status)}
                        <span className={cn('ml-2 text-xs font-medium px-2 py-1 rounded-full', getStatusColor(job.status))}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{job.pages || 0} pages</p>
                      <p className="text-xs text-gray-400">
                        {new Date(job.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Agents */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Available Agents</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {onlineAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    'p-4 border rounded-lg cursor-pointer transition-colors',
                    selectedAgent?.id === agent.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-500">Printer: {agent.printerId}</p>
                      <div className="flex items-center mt-2">
                        <span className={cn('text-xs font-medium px-2 py-1 rounded-full', getAgentStatusColor(agent.status))}>
                          {agent.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{agent.totalJobs} jobs</p>
                      <p className="text-xs text-gray-400">
                        {agent.currentJob ? 'Busy' : 'Available'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Job */}
      {selectedJob && selectedAgent && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Job to Printer</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Submit "{selectedJob.fileName}" to {selectedAgent.name}
              </p>
              <p className="text-sm text-gray-500">
                Customer: {selectedJob.customerName} • Pages: {selectedJob.pages || 0}
              </p>
            </div>
            <button
              onClick={handleSubmitJob}
              disabled={submitJobMutation.isPending}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-4 w-4 mr-2" />
              {submitJobMutation.isPending ? 'Submitting...' : 'Submit Job'}
            </button>
          </div>
        </div>
      )}

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs?.slice(0, 10).map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.fileName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(job.status)}
                      <span className={cn('ml-2 text-xs font-medium px-2 py-1 rounded-full', getStatusColor(job.status))}>
                        {job.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.pages || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(job.submittedAt).toLocaleDateString()}
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

export default ClerkDashboard;
