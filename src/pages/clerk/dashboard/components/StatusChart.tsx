import { useTheme } from '../../../../contexts/ThemeContext';
import { Bar } from './Bar';
import { LegendItem } from './LegendItem';

interface StatusChartProps {
  chartData: {
    completed: number;
    pending: number;
    quoted?: number;
    paid?: number;
    inProgress?: number;
    failed?: number;
    max: number;
  };
}

export function StatusChart({ chartData }: StatusChartProps) {
  const { theme } = useTheme();

  return (
    <div className={`p-3 rounded-md border flex flex-col ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-1 mb-2">
        <h3 className={`text-sm font-semibold ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Job Status
        </h3>
      </div>
      <div className="flex flex-col gap-2">
        <Bar
          label="Completed"
          value={chartData.completed}
          max={chartData.max}
          color="#10b981"
        />
        <Bar
          label="Pending"
          value={chartData.pending}
          max={chartData.max}
          color="#f59e0b"
        />
        {chartData.quoted !== undefined && (
          <Bar
            label="Quoted"
            value={chartData.quoted}
            max={chartData.max}
            color="#f59e0b"
          />
        )}
        {chartData.paid !== undefined && (
          <Bar
            label="Paid"
            value={chartData.paid}
            max={chartData.max}
            color="#10b981"
          />
        )}
        {chartData.inProgress !== undefined && (
          <Bar
            label="In Progress"
            value={chartData.inProgress}
            max={chartData.max}
            color="#fbbf24"
          />
        )}
        {chartData.failed !== undefined && (
          <Bar
            label="Failed"
            value={chartData.failed}
            max={chartData.max}
            color="#ef4444"
          />
        )}
      </div>
      <div className={`mt-2 flex gap-2 justify-start flex-wrap p-2 rounded ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <LegendItem color="#10b981" label="Completed" />
        <LegendItem color="#f59e0b" label="Pending" />
        {chartData.quoted !== undefined && (
          <LegendItem color="#f59e0b" label="Quoted" />
        )}
        {chartData.paid !== undefined && (
          <LegendItem color="#10b981" label="Paid" />
        )}
        {chartData.inProgress !== undefined && (
          <LegendItem color="#fbbf24" label="In Progress" />
        )}
        {chartData.failed !== undefined && (
          <LegendItem color="#ef4444" label="Failed" />
        )}
      </div>
    </div>
  );
}

