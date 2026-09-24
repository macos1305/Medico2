import api from './api';

const aiRecommendationService = {
  /**
   * Recommend doctors based on natural language symptoms
   * @param {string} symptoms - Description of patient symptoms
   * @returns {Promise} - Analysis and ranked doctors
   */
  recommendDoctor: (symptoms) => {
    // Try patient endpoint first, fallback to public recommend endpoint
    return api
      .post('/patient/recommend-doctor', { symptoms })
      .catch((err) => {
        // If 404 on patient route or not authenticated, try public /doctors/recommend
        if (err.statusCode === 404 || err.statusCode === 401) {
          return api.post('/doctors/recommend', { symptoms });
        }
        return Promise.reject(err);
      });
  },
};

export default aiRecommendationService;
