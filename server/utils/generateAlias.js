// server/utils/generateAlias.js - Pseudonymous name generator
const adjectives = ['Swift', 'Bright', 'Noble', 'Keen', 'Bold', 'Wise', 'Quick', 'Smart', 'Bright', 'Strong'];
const nouns = ['Eagle', 'Phoenix', 'Tiger', 'Wolf', 'Lion', 'Falcon', 'Raven', 'Fox', 'Bear', 'Hawk'];

const generateAlias = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adjective}${noun}${number}`;
};

module.exports = { generateAlias };
