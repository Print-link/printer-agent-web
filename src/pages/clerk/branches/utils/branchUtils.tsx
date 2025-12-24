import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Branch } from '../../../../types';

export const getStatusIcon = (status: Branch['status']) => {
  const iconSize = 16;

  switch (status) {
    case 'active':
      return <CheckCircle size={iconSize} className="text-green-500" />;
    case 'inactive':
      return <XCircle size={iconSize} className="text-red-500" />;
    case 'temporarily_closed':
      return <AlertCircle size={iconSize} className="text-yellow-500" />;
    default:
      return null;
  }
};

export const getStatusLabel = (status: Branch['status']) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'temporarily_closed':
      return 'Temporarily Closed';
    default:
      return status;
  }
};

export const formatOperatingHours = (operatingHours: Branch['operatingHours']) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels: { [key: string]: string } = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };

  // Convert 24-hour time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour % 12 || 12;
    return `${hour12}${minutes !== '00' ? `:${minutes}` : ''}${ampm}`;
  };

  // Group consecutive days with same hours
  const groups: Array<{ days: string[]; hours: { open: string; close: string } }> = [];
  
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const hours = operatingHours[day];
    
    if (!hours) continue;

    // Check if this day can be added to the last group
    const lastGroup = groups[groups.length - 1];
    if (
      lastGroup &&
      lastGroup.hours.open === hours.open &&
      lastGroup.hours.close === hours.close &&
      days.indexOf(lastGroup.days[lastGroup.days.length - 1]) === i - 1
    ) {
      // Add to existing group
      lastGroup.days.push(day);
    } else {
      // Create new group
      groups.push({ days: [day], hours });
    }
  }

  // Format groups
  return groups
    .map((group) => {
      if (group.days.length === 1) {
        return `${dayLabels[group.days[0]]} ${formatTime(group.hours.open)}-${formatTime(group.hours.close)}`;
      } else if (group.days.length === 2) {
        return `${dayLabels[group.days[0]]}-${dayLabels[group.days[1]]} ${formatTime(group.hours.open)}-${formatTime(group.hours.close)}`;
      } else {
        return `${dayLabels[group.days[0]]}-${dayLabels[group.days[group.days.length - 1]]} ${formatTime(group.hours.open)}-${formatTime(group.hours.close)}`;
      }
    })
    .join(', ');
};

