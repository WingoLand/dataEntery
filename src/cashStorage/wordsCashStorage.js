const setWordsCash = (id, words) => {
  try {
    localStorage.setItem(`${id}`, JSON.stringify(words));
  } catch (error) {
    console.log(error);
  }
};
////////////////////////////////////////////////////////////////////////?
const getWordsCash = (id) => {
  try {
    const data = JSON.parse(localStorage.getItem(`${id}`));

    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { setWordsCash, getWordsCash };
