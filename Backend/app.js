const express = require('express')
const cors = require('cors')
const { sequelize } = require('./models')
require('dotenv').config();
const routes = require('./routes/index')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;


async function startServer() {
    try {
      await sequelize.authenticate();
      console.log('Database connected successfully.');
      
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
}

startServer();