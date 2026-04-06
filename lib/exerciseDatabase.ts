export interface ExerciseInfo {
  howTo: string;
  muscles: string[];
}

export const exerciseDatabase: Record<string, ExerciseInfo> = {
  // ── A ──
  "90/90 hip switches": {
    howTo: "Sit on the floor with both legs bent at 90 degrees. Rotate your legs from one side to the other, keeping your torso upright and feet in contact with the floor. Move slowly through the full range to open up the hips.",
    muscles: ["Hip Flexors", "Glutes"],
  },
  "ab wheel rollouts": {
    howTo: "Kneel on the floor gripping an ab wheel with both hands. Roll the wheel forward while keeping your core braced and back flat, extending as far as you can control. Pull back to the starting position by contracting your abs.",
    muscles: ["Core"],
  },
  "abductor machine": {
    howTo: "Sit in the hip abduction machine with your outer thighs against the pads. Push your legs apart against the resistance, squeezing your glutes at the end range. Return slowly to the start position.",
    muscles: ["Glutes"],
  },
  "animal flow beast to crab transition": {
    howTo: "Start in a beast position (hands and feet on the floor, knees hovering). Rotate your body, lifting one hand and pivoting on your feet to transition into a crab position (belly up). Rotate back and repeat on each side.",
    muscles: ["Core", "Shoulders", "Glutes", "Full Body"],
  },
  "ape reach (deep squat walk)": {
    howTo: "Drop into a deep squat and place your hands on the ground in front of you. Walk forward by reaching your hands out and stepping your feet up to meet them. Stay low throughout the movement to maintain hip and ankle mobility.",
    muscles: ["Quads", "Glutes", "Hip Flexors", "Core"],
  },
  "archer push-ups": {
    howTo: "Start in a wide push-up position. As you lower, shift your weight to one arm while extending the other arm straight out to the side. Push back up and repeat, alternating sides.",
    muscles: ["Chest", "Triceps", "Shoulders", "Core"],
  },
  "arm circles": {
    howTo: "Stand with arms extended straight out to the sides at shoulder height. Make small controlled circles, gradually increasing the size. Reverse direction after the prescribed time.",
    muscles: ["Shoulders"],
  },
  "assault bike intervals": {
    howTo: "Sit on the assault bike and grip the handles. Alternate between all-out sprints pushing and pulling with your arms while pedaling hard, and easy recovery periods. Maintain an upright posture throughout.",
    muscles: ["Full Body", "Quads", "Core"],
  },
  "assault bike sprints": {
    howTo: "Sit on the assault bike and pedal as hard as possible while simultaneously pushing and pulling the handles. Drive with your legs and arms for maximum power output. Maintain a strong core throughout the sprint.",
    muscles: ["Full Body", "Quads", "Core"],
  },
  // ── B ──
  "band bicep curls": {
    howTo: "Stand on a resistance band with feet shoulder-width apart, holding the handles or ends at your sides. Curl your hands toward your shoulders, keeping elbows pinned to your sides. Lower slowly under control.",
    muscles: ["Biceps"],
  },
  "band hammer curls": {
    howTo: "Stand on a resistance band and hold the ends with a neutral (thumbs-up) grip. Curl your hands toward your shoulders while keeping your elbows stationary. Lower with control.",
    muscles: ["Biceps", "Forearms"],
  },
  "band pull-aparts": {
    howTo: "Hold a resistance band at chest height with arms extended straight ahead. Pull the band apart by squeezing your shoulder blades together until your arms are out to the sides. Return slowly to the start.",
    muscles: ["Back (Upper)", "Rear Delts"],
  },
  "band shoulder press": {
    howTo: "Stand on a resistance band and hold the handles at shoulder height with palms facing forward. Press the band overhead until your arms are fully extended. Lower back to shoulder height with control.",
    muscles: ["Shoulders", "Triceps"],
  },
  "banded hip abduction (seated)": {
    howTo: "Sit on the edge of a bench with a resistance band above your knees. Push your knees apart against the band, squeezing your glutes at the end range. Lean forward slightly to better target the upper glutes.",
    muscles: ["Glutes"],
  },
  "banded shoulder dislocations": {
    howTo: "Hold a resistance band with a wide overhand grip in front of your body. Keeping your arms straight, pass the band overhead and behind your back in a smooth arc. Reverse the movement to return to the start.",
    muscles: ["Shoulders", "Back (Upper)"],
  },
  "banded side steps": {
    howTo: "Place a mini band around your ankles and stand in a quarter squat. Step sideways maintaining tension on the band, keeping your feet parallel and hips low. Take controlled steps in one direction, then reverse.",
    muscles: ["Glutes", "Hip Flexors"],
  },
  "banded walks (side steps)": {
    howTo: "Place a resistance band above your knees or around your ankles. Assume a quarter-squat position and step laterally, maintaining tension on the band throughout. Keep your toes forward and hips low.",
    muscles: ["Glutes", "Hip Flexors"],
  },
  "barbell back squats": {
    howTo: "Position a barbell across your upper traps, unrack it, and stand with feet shoulder-width apart. Bend your knees and hips to lower until your thighs are at least parallel to the floor. Drive through your feet to stand back up, keeping your chest tall and core braced.",
    muscles: ["Quads", "Glutes", "Hamstrings", "Core"],
  },
  "barbell bench press": {
    howTo: "Lie on a flat bench with eyes under the bar, grip slightly wider than shoulder width. Unrack the bar, lower it to your mid-chest with control, then press it back up to lockout. Keep shoulder blades retracted and feet flat on the floor.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "barbell curls": {
    howTo: "Stand holding a barbell with an underhand grip at arm's length. Curl the bar toward your shoulders by bending at the elbows, keeping your upper arms stationary. Lower the bar back down with control.",
    muscles: ["Biceps"],
  },
  "barbell curls (cheat curls)": {
    howTo: "Stand holding a barbell with an underhand grip and use a slight swing of the hips to help curl a heavier weight up. Focus on a slow, controlled negative as you lower the bar back down. Only use momentum on the last few reps.",
    muscles: ["Biceps"],
  },
  "barbell deadlifts": {
    howTo: "Stand with feet hip-width apart, shins close to the bar. Hinge at the hips and grip the bar just outside your knees. Drive through your feet, extending your hips and knees simultaneously to stand up tall with the bar.",
    muscles: ["Back (Lats)", "Back (Upper)", "Glutes", "Hamstrings", "Core"],
  },
  "barbell hip thrusts": {
    howTo: "Sit on the floor with your upper back against a bench and a padded barbell over your hips. Drive through your heels to raise your hips until your body forms a straight line from shoulders to knees. Squeeze your glutes hard at the top and lower with control.",
    muscles: ["Glutes", "Hamstrings"],
  },
  "barbell romanian deadlifts": {
    howTo: "Stand holding a barbell at hip height with an overhand grip. Hinge at the hips and push them back, lowering the bar along your legs while keeping a slight bend in your knees. Return to standing by driving your hips forward and squeezing your glutes.",
    muscles: ["Hamstrings", "Glutes", "Back (Lats)"],
  },
  "barbell rows": {
    howTo: "Hinge forward at the hips to roughly a 45-degree angle, holding a barbell with an overhand grip. Pull the bar to your lower chest by driving your elbows back and squeezing your shoulder blades together. Lower the bar with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps", "Rear Delts"],
  },
  "barbell rows (overhand)": {
    howTo: "Hinge forward at the hips holding a barbell with a pronated (overhand) grip. Pull the bar toward your lower chest, driving your elbows back and squeezing your shoulder blades. Lower under control and repeat.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps", "Rear Delts"],
  },
  "barbell rows (pendlay)": {
    howTo: "Set up with the barbell on the floor, hinge at the hips with a flat back, and grip the bar overhand. Pull the bar explosively to your lower chest, then return it to a complete dead stop on the floor each rep. This eliminates momentum and builds raw pulling strength.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps", "Rear Delts"],
  },
  "barbell thrusters": {
    howTo: "Hold a barbell in the front rack position at shoulder height. Squat down to parallel then explosively stand up, using that momentum to press the bar overhead in one fluid motion. Lower the bar back to your shoulders and descend into the next rep.",
    muscles: ["Quads", "Glutes", "Shoulders", "Triceps", "Core"],
  },
  "barbell upright rows (wide grip)": {
    howTo: "Stand holding a barbell with a wide overhand grip in front of your thighs. Pull the bar up to mid-chest height by leading with your elbows out to the sides. Lower with control, keeping the bar close to your body.",
    muscles: ["Shoulders", "Side Delts", "Back (Upper)"],
  },
  "barbell walking lunges": {
    howTo: "Place a barbell across your upper back and step forward into a deep lunge, lowering your back knee toward the floor. Drive through the front heel to stand and step the back foot forward into the next lunge. Keep your torso upright throughout.",
    muscles: ["Quads", "Glutes", "Hamstrings", "Core"],
  },
  "battle rope alternating waves": {
    howTo: "Stand in a half-squat holding the ends of a battle rope. Alternate raising and lowering each arm rapidly to create waves in the rope. Keep your core tight and generate the movement from your shoulders.",
    muscles: ["Shoulders", "Core", "Full Body"],
  },
  "battle rope slams": {
    howTo: "Stand with feet shoulder-width apart, holding a battle rope end in each hand. Raise both arms overhead, then forcefully slam the ropes down to the ground. Use your hips and core to generate power on each slam.",
    muscles: ["Shoulders", "Core", "Back (Lats)", "Full Body"],
  },
  "bayesian cable curls": {
    howTo: "Stand facing away from a low cable with one arm behind your body gripping the handle. Curl the handle forward and up toward your shoulder, keeping your elbow behind your torso. This position stretches the bicep at the bottom for a deeper contraction.",
    muscles: ["Biceps"],
  },
  "bear crawl": {
    howTo: "Start on all fours with your knees hovering two inches off the ground. Move forward by stepping opposite hand and foot at the same time, keeping your back flat and hips low. Move slowly and with control.",
    muscles: ["Core", "Shoulders", "Quads", "Full Body"],
  },
  "bench dips": {
    howTo: "Place your hands on the edge of a bench behind you with fingers forward and legs extended. Lower your body by bending your elbows to roughly 90 degrees. Press back up by extending your arms fully.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "bicep curls": {
    howTo: "Stand holding dumbbells at your sides with palms facing forward. Curl the weights toward your shoulders by bending at the elbows, keeping your upper arms stationary. Lower slowly back to the start.",
    muscles: ["Biceps"],
  },
  "bicep curls (water bottles or band)": {
    howTo: "Stand holding heavy water bottles or resistance band handles at your sides. Curl up toward your shoulders while keeping your elbows pinned to your sides. Lower with control and repeat.",
    muscles: ["Biceps"],
  },
  "bicep curls / tricep pushdowns superset": {
    howTo: "Perform a set of bicep curls immediately followed by a set of tricep pushdowns with no rest between them. Use moderate weight on each exercise and focus on controlled reps. Rest only after both exercises are complete.",
    muscles: ["Biceps", "Triceps"],
  },
  "bicycle crunches": {
    howTo: "Lie on your back with hands behind your head and legs raised. Bring one knee toward your chest while rotating your opposite elbow to meet it, then switch sides in a pedaling motion. Keep your lower back pressed into the floor.",
    muscles: ["Core"],
  },
  "bodyweight get-ups": {
    howTo: "Lie flat on the floor and stand up using whatever pattern feels natural, without using the same sequence each time. Try to use minimal hand assistance as you progress. This builds functional strength and coordination.",
    muscles: ["Full Body", "Core"],
  },
  "bodyweight hip thrusts": {
    howTo: "Sit on the floor with your upper back resting against a bench and feet flat on the ground. Drive through your heels to raise your hips until your body forms a straight line from shoulders to knees. Squeeze your glutes hard at the top.",
    muscles: ["Glutes", "Hamstrings"],
  },
  "bodyweight hip thrusts (bench)": {
    howTo: "Sit on the floor with your upper back against a bench and feet flat on the ground. Push through your heels to lift your hips until your torso is parallel to the floor. Squeeze your glutes at the top and lower with control.",
    muscles: ["Glutes", "Hamstrings"],
  },
  "bodyweight squats": {
    howTo: "Stand with feet shoulder-width apart and arms in front of you for balance. Bend your knees and hips to lower your body as if sitting into a chair, going as deep as your mobility allows. Stand back up by driving through your heels.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "bodyweight squats (fast)": {
    howTo: "Perform standard bodyweight squats at an elevated tempo for cardiovascular effect. Maintain good form with your chest up and knees tracking over your toes despite the faster speed. Go to at least parallel on each rep.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "bodyweight sumo squats": {
    howTo: "Stand with a wide stance and toes pointed outward at 45 degrees. Lower your hips straight down by bending your knees, keeping your torso upright. Drive through your heels and squeeze your glutes to return to standing.",
    muscles: ["Quads", "Glutes", "Hip Flexors"],
  },
  "box jumps": {
    howTo: "Stand facing a sturdy box or platform. Swing your arms and jump onto the box, landing softly with both feet fully on the surface. Stand up tall at the top, then step back down to reset.",
    muscles: ["Quads", "Glutes", "Calves", "Full Body"],
  },
  "broad jumps": {
    howTo: "Stand with feet hip-width apart and swing your arms back. Explosively jump as far forward as possible, using your arms for momentum. Land softly with bent knees and absorb the impact.",
    muscles: ["Quads", "Glutes", "Calves", "Full Body"],
  },
  "bulgarian split squats": {
    howTo: "Stand a couple of feet in front of a bench and place one foot on the bench behind you. Lower your body by bending the front knee until your thigh is parallel to the floor. Drive through the front heel to stand back up.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "bulgarian split squats (foot on chair)": {
    howTo: "Stand in front of a chair and place the top of your rear foot on the seat behind you. Lower your body by bending your front knee to about 90 degrees. Push through the front heel to return to standing.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "burpee broad jumps": {
    howTo: "Perform a standard burpee, but instead of jumping straight up, explode forward into a broad jump. Land softly and immediately drop into the next burpee. This combines full-body conditioning with horizontal power.",
    muscles: ["Full Body", "Quads", "Chest", "Core"],
  },
  "burpee to pull-up": {
    howTo: "Perform a standard burpee under a pull-up bar. On the jump phase, grab the bar and complete one full pull-up. Drop back down and go directly into the next burpee.",
    muscles: ["Full Body", "Back (Lats)", "Chest", "Core"],
  },
  "burpees": {
    howTo: "From standing, drop into a squat and place your hands on the floor. Jump your feet back into a plank, perform a push-up, then jump your feet forward and explode upward into a jump. Land softly and repeat.",
    muscles: ["Full Body", "Chest", "Quads", "Core"],
  },
  "burpees (modified)": {
    howTo: "From standing, squat down and place your hands on the floor. Step your feet back one at a time into a plank position, then step them forward again. Stand up and reach your arms overhead instead of jumping.",
    muscles: ["Full Body", "Chest", "Quads", "Core"],
  },
  // ── C ──
  "cable crossovers (high to low)": {
    howTo: "Set the cables to the highest position and stand in the center with a handle in each hand. Step forward slightly and bring your hands together in a downward arc, crossing in front of your lower chest. Return slowly with control.",
    muscles: ["Chest", "Front Delts"],
  },
  "cable crunches / crunches": {
    howTo: "Kneel in front of a cable machine with a rope attachment, holding it behind your head. Crunch your torso down by flexing your abs, bringing your elbows toward your knees. At home, lie on your back and perform standard crunches.",
    muscles: ["Core"],
  },
  "cable curls (drop set)": {
    howTo: "Stand at a cable machine with a straight bar and curl to failure. Immediately reduce the weight and curl to failure again, repeating for multiple drops. Keep your elbows pinned to your sides throughout.",
    muscles: ["Biceps"],
  },
  "cable curls (straight bar)": {
    howTo: "Stand facing a low cable pulley with a straight bar attachment. Curl the bar toward your shoulders, keeping your elbows pinned at your sides. Lower with control under constant cable tension.",
    muscles: ["Biceps"],
  },
  "cable face pulls": {
    howTo: "Set a cable to face height with a rope attachment. Pull the rope toward your face by driving your elbows back and rotating your hands outward at the end. Squeeze your rear delts and upper back at the peak contraction.",
    muscles: ["Rear Delts", "Back (Upper)"],
  },
  "cable flyes": {
    howTo: "Stand in the center of a cable crossover station with handles set at shoulder height. With a slight bend in your elbows, bring your hands together in front of your chest in a hugging motion. Return slowly, feeling the stretch in your chest.",
    muscles: ["Chest"],
  },
  "cable flyes (mid)": {
    howTo: "Set the cables at shoulder height and stand in the center. With arms slightly bent, bring your hands together in front of your chest, squeezing your pecs at the midpoint. Return to the start with control.",
    muscles: ["Chest"],
  },
  "cable front raises": {
    howTo: "Stand facing away from a low cable with a handle in one hand. Raise your arm straight in front of you to eye level, keeping a slight bend in the elbow. Lower with control and repeat on each side.",
    muscles: ["Front Delts"],
  },
  "cable kickbacks": {
    howTo: "Attach an ankle strap to a low cable and face the machine. Kick your leg straight back behind you, squeezing your glute at the top. Return slowly and keep your core tight to avoid arching your lower back.",
    muscles: ["Glutes"],
  },
  "cable lat pulldown (neutral grip)": {
    howTo: "Sit at a lat pulldown machine using a neutral (palms facing each other) grip handle. Pull the handle to your upper chest by driving your elbows down and back. Return the handle with control, feeling the stretch in your lats.",
    muscles: ["Back (Lats)", "Biceps"],
  },
  "cable lateral raises": {
    howTo: "Stand sideways to a low cable and hold the handle in the far hand. Raise your arm out to the side to shoulder height, leading with your elbow. Lower slowly under the constant cable tension.",
    muscles: ["Side Delts"],
  },
  "cable lateral raises (drop set)": {
    howTo: "Perform cable lateral raises to failure, then immediately reduce the weight and continue for more reps. Repeat the drop two or three times without rest. Maintain strict form with a slight lean away from the cable.",
    muscles: ["Side Delts"],
  },
  "cable pull-throughs": {
    howTo: "Stand facing away from a low cable with the rope attachment held between your legs. Hinge at the hips and let the cable pull your hands back between your legs. Drive your hips forward to stand tall, squeezing your glutes at the top.",
    muscles: ["Glutes", "Hamstrings"],
  },
  "cable rear delt flyes": {
    howTo: "Set the cables at face height with no handles. Cross the cables and grab the opposite cable in each hand. Pull your hands apart by squeezing your rear delts, keeping your arms nearly straight.",
    muscles: ["Rear Delts", "Back (Upper)"],
  },
  "calf raises": {
    howTo: "Stand on the edge of a step or flat on the floor with feet hip-width apart. Rise up onto your toes as high as possible, squeezing your calves at the top. Lower slowly past the edge of the step for a full stretch.",
    muscles: ["Calves"],
  },
  "calf raises (on a step)": {
    howTo: "Stand on the edge of a step with your heels hanging off. Rise up onto your toes, squeezing your calves at the peak. Lower your heels below the step for a deep stretch, then repeat.",
    muscles: ["Calves"],
  },
  "cat-cow (on all fours)": {
    howTo: "Start on your hands and knees with a flat back. Arch your spine upward (cat) by tucking your chin and pelvis, then drop your belly and lift your head (cow). Alternate smoothly between positions with your breath.",
    muscles: ["Core", "Back (Upper)"],
  },
  "cat-cow stretch": {
    howTo: "Start on hands and knees. Inhale as you arch your back and lift your head (cow position), then exhale as you round your spine and tuck your chin (cat position). Flow between the two positions with each breath.",
    muscles: ["Core", "Back (Upper)"],
  },
  "chair dips (legs straight)": {
    howTo: "Place your hands on the edge of a sturdy chair behind you with legs fully extended. Lower your body by bending your elbows to about 90 degrees. Press back up by straightening your arms.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "chair tricep dips": {
    howTo: "Sit on the edge of a chair, place your hands on the seat beside your hips, and slide off with legs bent. Lower your body by bending your elbows to 90 degrees. Push back up to straighten your arms.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "chair tricep dips (legs extended)": {
    howTo: "Place your hands on a chair edge behind you with your legs straight out in front. Lower your body by bending at the elbows to roughly 90 degrees. Press yourself back up by extending your arms fully.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "chest doorway stretch": {
    howTo: "Stand in a doorway and place your forearm against the frame at shoulder height. Lean gently through the doorway until you feel a stretch across your chest and front shoulder. Hold the position and breathe deeply.",
    muscles: ["Chest", "Front Delts"],
  },
  "chest stretch (clasped hands behind back)": {
    howTo: "Stand tall and clasp your hands behind your lower back. Lift your arms up and away from your body while squeezing your shoulder blades together. Hold the stretch and breathe deeply.",
    muscles: ["Chest", "Front Delts"],
  },
  "chest supported dumbbell row": {
    howTo: "Lie face down on an incline bench set to about 30-45 degrees, holding a dumbbell in each hand. Row both dumbbells up by driving your elbows back and squeezing your shoulder blades. Lower with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps", "Rear Delts"],
  },
  "chest supported row machine": {
    howTo: "Sit in a chest-supported row machine with your chest pressed firmly against the pad. Grip the handles and pull them toward your torso by squeezing your shoulder blades together. Return with control, avoiding any momentum.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "chest supported t-bar row": {
    howTo: "Lie face down on the chest pad of a T-bar row machine and grip the handles. Pull the weight up toward your chest by driving your elbows back and squeezing your mid-back. Lower the weight slowly.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "child's pose": {
    howTo: "Kneel on the floor with your knees wide and big toes touching. Sit your hips back toward your heels and reach your arms forward on the ground. Relax into the stretch and breathe deeply.",
    muscles: ["Back (Lats)", "Shoulders", "Hip Flexors"],
  },
  "child's pose with side reach": {
    howTo: "From a standard child's pose, walk both hands to one side until you feel a stretch along the opposite side of your torso and lat. Hold for the prescribed time, then walk your hands to the other side.",
    muscles: ["Back (Lats)", "Core"],
  },
  "close grip bench press": {
    howTo: "Lie on a flat bench and grip the barbell with hands about shoulder-width apart. Lower the bar to your lower chest, keeping your elbows tucked close to your body. Press the bar back up to lockout.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "close grip push-ups": {
    howTo: "Set up in a push-up position with your hands shoulder-width apart or slightly narrower. Lower your body while keeping your elbows close to your sides. Push back up, focusing on squeezing your triceps.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "concentration curls": {
    howTo: "Sit on a bench with your legs spread and brace the back of one arm against your inner thigh. Curl the dumbbell up toward your shoulder, squeezing your bicep at the top. Lower slowly and repeat.",
    muscles: ["Biceps"],
  },
  "corpse pose (savasana)": {
    howTo: "Lie flat on your back with arms at your sides, palms facing up, and legs slightly apart. Close your eyes and relax every muscle in your body. Focus on slow, deep breathing for the prescribed time.",
    muscles: ["Full Body"],
  },
  "crab walk": {
    howTo: "Sit on the floor, place your hands behind you and lift your hips off the ground. Walk backward (or forward) by moving opposite hand and foot together, keeping your hips elevated throughout.",
    muscles: ["Triceps", "Shoulders", "Core", "Glutes"],
  },
  "cross body hammer curls": {
    howTo: "Stand holding a dumbbell in each hand at your sides with a neutral grip. Curl one dumbbell across your body toward the opposite shoulder. Lower and alternate arms each rep.",
    muscles: ["Biceps", "Forearms"],
  },
  "cross-body mountain climbers": {
    howTo: "Start in a push-up position. Drive one knee toward the opposite elbow, twisting slightly through your core. Alternate sides rapidly while keeping your hips level.",
    muscles: ["Core", "Hip Flexors", "Shoulders"],
  },
  "cross-body shoulder stretch": {
    howTo: "Stand or sit tall and bring one arm straight across your chest. Use the opposite hand to gently pull the arm closer to your body until you feel a stretch in your rear shoulder. Hold and breathe.",
    muscles: ["Rear Delts", "Shoulders"],
  },
  "crunches": {
    howTo: "Lie on your back with knees bent and feet flat on the floor, hands behind your head. Curl your shoulders off the floor by contracting your abs, keeping your lower back on the ground. Lower back down with control.",
    muscles: ["Core"],
  },
  "curtsy lunges": {
    howTo: "Stand with feet hip-width apart. Step one foot behind and across your body as if performing a curtsy, bending both knees. Drive through the front heel to return to standing and alternate sides.",
    muscles: ["Glutes", "Quads"],
  },
  // ── D ──
  "dead bugs": {
    howTo: "Lie on your back with arms extended toward the ceiling and knees bent at 90 degrees. Slowly lower one arm overhead while extending the opposite leg, keeping your lower back pressed into the floor. Return to start and alternate sides.",
    muscles: ["Core"],
  },
  "deadlifts": {
    howTo: "Stand with feet hip-width apart and shins near the bar. Hinge at the hips, grip the bar, and drive through your feet to stand up tall, locking out your hips at the top. Lower the bar back to the floor with a flat back.",
    muscles: ["Back (Lats)", "Back (Upper)", "Glutes", "Hamstrings", "Core"],
  },
  "decline dumbbell press": {
    howTo: "Lie on a decline bench holding dumbbells at chest level. Press the weights up toward the ceiling until your arms are extended. Lower the dumbbells back to chest level with control.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "decline push-ups (feet on chair)": {
    howTo: "Place your feet on a chair or elevated surface and your hands on the floor in a push-up position. Lower your chest toward the floor by bending your elbows. Press back up, focusing on your upper chest and shoulders.",
    muscles: ["Chest", "Triceps", "Front Delts", "Shoulders"],
  },
  "deep squat hold": {
    howTo: "Lower into a deep squat with your feet flat on the floor, heels down. Push your knees out with your elbows and keep your chest up. Hold this position, breathing deeply and sinking a little lower with each exhale.",
    muscles: ["Quads", "Glutes", "Hip Flexors"],
  },
  "deep squat to stand": {
    howTo: "Drop into a deep squat and grab your toes. Straighten your legs while holding your toes, feeling the hamstring stretch. Bend your knees to squat back down and then stand up tall.",
    muscles: ["Hamstrings", "Quads", "Hip Flexors"],
  },
  "deficit push-ups": {
    howTo: "Place your hands on dumbbells or elevated surfaces to increase the range of motion. Lower your chest as deep as possible between the surfaces. Press back up to the starting position.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "diamond push-ups": {
    howTo: "Set up in a push-up position with your hands close together, forming a diamond shape with your thumbs and index fingers. Lower your chest to your hands while keeping your elbows close to your body. Press back up, squeezing your triceps.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "donkey kicks": {
    howTo: "Start on all fours with your hands under your shoulders and knees under your hips. Keeping your knee bent at 90 degrees, press one foot toward the ceiling by squeezing your glute. Lower and repeat on each side.",
    muscles: ["Glutes"],
  },
  "downward dog": {
    howTo: "Start on all fours, tuck your toes, and lift your hips high to form an inverted V shape. Press your heels toward the floor and push your chest toward your thighs. Hold the position while breathing deeply.",
    muscles: ["Hamstrings", "Calves", "Shoulders", "Back (Lats)"],
  },
  "dumbbell bench press": {
    howTo: "Lie on a flat bench holding a dumbbell in each hand at chest level. Press the weights straight up until your arms are fully extended. Lower the dumbbells back to chest level with control.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "dumbbell bicep curls": {
    howTo: "Stand holding dumbbells at your sides with palms facing forward. Curl the weights up to your shoulders while keeping your elbows pinned at your sides. Lower slowly with full control.",
    muscles: ["Biceps"],
  },
  "dumbbell farmers carry": {
    howTo: "Hold a heavy dumbbell in each hand at your sides with a firm grip. Walk forward with tall posture, keeping your shoulders back and core braced. Maintain a steady pace for the prescribed distance.",
    muscles: ["Core", "Forearms", "Back (Upper)", "Shoulders"],
  },
  "dumbbell floor press": {
    howTo: "Lie on the floor holding dumbbells above your chest with arms extended. Lower the weights until your upper arms rest on the ground briefly. Press back up to lockout.",
    muscles: ["Chest", "Triceps"],
  },
  "dumbbell front raises": {
    howTo: "Stand holding dumbbells at your sides with palms facing your thighs. Raise one or both arms straight in front of you to shoulder height. Lower with control and repeat.",
    muscles: ["Front Delts"],
  },
  "dumbbell goblet squats": {
    howTo: "Hold a dumbbell vertically at chest level with both hands cupping the top end. Squat down by pushing your hips back and bending your knees until your thighs are at least parallel. Drive through your heels to stand.",
    muscles: ["Quads", "Glutes", "Core"],
  },
  "dumbbell lateral raises": {
    howTo: "Stand with dumbbells at your sides, palms facing inward. Raise both arms out to the sides until they reach shoulder height, leading slightly with your pinkies. Lower slowly with control.",
    muscles: ["Side Delts"],
  },
  "dumbbell lunges": {
    howTo: "Hold a dumbbell in each hand at your sides and step forward into a lunge, lowering your back knee toward the floor. Push through the front heel to return to standing. Alternate legs each rep.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "dumbbell overhead tricep extension": {
    howTo: "Hold a single dumbbell with both hands overhead, arms extended. Lower the weight behind your head by bending at the elbows, keeping your upper arms stationary. Extend your arms back to the top.",
    muscles: ["Triceps"],
  },
  "dumbbell pullover": {
    howTo: "Lie across a bench with your upper back supported, holding a dumbbell overhead with both hands. Lower the weight behind your head in an arc, feeling the stretch in your lats and chest. Pull the weight back over your chest.",
    muscles: ["Back (Lats)", "Chest"],
  },
  "dumbbell reverse lunges": {
    howTo: "Hold dumbbells at your sides and step one foot backward, lowering your back knee toward the floor. Push through your front heel to return to standing. Alternate legs each rep.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "dumbbell rows": {
    howTo: "Place one hand and knee on a bench for support, holding a dumbbell in the other hand. Row the dumbbell to your hip by driving your elbow back and squeezing your shoulder blade. Lower with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "dumbbell rows (bench supported)": {
    howTo: "Place one hand and knee on a flat bench for support while holding a dumbbell in the other hand. Pull the dumbbell to your hip, squeezing your shoulder blade at the top. Lower slowly and repeat on each side.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "dumbbell shoulder press": {
    howTo: "Sit or stand holding dumbbells at shoulder height with palms facing forward. Press the weights overhead until your arms are fully extended. Lower back to shoulder height with control.",
    muscles: ["Shoulders", "Triceps", "Front Delts"],
  },
  "dumbbell shrugs": {
    howTo: "Stand holding heavy dumbbells at your sides with arms straight. Shrug your shoulders straight up toward your ears, squeezing and holding at the top for a second. Lower slowly back down.",
    muscles: ["Back (Upper)"],
  },
  "dumbbell step-ups": {
    howTo: "Hold a dumbbell in each hand and stand facing a bench or step. Step up onto the bench with one foot, driving through the heel to stand up on top. Step back down and alternate legs.",
    muscles: ["Quads", "Glutes"],
  },
  // ── E ──
  "ez bar bicep curls": {
    howTo: "Stand holding an EZ curl bar with an underhand grip on the angled handles. Curl the bar toward your shoulders, keeping your elbows pinned to your sides. Lower the bar slowly with control.",
    muscles: ["Biceps"],
  },
  "ez bar curls": {
    howTo: "Stand holding an EZ curl bar with an underhand grip. Curl the bar toward your shoulders while keeping your upper arms stationary. Lower with a controlled tempo.",
    muscles: ["Biceps"],
  },
  "elliptical (forward)": {
    howTo: "Step onto the elliptical machine and grip the moving handles. Stride forward with an upright posture, pushing and pulling the handles in sync with your legs. Maintain a moderate, steady pace.",
    muscles: ["Quads", "Glutes", "Full Body"],
  },
  // ── F ──
  "face pulls": {
    howTo: "Set a cable to face height with a rope attachment. Pull the rope toward your face by driving your elbows back and outward, externally rotating your hands at the end. Squeeze your rear delts and upper back.",
    muscles: ["Rear Delts", "Back (Upper)"],
  },
  "figure-4 glute stretch (lying)": {
    howTo: "Lie on your back and cross one ankle over the opposite knee. Pull the uncrossed leg's thigh toward your chest until you feel a deep stretch in the crossed leg's glute. Hold and breathe.",
    muscles: ["Glutes", "Hip Flexors"],
  },
  "fire hydrants": {
    howTo: "Start on all fours with hands under shoulders and knees under hips. Keeping your knee bent at 90 degrees, lift one leg out to the side as high as you can. Lower and repeat, then switch sides.",
    muscles: ["Glutes", "Hip Flexors"],
  },
  "flat barbell bench press": {
    howTo: "Lie on a flat bench, grip the bar slightly wider than shoulder-width, and unrack it. Lower the bar to your mid-chest with control, then press it back up to lockout. Keep your shoulder blades retracted and feet planted.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "flat barbell bench press (paused)": {
    howTo: "Perform a standard flat bench press but pause the bar on your chest for 2 seconds before pressing. Keep tension throughout the pause without relaxing your muscles. This eliminates bounce and builds strength off the chest.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "flat dumbbell bench press": {
    howTo: "Lie on a flat bench holding dumbbells at chest level with palms forward. Press the weights up until your arms are extended, then lower them back to chest level. Keep your shoulder blades squeezed together throughout.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "flat dumbbell press": {
    howTo: "Lie on a flat bench with a dumbbell in each hand at chest height. Press the dumbbells straight up until your arms are fully extended. Lower them back with control, keeping your elbows at about 45 degrees.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "flutter kicks": {
    howTo: "Lie on your back with your hands under your hips and legs extended. Lift both legs a few inches off the floor and alternate kicking them up and down in small, rapid movements. Keep your lower back pressed into the floor.",
    muscles: ["Core", "Hip Flexors"],
  },
  "forward fold": {
    howTo: "Stand with feet hip-width apart and hinge forward at the hips, letting gravity pull your upper body down. Let your arms hang toward the floor and relax your head and neck. Bend your knees slightly if your hamstrings are tight.",
    muscles: ["Hamstrings", "Back (Lats)"],
  },
  "frog pumps (banded)": {
    howTo: "Lie on your back with a band above your knees, soles of your feet together, and knees falling outward. Drive your hips up rapidly by squeezing your glutes, keeping your feet together. Pump quickly for high reps.",
    muscles: ["Glutes"],
  },
  "front raises (water bottles)": {
    howTo: "Stand holding filled water bottles with your arms at your sides. Raise one arm straight in front of you to shoulder or eye level. Lower with control and alternate arms.",
    muscles: ["Front Delts"],
  },
  "front squats": {
    howTo: "Hold a barbell in the front rack position across the front of your shoulders. Squat down by pushing your hips back and bending your knees, keeping your torso as upright as possible. Drive through your feet to stand back up.",
    muscles: ["Quads", "Core", "Glutes"],
  },
  // ── G ──
  "glute bridge (banded)": {
    howTo: "Lie on your back with a resistance band above your knees, feet flat on the floor. Drive your hips up by pressing through your heels and pushing your knees outward against the band. Squeeze your glutes at the top and lower slowly.",
    muscles: ["Glutes", "Hamstrings"],
  },
  "glute bridges": {
    howTo: "Lie on your back with your knees bent and feet flat on the floor. Drive through your heels to lift your hips toward the ceiling, squeezing your glutes at the top. Lower back down with control.",
    muscles: ["Glutes", "Hamstrings"],
  },
  "glute kickback machine": {
    howTo: "Position yourself in the glute kickback machine with one foot on the platform. Press your foot back and up by extending your hip, squeezing your glute at full extension. Return slowly and repeat on each side.",
    muscles: ["Glutes"],
  },
  "goblet squats": {
    howTo: "Hold a dumbbell or kettlebell at chest height with both hands. Squat down by pushing your hips back and bending your knees, keeping your elbows inside your knees at the bottom. Stand by driving through your heels.",
    muscles: ["Quads", "Glutes", "Core"],
  },
  "goblet sumo squats": {
    howTo: "Hold a dumbbell at your chest with a wide stance and toes pointed out at 45 degrees. Squat down by bending your knees outward and lowering your hips. Drive through your heels to stand, squeezing your glutes at the top.",
    muscles: ["Quads", "Glutes", "Hip Flexors"],
  },
  // ── H ──
  "hack squat machine": {
    howTo: "Position yourself in the hack squat machine with your back flat against the pad and feet shoulder-width on the platform. Lower yourself by bending your knees to a deep range of motion. Press through your feet to return to the start.",
    muscles: ["Quads", "Glutes"],
  },
  "hammer curls": {
    howTo: "Stand holding dumbbells at your sides with a neutral (palms facing in) grip. Curl the weights toward your shoulders without rotating your wrists. Lower slowly with control.",
    muscles: ["Biceps", "Forearms"],
  },
  "hamstring stretch (seated)": {
    howTo: "Sit on the floor with one leg extended straight and the other bent inward. Hinge forward at the hips reaching toward the toes of the straight leg, keeping your back flat. Hold the stretch and breathe.",
    muscles: ["Hamstrings"],
  },
  "hanging leg raises": {
    howTo: "Hang from a pull-up bar with arms fully extended. Raise your legs in front of you by flexing your hips and abs, going as high as you can control. Lower slowly without swinging.",
    muscles: ["Core", "Hip Flexors"],
  },
  "hanging leg raises / lying leg raises": {
    howTo: "At the gym, hang from a bar and raise your legs by contracting your abs. At home, lie on your back and raise your legs toward the ceiling while keeping your lower back flat on the floor. Lower slowly with control.",
    muscles: ["Core", "Hip Flexors"],
  },
  "high knee sprints": {
    howTo: "Run in place driving your knees as high as possible toward your chest with each stride. Pump your arms vigorously in sync with your legs. Maintain maximum speed throughout the prescribed interval.",
    muscles: ["Core", "Hip Flexors", "Quads", "Calves"],
  },
  "high knees": {
    howTo: "Stand in place and drive your knees up toward hip height in an alternating running motion. Pump your arms naturally and stay on the balls of your feet. Maintain a quick, consistent pace.",
    muscles: ["Core", "Hip Flexors", "Quads", "Calves"],
  },
  "hip flexor stretch (half kneeling)": {
    howTo: "Kneel on one knee with the other foot flat in front of you. Push your hips gently forward until you feel a stretch in the front of the kneeling leg's hip. Keep your torso upright and hold.",
    muscles: ["Hip Flexors"],
  },
  "hip thrusts (barbell)": {
    howTo: "Sit on the floor with your upper back against a bench, a padded barbell across your hips. Drive through your heels to thrust your hips up until your body is in a straight line from shoulders to knees. Squeeze your glutes at the top and lower with control.",
    muscles: ["Glutes", "Hamstrings"],
  },
  // ── I ──
  "inchworms": {
    howTo: "Stand with feet hip-width apart and hinge at the hips to touch the floor. Walk your hands out to a plank position, then walk your feet back toward your hands. Stand up and repeat.",
    muscles: ["Core", "Shoulders", "Hamstrings"],
  },
  "incline barbell bench press": {
    howTo: "Lie on an incline bench set to about 30 degrees and grip the bar slightly wider than shoulder-width. Lower the bar to your upper chest, then press it back up to lockout. Keep your shoulder blades retracted throughout.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "incline barbell press": {
    howTo: "Set a bench to 30 degrees and lie back with feet flat on the floor. Unrack the barbell and lower it to your upper chest with control. Press the bar back up to full extension.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "incline dumbbell curls": {
    howTo: "Sit on an incline bench set to about 45 degrees holding dumbbells at your sides. Let your arms hang straight down, then curl the weights toward your shoulders. This stretched position emphasizes the long head of the bicep.",
    muscles: ["Biceps"],
  },
  "incline dumbbell flyes": {
    howTo: "Lie on an incline bench holding dumbbells above your chest with arms slightly bent. Lower the weights out to the sides in a wide arc until you feel a stretch in your chest. Bring the dumbbells back together by squeezing your pecs.",
    muscles: ["Chest"],
  },
  "incline dumbbell press": {
    howTo: "Lie on an incline bench set to about 30 degrees holding dumbbells at shoulder level. Press the dumbbells up and together until your arms are extended. Lower with control, feeling the stretch in your upper chest.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "incline push-ups (hands on sofa)": {
    howTo: "Place your hands on a sofa or elevated surface and assume a push-up position with your body in a straight line. Lower your chest toward the surface by bending your elbows. Push back up to the start.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "inverted rows (under a table)": {
    howTo: "Lie under a sturdy table and grip the edge with both hands. Pull your chest up to the table edge by squeezing your shoulder blades together. Lower back down with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  // ── J ──
  "jump lunges": {
    howTo: "Start in a lunge position and explosively jump into the air, switching your legs mid-flight. Land softly in a lunge with the opposite leg forward. Alternate continuously with each jump.",
    muscles: ["Quads", "Glutes", "Calves"],
  },
  "jump rope (or pretend jump rope)": {
    howTo: "Hold a jump rope (or mimic the motion without one) and bounce lightly on the balls of your feet. Turn the rope with your wrists, not your arms, and keep your jumps low and quick. Maintain a steady rhythm.",
    muscles: ["Calves", "Shoulders", "Core", "Full Body"],
  },
  "jump rope (or pretend rope)": {
    howTo: "Hold a jump rope or pantomime the motion. Bounce lightly on the balls of your feet, keeping jumps small. Turn the rope using your wrists and maintain a consistent rhythm.",
    muscles: ["Calves", "Shoulders", "Core", "Full Body"],
  },
  "jump squats": {
    howTo: "Stand with feet shoulder-width apart and squat down to parallel. Explosively jump as high as you can, extending your hips and knees fully. Land softly with bent knees and descend into the next rep.",
    muscles: ["Quads", "Glutes", "Calves"],
  },
  "jump to soft landing (single leg)": {
    howTo: "Jump from both feet and land on one foot, holding your balance for a few seconds. Focus on a quiet, soft landing with a slight knee bend to absorb impact. Alternate the landing leg each rep.",
    muscles: ["Quads", "Glutes", "Calves", "Core"],
  },
  "jumping jacks": {
    howTo: "Stand with feet together and arms at your sides. Jump your feet apart while raising your arms overhead, then jump back to the start. Maintain a quick, rhythmic pace.",
    muscles: ["Full Body", "Calves", "Shoulders"],
  },
  // ── K ──
  "kayak rows (cable)": {
    howTo: "Sit at a cable machine with a rope attachment and alternate pulling each end of the rope toward your hip in a kayaking motion. Allow a slight torso rotation with each pull to engage your obliques. Keep your core tight.",
    muscles: ["Back (Lats)", "Core", "Biceps"],
  },
  "kettlebell deadlifts": {
    howTo: "Stand over a kettlebell with feet hip-width apart. Hinge at your hips, grip the handle, and drive through your feet to stand tall. Reverse the movement to lower the kettlebell back to the floor.",
    muscles: ["Glutes", "Hamstrings", "Back (Lats)", "Core"],
  },
  "kettlebell goblet squats": {
    howTo: "Hold a kettlebell by the horns at chest height. Squat down with your chest up and elbows inside your knees at the bottom. Drive through your heels to stand.",
    muscles: ["Quads", "Glutes", "Core"],
  },
  "kettlebell swings": {
    howTo: "Stand with feet wider than shoulder-width, holding a kettlebell with both hands. Hike the bell between your legs, then snap your hips forward to swing it to chest height. Let it swing back and repeat with powerful hip drives.",
    muscles: ["Glutes", "Hamstrings", "Core", "Shoulders"],
  },
  "knee push-ups": {
    howTo: "Start in a push-up position with your knees on the floor and body in a straight line from head to knees. Lower your chest toward the floor by bending your elbows. Push back up to the start.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  // ── L ──
  "lat pulldown": {
    howTo: "Sit at the lat pulldown machine with thighs secured under the pads. Grip the bar wider than shoulder-width and pull it to your upper chest by driving your elbows down. Return the bar overhead with control.",
    muscles: ["Back (Lats)", "Biceps"],
  },
  "lat pulldown (wide grip)": {
    howTo: "Sit at a lat pulldown machine and take a wide overhand grip on the bar. Pull the bar to your upper chest by driving your elbows down and back, leaning back slightly. Return with control, feeling the stretch in your lats.",
    muscles: ["Back (Lats)", "Biceps"],
  },
  "lateral bear crawl": {
    howTo: "Start in a bear crawl position with hands and feet on the floor and knees hovering. Move sideways by stepping your hand and foot to one side, then following with the other. Keep your back flat and hips low throughout.",
    muscles: ["Core", "Shoulders", "Quads", "Full Body"],
  },
  "lateral lunges": {
    howTo: "Stand with feet together and take a wide step to one side. Bend the stepping leg and push your hips back while keeping the other leg straight. Push off the bent leg to return to center and alternate sides.",
    muscles: ["Quads", "Glutes", "Hip Flexors"],
  },
  "lateral raises": {
    howTo: "Stand with dumbbells at your sides, palms facing inward. Raise both arms straight out to the sides until they reach shoulder height. Lower with control, resisting the weight on the way down.",
    muscles: ["Side Delts"],
  },
  "lateral raises (water bottles)": {
    howTo: "Stand holding filled water bottles at your sides. Raise them out to the sides to shoulder height, leading with your elbows. Lower slowly with control.",
    muscles: ["Side Delts"],
  },
  "lateral shuffles": {
    howTo: "Get into a low athletic stance with knees bent and hips back. Shuffle quickly to one side by pushing off with the trailing foot, then reverse direction. Stay low and keep your feet wide.",
    muscles: ["Quads", "Glutes", "Calves"],
  },
  "leg curls": {
    howTo: "Lie face down on a leg curl machine with the pad behind your ankles. Curl your heels toward your glutes by contracting your hamstrings. Lower the weight slowly with control.",
    muscles: ["Hamstrings"],
  },
  "leg extensions": {
    howTo: "Sit in a leg extension machine with the pad against your shins. Extend your legs until they are straight, squeezing your quads at the top. Lower with control.",
    muscles: ["Quads"],
  },
  "leg press": {
    howTo: "Sit in the leg press machine with feet shoulder-width apart on the platform. Lower the platform by bending your knees toward your chest, then press it back up without locking your knees. Keep your back flat against the seat.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "leg raises": {
    howTo: "Lie on your back with legs straight and hands under your hips for support. Raise both legs toward the ceiling while keeping them straight, then lower them slowly without touching the floor. Keep your lower back pressed into the ground.",
    muscles: ["Core", "Hip Flexors"],
  },
  "low lunge (runner's lunge)": {
    howTo: "Step one foot forward into a lunge and lower your back knee to the ground. Sink your hips forward to feel a deep stretch in the hip flexor of the back leg. Keep your torso upright and hold.",
    muscles: ["Hip Flexors", "Quads"],
  },
  "low-to-high cable flyes": {
    howTo: "Set the cables to the lowest position and grip a handle in each hand. Bring your hands up and together in a sweeping arc to chest height, squeezing your upper chest. Lower slowly back to the start.",
    muscles: ["Chest", "Front Delts"],
  },
  "lu raises": {
    howTo: "Hold light dumbbells and perform a lateral raise halfway up, then continue the motion into a front raise to full arm extension overhead. It combines two movements into one fluid motion. Use very light weight.",
    muscles: ["Side Delts", "Front Delts"],
  },
  "lying knee-to-chest hug": {
    howTo: "Lie on your back and pull one knee toward your chest with both hands. Hold gently and feel the stretch in your lower back and glute. Keep the other leg flat or slightly bent on the floor.",
    muscles: ["Glutes", "Back (Lats)"],
  },
  "lying leg curls": {
    howTo: "Lie face down on a leg curl machine with the pad positioned behind your ankles. Curl your heels toward your glutes by contracting your hamstrings. Lower the weight slowly under control.",
    muscles: ["Hamstrings"],
  },
  "lying side leg raises": {
    howTo: "Lie on your side with legs stacked straight. Raise the top leg as high as you can while keeping it straight, then lower with control. Keep your hips stacked and avoid rolling backward.",
    muscles: ["Glutes", "Hip Flexors"],
  },
  // ── M ──
  "machine assisted pull-ups": {
    howTo: "Kneel or stand on the assisted pull-up machine platform and grip the bar overhead. Pull yourself up until your chin is over the bar, then lower yourself with control. Adjust the assistance weight so you can complete the prescribed reps.",
    muscles: ["Back (Lats)", "Biceps"],
  },
  "machine chest press": {
    howTo: "Sit in the chest press machine with handles at chest height. Press the handles forward until your arms are extended, squeezing your chest. Return slowly with control.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "machine shoulder press": {
    howTo: "Sit in the shoulder press machine with handles at ear height. Press the handles overhead until your arms are extended. Lower with control back to the starting position.",
    muscles: ["Shoulders", "Triceps"],
  },
  "marching in place": {
    howTo: "Stand tall and march by lifting your knees to hip height while swinging your opposite arms. Maintain an upright posture and a brisk pace. This is a great warm-up to elevate your heart rate.",
    muscles: ["Core", "Hip Flexors", "Quads"],
  },
  "meadows rows": {
    howTo: "Set up a barbell in a landmine attachment and stand perpendicular to it in a staggered stance. Grip the end of the barbell with one hand and row it toward your hip. Lower with control and repeat on each side.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "medicine ball rotational throws": {
    howTo: "Stand sideways to a wall holding a medicine ball at hip level. Rotate your torso and hips explosively to throw the ball against the wall. Catch it on the rebound and immediately rotate for the next throw.",
    muscles: ["Core", "Shoulders"],
  },
  "medicine ball slams": {
    howTo: "Hold a medicine ball overhead with arms fully extended. Slam it down to the floor with full force, engaging your core and lats. Pick it up and repeat with maximum power each rep.",
    muscles: ["Core", "Shoulders", "Back (Lats)", "Full Body"],
  },
  "mountain climbers": {
    howTo: "Start in a high plank position with hands under your shoulders. Rapidly drive one knee toward your chest, then switch legs in a running motion. Keep your hips level and core engaged throughout.",
    muscles: ["Core", "Hip Flexors", "Shoulders"],
  },
  // ── N ──
  "neck rolls": {
    howTo: "Stand or sit with good posture and slowly roll your head in a circle, bringing your ear toward one shoulder, chin to chest, then the other ear to the other shoulder. Move slowly and controlled through the full range. Reverse direction.",
    muscles: ["Core"],
  },
  "nordic hamstring curls": {
    howTo: "Kneel on the floor with someone holding your ankles or using a secure anchor. Slowly lower your body forward by straightening your knees, resisting gravity with your hamstrings. Push yourself back up from the floor if needed.",
    muscles: ["Hamstrings"],
  },
  // ── O ──
  "overhead cable tricep extension": {
    howTo: "Face away from a high cable with a rope attachment held overhead. Extend your arms forward and up by straightening your elbows, keeping your upper arms stationary beside your head. Return with control.",
    muscles: ["Triceps"],
  },
  "overhead dumbbell tricep extension": {
    howTo: "Hold a single dumbbell with both hands behind your head, elbows pointing up. Extend your arms to press the weight overhead. Lower it back behind your head with control, keeping your elbows tight.",
    muscles: ["Triceps"],
  },
  "overhead rope tricep extension": {
    howTo: "Face away from a cable machine, holding a rope attachment behind your head with both hands. Extend your arms forward until they are straight, squeezing your triceps. Return slowly to the start.",
    muscles: ["Triceps"],
  },
  // ── P ──
  "pallof press": {
    howTo: "Stand sideways to a cable machine holding a handle at chest height with both hands. Press the handle straight out in front of you, resisting the cable's pull trying to rotate your torso. Hold for a moment, then bring it back to your chest.",
    muscles: ["Core"],
  },
  "pec deck / machine flyes": {
    howTo: "Sit in the pec deck machine with your arms on the pads or gripping the handles. Bring the pads together in front of your chest by squeezing your pecs. Return slowly, feeling the stretch.",
    muscles: ["Chest"],
  },
  "pec deck machine": {
    howTo: "Sit in the pec deck machine with your forearms against the pads at chest height. Squeeze the pads together by contracting your chest muscles. Return to the start slowly, maintaining control.",
    muscles: ["Chest"],
  },
  "pigeon pose": {
    howTo: "From a hands-and-knees position, bring one knee forward and place your shin across your body. Extend the other leg straight behind you and sink your hips toward the floor. Hold the stretch and breathe deeply.",
    muscles: ["Glutes", "Hip Flexors"],
  },
  "pigeon stretch": {
    howTo: "From all fours, slide one knee forward behind your wrist with your shin angled across your body. Extend the back leg behind you and lower your hips toward the floor. Hold the deep hip stretch and breathe.",
    muscles: ["Glutes", "Hip Flexors"],
  },
  "pike push-ups": {
    howTo: "Start in a push-up position then walk your feet toward your hands, raising your hips into an inverted V. Bend your elbows to lower the top of your head toward the floor. Press back up to the starting pike position.",
    muscles: ["Shoulders", "Triceps"],
  },
  "pike push-ups (feet on chair)": {
    howTo: "Place your feet on a chair and walk your hands back until your hips are high in an inverted V. Lower the top of your head toward the floor by bending your elbows. Press back up. The elevation increases shoulder loading.",
    muscles: ["Shoulders", "Triceps"],
  },
  "pistol squat negatives": {
    howTo: "Stand on one leg and slowly lower yourself down to a chair or low surface behind you, keeping the other leg extended in front. Use a 3-5 second negative. Stand up using both legs and repeat.",
    muscles: ["Quads", "Glutes", "Core"],
  },
  "plank": {
    howTo: "Support your body on your forearms and toes with your body in a straight line from head to heels. Brace your core and squeeze your glutes to prevent your hips from sagging or piking. Hold for the prescribed time while breathing steadily.",
    muscles: ["Core", "Shoulders"],
  },
  "plank hold": {
    howTo: "Hold a forearm or high plank position with your body in a straight line. Engage your core and glutes to maintain a flat back. Breathe steadily and hold for the prescribed time.",
    muscles: ["Core", "Shoulders"],
  },
  "plank jacks": {
    howTo: "Start in a high plank position. Jump your feet apart and then back together, like a horizontal jumping jack. Keep your core tight and hips level throughout.",
    muscles: ["Core", "Shoulders", "Hip Flexors"],
  },
  "plank reach-outs": {
    howTo: "Start in a high plank position. Extend one arm straight out in front of you while maintaining balance on the other three points of contact. Return your hand to the floor and alternate sides.",
    muscles: ["Core", "Shoulders"],
  },
  "plank shoulder taps": {
    howTo: "Start in a high plank position with your hands under your shoulders. Lift one hand to tap the opposite shoulder, then return it to the floor and alternate. Keep your hips as still as possible.",
    muscles: ["Core", "Shoulders"],
  },
  "plank to push-up": {
    howTo: "Start in a forearm plank. Push up to a high plank one arm at a time, then lower back to the forearm plank. Alternate the leading arm each rep.",
    muscles: ["Core", "Triceps", "Shoulders"],
  },
  "plank up-downs": {
    howTo: "Start in a forearm plank and push up to a high plank one arm at a time. Lower back down to your forearms one arm at a time. Alternate which arm leads each rep.",
    muscles: ["Core", "Triceps", "Shoulders"],
  },
  "plate front raises": {
    howTo: "Hold a weight plate with both hands at the 3 and 9 o'clock positions. Raise the plate straight in front of you to eye level with arms extended. Lower with control.",
    muscles: ["Front Delts", "Core"],
  },
  "preacher curls": {
    howTo: "Sit at a preacher curl bench with your upper arms resting on the angled pad. Curl the weight up toward your shoulders, then lower it slowly with a controlled negative. Keep your upper arms pressed firmly against the pad.",
    muscles: ["Biceps"],
  },
  "preacher curls (ez bar)": {
    howTo: "Sit at a preacher bench and grip an EZ curl bar with an underhand grip. Rest your upper arms on the pad and curl the bar toward your shoulders. Lower slowly with a 3-second negative.",
    muscles: ["Biceps"],
  },
  "prone scorpion stretch": {
    howTo: "Lie face down with arms out to the sides. Lift one foot and reach it across your body toward the opposite hand, rotating through your spine. Return and repeat on the other side.",
    muscles: ["Core", "Hip Flexors", "Back (Upper)"],
  },
  "prone y-raises": {
    howTo: "Lie face down on the floor with arms extended overhead in a Y shape. Raise both arms off the ground by squeezing your upper back and rear delts. Lower slowly and repeat.",
    muscles: ["Back (Upper)", "Rear Delts"],
  },
  "prone y-w-t raises": {
    howTo: "Lie face down and perform arm raises in three positions: Y (arms overhead), W (elbows pulled back with arms bent), and T (arms straight out to the sides). Hold each position briefly at the top.",
    muscles: ["Back (Upper)", "Rear Delts", "Shoulders"],
  },
  "pseudo planche push-ups": {
    howTo: "Set up in a push-up position but rotate your hands so your fingers point toward your feet, positioning them near your waist. Lean forward and perform push-ups with your weight shifted toward your hands. This is an advanced variation requiring significant shoulder and core strength.",
    muscles: ["Chest", "Front Delts", "Core", "Triceps"],
  },
  "pull-ups": {
    howTo: "Hang from a pull-up bar with an overhand grip slightly wider than shoulder-width. Pull yourself up until your chin clears the bar by driving your elbows down. Lower yourself with control until your arms are fully extended.",
    muscles: ["Back (Lats)", "Biceps", "Back (Upper)"],
  },
  "push-up variations (wide/diamond)": {
    howTo: "Alternate between wide push-ups (hands wider than shoulders targeting the chest) and diamond push-ups (hands close together targeting the triceps). Maintain a straight body line and full range of motion on each variation.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "push-ups": {
    howTo: "Place your hands slightly wider than shoulder-width on the floor with your body in a straight line. Lower your chest to the floor by bending your elbows. Press back up to full arm extension.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "push-ups (or knee push-ups)": {
    howTo: "Perform a standard push-up from your toes, or from your knees if full push-ups are too challenging. Lower your chest to the floor and press back up, keeping your body in a straight line. Full range of motion on every rep.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  // ── Q ──
  "quad stretch (standing)": {
    howTo: "Stand on one leg and grab the other foot behind you, pulling your heel toward your glute. Keep your knees together and stand tall. Hold the stretch and breathe.",
    muscles: ["Quads"],
  },
  // ── R ──
  "rack pulls": {
    howTo: "Set the safety pins in a power rack just below knee height and load a barbell. Grip the bar and stand up by driving your hips forward and squeezing your upper back. Lower back to the pins with control.",
    muscles: ["Back (Upper)", "Back (Lats)", "Glutes", "Hamstrings"],
  },
  "rear delt flyes (cable)": {
    howTo: "Set the cables at face height with no handles. Cross your arms to grab the opposite cables. Pull them apart by driving your elbows back and squeezing your rear delts. Return with control.",
    muscles: ["Rear Delts", "Back (Upper)"],
  },
  "reclined butterfly (supta baddha konasana)": {
    howTo: "Lie on your back and bring the soles of your feet together, letting your knees fall open to the sides. Rest your arms at your sides and relax completely. Breathe deeply and allow gravity to deepen the stretch.",
    muscles: ["Hip Flexors", "Glutes"],
  },
  "resistance band pull-aparts": {
    howTo: "Hold a resistance band at chest height with arms extended. Pull the band apart by squeezing your shoulder blades together until the band touches your chest. Return slowly to the start.",
    muscles: ["Rear Delts", "Back (Upper)"],
  },
  "reverse curls": {
    howTo: "Stand holding a barbell or EZ bar with an overhand (pronated) grip. Curl the bar toward your shoulders, keeping your elbows pinned. Lower with control. This targets the forearms and brachioradialis.",
    muscles: ["Forearms", "Biceps"],
  },
  "reverse grip lat pulldown": {
    howTo: "Sit at a lat pulldown machine and grip the bar with an underhand (supinated) grip about shoulder-width apart. Pull the bar to your upper chest, focusing on squeezing your lower lats. Return with control.",
    muscles: ["Back (Lats)", "Biceps"],
  },
  "reverse lunges": {
    howTo: "Stand with feet hip-width apart. Step one foot backward and lower your back knee toward the floor until both legs form 90-degree angles. Push through the front heel to return to standing and alternate legs.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "reverse pec deck": {
    howTo: "Sit facing the pec deck machine and grip the handles or pads with your arms extended forward. Push the handles apart by squeezing your rear delts and upper back. Return with control.",
    muscles: ["Rear Delts", "Back (Upper)"],
  },
  "reverse snow angels": {
    howTo: "Lie face down with arms at your sides hovering off the floor. Sweep your arms in an arc from your hips to overhead while keeping them off the ground. Reverse the motion and repeat.",
    muscles: ["Back (Upper)", "Rear Delts", "Shoulders"],
  },
  "romanian deadlifts": {
    howTo: "Stand holding a barbell or dumbbells at hip height. Hinge at the hips and push them back, lowering the weight along your legs with a slight knee bend. Return to standing by driving your hips forward.",
    muscles: ["Hamstrings", "Glutes", "Back (Lats)"],
  },
  "romanian deadlifts (barbell)": {
    howTo: "Stand holding a barbell at hip height with an overhand grip. Hinge at your hips and push them back, sliding the bar down your thighs with a slight knee bend. Drive your hips forward to return to standing.",
    muscles: ["Hamstrings", "Glutes", "Back (Lats)"],
  },
  "romanian deadlifts (dumbbells)": {
    howTo: "Stand holding dumbbells at your sides. Hinge at the hips, pushing them back while lowering the dumbbells along your legs with a slight knee bend. Stand up by driving your hips forward and squeezing your glutes.",
    muscles: ["Hamstrings", "Glutes", "Back (Lats)"],
  },
  "rowing machine (easy pace)": {
    howTo: "Sit on the rower with feet strapped in and grip the handle. Drive with your legs first, then lean back slightly and pull the handle to your chest. Return by extending your arms, leaning forward, and bending your knees.",
    muscles: ["Back (Lats)", "Quads", "Core", "Full Body"],
  },
  "rowing machine intervals": {
    howTo: "Alternate between hard rowing sprints and easy recovery periods on the rowing machine. Drive powerfully with your legs on hard intervals and maintain good posture throughout. Reduce stroke rate during recovery periods.",
    muscles: ["Back (Lats)", "Quads", "Core", "Full Body"],
  },
  "rowing machine sprint": {
    howTo: "Row at maximum effort on the rowing machine, driving hard through your legs and pulling forcefully to your chest. Maintain proper rowing form with legs-back-arms sequence even at high intensity. Keep your core braced.",
    muscles: ["Back (Lats)", "Quads", "Core", "Full Body"],
  },
  "russian twists": {
    howTo: "Sit on the floor with knees bent and lean back slightly. Rotate your torso to tap the floor on each side of your hips, optionally holding a weight. Keep your feet off the ground for added difficulty.",
    muscles: ["Core"],
  },
  // ── S ──
  "scorpion reach (prone)": {
    howTo: "Lie face down with arms out to the sides. Lift one leg and reach it across your body toward the opposite hand, rotating your spine. Return to the start and repeat on the other side.",
    muscles: ["Core", "Hip Flexors", "Back (Upper)"],
  },
  "seated arnold press": {
    howTo: "Sit holding dumbbells at chest height with palms facing you. As you press overhead, rotate your wrists so your palms face forward at the top. Reverse the rotation as you lower.",
    muscles: ["Shoulders", "Front Delts", "Triceps"],
  },
  "seated cable row": {
    howTo: "Sit at a cable row machine with feet on the platform and knees slightly bent. Pull the handle to your belly button by squeezing your shoulder blades together. Extend your arms forward with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "seated cable row (close grip)": {
    howTo: "Sit at a cable row machine and use a close-grip (V-bar) handle. Pull the handle to your lower chest by driving your elbows back and squeezing your mid-back. Return slowly with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "seated cable row (v-bar)": {
    howTo: "Sit at a cable row station and grip the V-bar handle with both hands. Pull the handle to your belly button, squeezing your shoulder blades together. Extend your arms back to the start with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "seated calf raises": {
    howTo: "Sit in a calf raise machine with the pad on your lower thighs and the balls of your feet on the platform. Raise your heels as high as possible, squeezing your calves at the top. Lower slowly for a deep stretch.",
    muscles: ["Calves"],
  },
  "seated dumbbell shoulder press": {
    howTo: "Sit on a bench with back support, holding dumbbells at shoulder height with palms facing forward. Press both weights overhead until your arms are fully extended. Lower to shoulder height with control.",
    muscles: ["Shoulders", "Triceps", "Front Delts"],
  },
  "seated forward fold": {
    howTo: "Sit on the floor with both legs extended straight. Hinge forward at the hips and reach toward your toes, keeping your back as flat as possible. Hold the stretch and breathe deeply.",
    muscles: ["Hamstrings", "Back (Lats)"],
  },
  "seated leg curls": {
    howTo: "Sit in the leg curl machine with the pad behind your ankles and your shins against the upper pad. Curl your legs underneath you by contracting your hamstrings. Return slowly with control.",
    muscles: ["Hamstrings"],
  },
  "seated spinal twist": {
    howTo: "Sit tall on the floor with one leg extended and the other crossed over it. Twist your torso toward the bent knee, placing the opposite elbow on the outside of the knee. Hold and breathe, looking over your shoulder.",
    muscles: ["Core", "Back (Upper)"],
  },
  "shadow boxing": {
    howTo: "Stand in a boxing stance with hands up by your chin. Throw jabs, crosses, and hooks while staying light on your feet and moving around. Focus on speed and technique rather than power.",
    muscles: ["Shoulders", "Core", "Full Body"],
  },
  "shoulder rolls": {
    howTo: "Stand or sit with good posture and roll your shoulders in large circles forward. After the prescribed reps, reverse direction and roll them backward. Move slowly and through the full range.",
    muscles: ["Shoulders", "Back (Upper)"],
  },
  "side plank thread-through": {
    howTo: "Set up in a side plank on your elbow. Reach your top arm toward the ceiling, then thread it under your body, rotating your torso. Return to the open position and repeat.",
    muscles: ["Core", "Shoulders"],
  },
  "single arm cable row": {
    howTo: "Stand or sit at a cable machine and grip a single handle with one hand. Pull the handle toward your hip, squeezing your shoulder blade back. Return with control and complete all reps before switching sides.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "single arm dumbbell row": {
    howTo: "Place one hand and knee on a bench, holding a dumbbell in the other hand. Row the weight toward your hip, squeezing your shoulder blade at the top. Lower with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "single leg balance to reach": {
    howTo: "Stand on one leg and hinge forward at the hips, reaching toward the floor with your hands. Keep the standing leg slightly bent and extend the free leg behind you for balance. Return to standing.",
    muscles: ["Hamstrings", "Glutes", "Core"],
  },
  "single leg calf raises": {
    howTo: "Stand on the edge of a step on one foot with the other foot lifted. Rise up onto your toes, squeezing your calf at the top. Lower your heel below the step for a full stretch and repeat.",
    muscles: ["Calves"],
  },
  "single leg glute bridge": {
    howTo: "Lie on your back with one foot flat on the floor and the other leg extended or raised. Drive through the planted heel to lift your hips, squeezing the glute at the top. Lower and repeat on each side.",
    muscles: ["Glutes", "Hamstrings"],
  },
  "single leg romanian deadlift (bodyweight)": {
    howTo: "Stand on one leg and hinge forward at the hips, extending the free leg behind you for balance. Lower your torso until you feel a stretch in your hamstring. Return to standing by driving your hips forward.",
    muscles: ["Hamstrings", "Glutes", "Core"],
  },
  "single leg romanian deadlift (dumbbell)": {
    howTo: "Stand on one leg holding a dumbbell in the opposite hand. Hinge at the hips, lowering the dumbbell while extending the free leg behind you. Drive your hips forward to return to standing.",
    muscles: ["Hamstrings", "Glutes", "Core"],
  },
  "single leg romanian deadlift (kettlebell)": {
    howTo: "Stand on one leg holding a kettlebell in the opposite hand. Hinge at the hips, extending the free leg behind you as you lower the kettlebell toward the floor. Return to standing by driving your hips forward.",
    muscles: ["Hamstrings", "Glutes", "Core"],
  },
  "skull crushers": {
    howTo: "Lie on a flat bench holding a barbell or EZ bar with arms extended over your chest. Lower the bar toward your forehead by bending only at the elbows. Extend your arms back to the start.",
    muscles: ["Triceps"],
  },
  "sled push (or prowler)": {
    howTo: "Grip the sled handles at a low position, lean forward at about 45 degrees, and drive it forward using powerful leg pushes. Keep your arms locked and your core braced as you drive with each step.",
    muscles: ["Quads", "Glutes", "Core", "Full Body"],
  },
  "speed skaters": {
    howTo: "Jump laterally from one foot to the other, landing softly on each leg. Reach the opposite hand toward the landing foot. Stay low and move rhythmically side to side.",
    muscles: ["Quads", "Glutes", "Calves"],
  },
  "sphinx push-ups": {
    howTo: "Start in a forearm plank position. Press up to a high plank by pushing through your hands and straightening your arms. Lower back to your forearms with control.",
    muscles: ["Triceps", "Core", "Chest"],
  },
  "spider curls": {
    howTo: "Lie face down on an incline bench with your arms hanging straight down, holding dumbbells or a barbell. Curl the weight up toward your shoulders without swinging. Lower slowly for maximum tension.",
    muscles: ["Biceps"],
  },
  "sprint on spot": {
    howTo: "Run in place as fast as possible, driving your knees high and pumping your arms. Stay on the balls of your feet and maintain maximum intensity throughout the interval.",
    muscles: ["Quads", "Core", "Hip Flexors", "Calves"],
  },
  "squat to star jump": {
    howTo: "Lower into a deep squat, then explode upward into a star jump with arms and legs spread wide. Land softly back into the squat position and immediately descend into the next rep.",
    muscles: ["Quads", "Glutes", "Calves", "Full Body"],
  },
  "stair climber (continuous)": {
    howTo: "Step onto the stair climber machine and climb at a moderate, continuous pace. Stand tall without leaning on the handrails. Maintain a steady rhythm throughout the prescribed time.",
    muscles: ["Quads", "Glutes", "Calves"],
  },
  "stair climber (steady)": {
    howTo: "Use the stair climber machine at a comfortable steady pace. Hold the rails lightly for balance only and keep your body upright. Focus on driving through each step with your full foot.",
    muscles: ["Quads", "Glutes", "Calves"],
  },
  "stair sprints": {
    howTo: "Sprint up a flight of stairs as fast as you can, then walk back down to recover. Drive with your arms and push off each step with your forefoot. Repeat for the prescribed number of rounds.",
    muscles: ["Quads", "Glutes", "Calves", "Core"],
  },
  "standing barbell overhead press": {
    howTo: "Stand holding a barbell at shoulder height with feet shoulder-width apart. Press the bar straight overhead, locking out your arms at the top. Lower the bar back to your shoulders with control while keeping your core tight.",
    muscles: ["Shoulders", "Triceps", "Core"],
  },
  "standing calf raises": {
    howTo: "Stand with the balls of your feet on a raised edge or flat on the floor. Rise up onto your toes as high as possible, squeezing your calves. Lower slowly with control.",
    muscles: ["Calves"],
  },
  "standing hamstring stretch": {
    howTo: "Place one foot on a low bench or step in front of you with the leg straight. Hinge forward at your hips until you feel a stretch in the back of your thigh. Keep your back flat and hold.",
    muscles: ["Hamstrings"],
  },
  "standing machine calf raises": {
    howTo: "Position yourself in the standing calf raise machine with the pads on your shoulders. Rise up onto your toes, squeezing your calves at the top. Lower slowly for a deep stretch.",
    muscles: ["Calves"],
  },
  "standing quad stretch": {
    howTo: "Stand on one leg and grab the other foot behind you, pulling your heel toward your glute. Keep your knees close together and your torso upright. Hold and breathe, feeling the stretch in your quad.",
    muscles: ["Quads"],
  },
  "standing side bend": {
    howTo: "Stand with feet hip-width apart and reach one arm overhead. Lean to the opposite side until you feel a stretch along your side. Hold for the prescribed time, then switch sides.",
    muscles: ["Core"],
  },
  "star jumps": {
    howTo: "Start in a slight squat position. Explode upward, spreading your arms and legs wide into a star shape in the air. Land softly with knees slightly bent and repeat.",
    muscles: ["Quads", "Glutes", "Calves", "Full Body"],
  },
  "stationary bike (steady)": {
    howTo: "Sit on the stationary bike with proper seat height so your knee is slightly bent at the bottom of the pedal stroke. Pedal at a steady moderate pace with consistent resistance. Maintain an upright posture.",
    muscles: ["Quads", "Hamstrings", "Calves"],
  },
  "step-ups (bench)": {
    howTo: "Stand facing a bench holding dumbbells at your sides. Step up onto the bench with one foot, driving through the heel to stand on top. Step back down and alternate legs.",
    muscles: ["Quads", "Glutes"],
  },
  "step-ups (stairs or step)": {
    howTo: "Stand facing a stair or step. Step up with one foot, pressing through the heel to stand fully on the step. Step back down and alternate your leading leg each set.",
    muscles: ["Quads", "Glutes"],
  },
  "step-ups (use a chair/step)": {
    howTo: "Stand in front of a sturdy chair or step. Place one foot on top and press through your heel to step up, standing fully on the surface. Step back down with control and alternate legs.",
    muscles: ["Quads", "Glutes"],
  },
  "step-ups with knee drive": {
    howTo: "Step up onto a box or bench and as you stand, drive the opposite knee up toward your chest. Step back down and repeat. This adds a balance and hip flexor challenge to the standard step-up.",
    muscles: ["Quads", "Glutes", "Hip Flexors", "Core"],
  },
  "straight arm pulldowns": {
    howTo: "Stand facing a high cable with a straight bar or rope attachment. With arms nearly straight, pull the bar down to your thighs by engaging your lats. Return the bar overhead with control.",
    muscles: ["Back (Lats)"],
  },
  "sumo deadlifts": {
    howTo: "Stand with a wide stance and toes pointed out, gripping the bar between your legs with a shoulder-width grip. Drive through your feet and push your knees out as you stand up with the bar. Keep your chest up and hips through at the top.",
    muscles: ["Glutes", "Quads", "Hamstrings", "Back (Lats)"],
  },
  "sumo squats": {
    howTo: "Stand with a wide stance and toes pointed outward. Squat down by bending your knees and pushing your hips back, keeping your torso upright. Drive through your heels to stand, squeezing your glutes at the top.",
    muscles: ["Quads", "Glutes", "Hip Flexors"],
  },
  "superman holds": {
    howTo: "Lie face down with arms extended overhead. Simultaneously lift your arms, chest, and legs off the floor by contracting your lower back and glutes. Hold briefly at the top, then lower.",
    muscles: ["Back (Upper)", "Glutes", "Core"],
  },
  "supine spinal twist": {
    howTo: "Lie on your back and cross one knee over your body to the opposite side. Extend the arm on the same side out and look in the opposite direction of your knee. Relax into the twist and breathe.",
    muscles: ["Core", "Back (Upper)"],
  },
  // ── T ──
  "t-bar rows": {
    howTo: "Straddle a T-bar row machine or landmine barbell and grip the handle with both hands. Pull the weight toward your chest by driving your elbows back and squeezing your shoulder blades. Lower with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "trx rows (or inverted rows)": {
    howTo: "Grip TRX handles or a bar at hip height with your body angled back and arms extended. Pull your chest toward the handles by squeezing your shoulder blades together. Lower with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps", "Core"],
  },
  "table inverted rows": {
    howTo: "Lie under a sturdy table and grip the edge with both hands, body straight. Pull your chest up to the table edge by driving your elbows back. Lower yourself with control.",
    muscles: ["Back (Lats)", "Back (Upper)", "Biceps"],
  },
  "thoracic spine rotation (side-lying)": {
    howTo: "Lie on your side with knees bent and stacked. Extend your top arm and rotate it open behind you, following your hand with your eyes. Return to the starting position and repeat.",
    muscles: ["Back (Upper)", "Core"],
  },
  "thread the needle (thoracic)": {
    howTo: "Start on all fours and reach one arm under your body, sliding it along the floor as you rotate your torso. Return to the start and reach that arm up toward the ceiling. Repeat on each side.",
    muscles: ["Back (Upper)", "Core", "Shoulders"],
  },
  "towel curls (isometric)": {
    howTo: "Stand on a towel and grip both ends with your hands. Curl upward and hold an isometric contraction, using your foot on the towel to provide resistance. Hold the contraction for the prescribed time.",
    muscles: ["Biceps"],
  },
  "towel rows (doorknob)": {
    howTo: "Loop a towel around a doorknob and grip both ends. Lean back with straight arms, then pull yourself toward the door by rowing with your back. Lower yourself back and repeat.",
    muscles: ["Back (Lats)", "Biceps"],
  },
  "treadmill brisk walk (incline)": {
    howTo: "Set the treadmill to a 3-5% incline and walk at a brisk pace. Keep an upright posture and swing your arms naturally. This elevates heart rate more than flat walking while remaining low-impact.",
    muscles: ["Quads", "Glutes", "Calves"],
  },
  "treadmill intervals": {
    howTo: "Alternate between sprinting and walking on the treadmill at prescribed intervals. During sprints, drive your arms and maintain good running form. Use the walk periods for active recovery.",
    muscles: ["Quads", "Hamstrings", "Calves", "Core"],
  },
  "treadmill walk-to-jog intervals": {
    howTo: "Alternate between walking and light jogging on the treadmill at the prescribed intervals. Start at a comfortable pace and gradually increase speed during jog portions. This builds cardiovascular fitness progressively.",
    muscles: ["Quads", "Hamstrings", "Calves"],
  },
  "tricep dips": {
    howTo: "Support yourself on parallel dip bars with arms locked out. Lower your body by bending your elbows until your upper arms are parallel to the floor. Press back up to full lockout.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "tricep dips (chair)": {
    howTo: "Place your hands on the edge of a sturdy chair behind you. Slide off the seat with legs bent and lower your body by bending your elbows to 90 degrees. Push back up by extending your arms.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "tricep dips (chair/sofa)": {
    howTo: "Place your hands on the edge of a chair or sofa behind you. Slide your hips off the seat and lower your body by bending your elbows. Press back up to straighten your arms.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "tricep dips (machine or bench)": {
    howTo: "Use a dip machine or bench to perform tricep dips. Lower your body by bending at the elbows until your upper arms are roughly parallel to the floor. Press back up to full extension.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "tricep kickbacks (cable)": {
    howTo: "Stand facing a low cable and hinge forward at the hips. Hold a handle with one arm bent at 90 degrees. Extend your arm straight back by squeezing your tricep, then return to 90 degrees.",
    muscles: ["Triceps"],
  },
  "tricep pushdowns": {
    howTo: "Stand at a cable machine with a straight or V-bar attachment at head height. Push the bar down by extending your elbows until your arms are straight. Return to the start without letting your elbows drift forward.",
    muscles: ["Triceps"],
  },
  "tricep rope pushdowns": {
    howTo: "Stand at a cable machine with a rope attachment. Push the rope down by extending your elbows and spread the ends apart at the bottom for a full contraction. Return with control.",
    muscles: ["Triceps"],
  },
  "tricep stretch (overhead)": {
    howTo: "Reach one arm overhead and bend the elbow so your hand drops behind your head. Use the opposite hand to gently push the elbow further. Hold and breathe, feeling the stretch in your tricep.",
    muscles: ["Triceps"],
  },
  "tuck jumps": {
    howTo: "Stand with feet shoulder-width apart and jump as high as you can, pulling your knees toward your chest at the peak. Land softly with bent knees and immediately jump again.",
    muscles: ["Quads", "Glutes", "Calves", "Core"],
  },
  "turkish get-ups": {
    howTo: "Lie on the floor holding a kettlebell or dumbbell overhead with one arm. Stand up while keeping the weight locked out overhead through a series of controlled transitions. Reverse the movement to lie back down.",
    muscles: ["Full Body", "Core", "Shoulders"],
  },
  // ── W ──
  "walking lunges": {
    howTo: "Step forward into a lunge, lowering your back knee toward the floor. Push through the front heel to bring your back foot forward and step into the next lunge. Continue moving forward for the prescribed reps.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "walking lunges (barbell)": {
    howTo: "Place a barbell across your upper back and step forward into a lunge. Lower your back knee toward the floor, then drive through the front heel to step forward into the next lunge. Keep your torso upright.",
    muscles: ["Quads", "Glutes", "Hamstrings", "Core"],
  },
  "wall handstand hold": {
    howTo: "Kick up or walk your feet up a wall until your body is inverted with your belly facing the wall. Hold the position with your arms locked and core tight. This builds tremendous shoulder strength and stability.",
    muscles: ["Shoulders", "Core", "Triceps"],
  },
  "wall push-ups": {
    howTo: "Stand arm's length from a wall and place your hands flat against it at shoulder height. Lean in by bending your elbows, then push yourself back to the start. This is an excellent beginner push-up progression.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "wall sit": {
    howTo: "Lean your back flat against a wall and slide down until your thighs are parallel to the floor with knees at 90 degrees. Hold the position with your weight through your heels. Keep your back flat against the wall throughout.",
    muscles: ["Quads", "Glutes"],
  },
  "wall sit (single leg hold)": {
    howTo: "Perform a standard wall sit, then lift one foot off the floor and hold the position on a single leg. Keep your back pressed against the wall and the supporting leg at 90 degrees. Switch legs after the prescribed time.",
    muscles: ["Quads", "Glutes", "Core"],
  },
  "weighted chin-ups": {
    howTo: "Attach weight to a dip belt or hold a dumbbell between your feet, then hang from a bar with an underhand grip. Pull yourself up until your chin clears the bar. Lower with control.",
    muscles: ["Back (Lats)", "Biceps", "Back (Upper)"],
  },
  "weighted dips": {
    howTo: "Attach weight to a dip belt and support yourself on parallel bars with arms locked. Lower your body by bending your elbows, leaning slightly forward for chest emphasis. Press back up to lockout.",
    muscles: ["Chest", "Triceps", "Front Delts"],
  },
  "weighted dips (tricep focus)": {
    howTo: "Attach weight to a dip belt and support yourself on parallel bars. Keep your torso upright (rather than leaning forward) to target the triceps. Lower until your elbows are at 90 degrees and press back up.",
    muscles: ["Triceps", "Chest", "Front Delts"],
  },
  "weighted pull-ups": {
    howTo: "Attach weight to a dip belt or hold a dumbbell between your feet. Hang from a bar with an overhand grip and pull yourself up until your chin clears the bar. Lower with full control.",
    muscles: ["Back (Lats)", "Biceps", "Back (Upper)"],
  },
  "weighted pull-ups (wide grip)": {
    howTo: "Add weight via a dip belt and take a wide overhand grip on the pull-up bar. Pull yourself up until your chin passes the bar, focusing on driving your elbows down. Lower to a full dead hang.",
    muscles: ["Back (Lats)", "Biceps", "Back (Upper)"],
  },
  "wide grip lat pulldown": {
    howTo: "Sit at the lat pulldown machine and take a wide overhand grip. Pull the bar to your upper chest while leaning back slightly, driving your elbows down. Return the bar with control, feeling the full lat stretch.",
    muscles: ["Back (Lats)", "Biceps"],
  },
  "world's greatest stretch": {
    howTo: "Step into a deep lunge, place the same-side hand on the floor, then rotate your torso and reach the other arm toward the ceiling. Return and walk into the next rep on the other side. This hits the hips, thoracic spine, and hamstrings in one movement.",
    muscles: ["Hip Flexors", "Core", "Back (Upper)", "Hamstrings"],
  },
};

export function getExerciseInfo(name: string): ExerciseInfo | null {
  const normalized = name.toLowerCase().trim();

  // Direct match
  if (exerciseDatabase[normalized]) {
    return exerciseDatabase[normalized];
  }

  // Try to find a key that matches after stripping parenthetical details
  const strippedInput = normalized.replace(/\s*\([^)]*\)\s*/g, "").trim();
  for (const key of Object.keys(exerciseDatabase)) {
    const strippedKey = key.replace(/\s*\([^)]*\)\s*/g, "").trim();
    if (strippedKey === strippedInput) {
      return exerciseDatabase[key];
    }
  }

  // Partial match: check if the input contains a key or a key contains the input
  for (const key of Object.keys(exerciseDatabase)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return exerciseDatabase[key];
    }
  }

  // Fuzzy partial match: strip common prefixes/suffixes and try again
  const prefixes = [
    "flat ",
    "incline ",
    "decline ",
    "seated ",
    "standing ",
    "lying ",
    "barbell ",
    "dumbbell ",
    "cable ",
    "machine ",
    "banded ",
    "weighted ",
    "bodyweight ",
    "single leg ",
    "single arm ",
  ];
  let stripped = normalized;
  for (const prefix of prefixes) {
    if (stripped.startsWith(prefix)) {
      stripped = stripped.slice(prefix.length);
      break;
    }
  }
  for (const key of Object.keys(exerciseDatabase)) {
    if (key.includes(stripped) || stripped.includes(key)) {
      return exerciseDatabase[key];
    }
  }

  return null;
}
