const generateOrderNumber = function () {
  const date = new Date()
  const year = date.getFullYear().toString().slice(2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const randomNumber = Math.floor(0 + Math.random() * 9000)
    .toString()
    .padStart(4, '0')

  return `${year}${month}${day}-${randomNumber}`
}

module.exports = {
  generateOrderNumber,
}
