
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

async function testEndpoints() {
    try {
        console.log('Testing /api/flavordb/compounds/mango...');
        try {
            const res1 = await axios.get(`${BASE_URL}/api/flavordb/compounds/mango`);
            console.log('Status:', res1.status);
        } catch (e) {
            console.error('Error /compounds/mango:', e.response ? e.response.status : e.message, e.response ? e.response.data : '');
        }

        console.log('\nTesting /api/flavordb/recipes/search?q=mango...');
        try {
            const res2 = await axios.get(`${BASE_URL}/api/flavordb/recipes/search?q=mango`);
            console.log('Status:', res2.status);
        } catch (e) {
            console.error('Error /recipes/search:', e.response ? e.response.status : e.message, e.response ? e.response.data : '');
        }

        console.log('\nTesting /api/flavordb/advanced-substitutes/mango...');
        try {
            const res3 = await axios.get(`${BASE_URL}/api/flavordb/advanced-substitutes/mango`);
            console.log('Status:', res3.status);
        } catch (e) {
            console.error('Error /advanced-substitutes/mango:', e.response ? e.response.status : e.message, e.response ? e.response.data : '');
        }

    } catch (err) {
        console.error('Test script error:', err);
    }
}

testEndpoints();
