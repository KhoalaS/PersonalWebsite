export function formatTimestamp(unixtime: number) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dez'
  ]

  const date = new Date(unixtime)
  const month = months[date.getMonth()]
  const day = date.getDate()
  const min = date.getMinutes()
  const hour = date.getHours()

  const year = date.getFullYear()

  const currentYear = new Date().getFullYear()

  if (year < currentYear) {
    return `${month} ${day} ${year}`
  } else {
    return `${month} ${day} ${hour}:${min}`
  }
}
