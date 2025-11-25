// Express.js middleware to handle CORS and OPTIONS requests
const corsHandler = (req, res, next) => {
  // 1. Handle CORS specifically for this request
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle the Preflight (OPTIONS) request explicitly
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Continue to next middleware or route handler
  next();
};

module.exports = corsHandler;