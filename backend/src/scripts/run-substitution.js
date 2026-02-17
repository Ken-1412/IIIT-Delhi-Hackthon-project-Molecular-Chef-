
import fs from 'fs';
import { SubstitutionService } from '../services/substitutionService.js';

async function run() {
    // Get ingredient from command line args or default to 'mango'
    const ingredient = process.argv[2] || 'mango';

    const service = new SubstitutionService();

    try {
        console.log(`--- MolecularChef Substitution Service ---`);
        console.log(`Analyzing ingredient: ${ingredient}...`);

        const result = await service.getSubstitutionDetails(ingredient);

        // Output to file
        const outputFile = 'result.json';
        fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
        console.log(`\nResults saved to ${outputFile}`);

        // Print requested recommendations to console
        console.log(`\nTop substitutes for ${ingredient}:`);
        if (result.recommendedSubstitutes && result.recommendedSubstitutes.length > 0) {
            result.recommendedSubstitutes.forEach(sub => {
                console.log(`- ${sub.ingredient}: ${sub.reason}`);
            });
        } else {
            console.log("No specific substitutes found.");
        }

    } catch (error) {
        console.error("Critical Error during execution:", error);
    }
}

run();
