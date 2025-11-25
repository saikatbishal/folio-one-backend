export default async function handler(request, response) {
  // 1. Handle CORS specifically for this function
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle the Preflight (OPTIONS) request explicitly
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // 3. Your actual logic goes here
  return response.status(200).json({ message: 'Hello World' });
}