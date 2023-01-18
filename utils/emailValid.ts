export default (email: string): boolean => {
  if (!email.includes("@") || !email.includes(".") || email.length < 4)
    return false;
  return true;
};
