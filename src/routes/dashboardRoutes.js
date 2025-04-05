const express = require('express');
const router = express.Router();
const Athlete = require('../models/Athlete'); 
const TrainingPlan = require('../models/TrainingPlan');
const Performance = require('../models/Performance');
const Event = require('../models/Event');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalAthletes = await Athlete.countDocuments();
        const activeTrainingPlans = await TrainingPlan.countDocuments({ status: 'in_progress' });

        const performances = await Performance.find();
        const averagePerformance = performances.length > 0
            ? performances.reduce((sum, p) => sum + p.value, 0) / performances.length
            : 0;

        const upcomingEvents = await Event.find().sort({ event_date: 1 }).limit(3);

        res.json({
            totalAthletes,
            activeTrainingPlans,
            averagePerformance: Math.round(averagePerformance * 100) / 100,
            totalEvents: upcomingEvents.length,
            recentActivities: performances.slice(0, 3),
            upcomingEvents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
