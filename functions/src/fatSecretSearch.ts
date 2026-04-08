import * as functions from 'firebase-functions';
import axios from 'axios';

// Credentials from .env file (server-side only, never in client code)
const FATSECRET_CLIENT_ID = process.env.FATSECRET_CLIENT_ID || '';
const FATSECRET_CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET || '';

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  try {
    const response = await axios.post(
      'https://oauth.fatsecret.com/connect/token',
      'grant_type=client_credentials&scope=basic',
      {
        auth: { username: FATSECRET_CLIENT_ID, password: FATSECRET_CLIENT_SECRET },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
    return cachedToken;
  } catch {
    return null;
  }
}

export const searchFatSecretFoods = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in');
  }

  const query = data?.query;
  if (!query || typeof query !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Search query is required');
  }

  const token = await getToken();
  if (!token) {
    return { foods: [] };
  }

  try {
    const response = await axios.get('https://platform.fatsecret.com/rest/server.api', {
      params: {
        method: 'foods.search',
        search_expression: query,
        format: 'json',
        max_results: 20,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    const foods = response.data?.foods?.food || [];
    const results = (Array.isArray(foods) ? foods : [foods]).map((item: any) => {
      const desc = item.food_description || '';
      const parseVal = (label: string) => {
        const match = desc.match(new RegExp(`${label}:\\s*([\\d.]+)`));
        return match ? parseFloat(match[1]) : 0;
      };

      return {
        code: `fs-${item.food_id}`,
        product_name: item.food_name || '',
        brands: item.brand_name || 'FatSecret',
        serving_size: '100g',
        nutriments: {
          'energy-kcal_100g': parseVal('Calories'),
          proteins_100g: parseVal('Protein'),
          carbohydrates_100g: parseVal('Carbs'),
          fat_100g: parseVal('Fat'),
        },
      };
    });

    return { foods: results };
  } catch {
    return { foods: [] };
  }
});
