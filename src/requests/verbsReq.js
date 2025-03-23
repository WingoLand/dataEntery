import config from "../../config";

const { BASE_URL } = config;

export const getVerbsLevels = async (category) => {
  const res = await fetch(`${BASE_URL}/verb/levels/category`, {
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
export const fetchVerbs = async (category, page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/verb/category`, {
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
    const response = await fetch(`${BASE_URL}/verb/categories`);
    const data = await response.json();
    if (!response.ok) return alert(data.message);
    return data;
  } catch (err) {
    console.log(err.message || "An unexpected error occurred.");
  }
};
