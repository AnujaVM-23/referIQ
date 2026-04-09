// client/src/utils/maskProfile.js
export const maskEmail = (email) => {
  if (!email) return 'N/A';
  const [name, domain] = email.split('@');
  return `${name.charAt(0)}***@${domain}`;
};

export const maskPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  return phone.slice(-4).padStart(phone.length, '*');
};

export const maskCompanyName = (company) => {
  if (!company) return 'N/A';
  return company.split(' ')[0] + ' ' + '▓'.repeat(Math.floor(company.length / 2));
};

export const maskFullName = (name) => {
  if (!name) return 'Anonymous';
  const parts = name.split(' ');
  return parts[0] + ' ' + parts[parts.length - 1][0] + '.';
};
