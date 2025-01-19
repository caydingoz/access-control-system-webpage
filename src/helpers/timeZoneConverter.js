import { DateTime } from 'luxon'

function convertUtcToIstanbul(utcDate) {
  return new Date(DateTime.fromISO(utcDate, { zone: 'utc' }).setZone('Europe/Istanbul'))
}

const TimeZoneConverter = {
  convertUtcToIstanbul,
}

export default TimeZoneConverter
