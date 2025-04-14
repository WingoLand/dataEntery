import config from "../../config";

const { BASE_URL } = config;

export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sentence/categories`);

    const data = await response.json();
    if (!response.ok) return alert(data.message);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};
