import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, User, BarChart3, Printer, FileText, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { user, logout } = useAuthStore();

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/agents', label: 'Agents', icon: Printer },
    { path: '/admin/logs', label: 'System Logs', icon: FileText },
    { path: '/admin/users', label: 'User Management', icon: Users },
  ];

  const clerkNavItems = [
    { path: '/clerk/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/clerk/jobs', label: 'Print Jobs', icon: FileText },
    { path: '/clerk/agents', label: 'Agents', icon: Printer },
    { path: '/clerk/upload', label: 'Upload Files', icon: FileText },
  ];

  const navItems = (user?.role === 'manager' || user?.role === 'clerk') ? clerkNavItems : adminNavItems;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Printer Management</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={cn(
                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
