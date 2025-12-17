import { Calendar, Clock, CheckCircle, CheckCheck, CalendarClock, TrendingUp } from 'lucide-react';

export default function AppointmentStats({ stats }) {
  const statCards = [
    {
      label: 'Total Appointments',
      value: stats?.total || 0,
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      label: 'Pending',
      value: stats?.pending || 0,
      icon: Clock,
      gradient: 'from-yellow-500 to-yellow-600',
      lightBg: 'bg-yellow-50',
      darkBg: 'dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    {
      label: 'Confirmed',
      value: stats?.confirmed || 0,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      label: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCheck,
      gradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      label: "Today's Appointments",
      value: stats?.today || 0,
      icon: CalendarClock,
      gradient: 'from-primary-500 to-primary-600',
      lightBg: 'bg-primary-50',
      darkBg: 'dark:bg-primary-900/20',
      iconColor: 'text-primary-600 dark:text-primary-400',
      borderColor: 'border-primary-200 dark:border-primary-800',
    },
    {
      label: 'Upcoming',
      value: stats?.upcoming || 0,
      icon: TrendingUp,
      gradient: 'from-indigo-500 to-indigo-600',
      lightBg: 'bg-indigo-50',
      darkBg: 'dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border ${stat.borderColor} ${stat.lightBg} ${stat.darkBg} p-4`}
        >
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
