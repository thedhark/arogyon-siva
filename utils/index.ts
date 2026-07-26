export * from './dateFormatter';

import { formatShortDate } from './dateFormatter';
export const formatDate = (dateString: string): string => {
  return formatShortDate(dateString, true);
};

