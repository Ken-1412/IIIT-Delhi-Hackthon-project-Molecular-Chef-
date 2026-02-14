import { useEffect } from 'react';
import { useRecipeStore } from '../../store/recipeStore';
import clsx from 'clsx';

export default function ErrorToast() {
    const { state, dispatch } = useRecipeStore();
    const { error } = state;

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch({ type: 'CLEAR_ERROR' });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    if (!error) return null;

    return (
        <div className={clsx(
            "fixed bottom-6 left-6 z-50 max-w-sm w-full",
            "bg-accent-coral text-text-primary px-4 py-3 rounded shadow-lg",
            "font-mono text-xs flex items-center justify-between",
            "animate-fadeUp"
        )}>
            <span>{error}</span>
            <button
                onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
                className="ml-3 text-lg leading-none hover:text-white"
            >
                &times;
            </button>
        </div>
    );
}
