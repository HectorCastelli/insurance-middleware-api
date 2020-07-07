const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

// Setup Morgan
const morgan = require('morgan');

app.use(morgan('tiny'));

// Add swagger Doc output
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setup api router
const apiRouter = require('./controllers/apiRouter');

app.use('/api/v1', apiRouter);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

module.exports = app;
