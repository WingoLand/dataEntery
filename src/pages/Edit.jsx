import { useState } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";

import HomeButton from "../components/HomeButton";
import EditAlphabet from "./EditAlphabet";
import EditWords from "./EditWords";
import EditSentence from "./EditSentences";
import EditVerbs from "./EditVerbs";

export default function Edit() {
  const [page, setPage] = useState("editAlphabet");
  return (
    <Container className="mt-4">
      {/* Floating Home Button */}
      <HomeButton />

      {/* Navigation Buttons */}
      <ButtonGroup className="d-flex flex-wrap justify-content-center gap-2">
        <Button
          variant={page === "editAlphabet" ? "primary" : "outline-primary"}
          onClick={() => setPage("editAlphabet")}
        >
          Edit Alphabet
        </Button>
        <Button
          variant={page === "editWords" ? "secondary" : "outline-secondary"}
          onClick={() => setPage("editWords")}
        >
          Edit Words
        </Button>
        <Button
          variant={page === "editVerbs" ? "warning" : "outline-warning"}
          onClick={() => setPage("editVerbs")}
        >
          Edit Verbs
        </Button>
        <Button
          variant={page === "editSentence" ? "success" : "outline-success"}
          onClick={() => setPage("editSentence")}
        >
          Edit Sentences
        </Button>
      </ButtonGroup>

      {/* Content Display */}
      <div className="mt-4">
        {page === "editAlphabet" && <EditAlphabet />}
        {page === "editWords" && <EditWords />}
        {page === "editVerbs" && <EditVerbs />}
        {page === "editSentence" && <EditSentence />}
      </div>
    </Container>
  );
}
