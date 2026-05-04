const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

export function formatTimestamp(unixtime: number) {
  const date = new Date(unixtime)
  const month = months[date.getMonth()]
  const day = date.getDate()
  const min = date.getMinutes()
  const hour = date.getHours()

  const year = date.getFullYear()

  const currentYear = new Date().getFullYear()

  if (year < currentYear) {
    return `${month} ${day > 9 ? day : '0' + day} ${year}`
  } else {
    return `${month} ${day > 9 ? day : '0' + day} ${hour > 9 ? hour : '0' + hour}:${
      min > 9 ? min : '0' + min
    }`
  }
}

export function formatApacheDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}-${month}-${year} ${hours}:${minutes}`
}
