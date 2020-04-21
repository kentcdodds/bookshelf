function proxy(app) {
  app.get(/^\/$/, (req, res) => res.redirect('/list'))
}

module.exports = proxy
