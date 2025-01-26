export const generateMemberNumber = () => {
  // Generate a random 6-digit member number
  return Math.floor(100000 + Math.random() * 900000).toString();
};
