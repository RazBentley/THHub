import axios from 'axios';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { OpenFoodFactsProduct } from '../types';

// UK CoFID Database - 2,887 UK government-verified foods
import cofidData from '../assets/cofid-database.json';

// USDA FoodData Central API - 400,000+ foods (free, no limits with your own key)
// Get a free key: https://fdc.nal.usda.gov/api-key-signup
const USDA_API_KEY = 'DEMO_KEY';

// FatSecret Platform API - large global food database
// Sign up free (startups <$1M): https://platform.fatsecret.com/
const FATSECRET_CLIENT_ID = 'da4607d6c4384d1080ce9bbe9ce5a5d0';
const FATSECRET_CLIENT_SECRET = '5041213fb7ab4a598dd416fde4a45032';

const usdaClient = axios.create({
  baseURL: 'https://api.nal.usda.gov/fdc/v1',
});

// Open Food Facts for barcode lookups + extra branded products
const offClient = axios.create({
  baseURL: 'https://world.openfoodfacts.org',
  headers: { 'User-Agent': 'THHub/1.0.0 (contact@thtraining.com)' },
});

// Common whole foods for instant results (per 100g)
const COMMON_FOODS: OpenFoodFactsProduct[] = [
  { code: 'custom-chicken-breast', product_name: 'Chicken Breast (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 22.5, carbohydrates_100g: 0, fat_100g: 2.6 } },
  { code: 'custom-chicken-breast-cooked', product_name: 'Chicken Breast (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 165, proteins_100g: 31, carbohydrates_100g: 0, fat_100g: 3.6 } },
  { code: 'custom-chicken-thigh', product_name: 'Chicken Thigh (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 177, proteins_100g: 17.3, carbohydrates_100g: 0, fat_100g: 11.5 } },
  { code: 'custom-chicken-thigh-cooked', product_name: 'Chicken Thigh (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 209, proteins_100g: 26, carbohydrates_100g: 0, fat_100g: 10.9 } },
  { code: 'custom-chicken-diced', product_name: 'Diced Chicken Breast', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 22.5, carbohydrates_100g: 0, fat_100g: 2.6 } },
  { code: 'custom-chicken-drumsticks', product_name: 'Chicken Drumsticks (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 161, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 10.2 } },
  { code: 'custom-chicken-wings', product_name: 'Chicken Wings (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 191, proteins_100g: 17.5, carbohydrates_100g: 0, fat_100g: 13.2 } },
  { code: 'custom-chicken-strips', product_name: 'Chicken Stir Fry Strips', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 22.5, carbohydrates_100g: 0, fat_100g: 2.6 } },
  { code: 'custom-chicken-kiev', product_name: 'Chicken Kiev (frozen)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 230, proteins_100g: 14, carbohydrates_100g: 15, fat_100g: 13 } },
  { code: 'custom-salmon', product_name: 'Salmon Fillet (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 208, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 13.4 } },
  { code: 'custom-cod', product_name: 'Cod Fillet (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 82, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 0.7 } },
  { code: 'custom-tuna', product_name: 'Tuna (canned in water)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 116, proteins_100g: 25.5, carbohydrates_100g: 0, fat_100g: 0.8 } },
  { code: 'custom-prawns', product_name: 'Prawns (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 99, proteins_100g: 24, carbohydrates_100g: 0.2, fat_100g: 0.3 } },
  { code: 'custom-fish-fingers', product_name: 'Fish Fingers (frozen)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 220, proteins_100g: 12.5, carbohydrates_100g: 20, fat_100g: 10.5 } },
  { code: 'custom-beef-mince-5', product_name: 'Beef Mince (5% fat)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 137, proteins_100g: 21.4, carbohydrates_100g: 0, fat_100g: 5 } },
  { code: 'custom-beef-mince-20', product_name: 'Beef Mince (20% fat)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 254, proteins_100g: 17.2, carbohydrates_100g: 0, fat_100g: 20 } },
  { code: 'custom-beef-steak', product_name: 'Beef Sirloin Steak (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 192, proteins_100g: 20.9, carbohydrates_100g: 0, fat_100g: 11.7 } },
  { code: 'custom-beef-rump', product_name: 'Beef Rump Steak (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 158, proteins_100g: 21.6, carbohydrates_100g: 0, fat_100g: 7.6 } },
  { code: 'custom-beef-fillet', product_name: 'Beef Fillet Steak (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 218, proteins_100g: 20.2, carbohydrates_100g: 0, fat_100g: 15 } },
  { code: 'custom-beef-diced', product_name: 'Diced Beef / Braising Steak', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 155, proteins_100g: 21.2, carbohydrates_100g: 0, fat_100g: 7.5 } },
  { code: 'custom-beef-diced-cooked', product_name: 'Diced Beef (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 212, proteins_100g: 28.6, carbohydrates_100g: 0, fat_100g: 10.5 } },
  { code: 'custom-beef-strips', product_name: 'Beef Stir Fry Strips', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 133, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 5.2 } },
  { code: 'custom-beef-brisket', product_name: 'Beef Brisket (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 213, proteins_100g: 18.3, carbohydrates_100g: 0, fat_100g: 15.4 } },
  { code: 'custom-beef-roasting', product_name: 'Beef Roasting Joint', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 176, proteins_100g: 20.4, carbohydrates_100g: 0, fat_100g: 10.2 } },
  { code: 'custom-beef-burgers', product_name: 'Beef Burgers (frozen)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 240, proteins_100g: 15.4, carbohydrates_100g: 5.2, fat_100g: 17.6 } },
  { code: 'custom-stewing-steak', product_name: 'Stewing Steak', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 148, proteins_100g: 20.8, carbohydrates_100g: 0, fat_100g: 7 } },
  { code: 'custom-lamb-leg', product_name: 'Lamb Leg (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 162, proteins_100g: 20.3, carbohydrates_100g: 0, fat_100g: 8.8 } },
  { code: 'custom-lamb-mince', product_name: 'Lamb Mince', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 16.6, carbohydrates_100g: 0, fat_100g: 23.4 } },
  { code: 'custom-turkey-mince', product_name: 'Turkey Mince', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 148, proteins_100g: 19.3, carbohydrates_100g: 0, fat_100g: 7.7 } },
  { code: 'custom-turkey-breast', product_name: 'Turkey Breast (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 135, proteins_100g: 30, carbohydrates_100g: 0, fat_100g: 1 } },
  { code: 'custom-pork-loin', product_name: 'Pork Loin (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 143, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 6.3 } },
  { code: 'custom-pork-chops', product_name: 'Pork Chops (raw)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 172, proteins_100g: 20.5, carbohydrates_100g: 0, fat_100g: 9.7 } },
  { code: 'custom-pork-diced', product_name: 'Diced Pork', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 147, proteins_100g: 21.5, carbohydrates_100g: 0, fat_100g: 6.5 } },
  { code: 'custom-pork-mince', product_name: 'Pork Mince', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 212, proteins_100g: 17.2, carbohydrates_100g: 0, fat_100g: 15.8 } },
  { code: 'custom-sausages', product_name: 'Pork Sausages', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 301, proteins_100g: 12.6, carbohydrates_100g: 9.8, fat_100g: 23.4 } },
  { code: 'custom-bacon', product_name: 'Back Bacon', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 215, proteins_100g: 24, carbohydrates_100g: 0, fat_100g: 12.3 } },
  { code: 'custom-ham-sliced', product_name: 'Sliced Ham', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 18, carbohydrates_100g: 1.5, fat_100g: 4.6 } },
  { code: 'custom-eggs', product_name: 'Whole Egg (large, ~60g)', brands: 'Whole Food', serving_size: '60g', nutriments: { 'energy-kcal_100g': 143, proteins_100g: 12.6, carbohydrates_100g: 0.7, fat_100g: 9.9 } },
  { code: 'custom-egg-whites', product_name: 'Egg Whites', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 52, proteins_100g: 10.9, carbohydrates_100g: 0.7, fat_100g: 0.2 } },
  { code: 'custom-white-rice', product_name: 'White Rice (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 130, proteins_100g: 2.7, carbohydrates_100g: 28.2, fat_100g: 0.3 } },
  { code: 'custom-brown-rice', product_name: 'Brown Rice (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 123, proteins_100g: 2.7, carbohydrates_100g: 25.6, fat_100g: 1 } },
  { code: 'custom-basmati-rice', product_name: 'Basmati Rice (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 121, proteins_100g: 3.5, carbohydrates_100g: 25.2, fat_100g: 0.4 } },
  { code: 'custom-pasta', product_name: 'Pasta (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 131, proteins_100g: 5, carbohydrates_100g: 25, fat_100g: 1.1 } },
  { code: 'custom-couscous', product_name: 'Couscous (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 112, proteins_100g: 3.8, carbohydrates_100g: 23.2, fat_100g: 0.2 } },
  { code: 'custom-quinoa', product_name: 'Quinoa (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 4.4, carbohydrates_100g: 21.3, fat_100g: 1.9 } },
  { code: 'custom-sweet-potato', product_name: 'Sweet Potato (baked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 90, proteins_100g: 2, carbohydrates_100g: 20.7, fat_100g: 0.2 } },
  { code: 'custom-white-potato', product_name: 'White Potato (boiled)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 87, proteins_100g: 1.9, carbohydrates_100g: 20, fat_100g: 0.1 } },
  { code: 'custom-chips', product_name: 'Oven Chips (cooked)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 162, proteins_100g: 2.9, carbohydrates_100g: 26, fat_100g: 5.2 } },
  { code: 'custom-oats', product_name: 'Porridge Oats (dry)', brands: 'Whole Food', serving_size: '40g', nutriments: { 'energy-kcal_100g': 379, proteins_100g: 13.2, carbohydrates_100g: 67.7, fat_100g: 6.5 } },
  { code: 'custom-bread-white', product_name: 'White Bread (1 slice ~36g)', brands: 'Whole Food', serving_size: '36g', nutriments: { 'energy-kcal_100g': 265, proteins_100g: 9, carbohydrates_100g: 49, fat_100g: 3.2 } },
  { code: 'custom-bread-wholemeal', product_name: 'Wholemeal Bread (1 slice ~36g)', brands: 'Whole Food', serving_size: '36g', nutriments: { 'energy-kcal_100g': 247, proteins_100g: 13, carbohydrates_100g: 41, fat_100g: 3.4 } },
  { code: 'custom-wrap-tortilla', product_name: 'Flour Tortilla Wrap', brands: 'Whole Food', serving_size: '60g', nutriments: { 'energy-kcal_100g': 312, proteins_100g: 8.3, carbohydrates_100g: 51, fat_100g: 8.5 } },
  { code: 'custom-bagel', product_name: 'Plain Bagel', brands: 'Whole Food', serving_size: '90g', nutriments: { 'energy-kcal_100g': 275, proteins_100g: 10.5, carbohydrates_100g: 53, fat_100g: 1.6 } },
  { code: 'custom-naan', product_name: 'Naan Bread', brands: 'Whole Food', serving_size: '130g', nutriments: { 'energy-kcal_100g': 290, proteins_100g: 9, carbohydrates_100g: 47, fat_100g: 7 } },
  { code: 'custom-pitta', product_name: 'Pitta Bread', brands: 'Whole Food', serving_size: '60g', nutriments: { 'energy-kcal_100g': 275, proteins_100g: 9.2, carbohydrates_100g: 55, fat_100g: 1.5 } },
  { code: 'custom-banana', product_name: 'Banana', brands: 'Whole Food', serving_size: '120g', nutriments: { 'energy-kcal_100g': 89, proteins_100g: 1.1, carbohydrates_100g: 22.8, fat_100g: 0.3 } },
  { code: 'custom-apple', product_name: 'Apple', brands: 'Whole Food', serving_size: '150g', nutriments: { 'energy-kcal_100g': 52, proteins_100g: 0.3, carbohydrates_100g: 13.8, fat_100g: 0.2 } },
  { code: 'custom-blueberries', product_name: 'Blueberries', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 0.7, carbohydrates_100g: 14.5, fat_100g: 0.3 } },
  { code: 'custom-strawberries', product_name: 'Strawberries', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 32, proteins_100g: 0.7, carbohydrates_100g: 7.7, fat_100g: 0.3 } },
  { code: 'custom-grapes', product_name: 'Grapes', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 69, proteins_100g: 0.7, carbohydrates_100g: 18.1, fat_100g: 0.2 } },
  { code: 'custom-orange', product_name: 'Orange', brands: 'Whole Food', serving_size: '130g', nutriments: { 'energy-kcal_100g': 47, proteins_100g: 0.9, carbohydrates_100g: 11.8, fat_100g: 0.1 } },
  { code: 'custom-mango', product_name: 'Mango', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 60, proteins_100g: 0.8, carbohydrates_100g: 15, fat_100g: 0.4 } },
  { code: 'custom-avocado', product_name: 'Avocado', brands: 'Whole Food', serving_size: '80g', nutriments: { 'energy-kcal_100g': 160, proteins_100g: 2, carbohydrates_100g: 8.5, fat_100g: 14.7 } },
  { code: 'custom-broccoli', product_name: 'Broccoli', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 34, proteins_100g: 2.8, carbohydrates_100g: 7, fat_100g: 0.4 } },
  { code: 'custom-spinach', product_name: 'Spinach', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 2.9, carbohydrates_100g: 3.6, fat_100g: 0.4 } },
  { code: 'custom-mixed-veg', product_name: 'Mixed Vegetables', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 65, proteins_100g: 2.6, carbohydrates_100g: 13, fat_100g: 0.3 } },
  { code: 'custom-carrots', product_name: 'Carrots', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 41, proteins_100g: 0.9, carbohydrates_100g: 9.6, fat_100g: 0.2 } },
  { code: 'custom-peppers', product_name: 'Mixed Peppers', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 26, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 0.2 } },
  { code: 'custom-mushrooms', product_name: 'Mushrooms', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 22, proteins_100g: 3.1, carbohydrates_100g: 3.3, fat_100g: 0.3 } },
  { code: 'custom-onion', product_name: 'Onion', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 1.1, carbohydrates_100g: 9.3, fat_100g: 0.1 } },
  { code: 'custom-olive-oil', product_name: 'Olive Oil', brands: 'Whole Food', serving_size: '15ml', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100 } },
  { code: 'custom-coconut-oil', product_name: 'Coconut Oil', brands: 'Whole Food', serving_size: '15ml', nutriments: { 'energy-kcal_100g': 862, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100 } },
  { code: 'custom-oil-spray', product_name: 'Cooking Oil Spray (e.g. Frylight)', brands: 'Whole Food', serving_size: '1 spray (0.5ml)', nutriments: { 'energy-kcal_100g': 828, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 92 } },
  { code: 'custom-butter', product_name: 'Butter', brands: 'Whole Food', serving_size: '10g', nutriments: { 'energy-kcal_100g': 717, proteins_100g: 0.9, carbohydrates_100g: 0.1, fat_100g: 81 } },
  { code: 'custom-peanut-butter', product_name: 'Peanut Butter', brands: 'Whole Food', serving_size: '30g', nutriments: { 'energy-kcal_100g': 588, proteins_100g: 25, carbohydrates_100g: 20, fat_100g: 50 } },
  { code: 'custom-almonds', product_name: 'Almonds', brands: 'Whole Food', serving_size: '30g', nutriments: { 'energy-kcal_100g': 579, proteins_100g: 21, carbohydrates_100g: 22, fat_100g: 49.9 } },
  { code: 'custom-walnuts', product_name: 'Walnuts', brands: 'Whole Food', serving_size: '30g', nutriments: { 'energy-kcal_100g': 654, proteins_100g: 15.2, carbohydrates_100g: 13.7, fat_100g: 65.2 } },
  { code: 'custom-greek-yoghurt', product_name: 'Greek Yoghurt (0% fat)', brands: 'Whole Food', serving_size: '150g', nutriments: { 'energy-kcal_100g': 59, proteins_100g: 10.3, carbohydrates_100g: 3.6, fat_100g: 0.4 } },
  { code: 'custom-greek-yoghurt-full', product_name: 'Greek Yoghurt (full fat)', brands: 'Whole Food', serving_size: '150g', nutriments: { 'energy-kcal_100g': 97, proteins_100g: 9, carbohydrates_100g: 3.4, fat_100g: 5 } },
  { code: 'custom-whole-milk', product_name: 'Whole Milk', brands: 'Whole Food', serving_size: '250ml', nutriments: { 'energy-kcal_100g': 64, proteins_100g: 3.3, carbohydrates_100g: 4.7, fat_100g: 3.6 } },
  { code: 'custom-semi-milk', product_name: 'Semi-Skimmed Milk', brands: 'Whole Food', serving_size: '250ml', nutriments: { 'energy-kcal_100g': 47, proteins_100g: 3.4, carbohydrates_100g: 4.7, fat_100g: 1.7 } },
  { code: 'custom-skimmed-milk', product_name: 'Skimmed Milk', brands: 'Whole Food', serving_size: '250ml', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 3.5, carbohydrates_100g: 5, fat_100g: 0.1 } },
  { code: 'custom-oat-milk', product_name: 'Oat Milk', brands: 'Whole Food', serving_size: '250ml', nutriments: { 'energy-kcal_100g': 46, proteins_100g: 1, carbohydrates_100g: 6.7, fat_100g: 1.5 } },
  { code: 'custom-cheddar', product_name: 'Cheddar Cheese', brands: 'Whole Food', serving_size: '30g', nutriments: { 'energy-kcal_100g': 403, proteins_100g: 24.9, carbohydrates_100g: 1.3, fat_100g: 33.1 } },
  { code: 'custom-mozzarella', product_name: 'Mozzarella', brands: 'Whole Food', serving_size: '30g', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 28, carbohydrates_100g: 3.1, fat_100g: 17 } },
  { code: 'custom-cottage-cheese', product_name: 'Cottage Cheese', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 98, proteins_100g: 11.1, carbohydrates_100g: 3.4, fat_100g: 4.3 } },
  { code: 'custom-baked-beans', product_name: 'Baked Beans', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 81, proteins_100g: 4.8, carbohydrates_100g: 13.6, fat_100g: 0.4 } },
  { code: 'custom-tinned-tomatoes', product_name: 'Chopped Tomatoes (tinned)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 19, proteins_100g: 1.2, carbohydrates_100g: 3, fat_100g: 0.1 } },
  { code: 'custom-pasta-sauce', product_name: 'Pasta Sauce (tomato)', brands: 'Whole Food', serving_size: '100g', nutriments: { 'energy-kcal_100g': 45, proteins_100g: 1.5, carbohydrates_100g: 7, fat_100g: 1.2 } },
  { code: 'custom-honey', product_name: 'Honey', brands: 'Whole Food', serving_size: '15g', nutriments: { 'energy-kcal_100g': 304, proteins_100g: 0.3, carbohydrates_100g: 82.4, fat_100g: 0 } },
  { code: 'custom-rice-cakes', product_name: 'Rice Cakes', brands: 'Whole Food', serving_size: '10g', nutriments: { 'energy-kcal_100g': 387, proteins_100g: 8, carbohydrates_100g: 82, fat_100g: 2.8 } },
  { code: 'custom-whey-protein', product_name: 'Whey Protein Powder', brands: 'Supplement', serving_size: '30g', nutriments: { 'energy-kcal_100g': 400, proteins_100g: 80, carbohydrates_100g: 8, fat_100g: 6 } },
  { code: 'custom-creatine', product_name: 'Creatine Monohydrate', brands: 'Supplement', serving_size: '5g', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0 } },
];

// Convert USDA food item to our standard format
function usdaToProduct(item: any): OpenFoodFactsProduct | null {
  const nutrients = item.foodNutrients || [];
  const getVal = (name: string) => {
    const n = nutrients.find((n: any) => n.nutrientName === name);
    return n ? n.value : 0;
  };

  const calories = getVal('Energy');
  const protein = getVal('Protein');
  const carbs = getVal('Carbohydrate, by difference');
  const fat = getVal('Total lipid (fat)');

  if (!calories && !protein) return null;

  return {
    code: `usda-${item.fdcId}`,
    product_name: item.description || '',
    brands: item.brandName || item.brandOwner || '',
    serving_size: item.servingSize ? `${item.servingSize}${item.servingSizeUnit || 'g'}` : '100g',
    nutriments: {
      'energy-kcal_100g': Math.round(calories),
      proteins_100g: Math.round(protein * 10) / 10,
      carbohydrates_100g: Math.round(carbs * 10) / 10,
      fat_100g: Math.round(fat * 10) / 10,
    },
  };
}

// ============================================================
// CoFID UK Database Search (2,887 government-verified UK foods)
// ============================================================

interface CofidEntry {
  c: string; // code
  n: string; // name
  g: string; // group
  k: number; // kcal
  p: number; // protein
  f: number; // fat
  b: number; // carbs
}

function searchCofid(query: string): OpenFoodFactsProduct[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const entries = cofidData as CofidEntry[];

  return entries
    .filter((entry) => {
      const name = entry.n.toLowerCase();
      return words.every((w) => name.includes(w));
    })
    .slice(0, 20)
    .map((entry) => ({
      code: `cofid-${entry.c}`,
      product_name: entry.n,
      brands: 'UK CoFID',
      serving_size: '100g',
      nutriments: {
        'energy-kcal_100g': entry.k,
        proteins_100g: entry.p,
        carbohydrates_100g: entry.b,
        fat_100g: entry.f,
      },
    }));
}

// ============================================================
// FatSecret API (large global database, free for startups)
// ============================================================

let fatSecretToken: string | null = null;
let fatSecretTokenExpiry = 0;

async function getFatSecretToken(): Promise<string | null> {
  if (fatSecretToken && Date.now() < fatSecretTokenExpiry) return fatSecretToken;
  if (!FATSECRET_CLIENT_ID || FATSECRET_CLIENT_ID.startsWith('YOUR_')) return null;

  try {
    const response = await axios.post(
      'https://oauth.fatsecret.com/connect/token',
      'grant_type=client_credentials&scope=basic',
      {
        auth: { username: FATSECRET_CLIENT_ID, password: FATSECRET_CLIENT_SECRET },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    fatSecretToken = response.data.access_token;
    fatSecretTokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
    return fatSecretToken;
  } catch {
    return null;
  }
}

async function searchFatSecret(query: string): Promise<OpenFoodFactsProduct[]> {
  const token = await getFatSecretToken();
  if (!token) return [];

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
    return (Array.isArray(foods) ? foods : [foods]).map((item: any) => {
      // Parse the description string like "Per 100g - Calories: 165kcal | Fat: 3.6g | Carbs: 0g | Protein: 31g"
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
  } catch {
    return [];
  }
}

// ============================================================
// Shared Custom Database (Firestore)
// When anyone adds a food manually, it's saved here so all
// clients can find it in future searches.
// ============================================================

export async function saveToSharedDatabase(product: OpenFoodFactsProduct): Promise<void> {
  try {
    // Don't save built-in foods or duplicates
    if (product.code.startsWith('custom-') || product.code.startsWith('usda-')) return;

    const nutrition = getNutritionPer100g(product);
    await addDoc(collection(db, 'sharedFoods'), {
      name: product.product_name,
      nameLower: product.product_name.toLowerCase(),
      brand: product.brands || '',
      servingSize: product.serving_size || '100g',
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      createdAt: Date.now(),
      searchTerms: product.product_name.toLowerCase().split(/\s+/),
    });
  } catch {
    // Silently fail - not critical
  }
}

async function searchSharedDatabase(searchQuery: string): Promise<OpenFoodFactsProduct[]> {
  try {
    const snap = await getDocs(collection(db, 'sharedFoods'));
    const q = searchQuery.toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    const results: OpenFoodFactsProduct[] = [];

    snap.forEach((doc) => {
      const data = doc.data();
      const name = (data.name || '').toLowerCase();
      if (words.every((w: string) => name.includes(w))) {
        results.push({
          code: `shared-${doc.id}`,
          product_name: data.name,
          brands: data.brand || 'Community',
          serving_size: data.servingSize || '100g',
          nutriments: {
            'energy-kcal_100g': data.calories || 0,
            proteins_100g: data.protein || 0,
            carbohydrates_100g: data.carbs || 0,
            fat_100g: data.fat || 0,
          },
        });
      }
    });

    return results;
  } catch {
    return [];
  }
}

export async function searchFoods(query: string, page = 1): Promise<OpenFoodFactsProduct[]> {
  const q = query.toLowerCase();

  // Search local common foods + UK CoFID database (instant, no API call)
  const searchWords = q.split(/\s+/).filter(Boolean);
  const localResults = COMMON_FOODS.filter((f) => {
    const name = f.product_name.toLowerCase();
    return searchWords.every((word) => name.includes(word));
  });
  const cofidResults = searchCofid(query);

  // Search shared database + all APIs in parallel
  const [sharedResults, fatSecretResults, usdaResults, offResults] = await Promise.all([
    // Shared community database (Firestore)
    searchSharedDatabase(query),

    // FatSecret (large global database)
    searchFatSecret(query),

    // USDA FoodData Central
    usdaClient.get('/foods/search', {
      params: {
        api_key: USDA_API_KEY,
        query,
        pageSize: 25,
        pageNumber: page,
        dataType: 'Foundation,SR Legacy,Branded',
        sortBy: 'dataType.keyword',
        sortOrder: 'asc',
      },
    }).then(res =>
      (res.data.foods || [])
        .map(usdaToProduct)
        .filter((p: OpenFoodFactsProduct | null): p is OpenFoodFactsProduct =>
          p !== null && p.product_name.length > 2
        )
    ).catch(() => [] as OpenFoodFactsProduct[]),

    // Open Food Facts
    offClient.get('/cgi/search.pl', {
      params: {
        search_terms: query,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: 25,
        page,
        fields: 'code,product_name,brands,nutriments,serving_size,image_url',
        sort_by: 'unique_scans_n',
      },
    }).then(res => {
      const junkNames = ['use by', 'best before', 'test', 'barcode', 'unknown', 'n/a', 'product'];
      return (res.data.products || []).filter(
        (p: OpenFoodFactsProduct) =>
          p.product_name &&
          p.product_name.length > 2 &&
          p.nutriments &&
          (p.nutriments['energy-kcal_100g'] !== undefined || p.nutriments.proteins_100g !== undefined) &&
          !junkNames.includes(p.product_name.toLowerCase().trim())
      );
    }).catch(() => [] as OpenFoodFactsProduct[]),
  ]);

  // Dedupe by name
  const seen = new Set<string>();
  const combined: OpenFoodFactsProduct[] = [];

  for (const item of [...localResults, ...cofidResults, ...sharedResults, ...fatSecretResults, ...usdaResults, ...offResults]) {
    const key = item.product_name.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(item);
    }
  }

  return combined;
}

export async function getProductByBarcode(barcode: string): Promise<OpenFoodFactsProduct | null> {
  try {
    const response = await offClient.get(`/api/v0/product/${barcode}.json`);
    if (response.data.status === 1) {
      return response.data.product;
    }
  } catch {
    // barcode lookup failed
  }
  return null;
}

export function getNutritionPer100g(product: OpenFoodFactsProduct) {
  const n = product.nutriments;
  return {
    calories: Math.round(n['energy-kcal_100g'] || 0),
    protein: Math.round((n.proteins_100g || 0) * 10) / 10,
    carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
    fat: Math.round((n.fat_100g || 0) * 10) / 10,
  };
}

export function getNutritionPerServing(product: OpenFoodFactsProduct) {
  const n = product.nutriments;
  if (n['energy-kcal_serving']) {
    return {
      calories: Math.round(n['energy-kcal_serving'] || 0),
      protein: Math.round((n.proteins_serving || 0) * 10) / 10,
      carbs: Math.round((n.carbohydrates_serving || 0) * 10) / 10,
      fat: Math.round((n.fat_serving || 0) * 10) / 10,
    };
  }
  return null;
}
