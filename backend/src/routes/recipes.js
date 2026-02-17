import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/recipes
 * Get all recipes for the authenticated user
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const recipes = await prisma.recipe.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON strings back to objects
        const parsedRecipes = recipes.map(r => ({
            ...r,
            ingredients: JSON.parse(r.ingredients),
            nutritionData: r.nutritionData ? JSON.parse(r.nutritionData) : null,
            graphData: r.graphData ? JSON.parse(r.graphData) : null
        }));

        res.json(parsedRecipes);
    } catch (error) {
        console.error('Get recipes error:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

/**
 * POST /api/recipes
 * Create a new recipe
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, ingredients, flavorScore, nutritionData, graphData } = req.body;

        if (!name || !ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ error: 'Name and ingredients array are required' });
        }

        const recipe = await prisma.recipe.create({
            data: {
                userId: req.userId,
                name,
                ingredients: JSON.stringify(ingredients),
                flavorScore: flavorScore || null,
                nutritionData: nutritionData ? JSON.stringify(nutritionData) : null,
                graphData: graphData ? JSON.stringify(graphData) : null
            }
        });

        res.status(201).json({
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients),
            nutritionData: recipe.nutritionData ? JSON.parse(recipe.nutritionData) : null,
            graphData: recipe.graphData ? JSON.parse(recipe.graphData) : null
        });
    } catch (error) {
        console.error('Create recipe error:', error);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

/**
 * DELETE /api/recipes/:id
 * Delete a recipe
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const recipe = await prisma.recipe.findUnique({ where: { id } });
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        if (recipe.userId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await prisma.recipe.delete({ where: { id } });
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        console.error('Delete recipe error:', error);
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
});

export default router;
