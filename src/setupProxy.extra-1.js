function proxy(app) {
  app.get(/^\/$/, (req, res) => res.redirect('/discover'))
}

module.exports = proxy
