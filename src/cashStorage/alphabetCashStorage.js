const setAlphabetCash = (letter, data) => {
  try {
    localStorage.setItem(`${letter}`, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};
//////////////////////////////////////////////////////////////////////?
const getAlphabetCash = (letter) => {
  try {
    const data = JSON.parse(localStorage.getItem(`${letter}`));
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { setAlphabetCash, getAlphabetCash };
