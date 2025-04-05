const athleteService = require('../services/athleteService');

exports.getAthleteInfo = async (req, res) => {
    try {
        const athleteId = req.params.athleteId;
        const data = await athleteService.getAthleteInfo(athleteId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAthleteResults = async (req, res) => {
    try {
        const athleteId = req.params.athleteId;
        const { per_page, elite } = req.query;
        const data = await athleteService.getAthleteResults(athleteId, per_page, elite);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAthleteRankings = async (req, res) => {
    try {
        const athleteId = req.params.athleteId;
        const data = await athleteService.getAthleteRankings(athleteId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAthleteCategories = async (req, res) => {
    try {
        const data = await athleteService.getAthleteCategories();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
