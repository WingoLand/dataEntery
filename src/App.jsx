import { useState } from "react";

import AddAlphabet from "./pages/AddAlphabet";
import AddWord from "./pages/AddWord";
import AddSentence from "./pages/AddSentence";
import config from "../config";
// import ImageDisplay from "./pages/ImageDisplay";

const { BASE_URL } = config;

function App() {
  const [page, setPage] = useState("addAlphabet");
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          margin: "10px",
        }}
      >
        <button
          style={{ marginRight: 10 }}
          onClick={() => setPage("addAlphabet")}
        >
          Add Alphabet
        </button>
        <button style={{ marginRight: 10 }} onClick={() => setPage("addWords")}>
          Add Words
        </button>
        <button
          style={{ marginRight: 10 }}
          onClick={() => setPage("addSentence")}
        >
          Add Sentence
        </button>
      </div>
      {page === "addAlphabet" && <AddAlphabet />}
      {page === "addWords" && <AddWord />}
      {page === "addSentence" && <AddSentence />}
      <div
        style={{ marginTop: 100, display: "flex", justifyContent: "center" }}
      >
        <button
          style={{
            backgroundColor: "pink",
            borderColor: "red",
            width: 300,
            height: 50,
            fontSize: 20,
            fontWeight: "bold",
          }}
          onClick={async () => {
            const confirmDelete = window.confirm(
              "Are you sure you want to delete the database?"
            );

            if (confirmDelete) {
              try {
                await fetch(`${BASE_URL}/deleteDB`, {
                  method: "DELETE",
                })
                  .then((res) => res.json())
                  .then((data) => {
                    alert(data.message);
                  });
              } catch (error) {
                alert("Error deleting database: " + error.message);
              }
            }
          }}
        >
          Delete Database
        </button>
      </div>
      {/* <ImageDisplay /> */}
    </>
  );
}

export default App;
