-- Seed trainers
INSERT INTO public.trainers (name, specialty, bio, experience_years, certifications) VALUES
('Marcus Johnson', 'Strength & Conditioning', 'Former professional athlete with 12 years of training experience. Specializes in building functional strength and athletic performance.', 12, ARRAY['NASM-CPT', 'CSCS', 'FMS']),
('Sarah Chen', 'HIIT & Weight Loss', 'Certified nutritionist and fitness trainer passionate about helping clients achieve sustainable weight loss through high-intensity workouts.', 8, ARRAY['ACE-CPT', 'Precision Nutrition L1', 'TRX Certified']),
('David Rodriguez', 'Bodybuilding', 'Competition-winning bodybuilder who brings scientific approach to muscle building and contest preparation.', 15, ARRAY['IFBB Pro', 'NASM-CPT', 'Sports Nutrition Specialist']),
('Emily Thompson', 'Yoga & Flexibility', 'Holistic wellness coach combining traditional yoga with modern mobility training for complete body transformation.', 10, ARRAY['RYT-500', 'FRC Mobility Specialist', 'Pilates Certified']),
('James Wilson', 'CrossFit & Functional Fitness', 'CrossFit Games competitor dedicated to pushing boundaries and helping others discover their potential.', 7, ARRAY['CrossFit L3', 'USAW Sports Performance', 'Gymnastics Certified'])
ON CONFLICT DO NOTHING;

-- Seed exercises
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty, instructions) VALUES
-- Chest
('Barbell Bench Press', 'The king of chest exercises, targeting the pectoralis major while engaging shoulders and triceps.', 'Chest', 'Barbell, Bench', 'intermediate', ARRAY['Lie flat on bench with feet on floor', 'Grip bar slightly wider than shoulder width', 'Lower bar to mid-chest with control', 'Press bar up until arms are fully extended', 'Keep core tight throughout movement']),
('Incline Dumbbell Press', 'Targets the upper chest with dumbbells for greater range of motion and muscle activation.', 'Chest', 'Dumbbells, Incline Bench', 'intermediate', ARRAY['Set bench to 30-45 degree incline', 'Hold dumbbells at shoulder level', 'Press weights up and together', 'Lower with control to starting position']),
('Push-Ups', 'Classic bodyweight exercise for chest, shoulders, and triceps development.', 'Chest', 'Bodyweight', 'beginner', ARRAY['Start in plank position with hands shoulder-width', 'Lower chest to ground keeping body straight', 'Push back up to starting position', 'Keep core engaged throughout']),

-- Back
('Deadlift', 'Fundamental compound movement for overall posterior chain development.', 'Back', 'Barbell', 'advanced', ARRAY['Stand with feet hip-width apart', 'Grip bar just outside knees', 'Keep back flat and chest up', 'Drive through heels to stand', 'Lower with control back to floor']),
('Pull-Ups', 'Essential upper body exercise for lat development and grip strength.', 'Back', 'Pull-up Bar', 'intermediate', ARRAY['Hang from bar with overhand grip', 'Pull body up until chin clears bar', 'Lower with control to full extension', 'Avoid swinging or kipping']),
('Bent Over Row', 'Builds thickness in the middle back while engaging the biceps.', 'Back', 'Barbell', 'intermediate', ARRAY['Hinge at hips with slight knee bend', 'Keep back flat and core tight', 'Pull bar to lower chest', 'Squeeze shoulder blades at top', 'Lower with control']),

-- Legs
('Barbell Squat', 'The ultimate lower body exercise for building strength and muscle mass.', 'Legs', 'Barbell, Squat Rack', 'intermediate', ARRAY['Position bar on upper back', 'Stand with feet shoulder-width apart', 'Descend by breaking at hips and knees', 'Go to parallel or below', 'Drive up through heels to stand']),
('Romanian Deadlift', 'Targets hamstrings and glutes while improving hip hinge mechanics.', 'Legs', 'Barbell', 'intermediate', ARRAY['Hold bar at hip level', 'Push hips back while lowering bar', 'Keep slight bend in knees', 'Feel stretch in hamstrings', 'Return to standing by driving hips forward']),
('Leg Press', 'Machine-based leg exercise allowing heavy loads with reduced spinal stress.', 'Legs', 'Leg Press Machine', 'beginner', ARRAY['Sit in machine with back flat against pad', 'Place feet shoulder-width on platform', 'Lower weight by bending knees', 'Press through heels to extend legs', 'Do not lock knees at top']),
('Walking Lunges', 'Dynamic lower body exercise improving balance and unilateral strength.', 'Legs', 'Dumbbells', 'beginner', ARRAY['Hold dumbbells at sides', 'Step forward into lunge position', 'Lower back knee toward ground', 'Push through front heel to step forward', 'Alternate legs with each step']),

-- Shoulders
('Overhead Press', 'Primary shoulder builder targeting all three deltoid heads.', 'Shoulders', 'Barbell', 'intermediate', ARRAY['Hold bar at shoulder level', 'Press bar overhead until arms lock out', 'Keep core tight to prevent arching', 'Lower bar with control to shoulders']),
('Lateral Raises', 'Isolation exercise for developing the lateral deltoid head.', 'Shoulders', 'Dumbbells', 'beginner', ARRAY['Hold dumbbells at sides', 'Raise arms out to sides until parallel', 'Keep slight bend in elbows', 'Lower with control']),

-- Arms
('Barbell Curl', 'Classic bicep builder for arm size and strength.', 'Arms', 'Barbell', 'beginner', ARRAY['Hold bar with underhand grip', 'Curl bar up keeping elbows stationary', 'Squeeze biceps at top', 'Lower with control']),
('Tricep Dips', 'Compound movement for tricep development and pressing strength.', 'Arms', 'Parallel Bars', 'intermediate', ARRAY['Grip parallel bars and lift body', 'Lower body by bending elbows', 'Go until upper arms are parallel to ground', 'Press back up to starting position']),
('Hammer Curls', 'Targets the brachialis and forearms for complete arm development.', 'Arms', 'Dumbbells', 'beginner', ARRAY['Hold dumbbells with neutral grip', 'Curl weights up keeping palms facing in', 'Squeeze at top of movement', 'Lower with control']),

-- Core
('Plank', 'Isometric core exercise for building stability and endurance.', 'Core', 'Bodyweight', 'beginner', ARRAY['Start in forearm plank position', 'Keep body in straight line', 'Engage core and squeeze glutes', 'Hold for prescribed time']),
('Hanging Leg Raise', 'Advanced core exercise targeting lower abs and hip flexors.', 'Core', 'Pull-up Bar', 'advanced', ARRAY['Hang from bar with straight arms', 'Raise legs until parallel to ground', 'Control the descent', 'Avoid swinging']),
('Cable Woodchop', 'Rotational core exercise for functional strength.', 'Core', 'Cable Machine', 'intermediate', ARRAY['Set cable to high position', 'Grip handle with both hands', 'Rotate and pull diagonally across body', 'Control the return to starting position'])
ON CONFLICT DO NOTHING;
