import { useRecipeStore } from '../store/recipeStore';
import { analyzeRecipe, getNutritionScore } from '../api/client';

export function useRecipe() {
    const { state, dispatch } = useRecipeStore();

    async function addIngredient(name) {
        const trimmed = name.trim().toLowerCase();
        if (!trimmed) return;
        if (state.ingredients.includes(trimmed)) {
            dispatch({ type: 'SET_ERROR', payload: `Already added: ${trimmed}` });
            return;
        }

        dispatch({ type: 'ADD_INGREDIENT', payload: trimmed });

        // Auto-analyze if we have enough ingredients
        // state.ingredients is stale here, so allow for N+1
        if (state.ingredients.length + 1 >= 2) {
            // Small delay to allow state update or just pass new list directly
            // Better: trigger a refresh with explicit list
            refreshAnalysis([...state.ingredients, trimmed]);
        }
    }

    function removeIngredient(name) {
        dispatch({ type: 'REMOVE_INGREDIENT', payload: name });

        const remaining = state.ingredients.filter(i => i !== name);
        if (remaining.length >= 2) {
            refreshAnalysis(remaining);
        }
        // Reducer already clears recipeData when < 2 ingredients remain
    }

    async function refreshAnalysis(currentIngredients = state.ingredients) {
        if (currentIngredients.length < 2) return;

        dispatch({ type: 'SET_ANALYSIS_START' });

        // Parallel fetch if we want nutrition too, but let's stick to prompt flow
        const { data, error } = await analyzeRecipe(currentIngredients);

        if (error) {
            dispatch({ type: 'SET_ANALYSIS_ERROR', payload: error });
        } else {
            dispatch({ type: 'SET_ANALYSIS_SUCCESS', payload: { recipeData: data, nutritionData: null } });
        }
    }

    async function calculateNutrition() {
        const { data, error } = await getNutritionScore(state.ingredients, state.quantities);
        if (error) {
            dispatch({ type: 'SET_ERROR', payload: error });
        } else {
            dispatch({ type: 'SET_ANALYSIS_SUCCESS', payload: { recipeData: state.recipeData, nutritionData: data } });
        }
    }

    return {
        addIngredient,
        removeIngredient,
        refreshAnalysis,
        calculateNutrition,
        ingredients: state.ingredients,
        quantities: state.quantities,
        recipeData: state.recipeData,
        nutritionData: state.nutritionData,
        isAnalyzing: state.isAnalyzing,
        error: state.error,
        setError: (msg) => dispatch({ type: 'SET_ERROR', payload: msg }),
        clearError: () => dispatch({ type: 'CLEAR_ERROR' })
    };
}
