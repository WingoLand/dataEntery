import { useState } from "react";

import config from "../../config";

const { BASE_URL } = config;

export default function AddWord() {
  const [word, setWord] = useState("");
  const [pic, setPic] = useState("");

  const capitalizeFirstLetter = (string) => {
    if (!string) return string; // Handle empty strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || !pic) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("word", capitalizeFirstLetter(word.trim()));
    formData.append("pic", pic);

    try {
      const response = await fetch(`${BASE_URL}/word`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("word uploaded successfully");
        setWord("");
        return console.log("File uploaded successfully");
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
            <input type="file" onChange={(e) => setPic(e.target.files[0])} />
          </label>
        </div>
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
