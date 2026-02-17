import axios from 'axios';

async function testBackendAPIs() {
    console.log('=== Testing Backend API Responses ===\n');

    // Test 1: Food by alias (ingredient search)
    console.log('1. Testing /food/by-alias with "mango"...');
    try {
        const res1 = await axios.get('http://localhost:3001/api/flavordb/food/by-alias?food_pair=mango');
        console.log('Status:', res1.status);
        console.log('Data type:', Array.isArray(res1.data) ? 'Array' : typeof res1.data);
        console.log('Data length:', Array.isArray(res1.data) ? res1.data.length : 'N/A');
        if (Array.isArray(res1.data) && res1.data.length > 0) {
            console.log('First item keys:', Object.keys(res1.data[0]));
            console.log('First item sample:', JSON.stringify(res1.data[0], null, 2));
        } else {
            console.log('Response:', JSON.stringify(res1.data, null, 2));
        }
    } catch (e) {
        console.error('ERROR:', e.response ? `${e.response.status} - ${JSON.stringify(e.response.data)}` : e.message);
    }

    console.log('\n2. Testing /analyze-recipe with "basil,tomato"...');
    try {
        const res2 = await axios.get('http://localhost:3001/api/flavordb/analyze-recipe?ingredients=basil,tomato');
        console.log('Status:', res2.status);
        console.log('Response keys:', Object.keys(res2.data));
        console.log('Cohesion score:', res2.data.cohesion_score);
        console.log('Power pairs count:', res2.data.power_pairs?.length || 0);
        console.log('Full response:', JSON.stringify(res2.data, null, 2));
    } catch (e) {
        console.error('ERROR:', e.response ? `${e.response.status} - ${JSON.stringify(e.response.data)}` : e.message);
    }

    console.log('\n3. Testing /advanced-substitutes with "mango"...');
    try {
        const res3 = await axios.get('http://localhost:3001/api/flavordb/advanced-substitutes/mango');
        console.log('Status:', res3.status);
        console.log('Response keys:', Object.keys(res3.data));
        console.log('Full response:', JSON.stringify(res3.data, null, 2));
    } catch (e) {
        console.error('ERROR:', e.response ? `${e.response.status} - ${JSON.stringify(e.response.data)}` : e.message);
    }
}

testBackendAPIs();
