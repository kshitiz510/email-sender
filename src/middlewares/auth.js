function isAuthenticated(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/user/signup')
    }
    next()
  }

module.exports = {
    isAuthenticated,
}