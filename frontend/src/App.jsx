import { RecipeProvider } from './store/recipeStore';
import AppShell from './components/layout/AppShell';

function App() {
    return (
        <RecipeProvider>
            <AppShell />
        </RecipeProvider>
    );
}

export default App;
