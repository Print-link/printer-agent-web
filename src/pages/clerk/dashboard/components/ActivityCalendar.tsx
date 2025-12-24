import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface ActivityCalendarProps {
  calendarDates: Date[];
  calendarMonthHeader: string;
  calendarGridStart: number;
  monthlyCountMap: Map<string, number>;
  selectedDate: string;
  calendarOffset: number;
  onDateSelect: (date: string) => void;
  onCalendarOffsetChange: (offset: number) => void;
  onTodayClick: () => void;
}

export function ActivityCalendar({
  calendarDates,
  calendarMonthHeader,
  calendarGridStart,
  monthlyCountMap,
  selectedDate,
  calendarOffset = 0,
  onDateSelect,
  onCalendarOffsetChange,
  onTodayClick,
}: ActivityCalendarProps) {
  const { theme } = useTheme();

  return (
    <div className={`p-3 rounded-md border flex flex-col ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-amber-500/20">
            📅
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold m-0 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Activity Calendar
            </h3>
            <p className={`text-xs m-0 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {calendarMonthHeader || 'Job count by date'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCalendarOffsetChange(calendarOffset + 1)}
            className={`p-2 rounded-lg border text-base flex items-center justify-center transition-all ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
                : 'bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}
            title="Go to previous period"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onTodayClick}
            disabled={calendarOffset === 0}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
              calendarOffset === 0
                ? theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed opacity-60'
                  : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                : theme === 'dark'
                ? 'bg-amber-500 border-amber-500 text-black hover:bg-amber-600'
                : 'bg-amber-400 border-amber-400 text-black hover:bg-amber-500'
            }`}
            title="Jump to today"
          >
            Today
          </button>
          <button
            onClick={() => onCalendarOffsetChange(calendarOffset - 1)}
            disabled={calendarOffset === 0}
            className={`p-2 rounded-lg border text-base flex items-center justify-center transition-all ${
              calendarOffset === 0
                ? theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
                : 'bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}
            title="Go to next period"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-[11px] font-semibold p-1"
            style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before the first day of the month */}
        {Array.from({ length: calendarGridStart }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {calendarDates.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayJobCount = monthlyCountMap.get(dateStr) || 0;
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={index}
              onClick={() => onDateSelect(dateStr)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 relative ${
                isSelected
                  ? 'border-amber-400 bg-amber-400 text-black scale-105'
                  : isToday
                  ? 'border-transparent bg-amber-400/15 text-gray-900 dark:text-gray-100'
                  : theme === 'dark'
                  ? 'bg-gray-800 border-transparent text-gray-100 hover:bg-gray-700'
                  : 'bg-white border-transparent text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase opacity-80">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-2xl font-bold">{date.getDate()}</span>
              {dayJobCount > 0 && (
                <span
                  className={`rounded-xl px-2 py-0.5 text-[11px] font-bold mt-1 ${
                    isSelected
                      ? 'bg-black text-amber-400'
                      : 'bg-amber-400 text-black'
                  }`}
                >
                  {dayJobCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

