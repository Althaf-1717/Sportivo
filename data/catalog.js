export const sportsCatalog = [
  {
    slug: "cricket",
    name: "Cricket",
    short: "CR",
    description: "Build a complete game: confident batting, precise bowling, and sharp fielding, coached with purpose.",
    detail: "A clear pathway for every player, from first nets to match-day preparation. Train in small groups with specialist coaches and progress you can see.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=85",
    focus: ["Batting technique", "Fast & spin bowling", "Fielding and fitness"],
    color: "blue",
    icon: "cricket",
  },
  {
    slug: "football",
    name: "Football",
    short: "FB",
    description: "Play with more vision, move with confidence, and find your rhythm in a team that helps you grow.",
    detail: "Structured sessions combine technical work, game awareness, and team play, led by coaches who understand how young athletes develop.",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=85",
    focus: ["First touch & control", "Tactical awareness", "Speed and agility"],
    color: "green",
    icon: "football",
  },
  {
    slug: "basketball",
    name: "Basketball",
    short: "BK",
    description: "Develop your handle, shoot with confidence, and make smarter decisions on every possession.",
    detail: "Individual skill-building and team concepts work together in a supportive environment where effort turns into better play.",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85",
    focus: ["Ball handling & shooting", "Footwork and defense", "Game confidence"],
    color: "orange",
    icon: "basketball",
  },
];

export const coachesCatalog = [
  { slug: "arjun-menon", name: "Arjun Menon", sport: "Cricket", role: "Batting & fielding coach", experience: "12 years", initials: "AM", bio: "Helps young players build sound technique and the composure to trust it under pressure." },
  { slug: "kavya-rao", name: "Kavya Rao", sport: "Cricket", role: "Bowling coach", experience: "9 years", initials: "KR", bio: "Specialises in pace, spin, and the small details that make a training plan work." },
  { slug: "dev-sharma", name: "Dev Sharma", sport: "Football", role: "Head football coach", experience: "11 years", initials: "DS", bio: "Brings game intelligence and technical development into every session." },
  { slug: "nisha-fernandes", name: "Nisha Fernandes", sport: "Football", role: "Youth development coach", experience: "8 years", initials: "NF", bio: "Creates a welcoming environment where fundamentals, confidence, and teamwork grow together." },
  { slug: "rahul-nair", name: "Rahul Nair", sport: "Basketball", role: "Skills & performance coach", experience: "10 years", initials: "RN", bio: "Turns individual skill work into purposeful decisions on the court." },
  { slug: "meera-kapoor", name: "Meera Kapoor", sport: "Basketball", role: "Player development coach", experience: "7 years", initials: "MK", bio: "Focuses on footwork, conditioning, and helping every player find their strengths." },
];

export const planCatalog = [
  { slug: "basic", name: "Basic", duration: 1, durationLabel: "1 month", price: 1499, description: "A focused start for a new routine.", features: ["Small-group coaching", "Two sessions each week", "Monthly progress check-in"] },
  { slug: "standard", name: "Standard", duration: 3, durationLabel: "3 months", price: 3999, description: "Room to build consistency and momentum.", features: ["Everything in Basic", "Three sessions each week", "Priority coach feedback"] },
  { slug: "premium", name: "Premium", duration: 6, durationLabel: "6 months", price: 6999, description: "A longer commitment to meaningful progress.", features: ["Everything in Standard", "Personal development plan", "Match and performance review"] },
];
