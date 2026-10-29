import type { ImageMetadata } from 'astro';
import dormlyShot from '../assets/dormly.png';
import barbershopShot from '../assets/barbershop.png';
import nbaArt from '../assets/nba-logo.png';
import tectraShot from '../assets/tectra.png';
import solarTeam from '../assets/solar-team.jpg';
import solarLogo from '../assets/solar-logo.jpg';
import ipserLogo from '../assets/ipserlab-logo-trim.png';
import aljonsLogo from '../assets/aljons-logo.jpg';
import blueprintLogo from '../assets/blueprint-logo.png';
import indCrest from '../assets/ind-crest.png';
import rutgersLogo from '../assets/rutgers-logo.png';

export const person = {
  name: 'Aarya Vulupala',
  role: 'Software Engineer',
  school: 'Rutgers University',
  majors: 'Computer Science & Data Science',
  location: 'New Brunswick, NJ',
  timezone: 'America/New_York',
  emailPrimary: 'aaryavulupala0@gmail.com',
  emailSchool: 'av1136@scarletmail.rutgers.edu',
  github: 'https://github.com/aaryavulupala',
  githubUser: 'aaryavulupala',
  linkedin: 'https://www.linkedin.com/in/aarya-vulupala/',
  resume: '/Aarya_Vulupala_Resume.pdf',
  site: 'https://aaryavulupala.com',
  intro:
    'I build full-stack products, data pipelines and ML models. Founder of a campus marketplace, developer of the booking platform that runs my own barbershop, and a software engineering intern who shipped to 25+ research offices.',
  currently:
    'Teaching APIs and system design to 100+ fellows at Blueprint; building sponsor-outreach and telemetry tools for Rutgers Solar Car.',
};

/** Every technology that gets a logo. `full` = artwork already fills its own circle. */
export const tech = {
  java: { name: 'Java', logo: 'java.svg' },
  python: { name: 'Python', logo: 'python.svg' },
  javascript: { name: 'JavaScript', logo: 'javascript.svg' },
  typescript: { name: 'TypeScript', logo: 'typescript.svg' },
  sql: { name: 'SQL', logo: 'sql.svg' },
  c: { name: 'C', logo: 'c.svg' },
  html5: { name: 'HTML', logo: 'html5.svg' },
  css3: { name: 'CSS', logo: 'css3.svg' },
  react: { name: 'React', logo: 'react.svg' },
  nextjs: { name: 'Next.js', logo: 'nextjs.svg' },
  nodejs: { name: 'Node.js', logo: 'nodejs.svg' },
  springboot: { name: 'Spring Boot', logo: 'springboot.svg' },
  fastapi: { name: 'FastAPI', logo: 'fastapi.svg' },
  pandas: { name: 'pandas', logo: 'pandas.svg' },
  numpy: { name: 'NumPy', logo: 'numpy.svg' },
  scikitlearn: { name: 'scikit-learn', logo: 'scikitlearn.svg' },
  xgboost: { name: 'XGBoost', logo: 'xgboost.png', full: true },
  tensorflow: { name: 'TensorFlow', logo: 'tensorflow.svg' },
  shap: { name: 'SHAP', logo: 'shap.png', full: true },
  aws: { name: 'AWS', logo: 'aws.svg' },
  s3: { name: 'AWS S3', logo: 'aws.svg' },
  postgresql: { name: 'PostgreSQL', logo: 'postgresql.svg' },
  mysql: { name: 'MySQL', logo: 'mysql.svg' },
  firebase: { name: 'Firebase', logo: 'firebase.svg' },
  supabase: { name: 'Supabase', logo: 'supabase.svg' },
  rest: { name: 'REST APIs', logo: 'rest.svg' },
  git: { name: 'Git', logo: 'git.svg' },
  github: { name: 'GitHub', logo: 'github.svg' },
  databricks: { name: 'Databricks', logo: 'databricks.svg' },
  cicd: { name: 'CI/CD', logo: 'cicd.svg' },
  postman: { name: 'Postman', logo: 'postman.svg' },
  claudecode: { name: 'Claude Code', logo: 'claudecode.svg' },
  codex: { name: 'Codex', logo: 'codex.svg' },
  cursor: { name: 'Cursor', logo: 'cursor.svg' },
  stripe: { name: 'Stripe', logo: 'stripe.svg' },
  clerk: { name: 'Clerk', logo: 'clerk.svg' },
  resend: { name: 'Resend', logo: 'resend.svg' },
  gemini: { name: 'Gemini API', logo: 'gemini.svg' },
  googlecalendar: { name: 'Google Calendar', logo: 'googlecalendar.svg' },
  appsscript: { name: 'Apps Script', logo: 'appsscript.svg' },
  brevo: { name: 'Brevo', logo: 'brevo.svg' },
  twilio: { name: 'Twilio', logo: 'twilio.svg' },
  slack: { name: 'Slack', logo: 'slack.svg' },
  vercel: { name: 'Vercel', logo: 'vercel.svg' },
} as const;
export type TechKey = keyof typeof tech;

