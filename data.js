// Edit this file to change plans, programs and trainers.
const PLANS = [
  { name: 'Starter', price: 1500, period: 'month', features: ['Gym floor access', 'Locker', '1 orientation'] },
  { name: 'Forge', price: 2500, period: 'month', featured: true, features: ['All Starter perks', 'Group classes', 'Diet guidance'] },
  { name: 'Elite', price: 4000, period: 'month', features: ['All Forge perks', 'Personal trainer', 'Steam & recovery'] },
];
const PROGRAMS = [
  { title: 'Strength & Power', level: 'Intermediate', description: 'Barbell-based training for raw strength.' },
  { title: 'Fat Loss Blitz', level: 'Beginner', description: 'HIIT and conditioning circuits.' },
  { title: 'Functional Mobility', level: 'All levels', description: 'Move better, lift longer.' },
];
const TRAINERS = [
  { name: 'Farhan Khan', speciality: 'Strength Coach', bio: '8 years coaching powerlifters.' },
  { name: 'Khushi Rathod', speciality: 'Fat Loss & Nutrition', bio: 'Certified nutrition coach.' },
  { name: 'Vipul Indis', speciality: 'Functional Training', bio: 'Ex-athlete, mobility specialist.' },
];

// ====== SETTINGS: change these ======
const CONFIG = {
  FORMSPREE_ID: '',          // e.g. 'xyzabcde' from formspree.io (leave '' to save in browser only)
  WHATSAPP: '918087918607',  // country code + number, no + or spaces
  TRAINER_ADDON: 1000,       // per month
  JOINING_FEE: 500,          // waived for 6+ month plans
};
const TIMETABLE = {
  Mon: [['6:00 AM', 'Strength & Power', 'Farhan'], ['6:00 PM', 'Fat Loss Blitz', 'Khushi']],
  Tue: [['7:00 AM', 'Functional Mobility', 'Vipul'], ['7:00 PM', 'HIIT Circuit', 'Khushi']],
  Wed: [['6:00 AM', 'Strength & Power', 'Farhan'], ['6:30 PM', 'Core & Abs', 'Vipul']],
  Thu: [['7:00 AM', 'Fat Loss Blitz', 'Khushi'], ['7:00 PM', 'Powerlifting Basics', 'Farhan']],
  Fri: [['6:00 AM', 'Functional Mobility', 'Vipul'], ['6:00 PM', 'HIIT Circuit', 'Khushi']],
  Sat: [['8:00 AM', 'Full Body Burn', 'Farhan'], ['10:00 AM', 'Yoga & Stretch', 'Vipul']],
  Sun: [['9:00 AM', 'Open Gym + Mobility', 'Vipul']],
};
const REVIEWS = [
  { name: 'Aditya M.', text: 'Lost 9 kg in 4 months. The trainers actually care about your progress.' },
  { name: 'Priya S.', text: 'Clean equipment, great classes and a motivating crowd.' },
  { name: 'Karan D.', text: 'The Forge plan is value for money. My deadlift is up 40 kg.' },
];
const GALLERY = ['Free Weights', 'Cardio Zone', 'Group Classes', 'Recovery Lounge', 'Functional Rig', 'Personal Training'];
const WORKOUTS = {
  Strength: ['Squat + Leg Accessories', 'Bench Press + Triceps', 'Deadlift + Back', 'Overhead Press + Shoulders', 'Front Squat + Core', 'Mobility + Light Cardio'],
  'Fat Loss': ['Full Body Circuit', 'HIIT Intervals', 'Lower Body + Core', 'Upper Body Supersets', 'Steady Cardio 40 min', 'Active Recovery Walk'],
  'Muscle Gain': ['Chest + Triceps', 'Back + Biceps', 'Legs', 'Shoulders + Abs', 'Arms + Weak Points', 'Optional Full Body Pump'],
};
