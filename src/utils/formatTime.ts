import { format, differenceInMinutes, differenceInHours } from 'date-fns';

export const formatRideTime = (dateString?: string): string => {
  if (!dateString) return '';
  return format(new Date(dateString), 'h:mm a');
};

export const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const mins = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return format(date, 'MMM d');
};
