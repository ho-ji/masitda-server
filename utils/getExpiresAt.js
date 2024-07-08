const getExpiresAt = function () {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
}

module.exports = {
  getExpiresAt,
}
