const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const athleteRoutes = require('./routes/athleteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // Add this

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/athletes', athleteRoutes);
app.use('/api/dashboard', dashboardRoutes); // Register dashboard routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
