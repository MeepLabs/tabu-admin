const status = require('http-status');

const httpsRedirect = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === "http") {
    return res.redirect(status.MOVED_PERMANENTLY, `https://${req.hostname}${req.originalUrl}`);
  }
  next();
}

module.exports = httpsRedirect;
