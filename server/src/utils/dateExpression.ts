import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);

export default function dayjsFormatter(date?: string | Date | null, format?: string): any {
  if (date) {
    if (format) {
      return dayjs(date).format(format);
    }
    return dayjs(date);
  }
  return dayjs();
}
