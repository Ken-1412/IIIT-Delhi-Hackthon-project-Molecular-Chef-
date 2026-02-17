import axios from 'axios';

const FLAVORDB_BASE = process.env.FOODOSCOPE_FLAVORDB_BASE;
const RECIPEDB_BASE = process.env.FOODOSCOPE_RECIPEDB_BASE;
const API_KEY = process.env.FOODOSCOPE_API_KEY;

const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

/**
 * Get flavor compounds for an ingredient
 */
export async function getCompounds(ingredientName) {
    try {
        const response = await axios.get(
            `${FLAVORDB_BASE}/entity/search`,
            {
                params: { entity_name: ingredientName },
                headers
            }
        );
        return { data: response.data, error: null };
    } catch (error) {
        console.error('Foodoscope API Error (getCompounds):', error.message);
        return { data: null, error: error.message };
    }
}

/**
 * Get flavor pairings between two ingredients
 */
export async function getPairings(ingredient1, ingredient2) {
    try {
        const response = await axios.get(
            `${FLAVORDB_BASE}/pairing`,
            {
                params: { entity1: ingredient1, entity2: ingredient2 },
                headers
            }
        );
        return { data: response.data, error: null };
    } catch (error) {
        console.error('Foodoscope API Error (getPairings):', error.message);
        return { data: null, error: error.message };
    }
}

/**
 * Get ingredient substitutes
 */
export async function getSubstitutes(ingredientName, filters = {}) {
    try {
        const response = await axios.get(
            `${FLAVORDB_BASE}/substitutes`,
            {
                params: { ingredient: ingredientName, ...filters },
                headers
            }
        );
        return { data: response.data, error: null };
    } catch (error) {
        console.error('Foodoscope API Error (getSubstitutes):', error.message);
        return { data: null, error: error.message };
    }
}

/**
 * Search recipes from RecipeDB2
 */
export async function searchRecipes(query) {
    try {
        const response = await axios.get(
            `${RECIPEDB_BASE}/search`,
            {
                params: { q: query },
                headers
            }
        );
        return { data: response.data, error: null };
    } catch (error) {
        console.error('Foodoscope API Error (searchRecipes):', error.message);
        return { data: null, error: error.message };
    }
}

/**
 * Check API health
 */
export async function checkHealth() {
    try {
        await axios.get(`${FLAVORDB_BASE}/health`, { headers, timeout: 5000 });
        return { data: { status: 'ok' }, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
}
