// server/seed.js - Populate MongoDB with demo data
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User.js');
const CandidateProfile = require('./models/CandidateProfile.js');
const ReferrerProfile = require('./models/ReferrerProfile.js');
const TrustScore = require('./models/TrustScore.js');
const { generateAlias } = require('./utils/generateAlias.js');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await CandidateProfile.deleteMany({});
    await ReferrerProfile.deleteMany({});
    await TrustScore.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Candidate Data
    const candidateData = [
      {
        email: 'alice@example.com',
        fullName: 'Alice Johnson',
        headline: 'Full-stack Software Engineer with 5 years experience',
        bio: 'Passionate about building scalable web applications. Experienced in React, Node.js, and MongoDB.',
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
        targetRoles: ['Software Engineer', 'Senior Developer', 'Tech Lead'],
        targetCompanies: ['Google', 'Meta', 'Amazon'],
      },
      {
        email: 'bob@example.com',
        fullName: 'Bob Smith',
        headline: 'Product Manager with startup experience',
        bio: 'Data-driven PM with experience at early-stage startups. Passionate about user-centered design.',
        skills: ['Product Strategy', 'Analytics', 'SQL', 'Python'],
        targetRoles: ['Product Manager', 'Senior PM'],
        targetCompanies: ['Netflix', 'Spotify', 'Stripe'],
      },
      {
        email: 'carol@example.com',
        fullName: 'Carol White',
        headline: 'Backend Engineer specializing in distributed systems',
        bio: 'Expert in building high-scale backend systems. Published author on microservices.',
        skills: ['Go', 'Kubernetes', 'Docker', 'Postgres', 'Redis'],
        targetRoles: ['Infrastructure Engineer', 'Backend Engineer'],
        targetCompanies: ['Google', 'Stripe', 'Uber'],
      },
      {
        email: 'david@example.com',
        fullName: 'David Lee',
        headline: 'Data Scientist | Machine Learning Engineer',
        bio: 'ML specialist with 3 years of production experience. Strong in Python and PyTorch.',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Statistics', 'SQL'],
        targetRoles: ['Data Scientist', 'ML Engineer'],
        targetCompanies: ['OpenAI', 'DeepMind', 'Anthropic'],
      },
      {
        email: 'emma@example.com',
        fullName: 'Emma Wilson',
        headline: 'Frontend Developer | React Specialist',
        bio: 'UI/UX focused developer with expertise in React and modern web standards.',
        skills: ['React', 'TypeScript', 'CSS', 'Next.js', 'Web Performance'],
        targetRoles: ['Frontend Engineer', 'Senior Frontend Developer'],
        targetCompanies: ['Airbnb', 'Twitter', 'Figma'],
      },
      {
        email: 'frank@example.com',
        fullName: 'Frank Brown',
        headline: 'DevOps Engineer | Infrastructure Expert',
        bio: 'Passionate about CI/CD, cloud infrastructure, and automation.',
        skills: ['AWS', 'Terraform', 'Jenkins', 'Docker', 'GitHub Actions'],
        targetRoles: ['DevOps Engineer', 'Site Reliability Engineer'],
        targetCompanies: ['Amazon', 'Microsoft', 'GitHub'],
      },
      {
        email: 'grace@example.com',
        fullName: 'Grace Martinez',
        headline: 'QA Engineer | Automation Expert',
        bio: 'Quality assurance specialist with strong automation testing background.',
        skills: ['Selenium', 'Cypress', 'Jest', 'Python', 'Test Automation'],
        targetRoles: ['QA Engineer', 'Test Automation Engineer'],
        targetCompanies: ['Microsoft', 'Facebook', 'Zoom'],
      },
      {
        email: 'henry@example.com',
        fullName: 'Henry Chen',
        headline: 'Mobile Developer | iOS & Android',
        bio: 'Cross-platform mobile development with 4 years experience.',
        skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Firebase'],
        targetRoles: ['Mobile Developer', 'iOS Engineer', 'Android Engineer'],
        targetCompanies: ['Apple', 'Google', 'TikTok'],
      },
      {
        email: 'iris@example.com',
        fullName: 'Iris Park',
        headline: 'Security Engineer | InfoSec Specialist',
        bio: 'Information security professional focused on application security.',
        skills: ['Penetration Testing', 'OWASP', 'SSL/TLS', 'IAM', 'Cryptography'],
        targetRoles: ['Security Engineer', 'Security Architect'],
        targetCompanies: ['Google', 'Microsoft', 'Apple'],
      },
      {
        email: 'jack@example.com',
        fullName: 'Jack Davis',
        headline: 'Fullstack Developer | Startup Founder',
        bio: 'Experienced fullstack developer who loves solving complex problems.',
        skills: ['JavaScript', 'Python', 'Cloud', 'AWS', 'Postgres'],
        targetRoles: ['Fullstack Engineer', 'Tech Lead'],
        targetCompanies: ['Y Combinator Companies', 'Sequoia Portfolio', 'Accel'],
      },
    ];

    // Referrer Data
    const referrerData = [
      {
        email: 'referrer1@google.com',
        fullName: 'Rachel Martinez',
        company: 'Google',
        maskedCompany: 'Tech Giant A',
        role: 'Senior Software Engineer',
        dept: 'Search',
        location: 'Mountain View, CA',
      },
      {
        email: 'referrer2@meta.com',
        fullName: 'Michael Chen',
        company: 'Meta',
        maskedCompany: 'Social Network Corp',
        role: 'Product Manager',
        dept: 'Monetization',
        location: 'Menlo Park, CA',
      },
      {
        email: 'referrer3@amazon.com',
        fullName: 'Sarah Johnson',
        company: 'Amazon',
        maskedCompany: 'Retail Tech Co',
        role: 'Engineering Manager',
        dept: 'AWS',
        location: 'Seattle, WA',
      },
      {
        email: 'referrer4@stripe.com',
        fullName: 'James Wilson',
        company: 'Stripe',
        maskedCompany: 'Payments Company',
        role: 'Senior Backend Engineer',
        dept: 'Platform',
        location: 'San Francisco, CA',
      },
      {
        email: 'referrer5@netflix.com',
        fullName: 'Lisa Anderson',
        company: 'Netflix',
        maskedCompany: 'Streaming Platform',
        role: 'Data Scientist',
        dept: 'Recommendation',
        location: 'Los Gatos, CA',
      },
      {
        email: 'referrer6@airbnb.com',
        fullName: 'Kevin Brown',
        company: 'Airbnb',
        maskedCompany: 'Travel Tech Inc',
        role: 'Frontend Engineer',
        dept: 'Web Platform',
        location: 'San Francisco, CA',
      },
      {
        email: 'referrer7@uber.com',
        fullName: 'Jennifer Lee',
        company: 'Uber',
        maskedCompany: 'Mobility Services',
        role: 'Infrastructure Engineer',
        dept: 'Marketplace',
        location: 'San Francisco, CA',
      },
      {
        email: 'referrer8@microsoft.com',
        fullName: 'Robert Taylor',
        company: 'Microsoft',
        maskedCompany: 'Software Giant',
        role: 'Senior Product Manager',
        dept: 'Azure',
        location: 'Redmond, WA',
      },
      {
        email: 'referrer9@apple.com',
        fullName: 'Emma Garcia',
        company: 'Apple',
        maskedCompany: 'Hardware Corp',
        role: 'Security Engineer',
        dept: 'OS Security',
        location: 'Cupertino, CA',
      },
      {
        email: 'referrer10@github.com',
        fullName: 'David Rodriguez',
        company: 'GitHub',
        maskedCompany: 'Code Platform',
        role: 'Engineering Manager',
        dept: 'DevEx',
        location: 'San Francisco, CA',
      },
    ];

    // Create candidates
    for (const cData of candidateData) {
      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash('password123', salt);
      const alias = generateAlias();

      const user = await User.create({
        email: cData.email,
        passwordHash,
        role: 'candidate',
        alias,
      });

      await CandidateProfile.create({
        userId: user._id,
        fullName: cData.fullName,
        headline: cData.headline,
        bio: cData.bio,
        skills: cData.skills,
        targetRoles: cData.targetRoles,
        targetCompanies: cData.targetCompanies,
        qualityScore: 75 + Math.floor(Math.random() * 25),
      });

      await TrustScore.create({
        userId: user._id,
        totalScore: 50 + Math.floor(Math.random() * 100),
      });

      console.log(`✅ Created candidate: ${cData.fullName}`);
    }

    // Create referrers
    for (const rData of referrerData) {
      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash('password123', salt);
      const alias = generateAlias();

      const user = await User.create({
        email: rData.email,
        passwordHash,
        role: 'referrer',
        alias,
      });

      const referralScore = 100 + Math.floor(Math.random() * 500);
      let tier = 'bronze';
      if (referralScore >= 600) tier = 'platinum';
      else if (referralScore >= 300) tier = 'gold';
      else if (referralScore >= 100) tier = 'silver';

      await ReferrerProfile.create({
        userId: user._id,
        fullName: rData.fullName,
        company: rData.company,
        maskedCompany: rData.maskedCompany,
        role: rData.role,
        department: rData.dept,
        location: rData.location,
        referralScore,
        tier,
        totalReferrals: Math.floor(Math.random() * 20),
        successfulHires: Math.floor(Math.random() * 10),
        responseRate: 60 + Math.floor(Math.random() * 40),
      });

      await TrustScore.create({
        userId: user._id,
        totalScore: referralScore,
      });

      console.log(`✅ Created referrer: ${rData.fullName} (${rData.company})`);
    }

    console.log('\n🌟 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('  - 10 candidate profiles created');
    console.log('  - 10 referrer profiles created');
    console.log('  - All users can login with password: password123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedDatabase();
