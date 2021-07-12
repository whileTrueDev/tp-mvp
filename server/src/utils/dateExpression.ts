import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);

export default function dayjsFormatter(date?: string | Date | null | undefined, format?: 'default' | 'date-only' | string): any {
  if (date) {
    switch (format) {
      case 'default':
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss');

      case 'date-only':
        return dayjs(date).format('YYYY-MM-DD');

      default:
        if (format) {
          return dayjs(date).format(format);
        }
        return dayjs(date);
    }
  }
  return dayjs();
}
