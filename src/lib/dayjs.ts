import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isToday);

export default dayjs;
