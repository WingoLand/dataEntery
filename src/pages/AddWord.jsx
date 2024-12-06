import { useEffect, useState } from "react";

import config from "../../config";

const { BASE_URL } = config;

export default function AddWord() {
  const [word, setWord] = useState("");
  const [pic, setPic] = useState("");
  const [choices, setChoices] = useState(["", "", ""]);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/word/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || !pic) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    if (newCategory) {
      formData.append("category", newCategory.trim().toLowerCase());
    } else if (category) {
      formData.append("category", category.trim().toLowerCase());
    } else {
      alert("Please choose a category or enter a new category");
      return;
    }
    formData.append("word", word.trim().toLowerCase());
    formData.append("pic", pic);
    choices.forEach((choice) => {
      formData.append("choices", choice.trim().toLowerCase());
    });

    try {
      const response = await fetch(`${BASE_URL}/word`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("word uploaded successfully");
        fetchCategories();

        setWord("");
        setCategory(newCategory ? newCategory : category);
        setNewCategory("");
        return;
      }
      await response.json().then((data) => {
        alert(data.message);
      });
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>Add Word</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex" }}>
          <div style={styles.field}>
            <label>
              Category:
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label
            style={{ marginRight: 10, marginLeft: 10, fontWeight: "bolder" }}
          >
            {" "}
            or{" "}
          </label>
          <div style={styles.field}>
            <label>
              New Category:
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div style={styles.field}>
          <label>
            Word:
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </label>
        </div>
        <div style={styles.field}>
          <label>
            Picture:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPic(e.target.files[0])}
            />
          </label>
        </div>
        {[...Array(3)].map((_, index) => (
          <div key={index} style={styles.field}>
            <label>
              Choice {index + 1}:
              <input
                type="text"
                value={choices[index] || ""}
                onChange={(e) => {
                  const newChoices = [...choices];
                  newChoices[index] = e.target.value;
                  setChoices(newChoices);
                }}
              />
            </label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

const styles = {
  field: {
    marginBottom: 10,
  },
};
