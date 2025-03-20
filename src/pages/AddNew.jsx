import { useState } from "react";
import { Container, Button, ButtonGroup } from "react-bootstrap";
import HomeButton from "../components/HomeButton";

import AddAlphabet from "./AddAlphabet";
import AddWord from "./AddWord";
import AddSentence from "./AddSentence";
import config from "../../config";
import AddVerb from "./AddVerb";

const { BASE_URL } = config;

export default function AddNew() {
  const [page, setPage] = useState("addAlphabet");

  const handleDeleteDB = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the database?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${BASE_URL}/deleteDB`, {
          method: "DELETE",
        });
        const data = await response.json();
        alert(data.message);
      } catch (error) {
        alert("Error deleting database: " + error.message);
      }
    }
  };

  return (
    <Container>
      {/* Floating Home Button */}
      <HomeButton />

      {/* Navigation Buttons */}
      <ButtonGroup className="d-flex flex-wrap justify-content-center gap-2">
        <Button
          variant={page === "addAlphabet" ? "primary" : "outline-primary"}
          onClick={() => setPage("addAlphabet")}
        >
          Add Alphabet
        </Button>
        <Button
          variant={page === "addWords" ? "secondary" : "outline-secondary"}
          onClick={() => setPage("addWords")}
        >
          Add Words
        </Button>
        <Button
          variant={page === "addVerbs" ? "warning" : "outline-warning"}
          onClick={() => setPage("addVerbs")}
        >
          Add Verbs
        </Button>
        <Button
          variant={page === "addSentence" ? "success" : "outline-success"}
          onClick={() => setPage("addSentence")}
        >
          Add Sentences
        </Button>
      </ButtonGroup>

      {/* Content Display */}
      <div className="mt-4">
        {page === "addAlphabet" && <AddAlphabet />}
        {page === "addWords" && <AddWord />}
        {page === "addVerbs" && <AddVerb />}
        {page === "addSentence" && <AddSentence />}
      </div>

      {/* Delete Database Button */}
      {/* <Button
        variant="danger"
        size="lg"
        className="shadow mt-4"
        onClick={handleDeleteDB}
      >
        🗑 Delete Database
      </Button> */}
    </Container>
  );
}
