import { create } from 'zustand';
import { PrintJob, PrinterAgent, PrinterLog } from '../types';

interface PrinterState {
  jobs: PrintJob[];
  agents: PrinterAgent[];
  logs: PrinterLog[];
  selectedJob: PrintJob | null;
  selectedAgent: PrinterAgent | null;
  
  // Actions
  setJobs: (jobs: PrintJob[]) => void;
  addJob: (job: PrintJob) => void;
  updateJob: (id: string, updates: Partial<PrintJob>) => void;
  deleteJob: (id: string) => void;
  
  setAgents: (agents: PrinterAgent[]) => void;
  updateAgent: (id: string, updates: Partial<PrinterAgent>) => void;
  
  setLogs: (logs: PrinterLog[]) => void;
  addLog: (log: PrinterLog) => void;
  
  setSelectedJob: (job: PrintJob | null) => void;
  setSelectedAgent: (agent: PrinterAgent | null) => void;
}

export const usePrinterStore = create<PrinterState>((set) => ({
  jobs: [],
  agents: [],
  logs: [],
  selectedJob: null,
  selectedAgent: null,
  
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, updates) => set((state) => ({
    jobs: state.jobs.map(job => job.id === id ? { ...job, ...updates } : job)
  })),
  deleteJob: (id) => set((state) => ({
    jobs: state.jobs.filter(job => job.id !== id)
  })),
  
  setAgents: (agents) => set({ agents }),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(agent => agent.id === id ? { ...agent, ...updates } : agent)
  })),
  
  setLogs: (logs) => set({ logs }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  
  setSelectedJob: (job) => set({ selectedJob: job }),
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
}));
