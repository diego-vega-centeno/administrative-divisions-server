const frontendUrl = process.env.NODE_ENV == 'development' ? process.env.FRONTEND_DEV_URL : process.env.FRONTEND_PROD_URL;

//* Handle specific database errors
const databaseErrorHandler = (err, req, res, next) => {
  if (!err.code || !err.code.startsWith('23')) {
    return next(err);
  }

  console.error(`Database error -> code: ${err.code}; message: ${err.message}`);

  if (err.code === '23505') {
    return res.status(409).json({
      code: 'duplicate_entry',
      message: 'A record with this value already exists'
    });
  }

  next(err);
};

//* Handle oauth errors
const oauthErrorHandler = (err, req, res, next) => {
  if (!req.path.includes('/auth/')) {
    return next(err);
  }

  console.error(`Auth error -> code: ${err.code}; message: ${err.message}`);

  const provider = req.path.split('/')[2];
  return res.redirect(`${frontendUrl}?error=oauth_failed&provider=${provider}&message=${encodeURIComponent(err.message || 'Authentication failed')}`);
}

//* Generic errors
const generalErrorHandler = (err, req, res, next) => {
  console.error(`Generic error -> code: ${err.code}; message: ${err.message}`);

  if (err.code === 'ENOENT') {
    return res.status(404).json({
      code: err.code,
      message: err.message
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      code: err.code || 'operational_error',
      message: err.message
    });
  }

  return res.status(500).json({
    code: 'internal_error',
    message: process.env.NODE_ENV === 'production' ?
      'Something went wrong!' :
      err.message
  });
}

export { databaseErrorHandler, oauthErrorHandler, generalErrorHandler }