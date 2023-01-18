export default (n: number) => {
  let minutes = 0;
  let seconds = n % 60;

  for (let i = 0; i < n - 59; i = i + 60) {
    minutes++;
  }
  if (seconds < 10) return `${minutes}:0${seconds}`;
  return `${minutes}:${seconds}`;
};
