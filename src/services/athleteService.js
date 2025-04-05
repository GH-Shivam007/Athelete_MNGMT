import axios from 'axios';
import { API_KEY, API_BASE_URL } from '../config/apiConfig.js';

export const getAthleteInfo = async (athleteId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/athletes/${athleteId}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching athlete info:", error.message);
        throw error;
    }
};

export const getAthleteResults = async (athleteId, perPage = 10, elite = false) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/athletes/${athleteId}/results`, {
            params: { per_page: perPage, elite },
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching athlete results:", error.message);
        throw error;
    }
};

export const getAthleteRankings = async (athleteId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/athletes/${athleteId}/rankings`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching athlete rankings:", error.message);
        throw error;
    }
};

export const getAthleteCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/athletes/categories`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching athlete categories:", error.message);
        throw error;
    }
};
