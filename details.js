// ====== EDIT YOUR GYM DETAILS HERE ======
const GYM = {
  address: 'IRONFORGE Fitness, Main Road, Pune, Maharashtra 411001',   // <- change to your real address
  phone: '+91 80879 18607',
  email: 'info@ironforge.example',                                       // <- change
  hours: [['Mon - Fri', '5:30 AM - 10:30 PM'], ['Saturday', '6:00 AM - 9:00 PM'], ['Sunday', '7:00 AM - 1:00 PM']],
  stats: [[500, '+', 'Active Members'], [3, '', 'Expert Coaches'], [14, '', 'Classes / Week'], [5, '', 'Years of Service']],
};
const WHY = [
  ['dumbbell', 'Premium Equipment', 'Commercial-grade racks, plates and machines, serviced every week.'],
  ['users', 'Certified Coaches', 'Qualified trainers who build programs around your goals.'],
  ['clock', 'Long Opening Hours', 'Open early and late, so training fits around work or college.'],
  ['shield', 'Clean & Safe', 'Daily sanitisation, CCTV, first-aid and trained floor staff.'],
  ['heart', 'Diet Guidance', 'Practical nutrition advice that matches your plan.'],
  ['flame', 'Transparent Pricing', 'No hidden charges. Every price is shown before you join.'],
];
const FAQ = [
  ['Is the orientation really free?', 'Yes. Fill in the form and we will contact you to schedule a free walkthrough of the gym and a trial session.'],
  ['Do I need to pay online?', 'No. Choosing a plan on this website only records your interest. Payment is done at the gym.'],
  ['Can I freeze my membership?', 'Memberships of 6 months or more can be frozen for up to 15 days. Ask our front desk for details.'],
  ['Do you offer personal training?', 'Yes. Add the personal trainer option in the Membership Calculator or ask during your orientation.'],
  ['What should I bring on my first day?', 'Comfortable clothes, sports shoes, a towel and a water bottle. Lockers are included.'],
];
const ICONS = {
  dumbbell: '<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6M16 4.8a3.4 3.4 0 010 6.4M18 14.4c2.2.7 3.5 2.6 3.5 5.6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  heart: '<path d="M12 20s-8-4.7-8-10.5A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.5C20 15.3 12 20 12 20z"/>',
  flame: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z"/>',
};
const icon = n => '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICONS[n] + '</svg>';
