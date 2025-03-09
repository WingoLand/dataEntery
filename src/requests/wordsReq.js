import config from "../../config";

const { BASE_URL } = config;

export const getWordsLevels = async (category) => {
  const res = await fetch(`${BASE_URL}/word/levels/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category }),
  });
  const data = await res.json();
  if (!res.ok) {
    alert("error:", data.message);
    throw new Error("Failed to fetch words levels");
  }
  return data;
};
////////////////////////////////////////////////////////////////?
export const fetchWords = async (category, page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/word/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, page }),
    });
    if (!response.ok) throw new Error("Failed to load words.");
    const data = await response.json();

    if (!response.ok) return alert(data.message);

    return data;
  } catch (err) {
    console.log(err.message || "An unexpected error occurred.");
  }
};
////////////////////////////////////////////////////////////////?
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/word/categories`);
    const data = await response.json();
    if (!response.ok) return alert(data.message);
    return data;
  } catch (err) {
    console.log(err.message || "An unexpected error occurred.");
  }
};
