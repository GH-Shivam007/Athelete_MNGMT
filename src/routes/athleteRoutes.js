import express from 'express';
import {
    getAthleteInfo,
    getAthleteResults,
    getAthleteRankings,
    getAthleteCategories
} from '../services/athleteService.js';

const router = express.Router();

// ✅ Moved '/categories' to the top to avoid conflicts
router.get('/categories', async (req, res) => {
    try {
        const data = await getAthleteCategories();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Athlete Info
router.get('/:athleteId', async (req, res) => {
    try {
        const data = await getAthleteInfo(req.params.athleteId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Athlete Results (with default values for query params)
router.get('/:athleteId/results', async (req, res) => {
    try {
        const per_page = req.query.per_page || 10; // Default: 10 results per page
        const elite = req.query.elite === 'true'; // Convert to boolean
        const data = await getAthleteResults(req.params.athleteId, per_page, elite);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Athlete Rankings
router.get('/:athleteId/rankings', async (req, res) => {
    try {
        const data = await getAthleteRankings(req.params.athleteId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
