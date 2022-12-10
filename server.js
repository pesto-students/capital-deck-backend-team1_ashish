const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorMiddleware');
const logger = require('./config/logger');

const port = process.env.PORT || 5001;
const connectDB = require('./config/db');
const scheduleMail = require('./config/schedule');

connectDB();
scheduleMail();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/expense', require('./routes/expenseRoutes'));
app.use('/api/categoryincomes', require('./routes/incomesByCategoryRoutes'));
app.use('/api/categoryexpenses', require('./routes/expenseByCategoryRoutes'));
app.use('/api/alert', require('./routes/alertRoutes'));

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