export interface Link {
  label: string;
  href: string;
  /** Short note shown beside the link, e.g. a disclaimer. */
  note?: string;
}

export interface Project {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  status?: string;
  image: ImageMetadata;
  imageAlt: string;
  imageCaption: string;
  /** Screenshot is dark artwork rather than a page capture. */
  art?: boolean;
  stats: { value: string; label: string }[];
  built: string[];
  flow: { title: string; detail: string }[];
  tech: TechKey[];
  links: Link[];
  codeNote?: string;
}

export const projects: Project[] = [
  {
    slug: 'dormly',
    title: 'Dormly',
    kind: 'Campus marketplace · Founder',
    summary:
      'Student life is spread across group chats and listing sites. Dormly puts housing, goods, services, jobs, course swaps and clubs in one place, scoped to your campus.',
    status: 'Live. Stripe payments and ML-driven recommendations are next.',
    image: dormlyShot,
    imageAlt:
      'Dormly marketplace home page showing a grid of featured listings (shelves, iPhone 15, dumbbells, trampoline, TV, sweater, scooter, pool table) and a sidebar with Jobs, Campus Clubs, Course Exchange, Find a Roommate and Services.',
    imageCaption: 'Marketplace home, filtered to Rutgers University',
    stats: [
      { value: '14', label: 'listing categories' },
      { value: '7', label: 'campus hubs' },
    ],
    built: [
      'Founded and built it end to end: Home, Browse, Listing Detail, Messages and Profile pages in Next.js and React.',
      'Designed the PostgreSQL schema behind 14 listing categories and 7 hubs (jobs, roommates, course swaps), with search filtered by campus.',
      'Clerk handles sign-up and login with Google and Facebook. Image uploads go to S3, locked to a dedicated folder.',
    ],
    flow: [
      { title: 'Sign in', detail: 'Clerk, via Google or Facebook' },
      { title: 'Browse', detail: 'Campus-filtered search over 14 categories' },
      { title: 'List', detail: 'Images stored in a locked S3 folder' },
      { title: 'Connect', detail: 'In-app messaging between students' },
    ],
    tech: ['nextjs', 'react', 'typescript', 'postgresql', 's3', 'clerk'],
    links: [{ label: 'Live site', href: 'https://www.shopdormly.com/' }],
    codeNote: 'Private repository',
  },
  {
    slug: 'aarya-cuts',
    title: 'Aarya Cuts',
    kind: 'Booking platform for my barbershop',
    summary:
      'I run a barbershop, so I built the booking system I wanted: clients pick a time, pay, and get reminders, and the appointment lands on my calendar without me touching it.',
    status: 'Live and in daily use.',
    image: barbershopShot,
    imageAlt:
      'Landing page of the Aarya Cuts booking site with the headline "A fresh cut, wherever you are", a Book an appointment button, and a gallery of haircut photos beginning below.',
    imageCaption: 'Landing page, with the AI support chat button at bottom right',
    stats: [
      { value: '60+', label: 'appointments / month' },
      { value: '$1.5K+', label: 'monthly revenue' },
      { value: '−34%', label: 'no-shows' },
      { value: '~80%', label: 'less scheduling time' },
    ],
    built: [
      'Next.js and React on Vercel. Clients book and pay through Stripe; Supabase (PostgreSQL) tracks appointments.',
      'Each booking adds an event to my Google Calendar and notifies me. Clients get a calendar link of their own.',
      'Resend sends confirmations and pre-appointment reminders, which cut no-shows by 34%.',
      'Support chat on the Gemini API, steered by a custom prompt with the shop’s details so it stays on topic. A short quiz recommends hair care.',
    ],
    flow: [
      { title: 'Book', detail: 'Client picks an open time slot' },
      { title: 'Pay', detail: 'Stripe checkout' },
      { title: 'Store', detail: 'Appointment saved in Supabase / PostgreSQL' },
      { title: 'Sync', detail: 'Event on my Google Calendar, plus a calendar link for the client' },
      { title: 'Remind', detail: 'Resend emails confirmation and reminder' },
    ],
    tech: ['nextjs', 'react', 'supabase', 'postgresql', 'stripe', 'resend', 'googlecalendar', 'gemini', 'vercel'],
    links: [
      { label: 'Live site', href: 'https://www.aaryacuts.site/' },
      { label: 'Code', href: 'https://github.com/aaryavulupala/barbershop-booking' },
    ],
  },
  {
    slug: 'nba-predictor',
    title: 'NBA Prospect & Career Predictor',
    kind: 'Machine learning · Python',
    summary:
      'Can a draft prospect’s college profile predict the tier of their NBA career? I built the data pipeline and benchmarked models on held-out draft classes to find out.',
    image: nbaArt,
    imageAlt:
      'Project artwork: an NBA-style player silhouette inside a rising bar chart, ringed by the logos of Python, scikit-learn, XGBoost, TensorFlow and SHAP.',
    imageCaption: 'Project artwork',
    art: true,
    stats: [
      { value: '79%', label: 'within-1-tier accuracy (baseline 50%)' },
      { value: '5,589', label: 'prospect records' },
      { value: '−93%', label: 'data errors' },
    ],
    built: [
      'Python pipeline merging 5,589 prospect records from 4 scraped sources, with automated pandera checks that cut data errors 93%.',
      'Benchmarked 7 models, including XGBoost and TensorFlow, across 25 draft classes. The tuned XGBoost reached 79% within-1-tier accuracy against a 50% baseline.',
      'Engineered 63 features, lifting macro-F1 57% on held-out draft classes. SHAP showed age, steals and BMI as the top drivers of career tier.',
    ],
    flow: [
      { title: 'Collect', detail: '4 scraped sources, 5,589 prospects' },
      { title: 'Validate', detail: 'pandera checks, −93% errors' },
      { title: 'Engineer', detail: '63 features' },
      { title: 'Benchmark', detail: '7 models over 25 draft classes' },
      { title: 'Explain', detail: 'SHAP: age, steals, BMI lead' },
    ],
    tech: ['python', 'scikitlearn', 'xgboost', 'tensorflow', 'shap'],
    links: [{ label: 'Code', href: 'https://github.com/aaryavulupala/nba-predictor' }],
  },
];

