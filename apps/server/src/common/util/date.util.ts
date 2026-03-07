import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateUtils {
  static toKST(date: Date = new Date()): string {
    return dayjs(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  }

  static getNowKST(): Date {
    return dayjs().tz('Asia/Seoul').toDate();
  }

  static getNowUTC(): Date {
    return dayjs().utc().toDate();
  }
}
