import config from "../../config";

const { BASE_URL } = config;

export const fetchVerbs = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/verb/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page }),
    });
    if (!response.ok) throw new Error("Failed to load words.");
    const data = await response.json();

    if (!response.ok) return alert(data.message);

    return data;
  } catch (err) {
    console.log(err.message || "An unexpected error occurred.");
  }
};