export interface Role {
  slug: string;
  org: string;
  title: string;
  place: string;
  dates: string;
  logo: ImageMetadata;
  logoAlt: string;
  /** Wide wordmarks need a wider, shorter logo frame. */
  wide?: boolean;
  bullets: string[];
  tech: TechKey[];
  links: Link[];
  photo?: { src: ImageMetadata; alt: string };
}

export const experience: Role[] = [
  {
    slug: 'solar-car',
    org: 'Rutgers Solar Car Team',
    title: 'Software Engineer',
    place: 'New Brunswick, NJ',
    dates: 'Aug 2026 – Present',
    logo: solarLogo,
    logoAlt: 'Rutgers Solar Car Team logo',
    bullets: [
      'Built a free sponsor outreach tool in Python and Google Apps Script, using a local LLM to fit a tight budget and a ranking algorithm that prioritizes likely responders based on past sponsors. It emailed 1.5K+ sponsors and grew funding from $100 to $2,000+.',
      'Built a QR code check-in tool: members scan to update a live attendance dashboard that reports to the team president automatically.',
      'Analyzed 22 telemetry channels (speed, RPM, drag, GPS) and 20 rival-team datasets with NumPy, pandas and Databricks to run physics-based race simulations with anomaly alerts, boosting simulated race speed by 14%.',
    ],
    tech: ['python', 'appsscript', 'numpy', 'pandas', 'databricks'],
    links: [{ label: 'rusolarcar.org', href: 'https://www.rusolarcar.org/' }],
    photo: { src: solarTeam, alt: 'The Rutgers Solar Car team posing beside the solar car outside a building.' },
  },
  {
    slug: 'ipserlab',
    org: 'IpserLab',
    title: 'Software Engineer Intern',
    place: 'Remote',
    dates: 'Jun 2026 – Aug 2026',
    logo: ipserLogo,
    logoAlt: 'IpserLab logo',
    wide: true,
    bullets: [
      'Shipped 15+ full-stack features in Java, React and PostgreSQL for a tech-transfer platform used by 25+ research offices, including REST API endpoints and database changes. Also fixed front-end bugs and added safety checks that block prompt-injection attacks on the AI chatbot.',
      'Led the move from JavaMail to the Brevo API for ~5K monthly emails after diagnosing why Microsoft-hosted inboxes were rejecting messages. Bounce rates fell 60%.',
      'Built notification settings in React on top of Slack, Twilio and Brevo APIs, so users choose email, text or Slack alerts in one place.',
    ],
    tech: ['java', 'react', 'postgresql', 'rest', 'brevo', 'twilio', 'slack'],
    links: [
      { label: 'ipserlab.com', href: 'https://www.ipserlab.com/' },
      { label: 'Tectra Labs', href: 'https://tectralabs.com/', note: 'Research division, where I worked' },
    ],
    photo: {
      src: tectraShot,
      alt: 'Tectra Labs home page with the headline "From lab to launch — fueling innovation, building futures."',
    },
  },
  {
    slug: 'aljons',
    org: 'Aljon’s Grill Pizzeria & Restaurant',
    title: 'Freelance Software Engineer',
    place: 'Plainsboro, NJ',
    dates: 'Jun 2025 – Aug 2025',
    logo: aljonsLogo,
    logoAlt: 'Aljon’s Pizzeria logo',
    wide: true,
    bullets: [
      'Built a Python/SQL pipeline that consolidated 5K+ orders from 5 sales channels (DoorDash, online, phone, in-person) into one PostgreSQL database, cutting weekly reporting from 3 hours to 10 minutes.',
      'Developed a Next.js/React app where 15+ non-technical kitchen staff log stock and waste daily across 50+ ingredients.',
      'Added sales and inventory views that showed the owner which items were over-ordered, cutting food waste by roughly $30 a day.',
    ],
    tech: ['python', 'sql', 'postgresql', 'nextjs', 'react', 'html5', 'css3'],
    links: [
      {
        label: 'aljonspizza.com',
        href: 'https://aljonspizza.com/',
        note: 'Their current site. It is not the one I built.',
      },
    ],
  },
];

