import { createContext, useContext, useReducer } from 'react';
import { analyzeRecipe, getNutritionScore, checkHealth } from '../api/client';

const initialState = {
    ingredients: [],     // array of strings
    quantities: [],      // array of numbers (grams), matches index of ingredients
    recipeData: null,    // analysis result
    nutritionData: null, // nutrition result
    isAnalyzing: false,
    error: null
};

function recipeReducer(state, action) {
    switch (action.type) {
        case 'ADD_INGREDIENT':
            // Prevent duplicates or empty
            if (!action.payload || state.ingredients.includes(action.payload)) {
                return state;
            }
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload],
                quantities: [...state.quantities, 100], // Default 100g
                error: null
            };
        case 'REMOVE_INGREDIENT':
            {
                const idx = state.ingredients.indexOf(action.payload);
                if (idx === -1) return state;
                const newIng = [...state.ingredients];
                const newQty = [...state.quantities];
                newIng.splice(idx, 1);
                newQty.splice(idx, 1);
                return {
                    ...state,
                    ingredients: newIng,
                    quantities: newQty,
                    // Clear analysis if too few? Maybe keep it but stale?
                    // Let's clear to force re-analysis
                    recipeData: newIng.length < 2 ? null : state.recipeData
                };
            }
        case 'SET_ANALYSIS_START':
            return { ...state, isAnalyzing: true, error: null };
        case 'SET_ANALYSIS_SUCCESS':
            return {
                ...state,
                isAnalyzing: false,
                recipeData: action.payload.recipeData,
                nutritionData: action.payload.nutritionData
            };
        case 'SET_ANALYSIS_ERROR':
            return { ...state, isAnalyzing: false, error: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}

const RecipeContext = createContext();

export function RecipeProvider({ children }) {
    const [state, dispatch] = useReducer(recipeReducer, initialState);

    return (
        <RecipeContext.Provider value={{ state, dispatch }}>
            {children}
        </RecipeContext.Provider>
    );
}

export function useRecipeStore() {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error('useRecipeStore must be used within a RecipeProvider');
    }
    return context;
}

// Selectors to make consumption easier
export function useIngredients() {
    const { state } = useRecipeStore();
    return state.ingredients;
}

export function useRecipeData() {
    const { state } = useRecipeStore();
    return state.recipeData;
}
