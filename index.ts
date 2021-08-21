const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const serviceRouter = require('./services/user.ts')
// const serviceRouters = require('./services/index.ts')
app.use('/manageServices', serviceRouter)


app.listen(8085, () => {
  console.log('services success')
});
