const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

// Add swagger Doc output
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setup api router
const apiRouter = require('./controllers/apiRouter');
const APIError = require('./types/APIError');

app.use('/api/v1', apiRouter);

// Setup global error handler
// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, _next) => {
  if (error instanceof APIError || error.isAPIError) {
    res.status(error.code).send(error);
  } else if (error.name === 'UnauthorizedError') {
    res.status(401).send(new APIError(401, 'You are not authenticated.'));
  } else {
    // eslint-disable-next-line no-console
    console.error('500:', error);
    res.status(500).send(error);
  }
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Insurance Middleware API listening at http://localhost:${port}`));

module.exports = app;
