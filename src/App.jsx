import { useState } from "react";

import AddAlphabet from "./pages/AddAlphabet";
import AddWord from "./pages/AddWord";

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
      </div>
      {page === "addAlphabet" && <AddAlphabet />}
      {page === "addWords" && <AddWord />}
    </>
  );
}

export default App;
