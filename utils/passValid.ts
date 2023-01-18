export default (password: string): boolean => {
  if (password.length < 6) return false;
  return true;
};
