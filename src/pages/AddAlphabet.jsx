import { useState } from "react";

import config from "../../config";

const { BASE_URL } = config;

export default function AddAlphabet() {
  const [letter, setLetter] = useState("");
  const [word, setWord] = useState("");
  const [capPic, setCapPic] = useState(null);
  const [smallPic, setSmallPic] = useState(null);
  const [wordPic, setWordPic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const capitalizeFirstLetter = (string) => {
      if (!string) return string; // Handle empty strings
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if (!letter || !word || !capPic || !smallPic || !wordPic) {
      alert("Please fill in all fields");
      return;
    }
    const formData = new FormData();
    formData.append("capital", letter.toUpperCase());
    formData.append("small", letter.toLowerCase());
    formData.append("word", capitalizeFirstLetter(word));
    formData.append("capPic", capPic);
    formData.append("smallPic", smallPic);
    formData.append("wordPic", wordPic);

    try {
      const response = await fetch(`${BASE_URL}/alphabet`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("File uploaded successfully");
        setLetter("");
        setWord("");
        setCapPic(null);
        setSmallPic(null);
        setWordPic(null);
        return console.log("File uploaded successfully:", response.data);
      }
      await response.json().then((data) => {
        alert(data.message);
      });
    } catch (error) {
      console.error("Error uploading file:", error);
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
      <div>Add Alphabet</div>
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>
            letter:
            <input
              type="text"
              value={letter}
              onChange={(e) => setLetter(e.target.value.trim())}
            />
          </label>
        </div>
        <div style={styles.field}>
          <label>
            Word:
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value.trim())}
            />
          </label>
        </div>
        <div style={styles.field}>
          <label>
            Capital Picture:
            <input type="file" onChange={(e) => setCapPic(e.target.files[0])} />
          </label>
        </div>
        <div style={styles.field}>
          <label>
            Small Picture:
            <input
              type="file"
              onChange={(e) => setSmallPic(e.target.files[0])}
            />
          </label>
        </div>
        <div style={styles.field}>
          <label>
            Word Picture:
            <input
              type="file"
              onChange={(e) => setWordPic(e.target.files[0])}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

const styles = {
  field: {
    margin: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
};
