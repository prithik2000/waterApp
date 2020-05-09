require('dotenv').config();
const app = require('./app');

const server = app.listen(80, () => {
    console.log(`Express is running on port ${server.address().port}`);
});