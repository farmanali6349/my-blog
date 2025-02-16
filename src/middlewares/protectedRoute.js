function protectedRoute(req, res, next) {
  if (!req.userdata) {
    return res.redirect("/login");
  }
  next();
}

module.exports = protectedRoute;
