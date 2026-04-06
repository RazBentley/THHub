export interface LibraryWorkout {
  id: string;
  name: string;
  location: "gym" | "home" | "both";
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  description: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    restSeconds: number;
    notes?: string;
  }[];
  tips: string[];
}

export const WORKOUT_CATEGORIES = [
  "Push",
  "Pull",
  "Legs",
  "Upper Body",
  "Lower Body",
  "Full Body",
  "Core",
  "HIIT",
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Glutes",
] as const;

export const workoutLibrary: LibraryWorkout[] = [
  // ============ GYM WORKOUTS ============

  // PUSH
  {
    id: "gym-push-beginner",
    name: "Beginner Push Day",
    location: "gym",
    category: "Push",
    difficulty: "beginner",
    duration: "40",
    description: "A solid introduction to push movements targeting chest, shoulders, and triceps.",
    exercises: [
      { name: "Flat Barbell Bench Press", sets: 3, reps: "10-12", restSeconds: 90, notes: "Focus on controlled movement, touch chest lightly" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", restSeconds: 60, notes: "Seated or standing" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", restSeconds: 60, notes: "30-degree incline" },
      { name: "Cable Lateral Raises", sets: 3, reps: "12-15", restSeconds: 45, notes: "Light weight, control the negative" },
      { name: "Tricep Rope Pushdowns", sets: 3, reps: "12-15", restSeconds: 45 },
      { name: "Dumbbell Overhead Tricep Extension", sets: 2, reps: "12-15", restSeconds: 45 },
    ],
    tips: ["Warm up with 5 mins cardio and light sets", "Keep shoulder blades squeezed on bench press", "Don't lock out elbows on tricep movements"],
  },
  {
    id: "gym-push-intermediate",
    name: "Intermediate Push Day",
    location: "gym",
    category: "Push",
    difficulty: "intermediate",
    duration: "55",
    description: "Progressive push workout with heavier compounds and isolation work.",
    exercises: [
      { name: "Flat Barbell Bench Press", sets: 4, reps: "6-8", restSeconds: 120, notes: "Work up to a challenging weight" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", restSeconds: 90 },
      { name: "Seated Dumbbell Shoulder Press", sets: 3, reps: "8-10", restSeconds: 90 },
      { name: "Cable Flyes", sets: 3, reps: "12-15", restSeconds: 60, notes: "Slight bend in elbows, squeeze at the top" },
      { name: "Lateral Raises", sets: 4, reps: "12-15", restSeconds: 45, notes: "Superset last 2 sets with front raises" },
      { name: "Tricep Dips", sets: 3, reps: "8-12", restSeconds: 60, notes: "Add weight if bodyweight is easy" },
      { name: "Overhead Cable Tricep Extension", sets: 3, reps: "12-15", restSeconds: 45 },
    ],
    tips: ["Progressive overload — try to increase weight or reps each week", "Control the eccentric (lowering) phase", "Retract shoulder blades on all pressing movements"],
  },
  {
    id: "gym-push-advanced",
    name: "Advanced Push Day",
    location: "gym",
    category: "Push",
    difficulty: "advanced",
    duration: "65",
    description: "High-volume push session with intensity techniques for experienced lifters.",
    exercises: [
      { name: "Flat Barbell Bench Press", sets: 5, reps: "5-6", restSeconds: 150, notes: "Heavy working sets after warm-ups" },
      { name: "Incline Barbell Press", sets: 4, reps: "6-8", restSeconds: 120 },
      { name: "Dumbbell Shoulder Press", sets: 4, reps: "8-10", restSeconds: 90 },
      { name: "Weighted Dips", sets: 3, reps: "8-10", restSeconds: 90 },
      { name: "Pec Deck / Machine Flyes", sets: 3, reps: "12-15", restSeconds: 60, notes: "Drop set on final set" },
      { name: "Cable Lateral Raises", sets: 4, reps: "15-20", restSeconds: 30, notes: "Light weight, constant tension" },
      { name: "Close Grip Bench Press", sets: 3, reps: "8-10", restSeconds: 60 },
      { name: "Skull Crushers", sets: 3, reps: "10-12", restSeconds: 45, notes: "Superset with diamond push-ups to failure" },
    ],
    tips: ["Ensure adequate warm-up before heavy bench", "Use a spotter for heavy sets", "Rest-pause on final sets for extra intensity"],
  },

  // PULL
  {
    id: "gym-pull-beginner",
    name: "Beginner Pull Day",
    location: "gym",
    category: "Pull",
    difficulty: "beginner",
    duration: "40",
    description: "Build a strong back and biceps foundation with these pulling movements.",
    exercises: [
      { name: "Lat Pulldown", sets: 3, reps: "10-12", restSeconds: 60, notes: "Wide grip, pull to upper chest" },
      { name: "Seated Cable Row", sets: 3, reps: "10-12", restSeconds: 60, notes: "Squeeze shoulder blades together" },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12", restSeconds: 60, notes: "Each arm, brace on bench" },
      { name: "Face Pulls", sets: 3, reps: "15-20", restSeconds: 45, notes: "Great for rear delts and shoulder health" },
      { name: "EZ Bar Bicep Curls", sets: 3, reps: "10-12", restSeconds: 45 },
      { name: "Hammer Curls", sets: 2, reps: "12-15", restSeconds: 45 },
    ],
    tips: ["Think about pulling with your elbows, not your hands", "Keep core tight during rows", "Don't use momentum on curls"],
  },
  {
    id: "gym-pull-intermediate",
    name: "Intermediate Pull Day",
    location: "gym",
    category: "Pull",
    difficulty: "intermediate",
    duration: "55",
    description: "Build width and thickness in your back with compound and isolation pulls.",
    exercises: [
      { name: "Barbell Rows", sets: 4, reps: "6-8", restSeconds: 120, notes: "Overhand grip, 45-degree torso angle" },
      { name: "Pull-Ups", sets: 3, reps: "6-10", restSeconds: 90, notes: "Add weight if needed, or use assisted machine" },
      { name: "Seated Cable Row (Close Grip)", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Single Arm Dumbbell Row", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Face Pulls", sets: 3, reps: "15-20", restSeconds: 45 },
      { name: "Barbell Curls", sets: 3, reps: "8-10", restSeconds: 60 },
      { name: "Incline Dumbbell Curls", sets: 3, reps: "10-12", restSeconds: 45, notes: "Stretch at the bottom" },
    ],
    tips: ["Initiate all back movements by retracting your shoulder blades", "Full range of motion on pull-ups", "Vary your grip width across sessions"],
  },

  // LEGS
  {
    id: "gym-legs-beginner",
    name: "Beginner Leg Day",
    location: "gym",
    category: "Legs",
    difficulty: "beginner",
    duration: "40",
    description: "Build a strong lower body foundation with fundamental leg exercises.",
    exercises: [
      { name: "Goblet Squats", sets: 3, reps: "10-12", restSeconds: 60, notes: "Hold dumbbell at chest, squat to parallel" },
      { name: "Leg Press", sets: 3, reps: "10-12", restSeconds: 90, notes: "Feet shoulder width, don't lock knees" },
      { name: "Romanian Deadlifts (Dumbbells)", sets: 3, reps: "10-12", restSeconds: 60, notes: "Feel the stretch in hamstrings" },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg", restSeconds: 60 },
      { name: "Leg Curls", sets: 3, reps: "12-15", restSeconds: 45 },
      { name: "Calf Raises", sets: 3, reps: "15-20", restSeconds: 30, notes: "Full range, pause at the top" },
    ],
    tips: ["Warm up with 5 minutes cycling or walking", "Keep your knees tracking over your toes", "Don't rush — control every rep"],
  },
  {
    id: "gym-legs-intermediate",
    name: "Intermediate Leg Day",
    location: "gym",
    category: "Legs",
    difficulty: "intermediate",
    duration: "60",
    description: "Comprehensive leg workout hitting quads, hamstrings, glutes, and calves.",
    exercises: [
      { name: "Barbell Back Squats", sets: 4, reps: "6-8", restSeconds: 150, notes: "Below parallel if mobility allows" },
      { name: "Romanian Deadlifts (Barbell)", sets: 3, reps: "8-10", restSeconds: 90 },
      { name: "Leg Press", sets: 3, reps: "10-12", restSeconds: 90, notes: "High and wide foot position for glutes" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "10 each leg", restSeconds: 60, notes: "Hold dumbbells" },
      { name: "Leg Curls", sets: 3, reps: "10-12", restSeconds: 45 },
      { name: "Leg Extensions", sets: 3, reps: "12-15", restSeconds: 45, notes: "Squeeze quads at the top" },
      { name: "Standing Calf Raises", sets: 4, reps: "12-15", restSeconds: 30 },
    ],
    tips: ["Brace your core throughout squats", "Drive through your heels on squats and leg press", "Stretch hamstrings and quads after the session"],
  },

  // UPPER BODY
  {
    id: "gym-upper-beginner",
    name: "Beginner Upper Body",
    location: "gym",
    category: "Upper Body",
    difficulty: "beginner",
    duration: "45",
    description: "Balanced upper body workout hitting all major muscle groups.",
    exercises: [
      { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Lat Pulldown", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Seated Cable Row", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Lateral Raises", sets: 3, reps: "12-15", restSeconds: 45 },
      { name: "Bicep Curls", sets: 2, reps: "12-15", restSeconds: 45 },
      { name: "Tricep Pushdowns", sets: 2, reps: "12-15", restSeconds: 45 },
    ],
    tips: ["Alternate between pushing and pulling exercises for balance", "Start light and focus on form", "This is a great 3x per week workout"],
  },

  // FULL BODY
  {
    id: "gym-fullbody-beginner",
    name: "Beginner Full Body",
    location: "gym",
    category: "Full Body",
    difficulty: "beginner",
    duration: "45",
    description: "Perfect for beginners training 2-3 times per week. Covers everything in one session.",
    exercises: [
      { name: "Goblet Squats", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Lat Pulldown", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Plank", sets: 3, reps: "30-45 seconds", restSeconds: 30 },
    ],
    tips: ["Great for 2-3x per week training", "Focus on compound movements", "Increase weight gradually each week"],
  },

  // CORE
  {
    id: "gym-core-all",
    name: "Core Blaster",
    location: "both",
    category: "Core",
    difficulty: "intermediate",
    duration: "20",
    description: "Intense core workout you can do at the gym or at home.",
    exercises: [
      { name: "Cable Crunches / Crunches", sets: 3, reps: "15-20", restSeconds: 30 },
      { name: "Hanging Leg Raises / Lying Leg Raises", sets: 3, reps: "10-15", restSeconds: 30, notes: "Bend knees if too hard" },
      { name: "Russian Twists", sets: 3, reps: "20 total", restSeconds: 30, notes: "Hold weight or bodyweight" },
      { name: "Plank", sets: 3, reps: "45-60 seconds", restSeconds: 30 },
      { name: "Bicycle Crunches", sets: 3, reps: "20 total", restSeconds: 30 },
      { name: "Dead Bugs", sets: 3, reps: "10 each side", restSeconds: 30, notes: "Keep lower back pressed into floor" },
    ],
    tips: ["Brace your core — don't just crunch", "Quality reps over speed", "Can be added to the end of any workout"],
  },

  // CHEST
  {
    id: "gym-chest-intermediate",
    name: "Chest Focus Day",
    location: "gym",
    category: "Chest",
    difficulty: "intermediate",
    duration: "45",
    description: "Dedicated chest session targeting upper, mid, and lower pecs.",
    exercises: [
      { name: "Incline Barbell Bench Press", sets: 4, reps: "6-8", restSeconds: 120, notes: "30-degree incline for upper chest" },
      { name: "Flat Dumbbell Press", sets: 3, reps: "8-10", restSeconds: 90 },
      { name: "Cable Flyes (Mid)", sets: 3, reps: "12-15", restSeconds: 60, notes: "Cables at shoulder height" },
      { name: "Decline Dumbbell Press", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Pec Deck Machine", sets: 3, reps: "12-15", restSeconds: 45, notes: "Squeeze and hold for 1 sec" },
      { name: "Push-Ups", sets: 2, reps: "To failure", restSeconds: 60, notes: "Burnout finisher" },
    ],
    tips: ["Pre-exhaust with flyes if chest isn't activating well", "Retract and depress shoulder blades on all pressing", "Stretch chest between sets"],
  },

  // BACK
  {
    id: "gym-back-intermediate",
    name: "Back Focus Day",
    location: "gym",
    category: "Back",
    difficulty: "intermediate",
    duration: "50",
    description: "Build a wide, thick back with rows and pulldowns.",
    exercises: [
      { name: "Deadlifts", sets: 3, reps: "5-6", restSeconds: 180, notes: "Heavy compound — warm up thoroughly" },
      { name: "Wide Grip Lat Pulldown", sets: 3, reps: "8-10", restSeconds: 60, notes: "Full stretch at top" },
      { name: "T-Bar Rows", sets: 3, reps: "8-10", restSeconds: 90 },
      { name: "Single Arm Cable Row", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15", restSeconds: 45 },
      { name: "Face Pulls", sets: 3, reps: "15-20", restSeconds: 45 },
    ],
    tips: ["Deadlifts first while fresh", "Pull with elbows, not hands", "Vary grip between overhand, underhand, and neutral across weeks"],
  },

  // SHOULDERS
  {
    id: "gym-shoulders-intermediate",
    name: "Shoulder Builder",
    location: "gym",
    category: "Shoulders",
    difficulty: "intermediate",
    duration: "40",
    description: "Rounded shoulders from all angles — front, side, and rear delts.",
    exercises: [
      { name: "Seated Dumbbell Shoulder Press", sets: 4, reps: "8-10", restSeconds: 90 },
      { name: "Lateral Raises", sets: 4, reps: "12-15", restSeconds: 45, notes: "Control the negative" },
      { name: "Face Pulls", sets: 3, reps: "15-20", restSeconds: 45, notes: "External rotation at the top" },
      { name: "Cable Lateral Raises", sets: 3, reps: "12-15", restSeconds: 45, notes: "Behind the body for constant tension" },
      { name: "Reverse Pec Deck", sets: 3, reps: "12-15", restSeconds: 45 },
      { name: "Dumbbell Front Raises", sets: 2, reps: "12-15", restSeconds: 45, notes: "Alternating arms" },
    ],
    tips: ["Lateral raises are king for wider shoulders", "Don't go too heavy — use controlled form", "Rear delts are often neglected, prioritise face pulls"],
  },

  // ARMS
  {
    id: "gym-arms-intermediate",
    name: "Arm Day",
    location: "gym",
    category: "Arms",
    difficulty: "intermediate",
    duration: "40",
    description: "Dedicated bicep and tricep session for sleeve-busting arms.",
    exercises: [
      { name: "EZ Bar Curls", sets: 3, reps: "8-10", restSeconds: 60 },
      { name: "Close Grip Bench Press", sets: 3, reps: "8-10", restSeconds: 60 },
      { name: "Incline Dumbbell Curls", sets: 3, reps: "10-12", restSeconds: 45, notes: "Full stretch at bottom" },
      { name: "Overhead Cable Tricep Extension", sets: 3, reps: "10-12", restSeconds: 45 },
      { name: "Hammer Curls", sets: 3, reps: "10-12", restSeconds: 45, notes: "Builds brachialis for arm width" },
      { name: "Tricep Dips (Machine or Bench)", sets: 3, reps: "10-15", restSeconds: 45 },
      { name: "Cable Curls (Drop Set)", sets: 2, reps: "10 then drop", restSeconds: 60, notes: "Drop the weight 3 times, no rest" },
    ],
    tips: ["Superset biceps and triceps for efficiency", "Full range of motion on every rep", "Don't swing — if you need momentum, the weight is too heavy"],
  },

  // GLUTES
  {
    id: "gym-glutes-intermediate",
    name: "Glute Focus",
    location: "gym",
    category: "Glutes",
    difficulty: "intermediate",
    duration: "45",
    description: "Targeted glute session for building strength and shape.",
    exercises: [
      { name: "Hip Thrusts (Barbell)", sets: 4, reps: "8-10", restSeconds: 90, notes: "Squeeze glutes hard at the top, pause 1 sec" },
      { name: "Sumo Deadlifts", sets: 3, reps: "8-10", restSeconds: 90 },
      { name: "Bulgarian Split Squats", sets: 3, reps: "10 each leg", restSeconds: 60, notes: "Lean slightly forward for more glute" },
      { name: "Cable Kickbacks", sets: 3, reps: "12-15 each", restSeconds: 45 },
      { name: "Abductor Machine", sets: 3, reps: "15-20", restSeconds: 45, notes: "Lean forward for upper glute" },
      { name: "Glute Bridge (Banded)", sets: 3, reps: "15-20", restSeconds: 30, notes: "Band above knees, push knees out" },
    ],
    tips: ["Mind-muscle connection is everything for glutes", "Warm up with banded walks", "Squeeze and hold at peak contraction"],
  },

  // ============ HOME WORKOUTS ============

  // HOME FULL BODY
  {
    id: "home-fullbody-beginner",
    name: "Beginner Home Full Body",
    location: "home",
    category: "Full Body",
    difficulty: "beginner",
    duration: "30",
    description: "No equipment needed. Perfect for getting started at home.",
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: "15-20", restSeconds: 45 },
      { name: "Push-Ups (or Knee Push-Ups)", sets: 3, reps: "8-12", restSeconds: 45, notes: "Knees on floor if needed" },
      { name: "Reverse Lunges", sets: 3, reps: "10 each leg", restSeconds: 45 },
      { name: "Plank", sets: 3, reps: "30-45 seconds", restSeconds: 30 },
      { name: "Glute Bridges", sets: 3, reps: "15-20", restSeconds: 30, notes: "Squeeze at the top" },
      { name: "Superman Holds", sets: 3, reps: "10-12", restSeconds: 30, notes: "Hold for 2 seconds at the top" },
    ],
    tips: ["No equipment needed", "Focus on form over speed", "Do this 3-4 times per week for best results"],
  },
  {
    id: "home-fullbody-intermediate",
    name: "Intermediate Home Full Body",
    location: "home",
    category: "Full Body",
    difficulty: "intermediate",
    duration: "40",
    description: "Challenging bodyweight workout for all fitness levels. Dumbbells optional.",
    exercises: [
      { name: "Jump Squats", sets: 3, reps: "12-15", restSeconds: 45, notes: "Land softly, controlled descent" },
      { name: "Push-Up Variations (Wide/Diamond)", sets: 3, reps: "10-15", restSeconds: 45, notes: "Alternate wide and diamond each set" },
      { name: "Walking Lunges", sets: 3, reps: "12 each leg", restSeconds: 45 },
      { name: "Pike Push-Ups", sets: 3, reps: "8-10", restSeconds: 45, notes: "Targets shoulders — hips high" },
      { name: "Single Leg Glute Bridge", sets: 3, reps: "12 each", restSeconds: 30 },
      { name: "Burpees", sets: 3, reps: "10", restSeconds: 60 },
      { name: "Mountain Climbers", sets: 3, reps: "20 total", restSeconds: 30 },
      { name: "Plank to Push-Up", sets: 3, reps: "8-10", restSeconds: 30 },
    ],
    tips: ["Minimal rest for a cardio effect", "Modify exercises down if needed", "Add a backpack with books for extra resistance"],
  },

  // HOME UPPER BODY
  {
    id: "home-upper-beginner",
    name: "Home Upper Body",
    location: "home",
    category: "Upper Body",
    difficulty: "beginner",
    duration: "25",
    description: "Upper body workout with no equipment — just your bodyweight.",
    exercises: [
      { name: "Push-Ups", sets: 3, reps: "10-15", restSeconds: 45 },
      { name: "Diamond Push-Ups", sets: 3, reps: "8-10", restSeconds: 45, notes: "Hands close together for triceps" },
      { name: "Pike Push-Ups", sets: 3, reps: "8-10", restSeconds: 45, notes: "Hips high, targets shoulders" },
      { name: "Plank Shoulder Taps", sets: 3, reps: "10 each side", restSeconds: 30 },
      { name: "Tricep Dips (Chair/Sofa)", sets: 3, reps: "10-15", restSeconds: 45, notes: "Hands on edge of chair behind you" },
      { name: "Arm Circles", sets: 2, reps: "30 seconds each direction", restSeconds: 15, notes: "Burnout finisher" },
    ],
    tips: ["Slow and controlled reps for maximum tension", "Incline push-ups (hands on sofa) if regular are too hard", "Add a filled backpack for extra challenge"],
  },

  // HOME LOWER BODY
  {
    id: "home-lower-beginner",
    name: "Home Lower Body",
    location: "home",
    category: "Lower Body",
    difficulty: "beginner",
    duration: "25",
    description: "Build strong legs at home with zero equipment.",
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: "15-20", restSeconds: 45 },
      { name: "Reverse Lunges", sets: 3, reps: "12 each leg", restSeconds: 45 },
      { name: "Glute Bridges", sets: 3, reps: "15-20", restSeconds: 30, notes: "Squeeze and hold at the top" },
      { name: "Step-Ups (Use a chair/step)", sets: 3, reps: "10 each leg", restSeconds: 45 },
      { name: "Wall Sit", sets: 3, reps: "30-45 seconds", restSeconds: 30 },
      { name: "Calf Raises (On a step)", sets: 3, reps: "20-25", restSeconds: 20, notes: "Full range, slow negative" },
    ],
    tips: ["Use a sturdy chair or step for step-ups", "Squeeze your glutes on every rep", "Add tempo (3 seconds down, 1 second up) for extra difficulty"],
  },

  // HOME HIIT
  {
    id: "home-hiit-beginner",
    name: "Beginner HIIT",
    location: "home",
    category: "HIIT",
    difficulty: "beginner",
    duration: "20",
    description: "Quick, effective fat-burning workout. 30 seconds work, 30 seconds rest.",
    exercises: [
      { name: "Star Jumps", sets: 3, reps: "30 seconds", restSeconds: 30 },
      { name: "High Knees", sets: 3, reps: "30 seconds", restSeconds: 30 },
      { name: "Bodyweight Squats (Fast)", sets: 3, reps: "30 seconds", restSeconds: 30 },
      { name: "Mountain Climbers", sets: 3, reps: "30 seconds", restSeconds: 30 },
      { name: "Burpees (Modified)", sets: 3, reps: "30 seconds", restSeconds: 30, notes: "Step back instead of jump if needed" },
      { name: "Plank Jacks", sets: 3, reps: "30 seconds", restSeconds: 30 },
    ],
    tips: ["Work as hard as you can during the 30 seconds", "Rest fully during rest periods", "3 rounds through = approx 18 minutes"],
  },
  {
    id: "home-hiit-intermediate",
    name: "Intermediate HIIT Blitz",
    location: "home",
    category: "HIIT",
    difficulty: "intermediate",
    duration: "25",
    description: "Intense HIIT circuit. 40 seconds work, 20 seconds rest. Repeat 3 rounds.",
    exercises: [
      { name: "Burpees", sets: 3, reps: "40 seconds", restSeconds: 20 },
      { name: "Jump Squats", sets: 3, reps: "40 seconds", restSeconds: 20 },
      { name: "Push-Ups", sets: 3, reps: "40 seconds", restSeconds: 20 },
      { name: "Tuck Jumps", sets: 3, reps: "40 seconds", restSeconds: 20, notes: "High knees alternative if too intense" },
      { name: "Plank Up-Downs", sets: 3, reps: "40 seconds", restSeconds: 20 },
      { name: "Sprint on Spot", sets: 3, reps: "40 seconds", restSeconds: 20 },
      { name: "Jump Lunges", sets: 3, reps: "40 seconds", restSeconds: 20, notes: "Alternating legs" },
    ],
    tips: ["Push hard during work periods", "Rest 1-2 minutes between rounds", "Scale exercises down if needed — consistency beats intensity"],
  },

  // HOME CORE
  {
    id: "home-core-all",
    name: "Home Core Workout",
    location: "home",
    category: "Core",
    difficulty: "beginner",
    duration: "15",
    description: "Quick core session you can do anywhere, no equipment needed.",
    exercises: [
      { name: "Crunches", sets: 3, reps: "15-20", restSeconds: 20 },
      { name: "Leg Raises", sets: 3, reps: "10-15", restSeconds: 20, notes: "Keep lower back pressed into floor" },
      { name: "Russian Twists", sets: 3, reps: "20 total", restSeconds: 20 },
      { name: "Plank", sets: 3, reps: "30-60 seconds", restSeconds: 20 },
      { name: "Bicycle Crunches", sets: 3, reps: "20 total", restSeconds: 20 },
      { name: "Flutter Kicks", sets: 3, reps: "20 total", restSeconds: 20, notes: "Keep legs 6 inches off the ground" },
      { name: "Dead Bugs", sets: 3, reps: "10 each side", restSeconds: 20 },
    ],
    tips: ["Breathe out on the effort", "Don't pull on your neck during crunches", "Can be added to any workout as a finisher"],
  },

  // HOME GLUTES
  {
    id: "home-glutes-intermediate",
    name: "Home Glute Burner",
    location: "home",
    category: "Glutes",
    difficulty: "intermediate",
    duration: "25",
    description: "Targeted glute workout using just bodyweight. Resistance band optional.",
    exercises: [
      { name: "Glute Bridges", sets: 3, reps: "20", restSeconds: 30, notes: "Squeeze and hold 2 secs at top" },
      { name: "Single Leg Glute Bridge", sets: 3, reps: "12 each", restSeconds: 30 },
      { name: "Donkey Kicks", sets: 3, reps: "15 each leg", restSeconds: 20 },
      { name: "Fire Hydrants", sets: 3, reps: "15 each leg", restSeconds: 20 },
      { name: "Sumo Squats", sets: 3, reps: "15-20", restSeconds: 30, notes: "Wide stance, toes pointed out" },
      { name: "Curtsy Lunges", sets: 3, reps: "12 each leg", restSeconds: 30 },
      { name: "Banded Walks (Side Steps)", sets: 3, reps: "15 each direction", restSeconds: 20, notes: "Use resistance band if available" },
    ],
    tips: ["Band above knees adds serious resistance", "Focus on squeezing the glutes, not just moving", "Great as a warm-up before leg day too"],
  },
];

export function searchWorkouts(
  query: string,
  location?: "gym" | "home" | "both",
  difficulty?: string
): LibraryWorkout[] {
  const q = query.toLowerCase();
  return workoutLibrary.filter((w) => {
    const matchesLocation =
      !location || location === "both" || w.location === location || w.location === "both";
    const matchesDifficulty =
      !difficulty || w.difficulty === difficulty;
    const matchesQuery =
      !q ||
      w.name.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q) ||
      w.exercises.some((e) => e.name.toLowerCase().includes(q));
    return matchesLocation && matchesDifficulty && matchesQuery;
  });
}
