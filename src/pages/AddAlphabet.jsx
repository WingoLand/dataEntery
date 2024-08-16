import { useState } from "react";

export default function AddAlphabet() {
  const [capital, setCapital] = useState("");
  const [small, setSmall] = useState("");
  const [word, setWord] = useState("");
  const [capPic, setCapPic] = useState(null);
  const [smallPic, setSmallPic] = useState(null);
  const [wordPic, setWordPic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!capital || !small || !word || !capPic || !smallPic || !wordPic) {
      alert("Please fill in all fields");
      return;
    }
    const formData = new FormData();
    formData.append("capital", capital);
    formData.append("small", small);
    formData.append("word", word);
    formData.append("capPic", capPic);
    formData.append("smallPic", smallPic);
    formData.append("wordPic", wordPic);

    try {
      const response = await fetch("http://localhost:3000/alphabet", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setCapital("");
        setSmall("");
        setWord("");
        setCapPic(null);
        setSmallPic(null);
        setWordPic(null);
        alert("File uploaded successfully");
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
            Capital:
            <input
              type="text"
              value={capital}
              onChange={(e) => setCapital(e.target.value.trim())}
            />
          </label>
        </div>
        <div style={styles.field}>
          <label>
            Small:
            <input
              type="text"
              value={small}
              onChange={(e) => setSmall(e.target.value.trim())}
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
