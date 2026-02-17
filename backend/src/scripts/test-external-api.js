import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FLAVOR_API_BASE = process.env.FOODOSCOPE_FLAVORDB_BASE || 'http://192.168.1.92:6969';
const FLAVOR_TOKEN = process.env.FOODOSCOPE_API_KEY ? `Bearer ${process.env.FOODOSCOPE_API_KEY}` : "Bearer YOUR_TOKEN_HERE";

async function testExternalAPI() {
    console.log('=== Testing External FlavorDB API ===\n');
    console.log('Base URL:', FLAVOR_API_BASE);
    console.log('Has Token:', !!process.env.FOODOSCOPE_API_KEY);

    // Test the actual external API endpoint
    const testUrl = `${FLAVOR_API_BASE}/food/by-alias?food_pair=mango`;
    console.log('\nTesting URL:', testUrl);

    try {
        const response = await axios.get(testUrl, {
            headers: { Authorization: FLAVOR_TOKEN },
            timeout: 10000
        });

        console.log('\n✅ SUCCESS!');
        console.log('Status:', response.status);
        console.log('Data type:', Array.isArray(response.data) ? 'Array' : typeof response.data);
        console.log('Data length:', Array.isArray(response.data) ? response.data.length : 'N/A');

        if (Array.isArray(response.data) && response.data.length > 0) {
            console.log('\n📊 First item structure:');
            console.log('Keys:', Object.keys(response.data[0]));
            console.log('\nFull first item:');
            console.log(JSON.stringify(response.data[0], null, 2));

            console.log('\n📊 Second item (if exists):');
            if (response.data[1]) {
                console.log(JSON.stringify(response.data[1], null, 2));
            }
        } else {
            console.log('\nFull response:');
            console.log(JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.log('\n❌ ERROR:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            console.log('Cannot reach external API:', error.message);
            console.log('\n⚠️  This is expected if you\'re not on the IIIT Delhi network.');
            console.log('The backend will use fallback/mock data in this case.');
        } else {
            console.log('Error:', error.message);
        }
    }
}

testExternalAPI();
