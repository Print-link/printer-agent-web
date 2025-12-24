import { useState, useMemo, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useBranchStore } from '../stores/branchStore';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { apiService } from '../services/api';
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart3,
  Store,
  Wrench,
  Users,
  UserCircle,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  XCircle,
} from 'lucide-react';
import { BranchSelector } from '../components/shared/BranchSelector';

export default function ClerkLayout() {
  const { user, logout } = useAuthStore();
  const { selectedBranch, clearBranch } = useBranchStore();
  const { theme, toggleTheme } = useTheme();
  const { getFontSize, getSpacing, getIconSize, settings, playSound } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isManager = user?.role === 'manager';
  const isClerk = user?.role === 'clerk';
  const hasBranchSelected = Boolean(selectedBranch);

  // Determine which branch_id to use for fetching orders
  const branchIdForOrders = isClerk ? user?.branch_id : selectedBranch?.id;

  // Fetch orders to get PENDING and PAID count
  const { data: orders = [] } = useQuery({
    queryKey: ['branchOrders', branchIdForOrders],
    queryFn: async () => {
      if (!branchIdForOrders) return [];
      return await apiService.getBranchOrders(branchIdForOrders);
    },
    enabled: !!branchIdForOrders && (isManager || isClerk),
    staleTime: 30000,
    refetchInterval: 60000,
  });

  // Calculate PENDING and PAID jobs count
  const pendingAndPaidCount = useMemo(() => {
    return orders.filter(order => 
      order.status === 'PENDING' || order.status === 'PAID'
    ).length;
  }, [orders]);

  // Get PENDING and PAID orders
  const pendingAndPaidOrders = useMemo(() => {
    return orders.filter(order => 
      order.status === 'PENDING' || order.status === 'PAID'
    );
  }, [orders]);

  // Play sound notification every 1 minute when there are PENDING or PAID jobs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingAndPaidOrdersRef = useRef(pendingAndPaidOrders);
  const settingsRef = useRef(settings);

  // Keep refs up to date
  useEffect(() => {
    pendingAndPaidOrdersRef.current = pendingAndPaidOrders;
    settingsRef.current = settings;
  }, [pendingAndPaidOrders, settings]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only set up interval if:
    // 1. Sounds are enabled
    // 2. Job notification sound is enabled
    // 3. There are PENDING or PAID orders
    if (
      settings.sounds.enabled &&
      settings.sounds.jobNotificationEnabled &&
      pendingAndPaidOrders.length > 0
    ) {
      // Play sound immediately if there are pending/paid orders
      playSound('job');

      // Set up interval to play sound every 1 minute (60000ms)
      intervalRef.current = setInterval(() => {
        // Check again if conditions are still met using refs for latest values
        if (
          settingsRef.current.sounds.enabled &&
          settingsRef.current.sounds.jobNotificationEnabled &&
          pendingAndPaidOrdersRef.current.length > 0
        ) {
          playSound('job');
        }
      }, 60000); // 1 minute
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    settings.sounds.enabled,
    settings.sounds.jobNotificationEnabled,
    pendingAndPaidOrders.length,
    playSound,
  ]);

  const navItems = useMemo(() => {
    const items = [];

    // 1. Dashboard - Show for manager when branch selected, or for clerk
    if ((isManager && hasBranchSelected) || isClerk) {
      items.push({
        path: '/clerk/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
      });
    }

    // 2. Jobs/Orders - Manager only when branch selected
    if (isManager && hasBranchSelected) {
      items.push({
        path: '/clerk/jobs',
        label: 'Jobs',
        icon: ShoppingBag,
        badge: pendingAndPaidCount > 0 ? pendingAndPaidCount : undefined,
      });
    }

    // 2. Orders - For clerks
    if (isClerk) {
      items.push({
        path: '/clerk/orders',
        label: 'Orders',
        icon: ShoppingBag,
        badge: pendingAndPaidCount > 0 ? pendingAndPaidCount : undefined,
      });
    }


    // 5. Overview - Manager only when no branch selected (high-level analytics)
    if (isManager && !hasBranchSelected) {
      items.push({
        path: '/clerk/overview',
        label: 'Overview',
        icon: BarChart3,
      });
    }

    // 6. Branches - Manager only when no branch selected
    if (isManager && !hasBranchSelected) {
      items.push({
        path: '/clerk/branches',
        label: 'Branches',
        icon: Store,
      });
    }

    // 7. Services - Manager only when branch selected
    if (isManager && hasBranchSelected) {
      items.push({
        path: '/clerk/services',
        label: 'Services',
        icon: Wrench,
      });
    }

    // 8. User Management - Manager only when branch selected
    if (isManager && hasBranchSelected) {
      items.push({
        path: '/clerk/user-management',
        label: 'User Management',
        icon: Users,
      });
    }

    // 9. Profile - Available to all (personal settings)
    items.push({
      path: '/clerk/profile',
      label: 'Profile',
      icon: UserCircle,
    });

    // 10. Settings - Available to all (app settings)
    items.push({
      path: '/clerk/settings',
      label: 'Settings',
      icon: Settings,
    });

    return items;
  }, [isManager, isClerk, hasBranchSelected, pendingAndPaidCount]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <aside className={`${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-200 flex flex-col ${
        theme === 'dark' 
          ? 'bg-gray-800 border-r border-gray-700' 
          : 'bg-white border-r border-gray-200'
      }`}>
        {/* Sidebar Header */}
        <div className={`h-16 flex items-center justify-between px-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {!isSidebarCollapsed && (
            <h1 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Print Agent
            </h1>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all relative ${
                  isActive
                    ? 'bg-amber-400 text-gray-900 font-semibold'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-sm">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold min-w-[20px] text-center ${
                        isActive
                          ? 'bg-gray-900 text-amber-400'
                          : theme === 'dark'
                          ? 'bg-amber-400 text-gray-900'
                          : 'bg-amber-400 text-gray-900'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
                {isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isActive
                      ? 'bg-gray-900 text-amber-400'
                      : theme === 'dark'
                      ? 'bg-amber-400 text-gray-900'
                      : 'bg-amber-400 text-gray-900'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Branch Selector (for managers) */}
        {isManager && (
          <BranchSelector isSidebarCollapsed={isSidebarCollapsed} />
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`h-16 flex items-center justify-between px-6 border-b ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          {selectedBranch && (
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {selectedBranch.name}
              </span>
              <button
                onClick={() => {
                  clearBranch();
                  navigate('/clerk/overview');
                }}
                className={`p-1.5 rounded-md transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300'
                    : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                }`}
                title="Deselect branch"
              >
                <XCircle size={16} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 ml-auto">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-900'
                }`}>
                  {getInitials(user?.name || user?.firstName || user?.email)}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-sm">{user?.name || user?.firstName || 'User'}</span>
                )}
              </button>

              {isUserMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <div className={`p-3 border-b ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <p className={`text-sm font-semibold ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {user?.name || user?.firstName || 'User'}
                    </p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

