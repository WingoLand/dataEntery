const setVerbsCash = (id, words) => {
  try {
    localStorage.setItem(`${id}`, JSON.stringify(words));
  } catch (error) {
    console.log(error);
  }
};
////////////////////////////////////////////////////////////////////////?
const getVerbsCash = (id) => {
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

export { setVerbsCash, getVerbsCash };