export interface Leadership {
  slug: string;
  org: string;
  descriptor?: string;
  title: string;
  place: string;
  dates: string;
  logo: ImageMetadata;
  logoAlt: string;
  bullets: string[];
  tech: TechKey[];
  links: Link[];
}

export const leadership: Leadership[] = [
  {
    slug: 'blueprint',
    org: 'Blueprint',
    title: 'Software Engineering Fellowship Education Director',
    place: 'New Brunswick, NJ',
    dates: 'Sep 2026 – Present',
    logo: blueprintLogo,
    logoAlt: 'Blueprint logo',
    bullets: [
      'Instructed 100+ students, designing a full curriculum on system design, data structures, algorithms, HTTP, REST and runtime complexity.',
      'Wrote hands-on labs in Python, FastAPI and SQL, mentoring fellows on REST API design, login security, database modeling and scalability.',
    ],
    tech: ['python', 'fastapi', 'sql'],
    links: [
      { label: 'rutgersblueprint.com', href: 'https://rutgersblueprint.com/' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/blueprint-rutgers/posts/?feedView=all' },
    ],
  },
  {
    slug: 'iota-nu-delta',
    org: 'Iota Nu Delta Fraternity, Inc.',
    descriptor: 'A multicultural, South Asian interest fraternity',
    title: 'President',
    place: 'New Brunswick, NJ',
    dates: 'Apr 2026 – Present',
    logo: indCrest,
    logoAlt: 'Iota Nu Delta crest',
    bullets: [
      'Led the nation’s largest Iota Nu Delta chapter, driving 33% membership growth and allocating a $25,000 budget across 12 roles twice a year.',
      'Directed weekly chapter meetings for 40 members, setting short- and long-term priorities and delegating work across 12 officer positions.',
    ],
    tech: [],
    links: [],
  },
];

export const education = {
  school: 'Rutgers University',
  degree: 'Computer Science & Data Science',
  logo: rutgersLogo,
  logoAlt: 'Rutgers University logo',
  coursework: [
    'Computer Architecture',
    'Data Structures and Algorithms',
    'Computing in Java',
    'Database Management',
    'Discrete Structures',
    'Linear Algebra',
    'Calculus 1–3',
    'Statistics',
  ],
};

export const skillGroups: { label: string; items: TechKey[] }[] = [
  { label: 'Languages', items: ['java', 'python', 'javascript', 'typescript', 'sql', 'c', 'html5', 'css3'] },
  {
    label: 'Libraries & frameworks',
    items: ['react', 'nextjs', 'nodejs', 'springboot', 'fastapi', 'pandas', 'numpy', 'scikitlearn', 'xgboost', 'tensorflow'],
  },
  { label: 'Cloud & databases', items: ['aws', 'postgresql', 'mysql', 'firebase', 'supabase', 'rest'] },
  { label: 'Tools', items: ['git', 'github', 'databricks', 'cicd', 'postman', 'claudecode', 'codex', 'cursor'] },
];

export const sections = [
  { id: 'work', num: '01', label: 'Work' },
  { id: 'experience', num: '02', label: 'Experience' },
  { id: 'education', num: '03', label: 'Education' },
  { id: 'skills', num: '04', label: 'Skills' },
  { id: 'contact', num: '05', label: 'Contact' },
] as const;
