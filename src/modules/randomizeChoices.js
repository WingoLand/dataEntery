export default (choices, returnNum) => {
  const randomizedChoices = [...choices];
  let newChoices = [];
  while (true) {
    const j = Math.floor(Math.random() * randomizedChoices.length);
    if (newChoices.includes(randomizedChoices[j])) continue;
    newChoices.push(randomizedChoices[j]);
    if (newChoices.length === returnNum) break;
  }
  return newChoices;
};
