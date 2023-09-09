const WEEK_IN_MILLIS = 6.048e8,
  DAY_IN_MILLIS = 8.64e7,
  HOUR_IN_MILLIS = 3.6e6,
  MIN_IN_MILLIS = 6e4,
  SEC_IN_MILLIS = 1e3;

export function formatRelativeDate(date: Date) {
  const intl = new Intl.RelativeTimeFormat();

  const getCurrentUTCTime = () => getUTCTime(new Date());
  const getUTCTime = (date: Date) =>
    date.getTime() - date.getTimezoneOffset() * 60000;

  const millis = getUTCTime(date);
  const diff = millis - getCurrentUTCTime();
      
  if (Math.abs(diff) > WEEK_IN_MILLIS)
    return intl.format(
      Math.trunc(diff / WEEK_IN_MILLIS),
      'week'
    );
  else if (Math.abs(diff) > DAY_IN_MILLIS)
    return intl.format(
      Math.trunc(diff / DAY_IN_MILLIS),
      'day'
    );
  else if (Math.abs(diff) > HOUR_IN_MILLIS)
    return intl.format(
      Math.trunc((diff % DAY_IN_MILLIS) / HOUR_IN_MILLIS),
      'hour'
    );
  else if (Math.abs(diff) > MIN_IN_MILLIS)
    return intl.format(
      Math.trunc((diff % HOUR_IN_MILLIS) / MIN_IN_MILLIS),
      'minute'
    );
  else
    return intl.format(
      Math.trunc((diff % MIN_IN_MILLIS) / SEC_IN_MILLIS),
      'second'
    );
}
