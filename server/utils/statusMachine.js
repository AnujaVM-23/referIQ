// server/utils/statusMachine.js - Referral FSM transitions
const validTransitions = {
  pending: ['accepted', 'declined'],
  accepted: ['referred', 'closed'],
  declined: [],
  referred: ['interviewing', 'closed'],
  interviewing: ['hired', 'closed'],
  hired: [],
  closed: [],
};

const canTransition = (from, to) => {
  return validTransitions[from] && validTransitions[from].includes(to);
};

const getNextStates = (currentState) => {
  return validTransitions[currentState] || [];
};

module.exports = {
  validTransitions,
  canTransition,
  getNextStates,
};
