import express from 'express';
import * as foodoscope from '../services/foodoscope.js';
import { SubstitutionService } from '../services/substitutionService.js';

const router = express.Router();
const substitutionService = new SubstitutionService();

/**
 * GET /api/flavordb/compounds/:ingredient
 * Get flavor compounds for an ingredient
 */
router.get('/compounds/:ingredient', async (req, res) => {
    try {
        const { ingredient } = req.params;
        const { data, error } = await foodoscope.getCompounds(ingredient);

        if (error) {
            return res.status(500).json({ error });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/flavordb/pairings
 * Get pairings between two ingredients
 */
router.get('/pairings', async (req, res) => {
    try {
        const { ingredient1, ingredient2 } = req.query;

        if (!ingredient1 || !ingredient2) {
            return res.status(400).json({ error: 'Both ingredient1 and ingredient2 are required' });
        }

        const { data, error } = await foodoscope.getPairings(ingredient1, ingredient2);

        if (error) {
            return res.status(500).json({ error });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/flavordb/substitutes/:ingredient
 * Get substitutes for an ingredient
 */
router.get('/substitutes/:ingredient', async (req, res) => {
    try {
        const { ingredient } = req.params;
        const filters = req.query; // budget, cuisine, etc.

        const { data, error } = await foodoscope.getSubstitutes(ingredient, filters);

        if (error) {
            return res.status(500).json({ error });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/flavordb/recipes/search
 * Search recipes from RecipeDB2
 */
router.get('/recipes/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Query parameter q is required' });
        }

        const { data, error } = await foodoscope.searchRecipes(q);

        if (error) {
            return res.status(500).json({ error });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/flavordb/health
 * Check Foodoscope API health
 */
router.get('/health', async (req, res) => {
    try {
        const { data, error } = await foodoscope.checkHealth();

        if (error) {
            return res.status(503).json({ error });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/flavordb/food/by-alias
 * Get flavor pairings for a single ingredient (Frontend compatibility)
 * Returns data in the format expected by the frontend
 */
router.get('/food/by-alias', async (req, res) => {
    try {
        const { food_pair } = req.query;
        if (!food_pair) {
            return res.status(400).json({ error: 'Query parameter food_pair is required' });
        }
        const rawData = await substitutionService.fetchFlavorPairings(food_pair);

        // Transform to match frontend expectations
        // Frontend expects: array with { entity_alias_readable, shared, molecules, etc }
        const transformedData = Array.isArray(rawData) ? rawData : [];
        res.json(transformedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/flavordb/analyze-recipe
 * Analyze multiple ingredients and return flavor graph data
 */
router.get('/analyze-recipe', async (req, res) => {
    try {
        const { ingredients } = req.query;
        if (!ingredients) {
            return res.status(400).json({ error: 'Query parameter ingredients is required' });
        }

        const ingredientArray = ingredients.split(',').map(i => i.trim()).filter(Boolean);

        if (ingredientArray.length < 2) {
            return res.status(400).json({ error: 'At least 2 ingredients required' });
        }

        // Fetch pairings for all ingredients in parallel
        const results = await Promise.all(
            ingredientArray.map(name => substitutionService.fetchFlavorPairings(name))
        );

        // Build graph nodes
        const nodes = ingredientArray.map(name => ({
            id: name,
            category: 'ingredient',
            connections: 0,
        }));

        // Build links from shared pairings
        const links = [];
        let totalShared = 0;
        let pairCount = 0;

        for (let i = 0; i < ingredientArray.length; i++) {
            const pairingsA = Array.isArray(results[i]) ? results[i] : [];
            const namesA = new Set(pairingsA.map(p => (p.entity_alias_readable || p.alias || '').toLowerCase()));

            for (let j = i + 1; j < ingredientArray.length; j++) {
                const pairingsB = Array.isArray(results[j]) ? results[j] : [];
                const namesB = new Set(pairingsB.map(p => (p.entity_alias_readable || p.alias || '').toLowerCase()));

                // Count shared pairings
                const shared = [...namesA].filter(n => n && namesB.has(n)).length;
                const weight = Math.min(1, shared / 20);

                if (shared > 0) {
                    links.push({
                        source: ingredientArray[i],
                        target: ingredientArray[j],
                        weight,
                    });
                    nodes[i].connections++;
                    nodes[j].connections++;
                    totalShared += shared;
                    pairCount++;
                }
            }
        }

        const cohesion_score = pairCount > 0
            ? Math.min(1, totalShared / (pairCount * 15))
            : 0;

        // Power pairs (top connections)
        const power_pairs = links
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 3)
            .map(l => ({
                ingredient_a: l.source,
                ingredient_b: l.target,
                shared_compounds: Math.round(l.weight * 20),
            }));

        // Bridge suggestion: find common pairing across all ingredients
        const allPairNames = results.flatMap(r =>
            Array.isArray(r) ? r.map(p => (p.entity_alias_readable || '').toLowerCase()) : []
        );
        const countMap = {};
        allPairNames.forEach(n => {
            if (n && !ingredientArray.includes(n)) {
                countMap[n] = (countMap[n] || 0) + 1;
            }
        });
        const bridge = Object.entries(countMap)
            .sort((a, b) => b[1] - a[1])[0];

        res.json({
            graph: { nodes, links },
            cohesion_score,
            power_pairs,
            conflicts: [],
            bridge_ingredient: bridge ? {
                name: bridge[0],
                reason: `Pairs well with ${bridge[1]} of your ingredients, acting as a flavor bridge.`,
            } : null,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/flavordb/recipe2-api/recipe-bytitle/recipeByTitle
 * Proxy for nutrition lookup by recipe title
 */
router.get('/recipe2-api/recipe-bytitle/recipeByTitle', async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) {
            return res.status(400).json({ error: 'Query parameter title is required' });
        }

        // Call external API through axios
        const axios = (await import('axios')).default;
        const response = await axios.get(
            `${process.env.FOODOSCOPE_RECIPEDB_BASE}/recipe2-api/recipe-bytitle/recipeByTitle`,
            {
                params: { title },
                headers: { Authorization: `Bearer ${process.env.FOODOSCOPE_API_KEY}` }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Recipe lookup error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/flavordb/advanced-substitutes/:ingredient
 * Get advanced substitutes with aggregated data (flavor, molecules, nutrition, recipes)
 */
router.get('/advanced-substitutes/:ingredient', async (req, res) => {
    try {
        const { ingredient } = req.params;
        const result = await substitutionService.getSubstitutionDetails(ingredient);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
