// =============================================================================
// UK Food Nutrition Database
// Comprehensive local database for instant food lookups.
// Values are based on published UK nutritional data, rounded to nearest whole
// number for calories and 1 decimal place for macros.
// =============================================================================

export interface FoodItem {
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  category: string;
}

export const foodDatabase: FoodItem[] = [

  // ===========================================================================
  // COSTA COFFEE - HOT DRINKS
  // ===========================================================================
  { name: "Costa Latte (Small)", brand: "Costa", calories: 106, protein: 6.4, carbs: 9.2, fat: 4.8, servingSize: "Small (12oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Latte (Medium)", brand: "Costa", calories: 153, protein: 9.2, carbs: 13.3, fat: 6.9, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Latte (Large)", brand: "Costa", calories: 204, protein: 12.3, carbs: 17.7, fat: 9.2, servingSize: "Large (20oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Cappuccino (Small)", brand: "Costa", calories: 97, protein: 6.1, carbs: 8.4, fat: 4.4, servingSize: "Small (12oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Cappuccino (Medium)", brand: "Costa", calories: 132, protein: 8.3, carbs: 11.4, fat: 6.0, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Cappuccino (Large)", brand: "Costa", calories: 170, protein: 10.7, carbs: 14.8, fat: 7.7, servingSize: "Large (20oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Americano (Small)", brand: "Costa", calories: 6, protein: 0.4, carbs: 0.7, fat: 0.1, servingSize: "Small (12oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Americano (Medium)", brand: "Costa", calories: 8, protein: 0.5, carbs: 0.9, fat: 0.1, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Americano (Large)", brand: "Costa", calories: 10, protein: 0.7, carbs: 1.2, fat: 0.2, servingSize: "Large (20oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Flat White", brand: "Costa", calories: 140, protein: 8.5, carbs: 11.6, fat: 6.6, servingSize: "1 cup", category: "Coffee Shop Drinks" },
  { name: "Costa Mocha (Small)", brand: "Costa", calories: 198, protein: 7.2, carbs: 26.0, fat: 7.1, servingSize: "Small (12oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Mocha (Medium)", brand: "Costa", calories: 280, protein: 10.1, carbs: 36.8, fat: 10.1, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Mocha (Large)", brand: "Costa", calories: 365, protein: 13.2, carbs: 48.0, fat: 13.2, servingSize: "Large (20oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Hot Chocolate (Small)", brand: "Costa", calories: 236, protein: 8.2, carbs: 30.5, fat: 8.8, servingSize: "Small (12oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Hot Chocolate (Medium)", brand: "Costa", calories: 322, protein: 11.2, carbs: 41.6, fat: 12.0, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Hot Chocolate (Large)", brand: "Costa", calories: 414, protein: 14.4, carbs: 53.5, fat: 15.4, servingSize: "Large (20oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Cortado", brand: "Costa", calories: 42, protein: 2.5, carbs: 3.6, fat: 1.9, servingSize: "1 cup", category: "Coffee Shop Drinks" },
  { name: "Costa Espresso (Single)", brand: "Costa", calories: 3, protein: 0.2, carbs: 0.3, fat: 0.0, servingSize: "1 shot", category: "Coffee Shop Drinks" },
  { name: "Costa Espresso (Double)", brand: "Costa", calories: 6, protein: 0.4, carbs: 0.6, fat: 0.1, servingSize: "2 shots", category: "Coffee Shop Drinks" },
  { name: "Costa Chai Latte (Medium)", brand: "Costa", calories: 203, protein: 6.8, carbs: 33.0, fat: 4.8, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Matcha Latte (Medium)", brand: "Costa", calories: 180, protein: 7.5, carbs: 24.0, fat: 5.5, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },

  // COSTA - ICED DRINKS
  { name: "Costa Iced Latte (Medium)", brand: "Costa", calories: 130, protein: 7.8, carbs: 11.2, fat: 5.8, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Iced Cappuccino (Medium)", brand: "Costa", calories: 120, protein: 7.2, carbs: 10.4, fat: 5.4, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Iced Americano (Medium)", brand: "Costa", calories: 8, protein: 0.5, carbs: 0.9, fat: 0.1, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Iced Mocha (Medium)", brand: "Costa", calories: 250, protein: 8.8, carbs: 33.0, fat: 9.0, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Frappe (Caramel, Medium)", brand: "Costa", calories: 350, protein: 6.0, carbs: 52.0, fat: 12.0, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },
  { name: "Costa Frappe (Chocolate, Medium)", brand: "Costa", calories: 360, protein: 6.5, carbs: 54.0, fat: 12.5, servingSize: "Medium (16oz)", category: "Coffee Shop Drinks" },

  // COSTA - FOOD
  { name: "Costa Croissant (Butter)", brand: "Costa", calories: 289, protein: 5.5, carbs: 28.0, fat: 17.0, servingSize: "1 croissant", category: "Coffee Shop Food" },
  { name: "Costa Pain au Chocolat", brand: "Costa", calories: 320, protein: 5.8, carbs: 33.0, fat: 18.5, servingSize: "1 pastry", category: "Coffee Shop Food" },
  { name: "Costa Cheese & Ham Toastie", brand: "Costa", calories: 394, protein: 19.5, carbs: 32.0, fat: 20.0, servingSize: "1 toastie", category: "Coffee Shop Food" },
  { name: "Costa Tuna Melt Panini", brand: "Costa", calories: 445, protein: 24.0, carbs: 38.0, fat: 21.0, servingSize: "1 panini", category: "Coffee Shop Food" },
  { name: "Costa Bacon & Egg Roll", brand: "Costa", calories: 376, protein: 21.0, carbs: 30.0, fat: 18.0, servingSize: "1 roll", category: "Coffee Shop Food" },
  { name: "Costa Ham & Cheese Toastie", brand: "Costa", calories: 370, protein: 18.0, carbs: 31.0, fat: 19.0, servingSize: "1 toastie", category: "Coffee Shop Food" },
  { name: "Costa Chicken & Bacon Panini", brand: "Costa", calories: 460, protein: 27.0, carbs: 36.0, fat: 22.0, servingSize: "1 panini", category: "Coffee Shop Food" },
  { name: "Costa BLT Sandwich", brand: "Costa", calories: 385, protein: 16.0, carbs: 34.0, fat: 20.0, servingSize: "1 sandwich", category: "Coffee Shop Food" },
  { name: "Costa Chocolate Muffin", brand: "Costa", calories: 450, protein: 6.5, carbs: 56.0, fat: 22.0, servingSize: "1 muffin", category: "Coffee Shop Food" },
  { name: "Costa Blueberry Muffin", brand: "Costa", calories: 420, protein: 5.8, carbs: 54.0, fat: 20.0, servingSize: "1 muffin", category: "Coffee Shop Food" },
  { name: "Costa Carrot Cake Slice", brand: "Costa", calories: 415, protein: 4.5, carbs: 48.0, fat: 23.0, servingSize: "1 slice", category: "Coffee Shop Food" },
  { name: "Costa Victoria Sponge Slice", brand: "Costa", calories: 380, protein: 4.0, carbs: 46.0, fat: 20.0, servingSize: "1 slice", category: "Coffee Shop Food" },
  { name: "Costa Chocolate Brownie", brand: "Costa", calories: 390, protein: 5.0, carbs: 44.0, fat: 22.0, servingSize: "1 brownie", category: "Coffee Shop Food" },
  { name: "Costa Shortbread", brand: "Costa", calories: 250, protein: 2.8, carbs: 28.0, fat: 14.0, servingSize: "1 piece", category: "Coffee Shop Food" },

  // ===========================================================================
  // STARBUCKS - HOT DRINKS
  // ===========================================================================
  { name: "Starbucks Latte (Tall)", brand: "Starbucks", calories: 150, protein: 10.0, carbs: 15.0, fat: 6.0, servingSize: "Tall (12oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Latte (Grande)", brand: "Starbucks", calories: 190, protein: 13.0, carbs: 19.0, fat: 7.0, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Latte (Venti)", brand: "Starbucks", calories: 250, protein: 16.0, carbs: 24.0, fat: 9.0, servingSize: "Venti (20oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Cappuccino (Tall)", brand: "Starbucks", calories: 90, protein: 6.0, carbs: 9.0, fat: 4.0, servingSize: "Tall (12oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Cappuccino (Grande)", brand: "Starbucks", calories: 120, protein: 8.0, carbs: 12.0, fat: 5.0, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Cappuccino (Venti)", brand: "Starbucks", calories: 160, protein: 10.0, carbs: 15.0, fat: 7.0, servingSize: "Venti (20oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Americano (Tall)", brand: "Starbucks", calories: 5, protein: 0.3, carbs: 0.6, fat: 0.0, servingSize: "Tall (12oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Americano (Grande)", brand: "Starbucks", calories: 10, protein: 0.6, carbs: 1.0, fat: 0.1, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Americano (Venti)", brand: "Starbucks", calories: 15, protein: 1.0, carbs: 1.5, fat: 0.1, servingSize: "Venti (20oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Flat White", brand: "Starbucks", calories: 143, protein: 8.6, carbs: 12.0, fat: 6.8, servingSize: "1 cup (Short)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Mocha (Tall)", brand: "Starbucks", calories: 230, protein: 8.0, carbs: 32.0, fat: 8.0, servingSize: "Tall (12oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Mocha (Grande)", brand: "Starbucks", calories: 310, protein: 10.0, carbs: 43.0, fat: 11.0, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Hot Chocolate (Tall)", brand: "Starbucks", calories: 250, protein: 9.0, carbs: 34.0, fat: 8.5, servingSize: "Tall (12oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Hot Chocolate (Grande)", brand: "Starbucks", calories: 340, protein: 12.0, carbs: 46.0, fat: 11.5, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Caramel Macchiato (Grande)", brand: "Starbucks", calories: 250, protein: 10.0, carbs: 34.0, fat: 7.0, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Chai Tea Latte (Grande)", brand: "Starbucks", calories: 240, protein: 8.0, carbs: 42.0, fat: 4.5, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Matcha Latte (Grande)", brand: "Starbucks", calories: 200, protein: 9.0, carbs: 28.0, fat: 5.0, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Espresso (Solo)", brand: "Starbucks", calories: 5, protein: 0.3, carbs: 0.5, fat: 0.0, servingSize: "1 shot", category: "Coffee Shop Drinks" },

  // STARBUCKS - ICED DRINKS
  { name: "Starbucks Iced Latte (Grande)", brand: "Starbucks", calories: 130, protein: 8.0, carbs: 13.0, fat: 5.0, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Iced Caramel Macchiato (Grande)", brand: "Starbucks", calories: 230, protein: 8.0, carbs: 33.0, fat: 6.0, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Iced Americano (Grande)", brand: "Starbucks", calories: 10, protein: 0.6, carbs: 1.0, fat: 0.1, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Frappuccino (Caramel, Grande)", brand: "Starbucks", calories: 380, protein: 5.0, carbs: 58.0, fat: 14.0, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Frappuccino (Mocha, Grande)", brand: "Starbucks", calories: 370, protein: 5.5, carbs: 55.0, fat: 14.0, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Starbucks Frappuccino (Vanilla, Grande)", brand: "Starbucks", calories: 350, protein: 5.0, carbs: 52.0, fat: 13.0, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },

  // STARBUCKS - FOOD
  { name: "Starbucks Croissant (Butter)", brand: "Starbucks", calories: 272, protein: 5.0, carbs: 26.0, fat: 16.0, servingSize: "1 croissant", category: "Coffee Shop Food" },
  { name: "Starbucks Pain au Chocolat", brand: "Starbucks", calories: 330, protein: 6.0, carbs: 34.0, fat: 19.0, servingSize: "1 pastry", category: "Coffee Shop Food" },
  { name: "Starbucks Chocolate Muffin", brand: "Starbucks", calories: 470, protein: 7.0, carbs: 58.0, fat: 23.0, servingSize: "1 muffin", category: "Coffee Shop Food" },
  { name: "Starbucks Blueberry Muffin", brand: "Starbucks", calories: 430, protein: 6.0, carbs: 55.0, fat: 20.0, servingSize: "1 muffin", category: "Coffee Shop Food" },
  { name: "Starbucks Egg & Cheese Wrap", brand: "Starbucks", calories: 340, protein: 16.0, carbs: 28.0, fat: 18.0, servingSize: "1 wrap", category: "Coffee Shop Food" },
  { name: "Starbucks Chicken & Bacon Sandwich", brand: "Starbucks", calories: 445, protein: 24.0, carbs: 38.0, fat: 21.0, servingSize: "1 sandwich", category: "Coffee Shop Food" },
  { name: "Starbucks Toasted Cheese Toastie", brand: "Starbucks", calories: 380, protein: 17.0, carbs: 30.0, fat: 21.0, servingSize: "1 toastie", category: "Coffee Shop Food" },
  { name: "Starbucks Cookie (Chocolate Chunk)", brand: "Starbucks", calories: 340, protein: 4.0, carbs: 42.0, fat: 17.0, servingSize: "1 cookie", category: "Coffee Shop Food" },
  { name: "Starbucks Brownie", brand: "Starbucks", calories: 390, protein: 5.0, carbs: 44.0, fat: 22.0, servingSize: "1 brownie", category: "Coffee Shop Food" },
  { name: "Starbucks Banana Loaf Slice", brand: "Starbucks", calories: 410, protein: 5.5, carbs: 50.0, fat: 21.0, servingSize: "1 slice", category: "Coffee Shop Food" },

  // ===========================================================================
  // CAFFE NERO
  // ===========================================================================
  { name: "Caffe Nero Latte (Regular)", brand: "Caffe Nero", calories: 147, protein: 8.8, carbs: 12.8, fat: 6.6, servingSize: "Regular (12oz)", category: "Coffee Shop Drinks" },
  { name: "Caffe Nero Latte (Grande)", brand: "Caffe Nero", calories: 198, protein: 11.9, carbs: 17.2, fat: 8.9, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Caffe Nero Cappuccino (Regular)", brand: "Caffe Nero", calories: 110, protein: 6.6, carbs: 9.6, fat: 5.0, servingSize: "Regular (12oz)", category: "Coffee Shop Drinks" },
  { name: "Caffe Nero Cappuccino (Grande)", brand: "Caffe Nero", calories: 148, protein: 8.9, carbs: 12.9, fat: 6.7, servingSize: "Grande (16oz)", category: "Coffee Shop Drinks" },
  { name: "Caffe Nero Americano (Regular)", brand: "Caffe Nero", calories: 6, protein: 0.4, carbs: 0.7, fat: 0.1, servingSize: "Regular (12oz)", category: "Coffee Shop Drinks" },
  { name: "Caffe Nero Flat White", brand: "Caffe Nero", calories: 135, protein: 8.1, carbs: 11.2, fat: 6.4, servingSize: "1 cup", category: "Coffee Shop Drinks" },
  { name: "Caffe Nero Mocha (Regular)", brand: "Caffe Nero", calories: 218, protein: 8.0, carbs: 28.0, fat: 8.0, servingSize: "Regular (12oz)", category: "Coffee Shop Drinks" },
  { name: "Caffe Nero Hot Chocolate (Regular)", brand: "Caffe Nero", calories: 258, protein: 9.0, carbs: 33.0, fat: 9.5, servingSize: "Regular (12oz)", category: "Coffee Shop Drinks" },
  { name: "Caffe Nero Chai Latte (Regular)", brand: "Caffe Nero", calories: 195, protein: 6.5, carbs: 32.0, fat: 4.5, servingSize: "Regular (12oz)", category: "Coffee Shop Drinks" },
  { name: "Caffe Nero Croissant", brand: "Caffe Nero", calories: 280, protein: 5.2, carbs: 27.0, fat: 16.5, servingSize: "1 croissant", category: "Coffee Shop Food" },
  { name: "Caffe Nero Ham & Cheese Panini", brand: "Caffe Nero", calories: 420, protein: 20.0, carbs: 36.0, fat: 21.0, servingSize: "1 panini", category: "Coffee Shop Food" },
  { name: "Caffe Nero Chocolate Twist", brand: "Caffe Nero", calories: 310, protein: 5.5, carbs: 32.0, fat: 18.0, servingSize: "1 pastry", category: "Coffee Shop Food" },

  // ===========================================================================
  // PRET A MANGER
  // ===========================================================================
  { name: "Pret Latte (Regular)", brand: "Pret", calories: 148, protein: 8.8, carbs: 12.5, fat: 6.8, servingSize: "Regular", category: "Coffee Shop Drinks" },
  { name: "Pret Cappuccino (Regular)", brand: "Pret", calories: 105, protein: 6.3, carbs: 9.0, fat: 4.8, servingSize: "Regular", category: "Coffee Shop Drinks" },
  { name: "Pret Americano (Regular)", brand: "Pret", calories: 5, protein: 0.3, carbs: 0.5, fat: 0.0, servingSize: "Regular", category: "Coffee Shop Drinks" },
  { name: "Pret Flat White", brand: "Pret", calories: 130, protein: 7.8, carbs: 10.8, fat: 6.2, servingSize: "1 cup", category: "Coffee Shop Drinks" },
  { name: "Pret Mocha (Regular)", brand: "Pret", calories: 240, protein: 8.5, carbs: 32.0, fat: 8.5, servingSize: "Regular", category: "Coffee Shop Drinks" },
  { name: "Pret Hot Chocolate (Regular)", brand: "Pret", calories: 260, protein: 9.5, carbs: 34.0, fat: 9.8, servingSize: "Regular", category: "Coffee Shop Drinks" },
  { name: "Pret Chicken Caesar Wrap", brand: "Pret", calories: 450, protein: 28.0, carbs: 36.0, fat: 20.0, servingSize: "1 wrap", category: "Coffee Shop Food" },
  { name: "Pret Chicken & Avocado Sandwich", brand: "Pret", calories: 480, protein: 26.0, carbs: 38.0, fat: 24.0, servingSize: "1 sandwich", category: "Coffee Shop Food" },
  { name: "Pret Tuna Mayo Baguette", brand: "Pret", calories: 510, protein: 24.0, carbs: 48.0, fat: 24.0, servingSize: "1 baguette", category: "Coffee Shop Food" },
  { name: "Pret Egg Mayo Sandwich", brand: "Pret", calories: 395, protein: 16.0, carbs: 34.0, fat: 21.0, servingSize: "1 sandwich", category: "Coffee Shop Food" },
  { name: "Pret Hoisin Duck Wrap", brand: "Pret", calories: 430, protein: 20.0, carbs: 48.0, fat: 16.0, servingSize: "1 wrap", category: "Coffee Shop Food" },
  { name: "Pret Falafel & Halloumi Wrap", brand: "Pret", calories: 470, protein: 18.0, carbs: 44.0, fat: 24.0, servingSize: "1 wrap", category: "Coffee Shop Food" },
  { name: "Pret Chicken & Bacon Club", brand: "Pret", calories: 520, protein: 30.0, carbs: 40.0, fat: 26.0, servingSize: "1 sandwich", category: "Coffee Shop Food" },
  { name: "Pret Chef's Italian Chicken Salad", brand: "Pret", calories: 320, protein: 25.0, carbs: 12.0, fat: 19.0, servingSize: "1 salad", category: "Coffee Shop Food" },
  { name: "Pret Protein Box (Chicken)", brand: "Pret", calories: 350, protein: 30.0, carbs: 20.0, fat: 16.0, servingSize: "1 box", category: "Coffee Shop Food" },
  { name: "Pret Croissant", brand: "Pret", calories: 275, protein: 5.0, carbs: 26.0, fat: 16.5, servingSize: "1 croissant", category: "Coffee Shop Food" },
  { name: "Pret Pain au Chocolat", brand: "Pret", calories: 315, protein: 5.5, carbs: 32.0, fat: 18.5, servingSize: "1 pastry", category: "Coffee Shop Food" },
  { name: "Pret Chocolate Brownie", brand: "Pret", calories: 380, protein: 4.5, carbs: 42.0, fat: 22.0, servingSize: "1 brownie", category: "Coffee Shop Food" },
  { name: "Pret Cookie (Chocolate Chunk)", brand: "Pret", calories: 360, protein: 4.0, carbs: 44.0, fat: 18.0, servingSize: "1 cookie", category: "Coffee Shop Food" },

  // ===========================================================================
  // McDONALD'S
  // ===========================================================================
  { name: "McDonald's Big Mac", brand: "McDonald's", calories: 508, protein: 25.0, carbs: 43.0, fat: 25.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "McDonald's Quarter Pounder with Cheese", brand: "McDonald's", calories: 518, protein: 30.0, carbs: 37.0, fat: 27.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "McDonald's Double Quarter Pounder with Cheese", brand: "McDonald's", calories: 748, protein: 48.0, carbs: 37.0, fat: 43.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "McDonald's McChicken Sandwich", brand: "McDonald's", calories: 388, protein: 16.0, carbs: 40.0, fat: 18.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "McDonald's Filet-O-Fish", brand: "McDonald's", calories: 329, protein: 15.0, carbs: 33.0, fat: 15.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "McDonald's Cheeseburger", brand: "McDonald's", calories: 301, protein: 16.0, carbs: 30.0, fat: 12.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "McDonald's Double Cheeseburger", brand: "McDonald's", calories: 445, protein: 25.0, carbs: 30.0, fat: 23.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "McDonald's Hamburger", brand: "McDonald's", calories: 250, protein: 13.0, carbs: 30.0, fat: 8.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "McDonald's Chicken McNuggets (6)", brand: "McDonald's", calories: 259, protein: 16.0, carbs: 15.0, fat: 15.0, servingSize: "6 pieces", category: "Fast Food" },
  { name: "McDonald's Chicken McNuggets (9)", brand: "McDonald's", calories: 388, protein: 24.0, carbs: 22.0, fat: 23.0, servingSize: "9 pieces", category: "Fast Food" },
  { name: "McDonald's Chicken McNuggets (20)", brand: "McDonald's", calories: 863, protein: 53.0, carbs: 49.0, fat: 50.0, servingSize: "20 pieces", category: "Fast Food" },
  { name: "McDonald's Chicken Selects (3)", brand: "McDonald's", calories: 345, protein: 22.0, carbs: 22.0, fat: 19.0, servingSize: "3 pieces", category: "Fast Food" },
  { name: "McDonald's McChicken Legend", brand: "McDonald's", calories: 470, protein: 25.0, carbs: 44.0, fat: 21.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "McDonald's Crispy Chicken Wrap", brand: "McDonald's", calories: 380, protein: 18.0, carbs: 38.0, fat: 16.0, servingSize: "1 wrap", category: "Fast Food" },
  { name: "McDonald's Grilled Chicken Wrap", brand: "McDonald's", calories: 340, protein: 22.0, carbs: 34.0, fat: 12.0, servingSize: "1 wrap", category: "Fast Food" },
  { name: "McDonald's Fries (Small)", brand: "McDonald's", calories: 222, protein: 2.8, carbs: 29.0, fat: 11.0, servingSize: "Small", category: "Fast Food" },
  { name: "McDonald's Fries (Medium)", brand: "McDonald's", calories: 337, protein: 4.3, carbs: 44.0, fat: 16.0, servingSize: "Medium", category: "Fast Food" },
  { name: "McDonald's Fries (Large)", brand: "McDonald's", calories: 444, protein: 5.7, carbs: 58.0, fat: 22.0, servingSize: "Large", category: "Fast Food" },
  { name: "McDonald's Chicken Legend (Spicy Mayo)", brand: "McDonald's", calories: 497, protein: 24.0, carbs: 44.0, fat: 24.0, servingSize: "1 burger", category: "Fast Food" },

  // McDonald's Breakfast
  { name: "McDonald's Sausage & Egg McMuffin", brand: "McDonald's", calories: 430, protein: 23.0, carbs: 26.0, fat: 25.0, servingSize: "1 McMuffin", category: "Fast Food" },
  { name: "McDonald's Egg McMuffin", brand: "McDonald's", calories: 290, protein: 17.0, carbs: 26.0, fat: 12.0, servingSize: "1 McMuffin", category: "Fast Food" },
  { name: "McDonald's Bacon & Egg McMuffin", brand: "McDonald's", calories: 335, protein: 20.0, carbs: 26.0, fat: 16.0, servingSize: "1 McMuffin", category: "Fast Food" },
  { name: "McDonald's Double Sausage & Egg McMuffin", brand: "McDonald's", calories: 565, protein: 31.0, carbs: 26.0, fat: 37.0, servingSize: "1 McMuffin", category: "Fast Food" },
  { name: "McDonald's Hash Brown", brand: "McDonald's", calories: 133, protein: 1.3, carbs: 14.0, fat: 8.0, servingSize: "1 piece", category: "Fast Food" },
  { name: "McDonald's Pancakes (with Syrup)", brand: "McDonald's", calories: 470, protein: 9.0, carbs: 84.0, fat: 10.0, servingSize: "3 pancakes", category: "Fast Food" },
  { name: "McDonald's Breakfast Wrap (Sausage)", brand: "McDonald's", calories: 485, protein: 22.0, carbs: 32.0, fat: 29.0, servingSize: "1 wrap", category: "Fast Food" },

  // McDonald's Desserts
  { name: "McDonald's McFlurry (Oreo)", brand: "McDonald's", calories: 339, protein: 8.0, carbs: 47.0, fat: 13.0, servingSize: "1 regular", category: "Fast Food" },
  { name: "McDonald's McFlurry (Maltesers)", brand: "McDonald's", calories: 365, protein: 8.5, carbs: 52.0, fat: 13.0, servingSize: "1 regular", category: "Fast Food" },
  { name: "McDonald's McFlurry (Smarties)", brand: "McDonald's", calories: 355, protein: 8.0, carbs: 50.0, fat: 13.0, servingSize: "1 regular", category: "Fast Food" },
  { name: "McDonald's Apple Pie", brand: "McDonald's", calories: 237, protein: 2.5, carbs: 28.0, fat: 13.0, servingSize: "1 pie", category: "Fast Food" },
  { name: "McDonald's Mozzarella Dippers (3)", brand: "McDonald's", calories: 175, protein: 7.0, carbs: 15.0, fat: 10.0, servingSize: "3 pieces", category: "Fast Food" },

  // McDonald's Drinks
  { name: "McDonald's Coca-Cola (Medium)", brand: "McDonald's", calories: 170, protein: 0.0, carbs: 42.0, fat: 0.0, servingSize: "Medium", category: "Fast Food" },
  { name: "McDonald's Diet Coke (Medium)", brand: "McDonald's", calories: 1, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "Medium", category: "Fast Food" },
  { name: "McDonald's Milkshake (Chocolate, Medium)", brand: "McDonald's", calories: 380, protein: 10.0, carbs: 58.0, fat: 11.0, servingSize: "Medium", category: "Fast Food" },
  { name: "McDonald's Milkshake (Strawberry, Medium)", brand: "McDonald's", calories: 370, protein: 10.0, carbs: 56.0, fat: 10.0, servingSize: "Medium", category: "Fast Food" },
  { name: "McDonald's Milkshake (Vanilla, Medium)", brand: "McDonald's", calories: 365, protein: 10.0, carbs: 55.0, fat: 10.0, servingSize: "Medium", category: "Fast Food" },

  // ===========================================================================
  // KFC
  // ===========================================================================
  { name: "KFC Original Chicken Piece (Breast)", brand: "KFC", calories: 260, protein: 25.0, carbs: 9.0, fat: 14.0, servingSize: "1 piece", category: "Fast Food" },
  { name: "KFC Original Chicken Piece (Drumstick)", brand: "KFC", calories: 140, protein: 13.0, carbs: 5.0, fat: 8.0, servingSize: "1 piece", category: "Fast Food" },
  { name: "KFC Original Chicken Piece (Thigh)", brand: "KFC", calories: 220, protein: 17.0, carbs: 7.0, fat: 14.0, servingSize: "1 piece", category: "Fast Food" },
  { name: "KFC Zinger Burger", brand: "KFC", calories: 450, protein: 22.0, carbs: 40.0, fat: 22.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "KFC Tower Burger", brand: "KFC", calories: 580, protein: 28.0, carbs: 46.0, fat: 30.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "KFC Fillet Burger", brand: "KFC", calories: 450, protein: 25.0, carbs: 38.0, fat: 22.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "KFC Mighty Bucket for One", brand: "KFC", calories: 1150, protein: 55.0, carbs: 90.0, fat: 60.0, servingSize: "1 bucket", category: "Fast Food" },
  { name: "KFC Popcorn Chicken (Regular)", brand: "KFC", calories: 285, protein: 18.0, carbs: 17.0, fat: 16.0, servingSize: "Regular", category: "Fast Food" },
  { name: "KFC Popcorn Chicken (Large)", brand: "KFC", calories: 475, protein: 30.0, carbs: 28.0, fat: 27.0, servingSize: "Large", category: "Fast Food" },
  { name: "KFC Boneless Banquet", brand: "KFC", calories: 680, protein: 36.0, carbs: 58.0, fat: 32.0, servingSize: "1 meal", category: "Fast Food" },
  { name: "KFC Fries (Regular)", brand: "KFC", calories: 260, protein: 3.0, carbs: 34.0, fat: 12.0, servingSize: "Regular", category: "Fast Food" },
  { name: "KFC Fries (Large)", brand: "KFC", calories: 390, protein: 4.5, carbs: 51.0, fat: 18.0, servingSize: "Large", category: "Fast Food" },
  { name: "KFC Gravy (Regular)", brand: "KFC", calories: 75, protein: 1.5, carbs: 8.0, fat: 4.0, servingSize: "Regular pot", category: "Fast Food" },
  { name: "KFC Corn on the Cob", brand: "KFC", calories: 150, protein: 4.5, carbs: 18.0, fat: 7.0, servingSize: "1 cob", category: "Fast Food" },
  { name: "KFC Coleslaw (Regular)", brand: "KFC", calories: 135, protein: 1.0, carbs: 10.0, fat: 10.0, servingSize: "Regular", category: "Fast Food" },
  { name: "KFC Rice Box (Original)", brand: "KFC", calories: 520, protein: 25.0, carbs: 55.0, fat: 20.0, servingSize: "1 box", category: "Fast Food" },
  { name: "KFC Zinger Rice Box", brand: "KFC", calories: 545, protein: 24.0, carbs: 56.0, fat: 22.0, servingSize: "1 box", category: "Fast Food" },
  { name: "KFC Mini Fillet Wrap", brand: "KFC", calories: 290, protein: 16.0, carbs: 28.0, fat: 12.0, servingSize: "1 wrap", category: "Fast Food" },
  { name: "KFC Zinger Wrap", brand: "KFC", calories: 440, protein: 22.0, carbs: 40.0, fat: 21.0, servingSize: "1 wrap", category: "Fast Food" },

  // ===========================================================================
  // BURGER KING
  // ===========================================================================
  { name: "Burger King Whopper", brand: "Burger King", calories: 660, protein: 28.0, carbs: 49.0, fat: 40.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Burger King Whopper with Cheese", brand: "Burger King", calories: 740, protein: 33.0, carbs: 50.0, fat: 46.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Burger King Double Whopper", brand: "Burger King", calories: 900, protein: 48.0, carbs: 49.0, fat: 56.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Burger King Chicken Royale", brand: "Burger King", calories: 570, protein: 22.0, carbs: 48.0, fat: 32.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Burger King Bacon Double Cheeseburger", brand: "Burger King", calories: 370, protein: 22.0, carbs: 27.0, fat: 19.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Burger King Fries (Small)", brand: "Burger King", calories: 230, protein: 3.0, carbs: 30.0, fat: 11.0, servingSize: "Small", category: "Fast Food" },
  { name: "Burger King Fries (Medium)", brand: "Burger King", calories: 330, protein: 4.0, carbs: 43.0, fat: 16.0, servingSize: "Medium", category: "Fast Food" },
  { name: "Burger King Fries (Large)", brand: "Burger King", calories: 430, protein: 5.5, carbs: 56.0, fat: 20.0, servingSize: "Large", category: "Fast Food" },
  { name: "Burger King Onion Rings (Regular)", brand: "Burger King", calories: 310, protein: 4.0, carbs: 35.0, fat: 17.0, servingSize: "Regular", category: "Fast Food" },
  { name: "Burger King Veggie Bean Burger", brand: "Burger King", calories: 490, protein: 14.0, carbs: 58.0, fat: 22.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Burger King Plant-Based Whopper", brand: "Burger King", calories: 630, protein: 20.0, carbs: 52.0, fat: 36.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Burger King Chicken Nuggets (6)", brand: "Burger King", calories: 260, protein: 13.0, carbs: 16.0, fat: 16.0, servingSize: "6 pieces", category: "Fast Food" },

  // ===========================================================================
  // SUBWAY
  // ===========================================================================
  { name: "Subway Chicken Tikka Sub (6 inch)", brand: "Subway", calories: 340, protein: 24.0, carbs: 42.0, fat: 6.0, servingSize: "6 inch", category: "Fast Food" },
  { name: "Subway Chicken Tikka Sub (Footlong)", brand: "Subway", calories: 680, protein: 48.0, carbs: 84.0, fat: 12.0, servingSize: "Footlong", category: "Fast Food" },
  { name: "Subway Italian BMT (6 inch)", brand: "Subway", calories: 410, protein: 20.0, carbs: 42.0, fat: 17.0, servingSize: "6 inch", category: "Fast Food" },
  { name: "Subway Italian BMT (Footlong)", brand: "Subway", calories: 820, protein: 40.0, carbs: 84.0, fat: 34.0, servingSize: "Footlong", category: "Fast Food" },
  { name: "Subway Tuna Sub (6 inch)", brand: "Subway", calories: 400, protein: 18.0, carbs: 42.0, fat: 16.0, servingSize: "6 inch", category: "Fast Food" },
  { name: "Subway Tuna Sub (Footlong)", brand: "Subway", calories: 800, protein: 36.0, carbs: 84.0, fat: 32.0, servingSize: "Footlong", category: "Fast Food" },
  { name: "Subway Turkey Breast Sub (6 inch)", brand: "Subway", calories: 280, protein: 18.0, carbs: 42.0, fat: 3.5, servingSize: "6 inch", category: "Fast Food" },
  { name: "Subway Turkey Breast Sub (Footlong)", brand: "Subway", calories: 560, protein: 36.0, carbs: 84.0, fat: 7.0, servingSize: "Footlong", category: "Fast Food" },
  { name: "Subway Steak & Cheese Sub (6 inch)", brand: "Subway", calories: 380, protein: 24.0, carbs: 42.0, fat: 10.0, servingSize: "6 inch", category: "Fast Food" },
  { name: "Subway Meatball Marinara (6 inch)", brand: "Subway", calories: 480, protein: 22.0, carbs: 52.0, fat: 19.0, servingSize: "6 inch", category: "Fast Food" },
  { name: "Subway Chicken Teriyaki (6 inch)", brand: "Subway", calories: 340, protein: 22.0, carbs: 48.0, fat: 5.0, servingSize: "6 inch", category: "Fast Food" },
  { name: "Subway Ham Sub (6 inch)", brand: "Subway", calories: 270, protein: 16.0, carbs: 42.0, fat: 4.0, servingSize: "6 inch", category: "Fast Food" },
  { name: "Subway Veggie Delite (6 inch)", brand: "Subway", calories: 230, protein: 8.0, carbs: 42.0, fat: 2.5, servingSize: "6 inch", category: "Fast Food" },
  { name: "Subway Cookie (Chocolate Chip)", brand: "Subway", calories: 220, protein: 2.5, carbs: 30.0, fat: 10.0, servingSize: "1 cookie", category: "Fast Food" },
  { name: "Subway Cookie (White Chip Macadamia)", brand: "Subway", calories: 220, protein: 2.0, carbs: 28.0, fat: 11.0, servingSize: "1 cookie", category: "Fast Food" },
  { name: "Subway Cookie (Double Chocolate)", brand: "Subway", calories: 210, protein: 2.5, carbs: 30.0, fat: 10.0, servingSize: "1 cookie", category: "Fast Food" },

  // ===========================================================================
  // NANDO'S
  // ===========================================================================
  { name: "Nando's 1/4 Chicken Breast", brand: "Nando's", calories: 232, protein: 36.0, carbs: 0.0, fat: 9.5, servingSize: "1/4 chicken", category: "Fast Food" },
  { name: "Nando's 1/4 Chicken Leg", brand: "Nando's", calories: 278, protein: 28.0, carbs: 0.0, fat: 18.0, servingSize: "1/4 chicken", category: "Fast Food" },
  { name: "Nando's 1/2 Chicken", brand: "Nando's", calories: 510, protein: 64.0, carbs: 0.0, fat: 27.5, servingSize: "1/2 chicken", category: "Fast Food" },
  { name: "Nando's Whole Chicken", brand: "Nando's", calories: 1020, protein: 128.0, carbs: 0.0, fat: 55.0, servingSize: "1 whole chicken", category: "Fast Food" },
  { name: "Nando's Butterfly Chicken", brand: "Nando's", calories: 465, protein: 72.0, carbs: 0.0, fat: 19.0, servingSize: "1 butterfly breast", category: "Fast Food" },
  { name: "Nando's Chicken Thighs (3)", brand: "Nando's", calories: 490, protein: 42.0, carbs: 0.0, fat: 36.0, servingSize: "3 thighs", category: "Fast Food" },
  { name: "Nando's Chicken Wings (5)", brand: "Nando's", calories: 345, protein: 32.0, carbs: 0.0, fat: 24.0, servingSize: "5 wings", category: "Fast Food" },
  { name: "Nando's Peri Peri Chips (Regular)", brand: "Nando's", calories: 370, protein: 5.0, carbs: 50.0, fat: 16.0, servingSize: "Regular", category: "Fast Food" },
  { name: "Nando's Peri Peri Chips (Large)", brand: "Nando's", calories: 555, protein: 7.5, carbs: 75.0, fat: 24.0, servingSize: "Large", category: "Fast Food" },
  { name: "Nando's Corn on the Cob", brand: "Nando's", calories: 175, protein: 5.0, carbs: 21.0, fat: 8.0, servingSize: "1 cob", category: "Fast Food" },
  { name: "Nando's Coleslaw", brand: "Nando's", calories: 160, protein: 1.0, carbs: 8.0, fat: 14.0, servingSize: "1 portion", category: "Fast Food" },
  { name: "Nando's Spicy Rice", brand: "Nando's", calories: 310, protein: 6.0, carbs: 52.0, fat: 8.0, servingSize: "1 portion", category: "Fast Food" },
  { name: "Nando's Peri Peri Pitta", brand: "Nando's", calories: 260, protein: 8.0, carbs: 48.0, fat: 4.0, servingSize: "1 pitta", category: "Fast Food" },
  { name: "Nando's Chicken Wrap", brand: "Nando's", calories: 420, protein: 34.0, carbs: 42.0, fat: 12.0, servingSize: "1 wrap", category: "Fast Food" },
  { name: "Nando's Halloumi Sticks & Dip", brand: "Nando's", calories: 340, protein: 16.0, carbs: 20.0, fat: 22.0, servingSize: "1 portion", category: "Fast Food" },
  { name: "Nando's Macho Peas", brand: "Nando's", calories: 180, protein: 12.0, carbs: 16.0, fat: 7.0, servingSize: "1 portion", category: "Fast Food" },
  { name: "Nando's Chicken Burger", brand: "Nando's", calories: 410, protein: 38.0, carbs: 34.0, fat: 12.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Nando's Sunset Burger", brand: "Nando's", calories: 520, protein: 38.0, carbs: 36.0, fat: 24.0, servingSize: "1 burger", category: "Fast Food" },

  // ===========================================================================
  // GREGGS
  // ===========================================================================
  { name: "Greggs Sausage Roll", brand: "Greggs", calories: 327, protein: 8.5, carbs: 24.0, fat: 22.0, servingSize: "1 roll", category: "Fast Food" },
  { name: "Greggs Vegan Sausage Roll", brand: "Greggs", calories: 312, protein: 8.0, carbs: 26.0, fat: 19.0, servingSize: "1 roll", category: "Fast Food" },
  { name: "Greggs Steak Bake", brand: "Greggs", calories: 408, protein: 13.0, carbs: 32.0, fat: 25.0, servingSize: "1 bake", category: "Fast Food" },
  { name: "Greggs Vegan Steak Bake", brand: "Greggs", calories: 380, protein: 10.0, carbs: 34.0, fat: 22.0, servingSize: "1 bake", category: "Fast Food" },
  { name: "Greggs Cheese & Onion Bake", brand: "Greggs", calories: 362, protein: 9.0, carbs: 28.0, fat: 23.0, servingSize: "1 bake", category: "Fast Food" },
  { name: "Greggs Chicken Bake", brand: "Greggs", calories: 448, protein: 14.0, carbs: 34.0, fat: 28.0, servingSize: "1 bake", category: "Fast Food" },
  { name: "Greggs Sausage, Bean & Cheese Melt", brand: "Greggs", calories: 432, protein: 14.0, carbs: 32.0, fat: 27.0, servingSize: "1 melt", category: "Fast Food" },
  { name: "Greggs Ham & Cheese Baguette", brand: "Greggs", calories: 382, protein: 18.0, carbs: 42.0, fat: 15.0, servingSize: "1 baguette", category: "Fast Food" },
  { name: "Greggs Tuna Crunch Baguette", brand: "Greggs", calories: 410, protein: 15.0, carbs: 44.0, fat: 18.0, servingSize: "1 baguette", category: "Fast Food" },
  { name: "Greggs Chicken Club Sandwich", brand: "Greggs", calories: 370, protein: 20.0, carbs: 35.0, fat: 16.0, servingSize: "1 sandwich", category: "Fast Food" },
  { name: "Greggs BLT Sandwich", brand: "Greggs", calories: 350, protein: 14.0, carbs: 34.0, fat: 17.0, servingSize: "1 sandwich", category: "Fast Food" },
  { name: "Greggs Egg Mayo Sandwich", brand: "Greggs", calories: 340, protein: 12.0, carbs: 32.0, fat: 18.0, servingSize: "1 sandwich", category: "Fast Food" },
  { name: "Greggs Pizza Slice (Pepperoni)", brand: "Greggs", calories: 310, protein: 12.0, carbs: 30.0, fat: 15.0, servingSize: "1 slice", category: "Fast Food" },
  { name: "Greggs Pizza Slice (Cheese & Tomato)", brand: "Greggs", calories: 270, protein: 10.0, carbs: 30.0, fat: 12.0, servingSize: "1 slice", category: "Fast Food" },
  { name: "Greggs Bacon Roll", brand: "Greggs", calories: 280, protein: 15.0, carbs: 28.0, fat: 12.0, servingSize: "1 roll", category: "Fast Food" },
  { name: "Greggs Sausage Breakfast Roll", brand: "Greggs", calories: 360, protein: 14.0, carbs: 30.0, fat: 20.0, servingSize: "1 roll", category: "Fast Food" },
  { name: "Greggs Ring Doughnut (Sugar)", brand: "Greggs", calories: 265, protein: 3.5, carbs: 32.0, fat: 14.0, servingSize: "1 doughnut", category: "Fast Food" },
  { name: "Greggs Yum Yum", brand: "Greggs", calories: 280, protein: 3.0, carbs: 34.0, fat: 15.0, servingSize: "1 yum yum", category: "Fast Food" },
  { name: "Greggs Jam Doughnut", brand: "Greggs", calories: 290, protein: 4.0, carbs: 38.0, fat: 14.0, servingSize: "1 doughnut", category: "Fast Food" },
  { name: "Greggs Triple Chocolate Cookie", brand: "Greggs", calories: 290, protein: 3.0, carbs: 36.0, fat: 15.0, servingSize: "1 cookie", category: "Fast Food" },
  { name: "Greggs Belgian Bun", brand: "Greggs", calories: 370, protein: 5.0, carbs: 52.0, fat: 15.0, servingSize: "1 bun", category: "Fast Food" },
  { name: "Greggs Pain au Chocolat", brand: "Greggs", calories: 310, protein: 5.0, carbs: 30.0, fat: 19.0, servingSize: "1 pastry", category: "Fast Food" },

  // ===========================================================================
  // DOMINO'S PIZZA
  // ===========================================================================
  { name: "Domino's Pepperoni Passion (1 Medium Slice)", brand: "Domino's", calories: 214, protein: 9.5, carbs: 22.0, fat: 10.0, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Domino's Mighty Meaty (1 Medium Slice)", brand: "Domino's", calories: 228, protein: 10.5, carbs: 22.0, fat: 11.0, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Domino's Margherita (1 Medium Slice)", brand: "Domino's", calories: 170, protein: 7.0, carbs: 22.0, fat: 6.0, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Domino's Texas BBQ (1 Medium Slice)", brand: "Domino's", calories: 210, protein: 10.0, carbs: 24.0, fat: 8.5, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Domino's Vegi Supreme (1 Medium Slice)", brand: "Domino's", calories: 180, protein: 7.5, carbs: 22.0, fat: 7.0, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Domino's Meat Feast (1 Medium Slice)", brand: "Domino's", calories: 225, protein: 11.0, carbs: 22.0, fat: 10.5, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Domino's Hawaiian (1 Medium Slice)", brand: "Domino's", calories: 190, protein: 9.0, carbs: 24.0, fat: 6.5, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Domino's Chicken Strippers (4)", brand: "Domino's", calories: 230, protein: 18.0, carbs: 14.0, fat: 12.0, servingSize: "4 pieces", category: "Fast Food" },
  { name: "Domino's Garlic Bread", brand: "Domino's", calories: 290, protein: 6.0, carbs: 32.0, fat: 15.0, servingSize: "4 pieces", category: "Fast Food" },
  { name: "Domino's Garlic Bread with Cheese", brand: "Domino's", calories: 380, protein: 12.0, carbs: 32.0, fat: 22.0, servingSize: "4 pieces", category: "Fast Food" },
  { name: "Domino's Potato Wedges", brand: "Domino's", calories: 320, protein: 4.0, carbs: 40.0, fat: 16.0, servingSize: "1 portion", category: "Fast Food" },
  { name: "Domino's Chicken Wings (7)", brand: "Domino's", calories: 430, protein: 32.0, carbs: 18.0, fat: 26.0, servingSize: "7 wings", category: "Fast Food" },
  { name: "Domino's Cookies (4)", brand: "Domino's", calories: 520, protein: 5.0, carbs: 64.0, fat: 27.0, servingSize: "4 cookies", category: "Fast Food" },

  // ===========================================================================
  // PIZZA HUT
  // ===========================================================================
  { name: "Pizza Hut Margherita (1 Medium Slice)", brand: "Pizza Hut", calories: 175, protein: 7.5, carbs: 22.0, fat: 6.5, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Pizza Hut Pepperoni Feast (1 Medium Slice)", brand: "Pizza Hut", calories: 220, protein: 10.0, carbs: 22.0, fat: 10.0, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Pizza Hut Meat Feast (1 Medium Slice)", brand: "Pizza Hut", calories: 230, protein: 11.0, carbs: 22.0, fat: 11.0, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Pizza Hut Hawaiian (1 Medium Slice)", brand: "Pizza Hut", calories: 195, protein: 9.0, carbs: 24.0, fat: 7.0, servingSize: "1 medium slice", category: "Fast Food" },
  { name: "Pizza Hut Garlic Bread (4 slices)", brand: "Pizza Hut", calories: 310, protein: 7.0, carbs: 34.0, fat: 16.0, servingSize: "4 slices", category: "Fast Food" },
  { name: "Pizza Hut Chicken Wings (6)", brand: "Pizza Hut", calories: 420, protein: 30.0, carbs: 16.0, fat: 26.0, servingSize: "6 wings", category: "Fast Food" },
  { name: "Pizza Hut Fries", brand: "Pizza Hut", calories: 290, protein: 3.5, carbs: 38.0, fat: 14.0, servingSize: "1 portion", category: "Fast Food" },
  { name: "Pizza Hut Salad Bar (typical portion)", brand: "Pizza Hut", calories: 180, protein: 5.0, carbs: 12.0, fat: 12.0, servingSize: "1 bowl", category: "Fast Food" },
  { name: "Pizza Hut Cookie Dough", brand: "Pizza Hut", calories: 280, protein: 3.0, carbs: 36.0, fat: 14.0, servingSize: "1 portion", category: "Fast Food" },

  // ===========================================================================
  // FIVE GUYS
  // ===========================================================================
  { name: "Five Guys Hamburger", brand: "Five Guys", calories: 700, protein: 39.0, carbs: 39.0, fat: 43.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Five Guys Cheeseburger", brand: "Five Guys", calories: 840, protein: 47.0, carbs: 40.0, fat: 55.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Five Guys Bacon Cheeseburger", brand: "Five Guys", calories: 920, protein: 51.0, carbs: 40.0, fat: 62.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Five Guys Little Hamburger", brand: "Five Guys", calories: 480, protein: 23.0, carbs: 39.0, fat: 26.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Five Guys Little Cheeseburger", brand: "Five Guys", calories: 550, protein: 27.0, carbs: 39.0, fat: 32.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Five Guys Little Bacon Cheeseburger", brand: "Five Guys", calories: 630, protein: 31.0, carbs: 39.0, fat: 39.0, servingSize: "1 burger", category: "Fast Food" },
  { name: "Five Guys Hot Dog", brand: "Five Guys", calories: 545, protein: 18.0, carbs: 40.0, fat: 35.0, servingSize: "1 hot dog", category: "Fast Food" },
  { name: "Five Guys Fries (Little)", brand: "Five Guys", calories: 526, protein: 7.0, carbs: 64.0, fat: 28.0, servingSize: "Little", category: "Fast Food" },
  { name: "Five Guys Fries (Regular)", brand: "Five Guys", calories: 953, protein: 12.0, carbs: 116.0, fat: 50.0, servingSize: "Regular", category: "Fast Food" },
  { name: "Five Guys Milkshake (Regular)", brand: "Five Guys", calories: 740, protein: 16.0, carbs: 80.0, fat: 40.0, servingSize: "Regular", category: "Fast Food" },
  { name: "Five Guys Veggie Sandwich", brand: "Five Guys", calories: 440, protein: 16.0, carbs: 60.0, fat: 15.0, servingSize: "1 sandwich", category: "Fast Food" },

  // ===========================================================================
  // WETHERSPOONS
  // ===========================================================================
  { name: "Wetherspoons Fish & Chips", brand: "Wetherspoons", calories: 850, protein: 35.0, carbs: 80.0, fat: 42.0, servingSize: "1 meal", category: "Pub Food" },
  { name: "Wetherspoons Steak (8oz Sirloin with Chips)", brand: "Wetherspoons", calories: 900, protein: 50.0, carbs: 60.0, fat: 48.0, servingSize: "1 meal", category: "Pub Food" },
  { name: "Wetherspoons Classic Burger with Chips", brand: "Wetherspoons", calories: 950, protein: 40.0, carbs: 70.0, fat: 52.0, servingSize: "1 meal", category: "Pub Food" },
  { name: "Wetherspoons Chicken Burger with Chips", brand: "Wetherspoons", calories: 820, protein: 38.0, carbs: 68.0, fat: 40.0, servingSize: "1 meal", category: "Pub Food" },
  { name: "Wetherspoons Scampi & Chips", brand: "Wetherspoons", calories: 780, protein: 22.0, carbs: 75.0, fat: 38.0, servingSize: "1 meal", category: "Pub Food" },
  { name: "Wetherspoons Curry (Chicken) with Rice", brand: "Wetherspoons", calories: 750, protein: 35.0, carbs: 85.0, fat: 28.0, servingSize: "1 meal", category: "Pub Food" },
  { name: "Wetherspoons Lasagne", brand: "Wetherspoons", calories: 720, protein: 32.0, carbs: 55.0, fat: 40.0, servingSize: "1 meal", category: "Pub Food" },
  { name: "Wetherspoons Mac & Cheese", brand: "Wetherspoons", calories: 680, protein: 24.0, carbs: 56.0, fat: 38.0, servingSize: "1 meal", category: "Pub Food" },
  { name: "Wetherspoons Gammon, Egg & Chips", brand: "Wetherspoons", calories: 880, protein: 42.0, carbs: 60.0, fat: 48.0, servingSize: "1 meal", category: "Pub Food" },
  { name: "Wetherspoons Full English Breakfast", brand: "Wetherspoons", calories: 980, protein: 45.0, carbs: 65.0, fat: 55.0, servingSize: "1 meal", category: "Pub Food" },

  // ===========================================================================
  // UK SUPERMARKET READY MEALS & MEAL DEAL
  // ===========================================================================
  { name: "Supermarket Meal Deal Sandwich (typical)", calories: 400, protein: 18.0, carbs: 42.0, fat: 16.0, servingSize: "1 sandwich", category: "Ready Meals" },
  { name: "Supermarket Meal Deal Crisps (typical)", calories: 130, protein: 1.5, carbs: 15.0, fat: 7.0, servingSize: "1 bag (25g)", category: "Ready Meals" },
  { name: "Supermarket Meal Deal Drink (typical soft drink)", calories: 5, protein: 0.0, carbs: 0.5, fat: 0.0, servingSize: "500ml", category: "Ready Meals" },
  { name: "Supermarket Meal Deal (Total typical)", calories: 535, protein: 19.5, carbs: 57.5, fat: 23.0, servingSize: "Sandwich + Crisps + Drink", category: "Ready Meals" },
  { name: "Pot Noodle (Chicken & Mushroom)", brand: "Pot Noodle", calories: 383, protein: 7.5, carbs: 52.0, fat: 15.0, servingSize: "1 pot (90g dry)", category: "Ready Meals" },
  { name: "Pot Noodle (Beef & Tomato)", brand: "Pot Noodle", calories: 378, protein: 7.0, carbs: 51.0, fat: 15.0, servingSize: "1 pot (90g dry)", category: "Ready Meals" },
  { name: "Pot Noodle (Original Curry)", brand: "Pot Noodle", calories: 390, protein: 7.5, carbs: 53.0, fat: 16.0, servingSize: "1 pot (90g dry)", category: "Ready Meals" },
  { name: "Pot Noodle (Bombay Bad Boy)", brand: "Pot Noodle", calories: 385, protein: 7.0, carbs: 52.0, fat: 15.5, servingSize: "1 pot (90g dry)", category: "Ready Meals" },
  { name: "Baked Beans on Toast", calories: 350, protein: 15.0, carbs: 55.0, fat: 6.0, servingSize: "1 serving (beans + 2 toast)", category: "Ready Meals" },
  { name: "Beans and Sausages (tin)", calories: 370, protein: 16.0, carbs: 35.0, fat: 16.0, servingSize: "1 tin (395g)", category: "Ready Meals" },
  { name: "Microwave Chicken Tikka Masala with Rice", calories: 500, protein: 22.0, carbs: 62.0, fat: 18.0, servingSize: "1 meal (400g)", category: "Ready Meals" },
  { name: "Microwave Lasagne", calories: 440, protein: 18.0, carbs: 42.0, fat: 22.0, servingSize: "1 meal (400g)", category: "Ready Meals" },
  { name: "Microwave Spaghetti Bolognese", calories: 420, protein: 18.0, carbs: 52.0, fat: 14.0, servingSize: "1 meal (400g)", category: "Ready Meals" },
  { name: "Microwave Shepherd's Pie", calories: 380, protein: 14.0, carbs: 38.0, fat: 18.0, servingSize: "1 meal (400g)", category: "Ready Meals" },
  { name: "Microwave Macaroni Cheese", calories: 460, protein: 16.0, carbs: 44.0, fat: 24.0, servingSize: "1 meal (400g)", category: "Ready Meals" },
  { name: "Microwave Sweet & Sour Chicken with Rice", calories: 480, protein: 18.0, carbs: 68.0, fat: 14.0, servingSize: "1 meal (400g)", category: "Ready Meals" },
  { name: "Microwave Chilli Con Carne with Rice", calories: 470, protein: 20.0, carbs: 60.0, fat: 16.0, servingSize: "1 meal (400g)", category: "Ready Meals" },
  { name: "Cup-a-Soup (Chicken)", calories: 88, protein: 2.0, carbs: 12.0, fat: 3.5, servingSize: "1 sachet", category: "Ready Meals" },
  { name: "Cup-a-Soup (Tomato)", calories: 90, protein: 1.5, carbs: 14.0, fat: 3.0, servingSize: "1 sachet", category: "Ready Meals" },

  // ===========================================================================
  // UK HOME-COOKED MEALS
  // ===========================================================================
  // Sunday Roasts
  { name: "Sunday Roast Beef (with trimmings)", calories: 680, protein: 40.0, carbs: 55.0, fat: 32.0, servingSize: "1 plate", category: "Home Cooked" },
  { name: "Sunday Roast Chicken (with trimmings)", calories: 620, protein: 42.0, carbs: 52.0, fat: 26.0, servingSize: "1 plate", category: "Home Cooked" },
  { name: "Sunday Roast Lamb (with trimmings)", calories: 720, protein: 38.0, carbs: 55.0, fat: 36.0, servingSize: "1 plate", category: "Home Cooked" },
  { name: "Sunday Roast Pork (with trimmings)", calories: 690, protein: 38.0, carbs: 55.0, fat: 34.0, servingSize: "1 plate", category: "Home Cooked" },
  { name: "Yorkshire Pudding (1 medium)", calories: 95, protein: 3.5, carbs: 12.0, fat: 3.5, servingSize: "1 pudding", category: "Home Cooked" },
  { name: "Roast Potatoes (portion)", calories: 200, protein: 3.0, carbs: 28.0, fat: 9.0, servingSize: "3-4 pieces", category: "Home Cooked" },
  { name: "Gravy (homemade)", calories: 40, protein: 1.0, carbs: 4.0, fat: 2.0, servingSize: "4 tbsp", category: "Home Cooked" },

  // Classic British Meals
  { name: "Shepherd's Pie", calories: 450, protein: 22.0, carbs: 40.0, fat: 22.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Cottage Pie", calories: 460, protein: 24.0, carbs: 40.0, fat: 22.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Fish and Chips (chippy)", calories: 840, protein: 32.0, carbs: 76.0, fat: 44.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Spaghetti Bolognese", calories: 520, protein: 28.0, carbs: 55.0, fat: 18.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Chicken Curry with Rice", calories: 580, protein: 30.0, carbs: 65.0, fat: 20.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Chilli Con Carne with Rice", calories: 560, protein: 28.0, carbs: 62.0, fat: 18.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Lasagne", calories: 540, protein: 26.0, carbs: 42.0, fat: 28.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Bangers and Mash", calories: 550, protein: 22.0, carbs: 42.0, fat: 32.0, servingSize: "2 sausages + mash", category: "Home Cooked" },
  { name: "Fish Pie", calories: 420, protein: 24.0, carbs: 36.0, fat: 20.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Toad in the Hole", calories: 520, protein: 18.0, carbs: 40.0, fat: 30.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Steak and Kidney Pie", calories: 480, protein: 22.0, carbs: 34.0, fat: 28.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Chicken Stir Fry with Noodles", calories: 440, protein: 30.0, carbs: 48.0, fat: 14.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Chicken Stir Fry with Rice", calories: 480, protein: 30.0, carbs: 55.0, fat: 14.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Chicken Fajitas (2 wraps)", calories: 520, protein: 32.0, carbs: 48.0, fat: 20.0, servingSize: "2 fajitas", category: "Home Cooked" },
  { name: "Beef Fajitas (2 wraps)", calories: 560, protein: 30.0, carbs: 48.0, fat: 24.0, servingSize: "2 fajitas", category: "Home Cooked" },

  // Jacket Potatoes
  { name: "Jacket Potato (plain)", calories: 290, protein: 7.0, carbs: 63.0, fat: 0.3, servingSize: "1 large potato", category: "Home Cooked" },
  { name: "Jacket Potato with Beans", calories: 420, protein: 17.0, carbs: 78.0, fat: 2.5, servingSize: "1 potato + beans", category: "Home Cooked" },
  { name: "Jacket Potato with Cheese", calories: 480, protein: 18.0, carbs: 63.0, fat: 16.0, servingSize: "1 potato + cheese", category: "Home Cooked" },
  { name: "Jacket Potato with Beans & Cheese", calories: 540, protein: 22.0, carbs: 78.0, fat: 14.0, servingSize: "1 potato + beans + cheese", category: "Home Cooked" },
  { name: "Jacket Potato with Tuna Mayo", calories: 520, protein: 28.0, carbs: 63.0, fat: 16.0, servingSize: "1 potato + tuna", category: "Home Cooked" },
  { name: "Jacket Potato with Chilli", calories: 510, protein: 24.0, carbs: 68.0, fat: 14.0, servingSize: "1 potato + chilli", category: "Home Cooked" },

  // Breakfast
  { name: "Full English Breakfast", calories: 850, protein: 40.0, carbs: 52.0, fat: 52.0, servingSize: "1 full plate", category: "Home Cooked" },
  { name: "Cheese on Toast (2 slices)", calories: 340, protein: 15.0, carbs: 30.0, fat: 17.0, servingSize: "2 slices", category: "Home Cooked" },
  { name: "Beans on Toast", calories: 350, protein: 15.0, carbs: 55.0, fat: 6.0, servingSize: "2 toast + beans", category: "Home Cooked" },
  { name: "Scrambled Eggs on Toast", calories: 380, protein: 20.0, carbs: 28.0, fat: 20.0, servingSize: "2 eggs + 2 toast", category: "Home Cooked" },
  { name: "Poached Eggs on Toast", calories: 290, protein: 18.0, carbs: 28.0, fat: 11.0, servingSize: "2 eggs + 2 toast", category: "Home Cooked" },
  { name: "Boiled Egg and Soldiers", calories: 250, protein: 14.0, carbs: 24.0, fat: 11.0, servingSize: "2 eggs + 2 toast", category: "Home Cooked" },

  // Omelettes
  { name: "Cheese Omelette", calories: 350, protein: 22.0, carbs: 1.0, fat: 28.0, servingSize: "2-3 egg omelette", category: "Home Cooked" },
  { name: "Mushroom Omelette", calories: 260, protein: 16.0, carbs: 3.0, fat: 20.0, servingSize: "2-3 egg omelette", category: "Home Cooked" },
  { name: "Ham Omelette", calories: 290, protein: 24.0, carbs: 1.0, fat: 21.0, servingSize: "2-3 egg omelette", category: "Home Cooked" },
  { name: "Ham & Cheese Omelette", calories: 380, protein: 28.0, carbs: 1.5, fat: 29.0, servingSize: "2-3 egg omelette", category: "Home Cooked" },
  { name: "Spanish Omelette", calories: 320, protein: 14.0, carbs: 22.0, fat: 20.0, servingSize: "1 portion", category: "Home Cooked" },

  // Soups
  { name: "Tomato Soup (bowl)", calories: 150, protein: 3.0, carbs: 22.0, fat: 5.5, servingSize: "1 bowl (300ml)", category: "Home Cooked" },
  { name: "Chicken Soup (bowl)", calories: 120, protein: 8.0, carbs: 12.0, fat: 4.5, servingSize: "1 bowl (300ml)", category: "Home Cooked" },
  { name: "Vegetable Soup (bowl)", calories: 100, protein: 3.5, carbs: 14.0, fat: 3.0, servingSize: "1 bowl (300ml)", category: "Home Cooked" },
  { name: "Leek & Potato Soup (bowl)", calories: 160, protein: 4.0, carbs: 18.0, fat: 7.5, servingSize: "1 bowl (300ml)", category: "Home Cooked" },
  { name: "Minestrone Soup (bowl)", calories: 130, protein: 5.0, carbs: 18.0, fat: 3.5, servingSize: "1 bowl (300ml)", category: "Home Cooked" },
  { name: "French Onion Soup (bowl)", calories: 170, protein: 5.0, carbs: 16.0, fat: 9.0, servingSize: "1 bowl (300ml)", category: "Home Cooked" },

  // More Home Cooked
  { name: "Macaroni Cheese", calories: 480, protein: 18.0, carbs: 46.0, fat: 24.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Cauliflower Cheese", calories: 240, protein: 10.0, carbs: 12.0, fat: 16.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Chicken Pie", calories: 480, protein: 22.0, carbs: 36.0, fat: 28.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Beef Stew with Dumplings", calories: 520, protein: 28.0, carbs: 40.0, fat: 26.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Chicken Casserole", calories: 380, protein: 28.0, carbs: 28.0, fat: 16.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Lamb Hotpot", calories: 450, protein: 24.0, carbs: 36.0, fat: 24.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Beef Burger (homemade, with bun)", calories: 480, protein: 26.0, carbs: 34.0, fat: 26.0, servingSize: "1 burger", category: "Home Cooked" },
  { name: "Chicken Kiev with Chips", calories: 620, protein: 28.0, carbs: 48.0, fat: 34.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Gammon Steak, Egg & Chips", calories: 680, protein: 38.0, carbs: 48.0, fat: 36.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Pasta Carbonara", calories: 520, protein: 22.0, carbs: 50.0, fat: 26.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Prawn Stir Fry with Noodles", calories: 400, protein: 24.0, carbs: 48.0, fat: 12.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Vegetable Curry with Rice", calories: 420, protein: 10.0, carbs: 68.0, fat: 12.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Prawn Curry with Rice", calories: 490, protein: 24.0, carbs: 60.0, fat: 16.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Lamb Curry with Rice", calories: 620, protein: 28.0, carbs: 62.0, fat: 26.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Tikka Masala with Rice", calories: 600, protein: 30.0, carbs: 64.0, fat: 22.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Korma with Rice", calories: 640, protein: 28.0, carbs: 62.0, fat: 28.0, servingSize: "1 portion", category: "Home Cooked" },
  { name: "Madras with Rice", calories: 540, protein: 28.0, carbs: 60.0, fat: 18.0, servingSize: "1 portion", category: "Home Cooked" },

  // ===========================================================================
  // PROTEINS
  // ===========================================================================
  { name: "Chicken Breast (skinless, cooked)", calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6, servingSize: "100g", category: "Protein" },
  { name: "Chicken Breast (1 medium)", calories: 280, protein: 53.0, carbs: 0.0, fat: 6.1, servingSize: "1 breast (~170g)", category: "Protein" },
  { name: "Chicken Thigh (skinless, cooked)", calories: 195, protein: 26.0, carbs: 0.0, fat: 10.0, servingSize: "100g", category: "Protein" },
  { name: "Chicken Thigh (with skin, cooked)", calories: 229, protein: 24.0, carbs: 0.0, fat: 15.0, servingSize: "100g", category: "Protein" },
  { name: "Chicken Drumstick (cooked)", calories: 172, protein: 28.0, carbs: 0.0, fat: 6.0, servingSize: "1 drumstick (~100g)", category: "Protein" },
  { name: "Chicken Wing (cooked)", calories: 85, protein: 8.0, carbs: 0.0, fat: 6.0, servingSize: "1 wing (~40g)", category: "Protein" },
  { name: "Turkey Breast (cooked)", calories: 157, protein: 30.0, carbs: 0.0, fat: 3.5, servingSize: "100g", category: "Protein" },
  { name: "Turkey Mince (cooked)", calories: 170, protein: 28.0, carbs: 0.0, fat: 6.5, servingSize: "100g", category: "Protein" },

  // Beef
  { name: "Beef Mince 5% Fat (cooked)", calories: 174, protein: 28.0, carbs: 0.0, fat: 7.0, servingSize: "100g", category: "Protein" },
  { name: "Beef Mince 10% Fat (cooked)", calories: 209, protein: 26.0, carbs: 0.0, fat: 12.0, servingSize: "100g", category: "Protein" },
  { name: "Beef Mince 20% Fat (cooked)", calories: 250, protein: 24.0, carbs: 0.0, fat: 17.0, servingSize: "100g", category: "Protein" },
  { name: "Sirloin Steak (cooked, lean)", calories: 218, protein: 30.0, carbs: 0.0, fat: 10.5, servingSize: "100g", category: "Protein" },
  { name: "Sirloin Steak (1 steak)", calories: 480, protein: 66.0, carbs: 0.0, fat: 23.0, servingSize: "1 steak (~220g)", category: "Protein" },
  { name: "Rump Steak (cooked, lean)", calories: 198, protein: 31.0, carbs: 0.0, fat: 8.0, servingSize: "100g", category: "Protein" },
  { name: "Fillet Steak (cooked)", calories: 210, protein: 32.0, carbs: 0.0, fat: 9.0, servingSize: "100g", category: "Protein" },
  { name: "Ribeye Steak (cooked)", calories: 250, protein: 28.0, carbs: 0.0, fat: 15.0, servingSize: "100g", category: "Protein" },
  { name: "Beef Roasting Joint (cooked)", calories: 225, protein: 28.0, carbs: 0.0, fat: 12.5, servingSize: "100g", category: "Protein" },

  // Pork
  { name: "Pork Chop (grilled, lean)", calories: 184, protein: 31.0, carbs: 0.0, fat: 6.5, servingSize: "100g", category: "Protein" },
  { name: "Pork Loin (roasted)", calories: 210, protein: 30.0, carbs: 0.0, fat: 10.0, servingSize: "100g", category: "Protein" },
  { name: "Back Bacon (grilled, 2 rashers)", calories: 130, protein: 16.0, carbs: 0.0, fat: 7.5, servingSize: "2 rashers", category: "Protein" },
  { name: "Streaky Bacon (grilled, 2 rashers)", calories: 150, protein: 12.0, carbs: 0.0, fat: 12.0, servingSize: "2 rashers", category: "Protein" },
  { name: "Pork Sausage (grilled, 1)", calories: 130, protein: 7.0, carbs: 4.0, fat: 10.0, servingSize: "1 sausage (~50g)", category: "Protein" },
  { name: "Pork Sausage (grilled, 2)", calories: 260, protein: 14.0, carbs: 8.0, fat: 20.0, servingSize: "2 sausages", category: "Protein" },
  { name: "Ham Slice (2 slices)", calories: 65, protein: 10.0, carbs: 1.0, fat: 2.5, servingSize: "2 slices (~50g)", category: "Protein" },

  // Lamb
  { name: "Lamb Chop (grilled, lean)", calories: 230, protein: 26.0, carbs: 0.0, fat: 14.0, servingSize: "100g", category: "Protein" },
  { name: "Lamb Leg (roasted, lean)", calories: 210, protein: 29.0, carbs: 0.0, fat: 10.5, servingSize: "100g", category: "Protein" },
  { name: "Lamb Mince (cooked)", calories: 240, protein: 24.0, carbs: 0.0, fat: 16.0, servingSize: "100g", category: "Protein" },

  // Fish
  { name: "Salmon Fillet (baked)", calories: 208, protein: 20.0, carbs: 0.0, fat: 13.0, servingSize: "100g", category: "Protein" },
  { name: "Salmon Fillet (1 fillet)", calories: 354, protein: 34.0, carbs: 0.0, fat: 22.0, servingSize: "1 fillet (~170g)", category: "Protein" },
  { name: "Cod Fillet (baked)", calories: 96, protein: 21.0, carbs: 0.0, fat: 1.0, servingSize: "100g", category: "Protein" },
  { name: "Cod Fillet (battered, fried)", calories: 235, protein: 16.0, carbs: 12.0, fat: 14.0, servingSize: "100g", category: "Protein" },
  { name: "Tuna (tinned in brine, drained)", calories: 108, protein: 25.0, carbs: 0.0, fat: 1.0, servingSize: "100g", category: "Protein" },
  { name: "Tuna (tinned, 1 can)", calories: 130, protein: 30.0, carbs: 0.0, fat: 1.2, servingSize: "1 can (120g drained)", category: "Protein" },
  { name: "Tuna (tinned in sunflower oil, drained)", calories: 190, protein: 25.0, carbs: 0.0, fat: 10.0, servingSize: "100g", category: "Protein" },
  { name: "Prawns (cooked)", calories: 70, protein: 15.0, carbs: 0.0, fat: 0.9, servingSize: "100g", category: "Protein" },
  { name: "Haddock (baked)", calories: 112, protein: 24.0, carbs: 0.0, fat: 1.0, servingSize: "100g", category: "Protein" },
  { name: "Smoked Salmon", calories: 183, protein: 22.0, carbs: 0.0, fat: 10.5, servingSize: "100g", category: "Protein" },
  { name: "Fish Fingers (4 grilled)", calories: 200, protein: 12.0, carbs: 18.0, fat: 8.0, servingSize: "4 fish fingers", category: "Protein" },
  { name: "Mackerel (grilled)", calories: 239, protein: 20.0, carbs: 0.0, fat: 18.0, servingSize: "100g", category: "Protein" },
  { name: "Sardines (tinned in tomato sauce)", calories: 162, protein: 17.0, carbs: 1.5, fat: 10.0, servingSize: "100g", category: "Protein" },

  // Eggs
  { name: "Egg (1 medium, boiled)", calories: 66, protein: 5.5, carbs: 0.0, fat: 4.7, servingSize: "1 medium egg", category: "Protein" },
  { name: "Egg (1 large, boiled)", calories: 78, protein: 6.3, carbs: 0.0, fat: 5.5, servingSize: "1 large egg", category: "Protein" },
  { name: "Egg (1 large, fried)", calories: 120, protein: 6.3, carbs: 0.0, fat: 10.0, servingSize: "1 large egg", category: "Protein" },
  { name: "Egg (1 large, scrambled)", calories: 110, protein: 7.0, carbs: 1.0, fat: 8.5, servingSize: "1 large egg", category: "Protein" },
  { name: "Egg (1 large, poached)", calories: 80, protein: 6.3, carbs: 0.0, fat: 5.5, servingSize: "1 large egg", category: "Protein" },

  // Vegetarian Protein
  { name: "Tofu (firm)", calories: 144, protein: 15.0, carbs: 2.0, fat: 8.5, servingSize: "100g", category: "Protein" },
  { name: "Quorn Mince (cooked)", calories: 105, protein: 14.5, carbs: 4.5, fat: 3.0, servingSize: "100g", category: "Protein" },
  { name: "Quorn Chicken Pieces (cooked)", calories: 95, protein: 14.0, carbs: 4.0, fat: 2.5, servingSize: "100g", category: "Protein" },

  // ===========================================================================
  // CARBOHYDRATES
  // ===========================================================================
  { name: "White Rice (cooked)", calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3, servingSize: "100g", category: "Carbs" },
  { name: "White Rice (1 cup cooked)", calories: 240, protein: 5.0, carbs: 52.0, fat: 0.6, servingSize: "1 cup (~185g)", category: "Carbs" },
  { name: "Brown Rice (cooked)", calories: 123, protein: 2.7, carbs: 26.0, fat: 1.0, servingSize: "100g", category: "Carbs" },
  { name: "Brown Rice (1 cup cooked)", calories: 228, protein: 5.0, carbs: 48.0, fat: 1.8, servingSize: "1 cup (~185g)", category: "Carbs" },
  { name: "Basmati Rice (cooked)", calories: 128, protein: 2.8, carbs: 27.0, fat: 0.3, servingSize: "100g", category: "Carbs" },
  { name: "Pasta (white, cooked)", calories: 131, protein: 5.0, carbs: 25.0, fat: 1.1, servingSize: "100g", category: "Carbs" },
  { name: "Pasta (white, 1 serving cooked)", calories: 295, protein: 11.3, carbs: 56.0, fat: 2.5, servingSize: "1 serving (~225g)", category: "Carbs" },
  { name: "Pasta (wholemeal, cooked)", calories: 124, protein: 5.5, carbs: 23.0, fat: 1.0, servingSize: "100g", category: "Carbs" },
  { name: "White Bread (1 slice)", calories: 79, protein: 2.8, carbs: 14.5, fat: 0.8, servingSize: "1 slice (~34g)", category: "Carbs" },
  { name: "White Bread (thick slice)", calories: 100, protein: 3.5, carbs: 18.5, fat: 1.0, servingSize: "1 thick slice (~44g)", category: "Carbs" },
  { name: "Wholemeal Bread (1 slice)", calories: 75, protein: 3.5, carbs: 12.5, fat: 1.0, servingSize: "1 slice (~34g)", category: "Carbs" },
  { name: "Wholemeal Bread (thick slice)", calories: 96, protein: 4.5, carbs: 16.0, fat: 1.3, servingSize: "1 thick slice (~44g)", category: "Carbs" },
  { name: "Seeded Bread (1 slice)", calories: 90, protein: 4.0, carbs: 13.0, fat: 2.0, servingSize: "1 slice (~38g)", category: "Carbs" },
  { name: "Wrap (plain, large)", calories: 210, protein: 5.5, carbs: 36.0, fat: 4.5, servingSize: "1 large wrap", category: "Carbs" },
  { name: "Wrap (plain, small)", calories: 130, protein: 3.5, carbs: 22.0, fat: 2.8, servingSize: "1 small wrap", category: "Carbs" },
  { name: "Naan Bread", calories: 260, protein: 8.0, carbs: 42.0, fat: 6.5, servingSize: "1 naan", category: "Carbs" },
  { name: "Garlic Naan Bread", calories: 330, protein: 8.0, carbs: 46.0, fat: 12.0, servingSize: "1 naan", category: "Carbs" },
  { name: "Pitta Bread (white)", calories: 165, protein: 5.5, carbs: 33.0, fat: 1.0, servingSize: "1 pitta", category: "Carbs" },
  { name: "Pitta Bread (wholemeal)", calories: 155, protein: 6.0, carbs: 30.0, fat: 1.2, servingSize: "1 pitta", category: "Carbs" },

  // Potatoes
  { name: "Potatoes (boiled)", calories: 72, protein: 1.8, carbs: 15.5, fat: 0.1, servingSize: "100g", category: "Carbs" },
  { name: "Potatoes (boiled, 1 serving)", calories: 173, protein: 4.3, carbs: 37.0, fat: 0.2, servingSize: "1 serving (~240g)", category: "Carbs" },
  { name: "Mashed Potato (with butter & milk)", calories: 104, protein: 2.0, carbs: 14.0, fat: 4.5, servingSize: "100g", category: "Carbs" },
  { name: "Mashed Potato (1 serving)", calories: 250, protein: 4.8, carbs: 34.0, fat: 10.8, servingSize: "1 serving (~240g)", category: "Carbs" },
  { name: "Roast Potatoes (homemade)", calories: 149, protein: 2.5, carbs: 21.0, fat: 6.5, servingSize: "100g", category: "Carbs" },
  { name: "Chips / French Fries (oven)", calories: 162, protein: 2.5, carbs: 25.0, fat: 6.0, servingSize: "100g", category: "Carbs" },
  { name: "Chips / French Fries (deep fried)", calories: 239, protein: 3.2, carbs: 30.0, fat: 12.0, servingSize: "100g", category: "Carbs" },
  { name: "Sweet Potato (baked)", calories: 90, protein: 2.0, carbs: 21.0, fat: 0.1, servingSize: "100g", category: "Carbs" },
  { name: "Sweet Potato (1 medium, baked)", calories: 162, protein: 3.6, carbs: 38.0, fat: 0.2, servingSize: "1 medium (~180g)", category: "Carbs" },
  { name: "New Potatoes (boiled)", calories: 66, protein: 1.5, carbs: 14.0, fat: 0.3, servingSize: "100g", category: "Carbs" },

  // Other Carbs
  { name: "Porridge Oats (dry)", calories: 375, protein: 11.0, carbs: 60.0, fat: 8.0, servingSize: "100g", category: "Carbs" },
  { name: "Porridge Oats (40g dry serving)", calories: 150, protein: 4.4, carbs: 24.0, fat: 3.2, servingSize: "40g dry", category: "Carbs" },
  { name: "Couscous (cooked)", calories: 112, protein: 3.8, carbs: 23.0, fat: 0.2, servingSize: "100g", category: "Carbs" },
  { name: "Egg Noodles (cooked)", calories: 133, protein: 3.5, carbs: 24.0, fat: 2.0, servingSize: "100g", category: "Carbs" },
  { name: "Rice Noodles (cooked)", calories: 109, protein: 0.9, carbs: 25.0, fat: 0.2, servingSize: "100g", category: "Carbs" },
  { name: "Quinoa (cooked)", calories: 120, protein: 4.4, carbs: 21.0, fat: 1.9, servingSize: "100g", category: "Carbs" },
  { name: "Bagel (plain)", calories: 270, protein: 10.0, carbs: 50.0, fat: 2.0, servingSize: "1 bagel", category: "Carbs" },
  { name: "Crumpet", calories: 95, protein: 3.5, carbs: 18.0, fat: 0.5, servingSize: "1 crumpet", category: "Carbs" },
  { name: "English Muffin", calories: 130, protein: 5.0, carbs: 24.0, fat: 1.0, servingSize: "1 muffin", category: "Carbs" },

  // ===========================================================================
  // DAIRY
  // ===========================================================================
  { name: "Whole Milk", calories: 64, protein: 3.3, carbs: 4.6, fat: 3.6, servingSize: "100ml", category: "Dairy" },
  { name: "Whole Milk (1 glass)", calories: 160, protein: 8.3, carbs: 11.5, fat: 9.0, servingSize: "1 glass (250ml)", category: "Dairy" },
  { name: "Semi-Skimmed Milk", calories: 46, protein: 3.4, carbs: 4.7, fat: 1.7, servingSize: "100ml", category: "Dairy" },
  { name: "Semi-Skimmed Milk (1 glass)", calories: 115, protein: 8.5, carbs: 11.8, fat: 4.3, servingSize: "1 glass (250ml)", category: "Dairy" },
  { name: "Skimmed Milk", calories: 34, protein: 3.4, carbs: 5.0, fat: 0.1, servingSize: "100ml", category: "Dairy" },
  { name: "Skimmed Milk (1 glass)", calories: 85, protein: 8.5, carbs: 12.5, fat: 0.3, servingSize: "1 glass (250ml)", category: "Dairy" },
  { name: "Almond Milk (unsweetened)", calories: 13, protein: 0.4, carbs: 0.1, fat: 1.1, servingSize: "100ml", category: "Dairy" },
  { name: "Almond Milk (1 glass)", calories: 33, protein: 1.0, carbs: 0.3, fat: 2.8, servingSize: "1 glass (250ml)", category: "Dairy" },
  { name: "Oat Milk (Oatly Original)", calories: 46, protein: 1.0, carbs: 6.5, fat: 1.5, servingSize: "100ml", category: "Dairy" },
  { name: "Oat Milk (1 glass)", calories: 115, protein: 2.5, carbs: 16.3, fat: 3.8, servingSize: "1 glass (250ml)", category: "Dairy" },
  { name: "Soya Milk (unsweetened)", calories: 30, protein: 3.0, carbs: 0.5, fat: 1.8, servingSize: "100ml", category: "Dairy" },

  // Cheese
  { name: "Cheddar Cheese", calories: 416, protein: 25.0, carbs: 0.1, fat: 35.0, servingSize: "100g", category: "Dairy" },
  { name: "Cheddar Cheese (30g slice)", calories: 125, protein: 7.5, carbs: 0.0, fat: 10.5, servingSize: "30g slice", category: "Dairy" },
  { name: "Mozzarella Cheese", calories: 280, protein: 22.0, carbs: 2.2, fat: 21.0, servingSize: "100g", category: "Dairy" },
  { name: "Cream Cheese (Philadelphia)", calories: 240, protein: 5.5, carbs: 4.0, fat: 23.0, servingSize: "100g", category: "Dairy" },
  { name: "Cream Cheese (1 tbsp)", calories: 36, protein: 0.8, carbs: 0.6, fat: 3.5, servingSize: "1 tbsp (15g)", category: "Dairy" },
  { name: "Parmesan Cheese (grated, 1 tbsp)", calories: 42, protein: 3.8, carbs: 0.3, fat: 2.8, servingSize: "1 tbsp (10g)", category: "Dairy" },
  { name: "Brie", calories: 334, protein: 21.0, carbs: 0.5, fat: 28.0, servingSize: "100g", category: "Dairy" },
  { name: "Feta Cheese", calories: 264, protein: 14.0, carbs: 4.0, fat: 21.0, servingSize: "100g", category: "Dairy" },
  { name: "Red Leicester", calories: 400, protein: 24.0, carbs: 0.1, fat: 34.0, servingSize: "100g", category: "Dairy" },
  { name: "Stilton", calories: 410, protein: 24.0, carbs: 0.1, fat: 35.0, servingSize: "100g", category: "Dairy" },
  { name: "Halloumi", calories: 316, protein: 21.0, carbs: 2.0, fat: 25.0, servingSize: "100g", category: "Dairy" },
  { name: "Cottage Cheese (plain)", calories: 98, protein: 11.0, carbs: 3.4, fat: 4.3, servingSize: "100g", category: "Dairy" },
  { name: "Cottage Cheese (1 pot)", calories: 147, protein: 16.5, carbs: 5.1, fat: 6.5, servingSize: "1 pot (150g)", category: "Dairy" },

  // Yoghurt
  { name: "Greek Yoghurt (full fat)", calories: 133, protein: 6.0, carbs: 5.0, fat: 10.0, servingSize: "100g", category: "Dairy" },
  { name: "Greek Yoghurt (0% fat)", calories: 57, protein: 10.0, carbs: 4.0, fat: 0.0, servingSize: "100g", category: "Dairy" },
  { name: "Greek Yoghurt (0% fat, 170g pot)", calories: 97, protein: 17.0, carbs: 6.8, fat: 0.0, servingSize: "1 pot (170g)", category: "Dairy" },
  { name: "Natural Yoghurt", calories: 63, protein: 5.0, carbs: 7.0, fat: 1.5, servingSize: "100g", category: "Dairy" },
  { name: "Skyr (plain)", calories: 63, protein: 11.0, carbs: 4.0, fat: 0.2, servingSize: "100g", category: "Dairy" },

  // Butter & Cream
  { name: "Butter (per knob/10g)", calories: 74, protein: 0.1, carbs: 0.0, fat: 8.1, servingSize: "1 knob (10g)", category: "Dairy" },
  { name: "Butter (per tbsp)", calories: 100, protein: 0.1, carbs: 0.0, fat: 11.0, servingSize: "1 tbsp (14g)", category: "Dairy" },
  { name: "Single Cream", calories: 195, protein: 2.6, carbs: 4.0, fat: 19.0, servingSize: "100ml", category: "Dairy" },
  { name: "Double Cream", calories: 449, protein: 1.7, carbs: 2.6, fat: 48.0, servingSize: "100ml", category: "Dairy" },
  { name: "Clotted Cream (1 tbsp)", calories: 90, protein: 0.3, carbs: 0.4, fat: 10.0, servingSize: "1 tbsp (15g)", category: "Dairy" },

  // ===========================================================================
  // FRUITS
  // ===========================================================================
  { name: "Apple (1 medium)", calories: 52, protein: 0.3, carbs: 14.0, fat: 0.2, servingSize: "1 medium (~100g)", category: "Fruit" },
  { name: "Apple (1 large)", calories: 80, protein: 0.5, carbs: 21.0, fat: 0.3, servingSize: "1 large (~155g)", category: "Fruit" },
  { name: "Banana (1 medium)", calories: 105, protein: 1.3, carbs: 27.0, fat: 0.4, servingSize: "1 medium (~120g)", category: "Fruit" },
  { name: "Banana (1 large)", calories: 130, protein: 1.6, carbs: 33.0, fat: 0.5, servingSize: "1 large (~150g)", category: "Fruit" },
  { name: "Orange (1 medium)", calories: 62, protein: 1.2, carbs: 15.0, fat: 0.2, servingSize: "1 medium (~130g)", category: "Fruit" },
  { name: "Strawberries", calories: 33, protein: 0.7, carbs: 7.5, fat: 0.3, servingSize: "100g (~7 strawberries)", category: "Fruit" },
  { name: "Strawberries (1 punnet)", calories: 66, protein: 1.4, carbs: 15.0, fat: 0.6, servingSize: "1 punnet (~200g)", category: "Fruit" },
  { name: "Blueberries", calories: 57, protein: 0.7, carbs: 14.0, fat: 0.3, servingSize: "100g", category: "Fruit" },
  { name: "Blueberries (80g portion)", calories: 46, protein: 0.6, carbs: 11.0, fat: 0.2, servingSize: "80g portion", category: "Fruit" },
  { name: "Grapes (red/green)", calories: 69, protein: 0.7, carbs: 17.0, fat: 0.2, servingSize: "100g", category: "Fruit" },
  { name: "Grapes (small bunch)", calories: 104, protein: 1.1, carbs: 26.0, fat: 0.3, servingSize: "small bunch (~150g)", category: "Fruit" },
  { name: "Pear (1 medium)", calories: 58, protein: 0.4, carbs: 15.0, fat: 0.1, servingSize: "1 medium (~100g)", category: "Fruit" },
  { name: "Mango (1 cup, diced)", calories: 99, protein: 1.4, carbs: 25.0, fat: 0.6, servingSize: "1 cup (~165g)", category: "Fruit" },
  { name: "Mango (1/2 medium)", calories: 68, protein: 0.9, carbs: 17.0, fat: 0.4, servingSize: "1/2 mango (~115g)", category: "Fruit" },
  { name: "Pineapple (1 cup, chunks)", calories: 82, protein: 0.9, carbs: 21.0, fat: 0.2, servingSize: "1 cup (~165g)", category: "Fruit" },
  { name: "Watermelon (1 slice)", calories: 86, protein: 1.7, carbs: 22.0, fat: 0.4, servingSize: "1 slice (~280g)", category: "Fruit" },
  { name: "Avocado (1/2 medium)", calories: 120, protein: 1.5, carbs: 6.0, fat: 11.0, servingSize: "1/2 avocado (~75g)", category: "Fruit" },
  { name: "Avocado (1 whole)", calories: 240, protein: 3.0, carbs: 12.0, fat: 22.0, servingSize: "1 avocado (~150g)", category: "Fruit" },
  { name: "Raspberries", calories: 52, protein: 1.2, carbs: 12.0, fat: 0.6, servingSize: "100g", category: "Fruit" },
  { name: "Melon (Cantaloupe)", calories: 34, protein: 0.8, carbs: 8.0, fat: 0.2, servingSize: "100g", category: "Fruit" },
  { name: "Clementine (1)", calories: 35, protein: 0.6, carbs: 9.0, fat: 0.1, servingSize: "1 clementine (~65g)", category: "Fruit" },
  { name: "Kiwi (1)", calories: 42, protein: 0.8, carbs: 10.0, fat: 0.4, servingSize: "1 kiwi (~70g)", category: "Fruit" },
  { name: "Plum (1)", calories: 30, protein: 0.5, carbs: 7.5, fat: 0.2, servingSize: "1 plum (~65g)", category: "Fruit" },
  { name: "Cherries (80g)", calories: 40, protein: 0.7, carbs: 10.0, fat: 0.1, servingSize: "80g (~12 cherries)", category: "Fruit" },
  { name: "Dried Fruit Mix (handful)", calories: 130, protein: 1.5, carbs: 32.0, fat: 0.3, servingSize: "40g handful", category: "Fruit" },
  { name: "Raisins (small box)", calories: 85, protein: 0.8, carbs: 21.0, fat: 0.1, servingSize: "1 small box (25g)", category: "Fruit" },
  { name: "Dates (Medjool, 2)", calories: 133, protein: 1.0, carbs: 36.0, fat: 0.1, servingSize: "2 dates (~50g)", category: "Fruit" },

  // ===========================================================================
  // VEGETABLES
  // ===========================================================================
  { name: "Broccoli (cooked)", calories: 35, protein: 2.4, carbs: 7.0, fat: 0.4, servingSize: "100g", category: "Vegetables" },
  { name: "Broccoli (1 portion steamed)", calories: 55, protein: 3.7, carbs: 11.0, fat: 0.6, servingSize: "1 portion (~160g)", category: "Vegetables" },
  { name: "Carrots (cooked)", calories: 35, protein: 0.6, carbs: 8.0, fat: 0.3, servingSize: "100g", category: "Vegetables" },
  { name: "Carrots (1 medium, raw)", calories: 25, protein: 0.6, carbs: 6.0, fat: 0.1, servingSize: "1 medium carrot (~60g)", category: "Vegetables" },
  { name: "Peas (cooked)", calories: 81, protein: 5.4, carbs: 14.0, fat: 0.4, servingSize: "100g", category: "Vegetables" },
  { name: "Peas (1 portion)", calories: 65, protein: 4.3, carbs: 11.0, fat: 0.3, servingSize: "1 portion (80g)", category: "Vegetables" },
  { name: "Sweetcorn (cooked)", calories: 86, protein: 3.3, carbs: 19.0, fat: 1.2, servingSize: "100g", category: "Vegetables" },
  { name: "Sweetcorn (1 cob)", calories: 130, protein: 5.0, carbs: 29.0, fat: 1.8, servingSize: "1 large cob (~150g)", category: "Vegetables" },
  { name: "Spinach (raw)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: "100g", category: "Vegetables" },
  { name: "Spinach (cooked)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.3, servingSize: "100g", category: "Vegetables" },
  { name: "Spinach (large handful, raw)", calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, servingSize: "1 handful (~30g)", category: "Vegetables" },
  { name: "Tomatoes (1 medium)", calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, servingSize: "1 medium (~120g)", category: "Vegetables" },
  { name: "Cherry Tomatoes (80g)", calories: 14, protein: 0.7, carbs: 3.1, fat: 0.2, servingSize: "80g (~8 tomatoes)", category: "Vegetables" },
  { name: "Bell Pepper (1 medium)", calories: 30, protein: 1.0, carbs: 6.0, fat: 0.2, servingSize: "1 medium (~150g)", category: "Vegetables" },
  { name: "Onion (1 medium)", calories: 44, protein: 1.2, carbs: 10.0, fat: 0.1, servingSize: "1 medium (~110g)", category: "Vegetables" },
  { name: "Mushrooms (sliced, raw)", calories: 15, protein: 2.2, carbs: 0.4, fat: 0.3, servingSize: "100g", category: "Vegetables" },
  { name: "Mushrooms (fried)", calories: 157, protein: 2.4, carbs: 0.3, fat: 16.0, servingSize: "100g", category: "Vegetables" },
  { name: "Green Beans (cooked)", calories: 22, protein: 1.8, carbs: 3.6, fat: 0.1, servingSize: "100g", category: "Vegetables" },
  { name: "Cauliflower (cooked)", calories: 28, protein: 1.8, carbs: 5.0, fat: 0.3, servingSize: "100g", category: "Vegetables" },
  { name: "Courgette / Zucchini (cooked)", calories: 19, protein: 1.2, carbs: 3.1, fat: 0.4, servingSize: "100g", category: "Vegetables" },
  { name: "Aubergine / Eggplant (cooked)", calories: 25, protein: 1.0, carbs: 6.0, fat: 0.2, servingSize: "100g", category: "Vegetables" },
  { name: "Asparagus (cooked)", calories: 20, protein: 2.2, carbs: 3.9, fat: 0.2, servingSize: "100g", category: "Vegetables" },
  { name: "Kale (cooked)", calories: 28, protein: 2.9, carbs: 4.4, fat: 0.5, servingSize: "100g", category: "Vegetables" },
  { name: "Cucumber (1/4)", calories: 10, protein: 0.5, carbs: 2.2, fat: 0.1, servingSize: "1/4 cucumber (~80g)", category: "Vegetables" },
  { name: "Lettuce (Iceberg)", calories: 14, protein: 0.9, carbs: 3.0, fat: 0.1, servingSize: "100g", category: "Vegetables" },
  { name: "Mixed Salad Leaves", calories: 18, protein: 1.5, carbs: 3.0, fat: 0.2, servingSize: "100g", category: "Vegetables" },
  { name: "Baked Beans (Heinz)", calories: 81, protein: 4.7, carbs: 13.0, fat: 0.6, servingSize: "100g", category: "Vegetables" },
  { name: "Baked Beans (1/2 tin)", calories: 162, protein: 9.4, carbs: 26.0, fat: 1.2, servingSize: "1/2 tin (200g)", category: "Vegetables" },
  { name: "Baked Beans (1 tin)", calories: 324, protein: 18.8, carbs: 52.0, fat: 2.4, servingSize: "1 tin (400g)", category: "Vegetables" },
  { name: "Chickpeas (tinned, drained)", calories: 119, protein: 7.0, carbs: 16.0, fat: 2.6, servingSize: "100g", category: "Vegetables" },
  { name: "Lentils (cooked)", calories: 116, protein: 9.0, carbs: 20.0, fat: 0.4, servingSize: "100g", category: "Vegetables" },
  { name: "Edamame Beans", calories: 122, protein: 11.0, carbs: 10.0, fat: 5.0, servingSize: "100g", category: "Vegetables" },

  // ===========================================================================
  // NUTS, SEEDS & NUT BUTTERS
  // ===========================================================================
  { name: "Almonds", calories: 579, protein: 21.0, carbs: 22.0, fat: 49.0, servingSize: "100g", category: "Nuts & Seeds" },
  { name: "Almonds (handful, ~25g)", calories: 145, protein: 5.3, carbs: 5.5, fat: 12.3, servingSize: "25g (~20 almonds)", category: "Nuts & Seeds" },
  { name: "Cashews", calories: 553, protein: 18.0, carbs: 30.0, fat: 44.0, servingSize: "100g", category: "Nuts & Seeds" },
  { name: "Cashews (handful, ~25g)", calories: 138, protein: 4.5, carbs: 7.5, fat: 11.0, servingSize: "25g (~15 cashews)", category: "Nuts & Seeds" },
  { name: "Peanuts (roasted)", calories: 567, protein: 26.0, carbs: 16.0, fat: 49.0, servingSize: "100g", category: "Nuts & Seeds" },
  { name: "Peanuts (handful, ~25g)", calories: 142, protein: 6.5, carbs: 4.0, fat: 12.3, servingSize: "25g", category: "Nuts & Seeds" },
  { name: "Walnuts (handful, ~25g)", calories: 163, protein: 3.8, carbs: 3.4, fat: 16.3, servingSize: "25g (~6 halves)", category: "Nuts & Seeds" },
  { name: "Mixed Nuts (handful, ~30g)", calories: 175, protein: 5.5, carbs: 5.0, fat: 15.5, servingSize: "30g", category: "Nuts & Seeds" },
  { name: "Pecans (handful, ~25g)", calories: 173, protein: 2.3, carbs: 3.5, fat: 18.0, servingSize: "25g", category: "Nuts & Seeds" },
  { name: "Brazil Nuts (3)", calories: 99, protein: 2.2, carbs: 1.8, fat: 10.0, servingSize: "3 nuts (~15g)", category: "Nuts & Seeds" },
  { name: "Pistachios (handful, ~25g)", calories: 141, protein: 5.1, carbs: 7.0, fat: 11.3, servingSize: "25g", category: "Nuts & Seeds" },
  { name: "Chia Seeds (1 tbsp)", calories: 58, protein: 2.0, carbs: 5.0, fat: 3.7, servingSize: "1 tbsp (12g)", category: "Nuts & Seeds" },
  { name: "Flaxseed / Linseed (1 tbsp)", calories: 55, protein: 1.9, carbs: 3.0, fat: 4.3, servingSize: "1 tbsp (10g)", category: "Nuts & Seeds" },
  { name: "Pumpkin Seeds (handful, ~25g)", calories: 138, protein: 7.5, carbs: 4.0, fat: 11.5, servingSize: "25g", category: "Nuts & Seeds" },
  { name: "Sunflower Seeds (handful, ~25g)", calories: 146, protein: 5.2, carbs: 5.0, fat: 12.8, servingSize: "25g", category: "Nuts & Seeds" },
  { name: "Peanut Butter (1 tbsp)", calories: 95, protein: 3.8, carbs: 2.5, fat: 8.0, servingSize: "1 tbsp (15g)", category: "Nuts & Seeds" },
  { name: "Peanut Butter (2 tbsp)", calories: 190, protein: 7.6, carbs: 5.0, fat: 16.0, servingSize: "2 tbsp (30g)", category: "Nuts & Seeds" },
  { name: "Almond Butter (1 tbsp)", calories: 98, protein: 3.4, carbs: 3.0, fat: 9.0, servingSize: "1 tbsp (15g)", category: "Nuts & Seeds" },

  // ===========================================================================
  // OILS & FATS
  // ===========================================================================
  { name: "Olive Oil (1 tbsp)", calories: 119, protein: 0.0, carbs: 0.0, fat: 13.5, servingSize: "1 tbsp (15ml)", category: "Oils & Fats" },
  { name: "Olive Oil (1 tsp)", calories: 40, protein: 0.0, carbs: 0.0, fat: 4.5, servingSize: "1 tsp (5ml)", category: "Oils & Fats" },
  { name: "Coconut Oil (1 tbsp)", calories: 117, protein: 0.0, carbs: 0.0, fat: 13.5, servingSize: "1 tbsp (15ml)", category: "Oils & Fats" },
  { name: "Vegetable Oil (1 tbsp)", calories: 120, protein: 0.0, carbs: 0.0, fat: 13.6, servingSize: "1 tbsp (15ml)", category: "Oils & Fats" },
  { name: "Butter (1 knob / 10g)", calories: 74, protein: 0.1, carbs: 0.0, fat: 8.1, servingSize: "1 knob (10g)", category: "Oils & Fats" },
  { name: "Spray Oil (1cal per spray)", calories: 1, protein: 0.0, carbs: 0.0, fat: 0.1, servingSize: "1 spray", category: "Oils & Fats" },

  // ===========================================================================
  // DRINKS
  // ===========================================================================
  // Water
  { name: "Water", calories: 0, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "any amount", category: "Drinks" },
  { name: "Sparkling Water", calories: 0, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "any amount", category: "Drinks" },

  // Soft Drinks
  { name: "Coca-Cola (330ml can)", brand: "Coca-Cola", calories: 139, protein: 0.0, carbs: 35.0, fat: 0.0, servingSize: "330ml can", category: "Drinks" },
  { name: "Coca-Cola (500ml bottle)", brand: "Coca-Cola", calories: 210, protein: 0.0, carbs: 53.0, fat: 0.0, servingSize: "500ml bottle", category: "Drinks" },
  { name: "Diet Coke (330ml can)", brand: "Coca-Cola", calories: 1, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "330ml can", category: "Drinks" },
  { name: "Diet Coke (500ml bottle)", brand: "Coca-Cola", calories: 2, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "500ml bottle", category: "Drinks" },
  { name: "Coke Zero (330ml can)", brand: "Coca-Cola", calories: 1, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "330ml can", category: "Drinks" },
  { name: "Coke Zero (500ml bottle)", brand: "Coca-Cola", calories: 2, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "500ml bottle", category: "Drinks" },
  { name: "Pepsi (330ml can)", brand: "Pepsi", calories: 138, protein: 0.0, carbs: 35.0, fat: 0.0, servingSize: "330ml can", category: "Drinks" },
  { name: "Pepsi Max (330ml can)", brand: "Pepsi", calories: 1, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "330ml can", category: "Drinks" },
  { name: "Pepsi Max (500ml bottle)", brand: "Pepsi", calories: 2, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "500ml bottle", category: "Drinks" },
  { name: "Lucozade Original (380ml)", brand: "Lucozade", calories: 266, protein: 0.0, carbs: 65.0, fat: 0.0, servingSize: "380ml bottle", category: "Drinks" },
  { name: "Lucozade Sport (500ml)", brand: "Lucozade", calories: 70, protein: 0.0, carbs: 16.0, fat: 0.0, servingSize: "500ml bottle", category: "Drinks" },
  { name: "Ribena (Original, 500ml)", brand: "Ribena", calories: 50, protein: 0.0, carbs: 12.0, fat: 0.0, servingSize: "500ml bottle", category: "Drinks" },
  { name: "Fanta Orange (330ml can)", brand: "Fanta", calories: 63, protein: 0.0, carbs: 15.0, fat: 0.0, servingSize: "330ml can", category: "Drinks" },
  { name: "Sprite (330ml can)", brand: "Sprite", calories: 66, protein: 0.0, carbs: 16.0, fat: 0.0, servingSize: "330ml can", category: "Drinks" },
  { name: "Dr Pepper (330ml can)", brand: "Dr Pepper", calories: 132, protein: 0.0, carbs: 33.0, fat: 0.0, servingSize: "330ml can", category: "Drinks" },
  { name: "Red Bull (250ml can)", brand: "Red Bull", calories: 112, protein: 0.0, carbs: 27.0, fat: 0.0, servingSize: "250ml can", category: "Drinks" },
  { name: "Red Bull Sugar Free (250ml can)", brand: "Red Bull", calories: 5, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "250ml can", category: "Drinks" },
  { name: "Monster Energy (500ml)", brand: "Monster", calories: 220, protein: 0.0, carbs: 55.0, fat: 0.0, servingSize: "500ml can", category: "Drinks" },
  { name: "Monster Ultra Zero (500ml)", brand: "Monster", calories: 5, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "500ml can", category: "Drinks" },
  { name: "Irn-Bru (330ml can)", brand: "Irn-Bru", calories: 46, protein: 0.0, carbs: 11.0, fat: 0.0, servingSize: "330ml can", category: "Drinks" },

  // Juices
  { name: "Orange Juice (1 glass)", calories: 90, protein: 1.5, carbs: 22.0, fat: 0.0, servingSize: "1 glass (200ml)", category: "Drinks" },
  { name: "Apple Juice (1 glass)", calories: 92, protein: 0.2, carbs: 23.0, fat: 0.0, servingSize: "1 glass (200ml)", category: "Drinks" },
  { name: "Cranberry Juice (1 glass)", calories: 92, protein: 0.0, carbs: 24.0, fat: 0.0, servingSize: "1 glass (200ml)", category: "Drinks" },
  { name: "Smoothie (typical fruit, shop bought)", calories: 180, protein: 2.0, carbs: 40.0, fat: 0.5, servingSize: "1 bottle (250ml)", category: "Drinks" },
  { name: "Innocent Smoothie (250ml)", brand: "Innocent", calories: 135, protein: 1.5, carbs: 30.0, fat: 0.5, servingSize: "250ml bottle", category: "Drinks" },

  // Alcohol
  { name: "Lager (1 pint)", calories: 240, protein: 1.5, carbs: 18.0, fat: 0.0, servingSize: "1 pint (568ml)", category: "Alcohol" },
  { name: "Lager (330ml bottle)", calories: 142, protein: 0.9, carbs: 11.0, fat: 0.0, servingSize: "330ml bottle", category: "Alcohol" },
  { name: "Ale / Bitter (1 pint)", calories: 210, protein: 2.0, carbs: 14.0, fat: 0.0, servingSize: "1 pint (568ml)", category: "Alcohol" },
  { name: "IPA (1 pint)", calories: 260, protein: 2.0, carbs: 18.0, fat: 0.0, servingSize: "1 pint (568ml)", category: "Alcohol" },
  { name: "Stout (Guinness, 1 pint)", brand: "Guinness", calories: 210, protein: 2.0, carbs: 18.0, fat: 0.0, servingSize: "1 pint (568ml)", category: "Alcohol" },
  { name: "Cider (1 pint)", calories: 210, protein: 0.0, carbs: 22.0, fat: 0.0, servingSize: "1 pint (568ml)", category: "Alcohol" },
  { name: "Red Wine (175ml glass)", calories: 133, protein: 0.2, carbs: 0.5, fat: 0.0, servingSize: "175ml glass", category: "Alcohol" },
  { name: "Red Wine (250ml large glass)", calories: 190, protein: 0.3, carbs: 0.7, fat: 0.0, servingSize: "250ml glass", category: "Alcohol" },
  { name: "White Wine (175ml glass)", calories: 131, protein: 0.1, carbs: 2.5, fat: 0.0, servingSize: "175ml glass", category: "Alcohol" },
  { name: "White Wine (250ml large glass)", calories: 187, protein: 0.2, carbs: 3.5, fat: 0.0, servingSize: "250ml glass", category: "Alcohol" },
  { name: "Rose Wine (175ml glass)", calories: 126, protein: 0.1, carbs: 3.0, fat: 0.0, servingSize: "175ml glass", category: "Alcohol" },
  { name: "Prosecco (1 glass, 125ml)", calories: 80, protein: 0.2, carbs: 1.5, fat: 0.0, servingSize: "1 glass (125ml)", category: "Alcohol" },
  { name: "Champagne (1 glass, 125ml)", calories: 89, protein: 0.3, carbs: 1.4, fat: 0.0, servingSize: "1 glass (125ml)", category: "Alcohol" },
  { name: "Gin & Tonic (single)", calories: 120, protein: 0.0, carbs: 8.0, fat: 0.0, servingSize: "25ml gin + tonic", category: "Alcohol" },
  { name: "Gin & Slim Tonic (single)", calories: 55, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "25ml gin + slimline tonic", category: "Alcohol" },
  { name: "Vodka & Coke (single)", calories: 125, protein: 0.0, carbs: 14.0, fat: 0.0, servingSize: "25ml vodka + coke", category: "Alcohol" },
  { name: "Vodka & Diet Coke (single)", calories: 55, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "25ml vodka + diet coke", category: "Alcohol" },
  { name: "Vodka (single, 25ml)", calories: 55, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "25ml single measure", category: "Alcohol" },
  { name: "Vodka (double, 50ml)", calories: 110, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "50ml double measure", category: "Alcohol" },
  { name: "Gin (single, 25ml)", calories: 55, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "25ml single measure", category: "Alcohol" },
  { name: "Rum (single, 25ml)", calories: 55, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "25ml single measure", category: "Alcohol" },
  { name: "Rum & Coke (single)", calories: 125, protein: 0.0, carbs: 14.0, fat: 0.0, servingSize: "25ml rum + coke", category: "Alcohol" },
  { name: "Whisky (single, 25ml)", calories: 55, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "25ml single measure", category: "Alcohol" },
  { name: "Whisky (double, 50ml)", calories: 110, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "50ml double measure", category: "Alcohol" },
  { name: "Jagerbomb", calories: 155, protein: 0.0, carbs: 20.0, fat: 0.0, servingSize: "25ml Jagermeister + Red Bull", category: "Alcohol" },
  { name: "WKD Blue (275ml)", calories: 170, protein: 0.0, carbs: 28.0, fat: 0.0, servingSize: "275ml bottle", category: "Alcohol" },

  // Protein Shakes
  { name: "Protein Shake (whey, with water)", calories: 120, protein: 24.0, carbs: 2.0, fat: 1.5, servingSize: "1 scoop + water", category: "Drinks" },
  { name: "Protein Shake (whey, with semi-skimmed milk)", calories: 235, protein: 32.5, carbs: 13.8, fat: 5.8, servingSize: "1 scoop + 250ml milk", category: "Drinks" },
  { name: "Protein Shake (whey, with whole milk)", calories: 280, protein: 32.3, carbs: 13.6, fat: 10.5, servingSize: "1 scoop + 250ml milk", category: "Drinks" },

  // ===========================================================================
  // SNACKS - CRISPS
  // ===========================================================================
  { name: "Walkers Crisps (standard bag)", brand: "Walkers", calories: 132, protein: 1.5, carbs: 14.0, fat: 8.0, servingSize: "1 bag (25g)", category: "Snacks" },
  { name: "Walkers Crisps (grab bag)", brand: "Walkers", calories: 245, protein: 2.8, carbs: 26.0, fat: 15.0, servingSize: "1 bag (50g)", category: "Snacks" },
  { name: "Pringles (Original, per serving)", brand: "Pringles", calories: 135, protein: 1.2, carbs: 15.0, fat: 7.5, servingSize: "25g (~12 crisps)", category: "Snacks" },
  { name: "Pringles (Original, sharing tube)", brand: "Pringles", calories: 945, protein: 8.4, carbs: 105.0, fat: 52.5, servingSize: "1 tube (175g)", category: "Snacks" },
  { name: "Doritos (per bag, sharing)", brand: "Doritos", calories: 487, protein: 6.5, carbs: 57.0, fat: 25.0, servingSize: "1 bag (100g)", category: "Snacks" },
  { name: "Doritos (handful, ~30g)", brand: "Doritos", calories: 146, protein: 2.0, carbs: 17.0, fat: 7.5, servingSize: "30g", category: "Snacks" },
  { name: "Kettle Chips (handful, ~30g)", brand: "Kettle", calories: 150, protein: 2.0, carbs: 16.0, fat: 8.5, servingSize: "30g", category: "Snacks" },
  { name: "Kettle Chips (sharing bag)", brand: "Kettle", calories: 750, protein: 10.0, carbs: 80.0, fat: 42.5, servingSize: "1 bag (150g)", category: "Snacks" },
  { name: "Quavers (standard bag)", brand: "Walkers", calories: 88, protein: 0.6, carbs: 10.0, fat: 5.0, servingSize: "1 bag (16g)", category: "Snacks" },
  { name: "Wotsits (standard bag)", brand: "Walkers", calories: 96, protein: 1.2, carbs: 10.0, fat: 5.5, servingSize: "1 bag (17g)", category: "Snacks" },
  { name: "Hula Hoops (standard bag)", brand: "Hula Hoops", calories: 125, protein: 1.0, carbs: 13.0, fat: 7.5, servingSize: "1 bag (24g)", category: "Snacks" },
  { name: "McCoy's (standard bag)", brand: "McCoy's", calories: 147, protein: 2.0, carbs: 16.0, fat: 8.0, servingSize: "1 bag (30g)", category: "Snacks" },
  { name: "Skips (standard bag)", brand: "Skips", calories: 75, protein: 0.4, carbs: 9.0, fat: 4.0, servingSize: "1 bag (13g)", category: "Snacks" },

  // ===========================================================================
  // SNACKS - CHOCOLATE
  // ===========================================================================
  { name: "Cadbury Dairy Milk Bar", brand: "Cadbury", calories: 240, protein: 3.4, carbs: 26.0, fat: 14.0, servingSize: "1 bar (45g)", category: "Snacks" },
  { name: "Cadbury Dairy Milk (treat size)", brand: "Cadbury", calories: 110, protein: 1.6, carbs: 12.0, fat: 6.5, servingSize: "1 bar (22g)", category: "Snacks" },
  { name: "KitKat (2 finger)", brand: "Nestle", calories: 106, protein: 1.3, carbs: 13.0, fat: 5.5, servingSize: "2 fingers (20g)", category: "Snacks" },
  { name: "KitKat (4 finger)", brand: "Nestle", calories: 213, protein: 2.6, carbs: 26.0, fat: 11.0, servingSize: "4 fingers (41g)", category: "Snacks" },
  { name: "KitKat Chunky", brand: "Nestle", calories: 245, protein: 3.0, carbs: 29.0, fat: 13.0, servingSize: "1 bar (49g)", category: "Snacks" },
  { name: "Snickers", brand: "Mars", calories: 296, protein: 5.0, carbs: 33.0, fat: 15.0, servingSize: "1 bar (52g)", category: "Snacks" },
  { name: "Mars Bar", brand: "Mars", calories: 228, protein: 2.4, carbs: 32.0, fat: 9.5, servingSize: "1 bar (51g)", category: "Snacks" },
  { name: "Twix (twin)", brand: "Mars", calories: 250, protein: 2.8, carbs: 30.0, fat: 12.5, servingSize: "1 twin pack (50g)", category: "Snacks" },
  { name: "Maltesers (standard bag)", brand: "Mars", calories: 186, protein: 2.6, carbs: 22.0, fat: 9.5, servingSize: "1 bag (37g)", category: "Snacks" },
  { name: "Maltesers (treat bag)", brand: "Mars", calories: 66, protein: 0.9, carbs: 8.0, fat: 3.4, servingSize: "1 treat bag (13g)", category: "Snacks" },
  { name: "Freddo", brand: "Cadbury", calories: 95, protein: 1.3, carbs: 10.5, fat: 5.4, servingSize: "1 bar (18g)", category: "Snacks" },
  { name: "Freddo Caramel", brand: "Cadbury", calories: 120, protein: 1.3, carbs: 15.0, fat: 6.0, servingSize: "1 bar (25.5g)", category: "Snacks" },
  { name: "Bounty", brand: "Mars", calories: 268, protein: 2.8, carbs: 30.0, fat: 15.0, servingSize: "1 bar (57g)", category: "Snacks" },
  { name: "Milky Way", brand: "Mars", calories: 117, protein: 1.1, carbs: 18.0, fat: 4.4, servingSize: "1 bar (26g)", category: "Snacks" },
  { name: "Galaxy (standard)", brand: "Mars", calories: 242, protein: 3.0, carbs: 24.0, fat: 15.0, servingSize: "1 bar (42g)", category: "Snacks" },
  { name: "Crunchie", brand: "Cadbury", calories: 195, protein: 1.5, carbs: 30.0, fat: 7.5, servingSize: "1 bar (40g)", category: "Snacks" },
  { name: "Wispa", brand: "Cadbury", calories: 213, protein: 3.0, carbs: 23.0, fat: 12.0, servingSize: "1 bar (39g)", category: "Snacks" },
  { name: "Wispa Gold", brand: "Cadbury", calories: 233, protein: 2.8, carbs: 26.0, fat: 13.0, servingSize: "1 bar (43g)", category: "Snacks" },
  { name: "Aero (Milk Choc)", brand: "Nestle", calories: 212, protein: 2.5, carbs: 24.0, fat: 12.0, servingSize: "1 bar (36g)", category: "Snacks" },
  { name: "Yorkie", brand: "Nestle", calories: 261, protein: 3.5, carbs: 27.0, fat: 15.5, servingSize: "1 bar (46g)", category: "Snacks" },
  { name: "Double Decker", brand: "Cadbury", calories: 230, protein: 2.5, carbs: 30.0, fat: 11.0, servingSize: "1 bar (47g)", category: "Snacks" },
  { name: "Boost", brand: "Cadbury", calories: 290, protein: 3.5, carbs: 34.0, fat: 15.0, servingSize: "1 bar (61g)", category: "Snacks" },
  { name: "Lion Bar", brand: "Nestle", calories: 230, protein: 2.5, carbs: 30.0, fat: 11.0, servingSize: "1 bar (50g)", category: "Snacks" },
  { name: "Turkish Delight (Fry's)", brand: "Cadbury", calories: 177, protein: 1.2, carbs: 32.0, fat: 5.0, servingSize: "1 bar (51g)", category: "Snacks" },
  { name: "Flake", brand: "Cadbury", calories: 170, protein: 2.3, carbs: 17.5, fat: 10.0, servingSize: "1 bar (32g)", category: "Snacks" },
  { name: "Kinder Bueno", brand: "Kinder", calories: 244, protein: 4.0, carbs: 22.0, fat: 15.5, servingSize: "1 twin bar (43g)", category: "Snacks" },
  { name: "Ferrero Rocher (3 pack)", brand: "Ferrero", calories: 220, protein: 2.7, carbs: 17.0, fat: 16.0, servingSize: "3 pieces (37.5g)", category: "Snacks" },
  { name: "Lindor Truffle (1)", brand: "Lindt", calories: 75, protein: 0.8, carbs: 6.0, fat: 5.5, servingSize: "1 truffle (12g)", category: "Snacks" },

  // ===========================================================================
  // SNACKS - BISCUITS
  // ===========================================================================
  { name: "Digestive Biscuit", calories: 71, protein: 1.0, carbs: 10.0, fat: 3.0, servingSize: "1 biscuit (15g)", category: "Snacks" },
  { name: "Chocolate Digestive", calories: 83, protein: 1.1, carbs: 11.0, fat: 4.0, servingSize: "1 biscuit (17g)", category: "Snacks" },
  { name: "Hobnob", calories: 75, protein: 1.0, carbs: 10.0, fat: 3.5, servingSize: "1 biscuit (15g)", category: "Snacks" },
  { name: "Chocolate Hobnob", calories: 93, protein: 1.2, carbs: 11.0, fat: 5.0, servingSize: "1 biscuit (18g)", category: "Snacks" },
  { name: "Rich Tea Biscuit", calories: 38, protein: 0.6, carbs: 6.0, fat: 1.2, servingSize: "1 biscuit (8g)", category: "Snacks" },
  { name: "Bourbon Biscuit", calories: 67, protein: 0.8, carbs: 10.0, fat: 2.8, servingSize: "1 biscuit (13g)", category: "Snacks" },
  { name: "Custard Cream", calories: 60, protein: 0.7, carbs: 8.0, fat: 2.8, servingSize: "1 biscuit (12g)", category: "Snacks" },
  { name: "Oreo (2 cookies)", brand: "Oreo", calories: 105, protein: 1.0, carbs: 15.0, fat: 4.5, servingSize: "2 cookies (22g)", category: "Snacks" },
  { name: "Jaffa Cake", brand: "McVitie's", calories: 46, protein: 0.6, carbs: 8.0, fat: 1.0, servingSize: "1 cake (12g)", category: "Snacks" },
  { name: "Shortbread Finger", calories: 90, protein: 1.0, carbs: 11.0, fat: 5.0, servingSize: "1 finger (18g)", category: "Snacks" },
  { name: "Cookie (Maryland, 1)", brand: "Maryland", calories: 52, protein: 0.6, carbs: 7.0, fat: 2.5, servingSize: "1 cookie (11g)", category: "Snacks" },
  { name: "Nice Biscuit", calories: 35, protein: 0.5, carbs: 5.5, fat: 1.3, servingSize: "1 biscuit (8g)", category: "Snacks" },
  { name: "Malted Milk Biscuit", calories: 40, protein: 0.6, carbs: 6.0, fat: 1.5, servingSize: "1 biscuit (8g)", category: "Snacks" },

  // ===========================================================================
  // SNACKS - CEREAL BARS & PROTEIN BARS
  // ===========================================================================
  { name: "Nature Valley Granola Bar (2 pack)", brand: "Nature Valley", calories: 190, protein: 4.0, carbs: 26.0, fat: 8.0, servingSize: "1 pack (42g)", category: "Snacks" },
  { name: "Belvita Breakfast Biscuit (1 pack)", brand: "Belvita", calories: 230, protein: 4.5, carbs: 36.0, fat: 7.5, servingSize: "1 pack (50g)", category: "Snacks" },
  { name: "Nakd Bar (Cashew Cookie)", brand: "Nakd", calories: 138, protein: 3.2, carbs: 17.0, fat: 6.5, servingSize: "1 bar (35g)", category: "Snacks" },
  { name: "Nakd Bar (Blueberry Muffin)", brand: "Nakd", calories: 127, protein: 2.5, carbs: 18.0, fat: 5.5, servingSize: "1 bar (35g)", category: "Snacks" },
  { name: "Trek Bar (Cocoa Oat)", brand: "Trek", calories: 195, protein: 6.0, carbs: 22.0, fat: 9.0, servingSize: "1 bar (55g)", category: "Snacks" },
  { name: "Grenade Protein Bar (Oreo)", brand: "Grenade", calories: 220, protein: 20.0, carbs: 17.0, fat: 9.0, servingSize: "1 bar (60g)", category: "Snacks" },
  { name: "Grenade Protein Bar (Cookie Dough)", brand: "Grenade", calories: 215, protein: 20.0, carbs: 16.0, fat: 8.5, servingSize: "1 bar (60g)", category: "Snacks" },
  { name: "Grenade Protein Bar (Caramel Chaos)", brand: "Grenade", calories: 218, protein: 20.0, carbs: 17.0, fat: 8.5, servingSize: "1 bar (60g)", category: "Snacks" },
  { name: "Barebells Protein Bar (Salty Peanut)", brand: "Barebells", calories: 204, protein: 20.0, carbs: 15.0, fat: 8.0, servingSize: "1 bar (55g)", category: "Snacks" },
  { name: "Barebells Protein Bar (Cookies & Cream)", brand: "Barebells", calories: 198, protein: 20.0, carbs: 14.0, fat: 7.5, servingSize: "1 bar (55g)", category: "Snacks" },
  { name: "MyProtein Protein Bar (Chocolate Brownie)", brand: "MyProtein", calories: 196, protein: 20.0, carbs: 14.0, fat: 7.0, servingSize: "1 bar (55g)", category: "Snacks" },
  { name: "Fulfil Protein Bar", brand: "Fulfil", calories: 205, protein: 20.0, carbs: 16.0, fat: 7.5, servingSize: "1 bar (55g)", category: "Snacks" },
  { name: "PhD Smart Bar (Chocolate Brownie)", brand: "PhD", calories: 238, protein: 20.0, carbs: 20.0, fat: 8.5, servingSize: "1 bar (64g)", category: "Snacks" },

  // ===========================================================================
  // SNACKS - OTHER
  // ===========================================================================
  { name: "Rice Cakes (plain, 1)", calories: 28, protein: 0.7, carbs: 6.0, fat: 0.2, servingSize: "1 rice cake (8g)", category: "Snacks" },
  { name: "Rice Cakes (chocolate coated, 1)", calories: 48, protein: 0.7, carbs: 8.0, fat: 1.5, servingSize: "1 rice cake (12g)", category: "Snacks" },
  { name: "Oatcakes (Nairn's, 1)", brand: "Nairn's", calories: 46, protein: 1.0, carbs: 6.0, fat: 2.0, servingSize: "1 oatcake (10g)", category: "Snacks" },
  { name: "Fruit & Nut Mix (handful)", calories: 165, protein: 5.0, carbs: 12.0, fat: 12.0, servingSize: "30g handful", category: "Snacks" },
  { name: "Haribo (standard bag)", brand: "Haribo", calories: 347, protein: 5.0, carbs: 77.0, fat: 0.5, servingSize: "1 bag (100g)", category: "Snacks" },
  { name: "Haribo (small bag)", brand: "Haribo", calories: 140, protein: 2.0, carbs: 31.0, fat: 0.2, servingSize: "1 small bag (40g)", category: "Snacks" },
  { name: "Popcorn (Sweet, per bag)", calories: 170, protein: 1.5, carbs: 28.0, fat: 6.0, servingSize: "1 bag (40g)", category: "Snacks" },
  { name: "Popcorn (Salted, per bag)", calories: 145, protein: 2.0, carbs: 18.0, fat: 7.0, servingSize: "1 bag (30g)", category: "Snacks" },
  { name: "Popcorn (Butterkist, Sweet Cinema)", brand: "Butterkist", calories: 480, protein: 4.0, carbs: 68.0, fat: 22.0, servingSize: "1 bag (100g)", category: "Snacks" },
  { name: "Skittles (standard bag)", brand: "Skittles", calories: 195, protein: 0.0, carbs: 44.0, fat: 2.0, servingSize: "1 bag (45g)", category: "Snacks" },
  { name: "Wine Gums (roll)", brand: "Maynards", calories: 170, protein: 3.0, carbs: 39.0, fat: 0.1, servingSize: "1 roll (52g)", category: "Snacks" },
  { name: "Jelly Babies (bag)", brand: "Bassett's", calories: 350, protein: 4.0, carbs: 80.0, fat: 0.0, servingSize: "1 bag (100g)", category: "Snacks" },
  { name: "Hummus (2 tbsp)", calories: 70, protein: 2.5, carbs: 4.0, fat: 5.0, servingSize: "2 tbsp (30g)", category: "Snacks" },
  { name: "Hummus (pot)", calories: 280, protein: 9.5, carbs: 14.0, fat: 20.0, servingSize: "1 pot (200g)", category: "Snacks" },
  { name: "Breadsticks (5)", calories: 100, protein: 2.5, carbs: 16.0, fat: 2.5, servingSize: "5 breadsticks (~25g)", category: "Snacks" },
  { name: "Scotch Egg", calories: 280, protein: 12.0, carbs: 16.0, fat: 18.0, servingSize: "1 scotch egg", category: "Snacks" },
  { name: "Pork Pie (individual)", calories: 350, protein: 10.0, carbs: 22.0, fat: 25.0, servingSize: "1 mini pork pie", category: "Snacks" },
  { name: "Babybel (1 mini)", brand: "Babybel", calories: 62, protein: 5.0, carbs: 0.0, fat: 5.0, servingSize: "1 mini (20g)", category: "Snacks" },
  { name: "Cheese String", brand: "Kerry", calories: 60, protein: 5.0, carbs: 0.3, fat: 4.5, servingSize: "1 string (20g)", category: "Snacks" },
  { name: "Dark Chocolate (4 squares)", calories: 120, protein: 1.5, carbs: 11.0, fat: 8.0, servingSize: "4 squares (~25g)", category: "Snacks" },

  // ===========================================================================
  // BREAKFAST CEREALS
  // ===========================================================================
  { name: "Weetabix (2 biscuits)", brand: "Weetabix", calories: 136, protein: 4.5, carbs: 26.0, fat: 0.8, servingSize: "2 biscuits (37.5g)", category: "Breakfast" },
  { name: "Weetabix (2) with Semi-Skimmed Milk", brand: "Weetabix", calories: 205, protein: 10.3, carbs: 34.0, fat: 3.7, servingSize: "2 biscuits + 150ml milk", category: "Breakfast" },
  { name: "Cheerios (30g serving)", brand: "Nestle", calories: 114, protein: 2.5, carbs: 22.0, fat: 1.5, servingSize: "30g", category: "Breakfast" },
  { name: "Crunchy Nut Cornflakes (30g serving)", brand: "Kellogg's", calories: 120, protein: 1.8, carbs: 24.0, fat: 1.5, servingSize: "30g", category: "Breakfast" },
  { name: "Bran Flakes (30g serving)", brand: "Kellogg's", calories: 101, protein: 3.0, carbs: 20.0, fat: 0.6, servingSize: "30g", category: "Breakfast" },
  { name: "Corn Flakes (30g serving)", brand: "Kellogg's", calories: 113, protein: 2.1, carbs: 25.0, fat: 0.3, servingSize: "30g", category: "Breakfast" },
  { name: "Special K (30g serving)", brand: "Kellogg's", calories: 114, protein: 5.0, carbs: 22.0, fat: 0.5, servingSize: "30g", category: "Breakfast" },
  { name: "Coco Pops (30g serving)", brand: "Kellogg's", calories: 116, protein: 1.5, carbs: 26.0, fat: 1.0, servingSize: "30g", category: "Breakfast" },
  { name: "Frosties (30g serving)", brand: "Kellogg's", calories: 114, protein: 1.2, carbs: 27.0, fat: 0.2, servingSize: "30g", category: "Breakfast" },
  { name: "Shreddies (40g serving)", brand: "Nestle", calories: 143, protein: 3.5, carbs: 29.0, fat: 0.8, servingSize: "40g", category: "Breakfast" },
  { name: "Granola (typical, 50g serving)", calories: 225, protein: 5.0, carbs: 30.0, fat: 9.0, servingSize: "50g", category: "Breakfast" },
  { name: "Granola with Yoghurt", calories: 340, protein: 12.0, carbs: 38.0, fat: 14.0, servingSize: "50g granola + 150g yoghurt", category: "Breakfast" },
  { name: "Ready Brek (30g dry)", brand: "Ready Brek", calories: 113, protein: 3.3, carbs: 19.0, fat: 2.4, servingSize: "30g dry", category: "Breakfast" },
  { name: "Porridge (made with water)", calories: 150, protein: 4.4, carbs: 24.0, fat: 3.2, servingSize: "40g oats + water", category: "Breakfast" },
  { name: "Porridge (made with semi-skimmed milk)", calories: 265, protein: 10.8, carbs: 35.8, fat: 7.5, servingSize: "40g oats + 200ml milk", category: "Breakfast" },
  { name: "Porridge (made with whole milk)", calories: 300, protein: 10.6, carbs: 35.2, fat: 10.4, servingSize: "40g oats + 200ml milk", category: "Breakfast" },
  { name: "Overnight Oats (typical)", calories: 310, protein: 12.0, carbs: 40.0, fat: 10.0, servingSize: "1 portion", category: "Breakfast" },

  // Toast & Toppings
  { name: "Toast (1 slice white) with Butter", calories: 153, protein: 2.9, carbs: 14.5, fat: 8.9, servingSize: "1 slice + butter", category: "Breakfast" },
  { name: "Toast (1 slice wholemeal) with Butter", calories: 149, protein: 3.6, carbs: 12.5, fat: 9.1, servingSize: "1 slice + butter", category: "Breakfast" },
  { name: "Toast with Jam (1 slice)", calories: 120, protein: 2.8, carbs: 22.0, fat: 1.0, servingSize: "1 slice + jam", category: "Breakfast" },
  { name: "Toast with Peanut Butter (1 slice)", calories: 175, protein: 6.6, carbs: 17.0, fat: 8.8, servingSize: "1 slice + peanut butter", category: "Breakfast" },
  { name: "Toast with Marmite (1 slice)", calories: 90, protein: 4.0, carbs: 15.0, fat: 1.0, servingSize: "1 slice + Marmite", category: "Breakfast" },
  { name: "Toast with Nutella (1 slice)", calories: 180, protein: 3.5, carbs: 24.0, fat: 8.0, servingSize: "1 slice + Nutella", category: "Breakfast" },
  { name: "Toast with Avocado (1 slice)", calories: 200, protein: 3.5, carbs: 16.0, fat: 12.0, servingSize: "1 slice + 1/2 avocado", category: "Breakfast" },

  // Pastries
  { name: "Croissant (plain)", calories: 275, protein: 5.0, carbs: 26.0, fat: 16.0, servingSize: "1 croissant (~60g)", category: "Breakfast" },
  { name: "Pain au Chocolat", calories: 320, protein: 5.5, carbs: 32.0, fat: 19.0, servingSize: "1 pastry (~70g)", category: "Breakfast" },
  { name: "Pancakes (2, with maple syrup)", calories: 310, protein: 6.5, carbs: 52.0, fat: 8.5, servingSize: "2 pancakes + syrup", category: "Breakfast" },
  { name: "Pancakes (2, plain)", calories: 210, protein: 6.5, carbs: 30.0, fat: 7.0, servingSize: "2 pancakes", category: "Breakfast" },
  { name: "Crumpet with Butter", calories: 145, protein: 3.5, carbs: 18.0, fat: 6.5, servingSize: "1 crumpet + butter", category: "Breakfast" },
  { name: "Bagel with Cream Cheese", calories: 370, protein: 11.0, carbs: 50.0, fat: 13.0, servingSize: "1 bagel + cream cheese", category: "Breakfast" },
  { name: "English Muffin with Butter", calories: 205, protein: 5.0, carbs: 24.0, fat: 9.0, servingSize: "1 muffin + butter", category: "Breakfast" },

  // Yoghurt Pots
  { name: "Muller Corner (Strawberry)", brand: "Muller", calories: 175, protein: 5.8, carbs: 24.0, fat: 5.5, servingSize: "1 pot (136g)", category: "Breakfast" },
  { name: "Muller Corner (Banana Chocolate Flakes)", brand: "Muller", calories: 195, protein: 5.5, carbs: 26.0, fat: 7.0, servingSize: "1 pot (135g)", category: "Breakfast" },
  { name: "Muller Light (various)", brand: "Muller", calories: 89, protein: 5.5, carbs: 13.0, fat: 0.5, servingSize: "1 pot (165g)", category: "Breakfast" },
  { name: "Activia Yoghurt (Strawberry)", brand: "Activia", calories: 95, protein: 4.5, carbs: 14.0, fat: 2.0, servingSize: "1 pot (120g)", category: "Breakfast" },
  { name: "Fage Total 0% (170g)", brand: "Fage", calories: 97, protein: 17.0, carbs: 6.8, fat: 0.0, servingSize: "1 pot (170g)", category: "Breakfast" },
  { name: "Danone Light & Free (Greek Style)", brand: "Danone", calories: 75, protein: 8.0, carbs: 8.0, fat: 0.1, servingSize: "1 pot (120g)", category: "Breakfast" },
  { name: "Skyr Yoghurt (Arla, plain)", brand: "Arla", calories: 99, protein: 17.0, carbs: 6.0, fat: 0.3, servingSize: "1 pot (150g)", category: "Breakfast" },

  // ===========================================================================
  // SUPPLEMENTS
  // ===========================================================================
  { name: "Whey Protein (1 scoop, with water)", calories: 120, protein: 24.0, carbs: 2.0, fat: 1.5, servingSize: "1 scoop (~30g) + water", category: "Supplements" },
  { name: "Whey Protein (1 scoop, with semi-skimmed milk)", calories: 235, protein: 32.5, carbs: 13.8, fat: 5.8, servingSize: "1 scoop + 250ml milk", category: "Supplements" },
  { name: "Whey Protein (1 scoop, with whole milk)", calories: 280, protein: 32.3, carbs: 13.6, fat: 10.5, servingSize: "1 scoop + 250ml milk", category: "Supplements" },
  { name: "Casein Protein (1 scoop, with water)", calories: 110, protein: 24.0, carbs: 3.0, fat: 0.5, servingSize: "1 scoop (~30g) + water", category: "Supplements" },
  { name: "Mass Gainer (1 scoop)", calories: 380, protein: 20.0, carbs: 62.0, fat: 5.0, servingSize: "1 scoop (~100g)", category: "Supplements" },
  { name: "BCAA Powder (1 serving)", calories: 5, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "1 scoop (~10g)", category: "Supplements" },
  { name: "Creatine Monohydrate (1 serving)", calories: 0, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "1 scoop (5g) - 0 calories", category: "Supplements" },
  { name: "Pre-Workout (typical)", calories: 10, protein: 0.0, carbs: 2.0, fat: 0.0, servingSize: "1 scoop", category: "Supplements" },
  { name: "Protein Flapjack (typical)", calories: 290, protein: 18.0, carbs: 28.0, fat: 12.0, servingSize: "1 bar (~70g)", category: "Supplements" },
  { name: "Protein Pancake Mix (1 serving)", calories: 180, protein: 20.0, carbs: 15.0, fat: 3.5, servingSize: "1 serving (~50g dry)", category: "Supplements" },

  // ===========================================================================
  // CONDIMENTS & SAUCES
  // ===========================================================================
  { name: "Ketchup (1 tbsp)", calories: 17, protein: 0.2, carbs: 4.0, fat: 0.0, servingSize: "1 tbsp (15g)", category: "Condiments" },
  { name: "Mayonnaise (1 tbsp)", calories: 100, protein: 0.2, carbs: 0.5, fat: 11.0, servingSize: "1 tbsp (15g)", category: "Condiments" },
  { name: "Light Mayonnaise (1 tbsp)", calories: 35, protein: 0.1, carbs: 1.5, fat: 3.0, servingSize: "1 tbsp (15g)", category: "Condiments" },
  { name: "BBQ Sauce (1 tbsp)", calories: 30, protein: 0.2, carbs: 7.0, fat: 0.1, servingSize: "1 tbsp (15g)", category: "Condiments" },
  { name: "Soy Sauce (1 tbsp)", calories: 8, protein: 1.0, carbs: 1.0, fat: 0.0, servingSize: "1 tbsp (15ml)", category: "Condiments" },
  { name: "Hot Sauce (1 tsp)", calories: 1, protein: 0.0, carbs: 0.0, fat: 0.0, servingSize: "1 tsp", category: "Condiments" },
  { name: "Brown Sauce (HP, 1 tbsp)", brand: "HP", calories: 18, protein: 0.1, carbs: 4.0, fat: 0.0, servingSize: "1 tbsp (15g)", category: "Condiments" },
  { name: "Mustard (English, 1 tsp)", calories: 8, protein: 0.5, carbs: 0.5, fat: 0.5, servingSize: "1 tsp (5g)", category: "Condiments" },
  { name: "Honey (1 tbsp)", calories: 64, protein: 0.1, carbs: 17.0, fat: 0.0, servingSize: "1 tbsp (21g)", category: "Condiments" },
  { name: "Jam / Marmalade (1 tbsp)", calories: 40, protein: 0.1, carbs: 10.0, fat: 0.0, servingSize: "1 tbsp (15g)", category: "Condiments" },
  { name: "Nutella (1 tbsp)", brand: "Nutella", calories: 80, protein: 0.9, carbs: 8.5, fat: 4.5, servingSize: "1 tbsp (15g)", category: "Condiments" },
  { name: "Marmite (1 tsp)", brand: "Marmite", calories: 9, protein: 1.4, carbs: 0.6, fat: 0.0, servingSize: "1 tsp (4g)", category: "Condiments" },
  { name: "Salad Cream (1 tbsp)", calories: 50, protein: 0.3, carbs: 3.5, fat: 3.8, servingSize: "1 tbsp (15g)", category: "Condiments" },
  { name: "Balsamic Vinegar (1 tbsp)", calories: 14, protein: 0.1, carbs: 2.7, fat: 0.0, servingSize: "1 tbsp (15ml)", category: "Condiments" },
  { name: "Caesar Dressing (1 tbsp)", calories: 75, protein: 0.5, carbs: 0.5, fat: 8.0, servingSize: "1 tbsp (15ml)", category: "Condiments" },
  { name: "Sweet Chilli Sauce (1 tbsp)", calories: 32, protein: 0.1, carbs: 7.5, fat: 0.0, servingSize: "1 tbsp (15ml)", category: "Condiments" },
  { name: "Gravy Granules (made, 4 tbsp)", calories: 34, protein: 0.4, carbs: 4.0, fat: 1.8, servingSize: "4 tbsp", category: "Condiments" },
  { name: "Mint Sauce (1 tbsp)", calories: 14, protein: 0.1, carbs: 3.0, fat: 0.0, servingSize: "1 tbsp (15ml)", category: "Condiments" },
  { name: "Cranberry Sauce (1 tbsp)", calories: 40, protein: 0.0, carbs: 10.0, fat: 0.0, servingSize: "1 tbsp (15g)", category: "Condiments" },
  { name: "Pesto (1 tbsp)", calories: 55, protein: 1.5, carbs: 1.0, fat: 5.0, servingSize: "1 tbsp (15g)", category: "Condiments" },
  { name: "Maple Syrup (1 tbsp)", calories: 52, protein: 0.0, carbs: 13.0, fat: 0.0, servingSize: "1 tbsp (20ml)", category: "Condiments" },
  { name: "Sugar (1 tsp)", calories: 16, protein: 0.0, carbs: 4.0, fat: 0.0, servingSize: "1 tsp (4g)", category: "Condiments" },

  // ===========================================================================
  // DESSERTS
  // ===========================================================================
  { name: "Ice Cream (vanilla, 1 scoop)", calories: 137, protein: 2.4, carbs: 16.0, fat: 7.0, servingSize: "1 scoop (~70g)", category: "Desserts" },
  { name: "Ice Cream (vanilla, 2 scoops)", calories: 274, protein: 4.8, carbs: 32.0, fat: 14.0, servingSize: "2 scoops (~140g)", category: "Desserts" },
  { name: "Magnum Classic", brand: "Magnum", calories: 260, protein: 3.5, carbs: 25.0, fat: 17.0, servingSize: "1 bar", category: "Desserts" },
  { name: "Cornetto (Classico)", brand: "Cornetto", calories: 220, protein: 2.8, carbs: 28.0, fat: 11.0, servingSize: "1 cone", category: "Desserts" },
  { name: "Ben & Jerry's (per 100ml)", brand: "Ben & Jerry's", calories: 260, protein: 4.0, carbs: 28.0, fat: 15.0, servingSize: "100ml", category: "Desserts" },
  { name: "Halo Top (per pot)", brand: "Halo Top", calories: 320, protein: 20.0, carbs: 48.0, fat: 8.0, servingSize: "1 pot (473ml)", category: "Desserts" },
  { name: "Sticky Toffee Pudding", calories: 380, protein: 4.0, carbs: 55.0, fat: 16.0, servingSize: "1 portion", category: "Desserts" },
  { name: "Apple Crumble", calories: 320, protein: 3.0, carbs: 48.0, fat: 13.0, servingSize: "1 portion", category: "Desserts" },
  { name: "Apple Crumble with Custard", calories: 460, protein: 6.0, carbs: 62.0, fat: 20.0, servingSize: "1 portion", category: "Desserts" },
  { name: "Custard (ready made, 100ml)", calories: 118, protein: 3.0, carbs: 16.0, fat: 4.5, servingSize: "100ml", category: "Desserts" },
  { name: "Treacle Sponge", calories: 340, protein: 4.0, carbs: 50.0, fat: 14.0, servingSize: "1 portion", category: "Desserts" },
  { name: "Chocolate Cake Slice", calories: 380, protein: 4.5, carbs: 48.0, fat: 19.0, servingSize: "1 slice", category: "Desserts" },
  { name: "Cheesecake Slice", calories: 350, protein: 5.0, carbs: 30.0, fat: 24.0, servingSize: "1 slice", category: "Desserts" },
  { name: "Lemon Drizzle Cake Slice", calories: 330, protein: 4.0, carbs: 42.0, fat: 16.0, servingSize: "1 slice", category: "Desserts" },
  { name: "Doughnut (jam)", calories: 290, protein: 4.0, carbs: 38.0, fat: 14.0, servingSize: "1 doughnut", category: "Desserts" },
  { name: "Doughnut (ring, sugar)", calories: 260, protein: 3.5, carbs: 32.0, fat: 14.0, servingSize: "1 doughnut", category: "Desserts" },
  { name: "Mince Pie", calories: 230, protein: 2.5, carbs: 32.0, fat: 10.0, servingSize: "1 mince pie", category: "Desserts" },
  { name: "Scone (plain, with jam & cream)", calories: 450, protein: 6.0, carbs: 52.0, fat: 24.0, servingSize: "1 scone + toppings", category: "Desserts" },
  { name: "Scone (plain, no toppings)", calories: 220, protein: 4.5, carbs: 32.0, fat: 8.0, servingSize: "1 scone", category: "Desserts" },
  { name: "Tiramisu (1 portion)", calories: 340, protein: 5.0, carbs: 30.0, fat: 22.0, servingSize: "1 portion", category: "Desserts" },
  { name: "Profiteroles (portion)", calories: 330, protein: 6.0, carbs: 26.0, fat: 22.0, servingSize: "1 portion", category: "Desserts" },
  { name: "Rice Pudding (tinned)", calories: 130, protein: 3.0, carbs: 22.0, fat: 3.0, servingSize: "1/2 tin (200g)", category: "Desserts" },
  { name: "Jelly (made, 1 serving)", calories: 62, protein: 1.5, carbs: 14.0, fat: 0.0, servingSize: "1 serving (140g)", category: "Desserts" },

];


// =============================================================================
// SEARCH FUNCTION
// =============================================================================

/**
 * Common misspelling / alias map for fuzzy matching.
 * Keys are normalised (lowercase, trimmed). Values are the corrected term.
 */
const ALIASES: Record<string, string> = {
  // Brand typos
  "macdonalds": "mcdonald",
  "mcdonals": "mcdonald",
  "mc donalds": "mcdonald",
  "maccies": "mcdonald",
  "maccys": "mcdonald",
  "maccas": "mcdonald",
  "maccy d": "mcdonald",
  "maccy ds": "mcdonald",
  "mcds": "mcdonald",
  "bk": "burger king",
  "dominos": "domino",
  "starbuck": "starbucks",
  "nero": "caffe nero",
  "cafe nero": "caffe nero",
  "nandos": "nando",
  "nando": "nando",
  "spoons": "wetherspoons",
  "weatherspoons": "wetherspoons",
  "wetherspoon": "wetherspoons",

  // Food aliases
  "chips": "fries",
  "sarnie": "sandwich",
  "butty": "sandwich",
  "bap": "roll",
  "cob": "roll",
  "brew": "tea",
  "cuppa": "tea",
  "biccy": "biscuit",
  "bicky": "biscuit",
  "nugs": "nuggets",
  "mcnuggets": "chicken mcnuggets",
  "mcnugget": "chicken mcnuggets",
  "nuggets": "mcnuggets",
  "quarter pounder": "quarter pounder",
  "qpc": "quarter pounder",
  "big mac": "big mac",
  "bigmac": "big mac",
  "whooper": "whopper",
  "wooper": "whopper",
  "zinger": "zinger",
  "popchicken": "popcorn chicken",
  "pop chicken": "popcorn chicken",
  "sausage roll": "sausage roll",
  "saus roll": "sausage roll",
  "steak bake": "steak bake",
  "vegan sausage": "vegan sausage roll",
  "choccy": "chocolate",
  "choc": "chocolate",
  "pb": "peanut butter",
  "avo": "avocado",
  "spag bol": "spaghetti bolognese",
  "spag": "spaghetti",
  "bolognese": "bolognese",
  "spagbol": "spaghetti bolognese",
  "jacket spud": "jacket potato",
  "baked spud": "jacket potato",
  "baked potato": "jacket potato",
  "full english": "full english breakfast",
  "fry up": "full english breakfast",
  "fryup": "full english breakfast",
  "bangers": "sausage",
  "porrige": "porridge",
  "poridge": "porridge",
  "yogurt": "yoghurt",
  "yoghert": "yoghurt",
  "protien": "protein",
  "protine": "protein",
  "capuccino": "cappuccino",
  "cappucino": "cappuccino",
  "capucino": "cappuccino",
  "expresso": "espresso",
  "lattee": "latte",
  "latte": "latte",
  "flatwhite": "flat white",
  "flat white": "flat white",
  "mochar": "mocha",
  "hot choc": "hot chocolate",
  "hot choclate": "hot chocolate",
  "hot chocoalte": "hot chocolate",
  "frappucino": "frappuccino",
  "frappe": "frappe",
  "peperoni": "pepperoni",
  "peppperoni": "pepperoni",
  "peporoni": "pepperoni",
  "margarita": "margherita",
  "margerita": "margherita",
  "margarhita": "margherita",
  "lasanga": "lasagne",
  "lasagne": "lasagne",
  "lazagne": "lasagne",
  "shepherds pie": "shepherd's pie",
  "shepards pie": "shepherd's pie",
  "sheperd pie": "shepherd's pie",
  "cottage pie": "cottage pie",
  "fish n chips": "fish and chips",
  "fish & chips": "fish and chips",
  "fishnchips": "fish and chips",
  "sunday dinner": "sunday roast",
  "roast dinner": "sunday roast",
  "pot noodle": "pot noodle",
  "potnoodle": "pot noodle",
  "grenade bar": "grenade protein bar",
  "dairy milk": "cadbury dairy milk",
  "kitkat": "kitkat",
  "kit kat": "kitkat",
  "kit-kat": "kitkat",
  "malteasers": "maltesers",
  "malteasors": "maltesers",
  "wheetabix": "weetabix",
  "weetbix": "weetabix",
  "weetabx": "weetabix",
  "weet-bix": "weetabix",
  "lucazade": "lucozade",
  "ribenna": "ribena",
  "coca cola": "coca-cola",
  "cocacola": "coca-cola",
  "coke": "coca-cola",
  "diet coke": "diet coke",
  "coke zero": "coke zero",
  "pepsi max": "pepsi max",
  "guiness": "guinness",
  "guinesss": "guinness",
  "brocoli": "broccoli",
  "brocolli": "broccoli",
  "corgette": "courgette",
  "courgete": "courgette",
  "aubergene": "aubergine",
  "egg plant": "aubergine",
  "eggplant": "aubergine",
  "zucchini": "courgette",
  "mushrom": "mushroom",
  "mushrrom": "mushroom",
  "sweetpotato": "sweet potato",
  "chiken": "chicken",
  "chickin": "chicken",
  "chickn": "chicken",
  "samlon": "salmon",
  "salmen": "salmon",
  "toder in the hole": "toad in the hole",
};


/**
 * Normalise a string for comparison: lowercase, trim, collapse whitespace.
 */
function normalise(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Apply alias substitutions to a query string.
 */
function applyAliases(query: string): string {
  let q = normalise(query);

  // Check for exact alias matches first (longest first to match multi-word aliases)
  const sortedAliases = Object.keys(ALIASES).sort((a, b) => b.length - a.length);
  for (const alias of sortedAliases) {
    if (q === alias || q.includes(alias)) {
      q = q.replace(alias, ALIASES[alias]);
    }
  }

  return q;
}

/**
 * Simple token-based similarity score.
 * Higher is better. Considers both token matches and substring matches.
 */
function scoreMatch(query: string, item: FoodItem): number {
  const q = applyAliases(query);
  const tokens = q.split(" ").filter(Boolean);

  // Build a single searchable string from the item
  const target = normalise(
    [item.name, item.brand || "", item.category].join(" ")
  );

  // Exact full-query substring match in name gets a big bonus
  const nameNorm = normalise(item.name);
  if (nameNorm === q) return 1000;
  if (nameNorm.startsWith(q)) return 900;
  if (nameNorm.includes(q)) return 800;

  let score = 0;

  // Token matching
  for (const token of tokens) {
    if (token.length < 2) continue; // skip very short tokens

    if (target.includes(token)) {
      // Bonus for matching in the name vs brand/category
      if (nameNorm.includes(token)) {
        score += 100;
        // Extra bonus if the token matches the start of a word in the name
        if (nameNorm.startsWith(token) || nameNorm.includes(` ${token}`)) {
          score += 50;
        }
      } else {
        score += 30;
      }
    }
  }

  // Penalty for items that are much longer than the query (less specific matches)
  if (score > 0) {
    const nameWords = nameNorm.split(" ").length;
    const queryWords = tokens.length;
    if (nameWords > queryWords * 3) {
      score -= 10;
    }
  }

  // All tokens must match for a result to be returned
  const allTokensMatch = tokens.every(
    (token) => token.length < 2 || target.includes(token)
  );
  if (!allTokensMatch) {
    // Partial match: at least half the tokens should match
    const matchCount = tokens.filter(
      (token) => token.length < 2 || target.includes(token)
    ).length;
    if (matchCount < tokens.length * 0.5) {
      return 0;
    }
    // Reduce score for partial matches
    score = Math.floor(score * 0.5);
  }

  return score;
}

/**
 * Search the food database for items matching the query.
 * Returns up to `limit` results sorted by relevance.
 *
 * - Case insensitive
 * - Handles partial matches ("costa" matches all Costa items)
 * - Handles common misspellings via alias map
 * - Sorted by relevance score (best match first)
 */
export function searchFood(query: string, limit: number = 10): FoodItem[] {
  if (!query || query.trim().length === 0) return [];

  const results: { item: FoodItem; score: number }[] = [];

  for (const item of foodDatabase) {
    const score = scoreMatch(query, item);
    if (score > 0) {
      results.push({ item, score });
    }
  }

  // Sort by score descending, then alphabetically by name for ties
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.name.localeCompare(b.item.name);
  });

  return results.slice(0, limit).map((r) => r.item);
}

/**
 * Get all unique categories in the database.
 */
export function getCategories(): string[] {
  const categories = new Set<string>();
  for (const item of foodDatabase) {
    categories.add(item.category);
  }
  return Array.from(categories).sort();
}

/**
 * Get all items in a specific category.
 */
export function getFoodsByCategory(category: string): FoodItem[] {
  return foodDatabase.filter(
    (item) => normalise(item.category) === normalise(category)
  );
}
