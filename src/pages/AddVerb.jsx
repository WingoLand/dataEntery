import { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import config from "../../config";
import randomizeChoices from "../modules/randomizeChoices.js";

const { BASE_URL } = config;

export default function AddVerb() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbWords, setDbWords] = useState([]);
  const [word, setWord] = useState("");
  const [arabicWord, setArabicWord] = useState("");
  const [arabicWords, setArabicWords] = useState([]);

  const [words, setWords] = useState([]);

  const fetchWords = async () => {
    try {
      const response = await fetch(`${BASE_URL}/verb`);
      if (response.ok) {
        const data = await response.json();
        setDbWords(data);
      }
    } catch (error) {
      console.log("Error fetching verbs:", error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    if (!Array.isArray(words) || words.length !== 6) {
      alert("You must add exactly 6 words before submitting.");
      setIsSubmitting(false);
      return;
    }

    const newWords = words.map((word, index) => {
      const randomChoices = randomizeChoices(
        words.filter((_, i) => i !== index),
        3
      );
      if (!Array.isArray(randomChoices)) {
        console.error(
          "randomizeChoices returned an invalid value:",
          randomChoices
        );
      }

      const randomizeArabicChoices = randomizeChoices(
        arabicWords.filter((_, i) => i !== index),
        3
      );
      if (!Array.isArray(randomizeArabicChoices)) {
        console.error(
          "randomizeChoices returned an invalid value:",
          randomizeArabicChoices
        );
      }

      return {
        word: word.trim().toLowerCase(),
        wordInArabic: arabicWords[index].trim().toLowerCase(),
        choices: randomChoices,
        arabicChoices: randomizeArabicChoices,
      };
    });

    try {
      const response = await fetch(`${BASE_URL}/verb/addVerbs`, {
        method: "POST",
        body: JSON.stringify(newWords),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Words uploaded successfully");
        setWords([]);
        setArabicWords([]);
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.log("Error uploading words:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdd = () => {
    if (words.length - 1 >= 5) return alert("Submit these 6 words first !");

    if (!word || !arabicWord) {
      alert("Please fill in all fields before adding.");
      return;
    }
    let wordExists = dbWords.some(
      (dbWord) => dbWord.word.toLowerCase() === word.toLowerCase()
    );
    if (wordExists) {
      alert("This word already exists in this category in database!");
      return;
    }

    wordExists = words.includes(word);
    if (wordExists) {
      alert("This word already added to the list!");
      return;
    }
    setWords([...words, word]);
    setArabicWords([...arabicWords, arabicWord]);

    setArabicWord("");
    setWord("");
  };

  return (
    <Container className="mb-4 mt-4">
      <h2 className="text-center mb-4">Add Word</h2>
      <p className="float-end text-decoration-underline text-warning fs-6 fw-semibold me-1">
        Add 6 verbs then Submit
      </p>
      <Form
        onSubmit={handleSubmit}
        className="bg-light border p-3 rounded shadow-sm"
      >
        <Form.Group className="mb-3">
          <Form.Label>Verb</Form.Label>
          <Form.Control
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <Form.Label>Meaning in Arabic</Form.Label>
          <Form.Control
            type="text"
            value={arabicWord}
            onChange={(e) => setArabicWord(e.target.value)}
          />
        </Form.Group>

        <Row className="justify-content-space-between w-100">
          <Col
            xs={6}
            className="d-flex align-items-center justify-content-center"
          >
            <button
              type="button"
              className="btn btn-outline-primary border-2 w-100"
              onClick={handleAdd}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add
            </button>
          </Col>
          <Col
            xs={6}
            className="d-flex align-items-center justify-content-center"
          >
            <Button
              variant={!isSubmitting ? "success" : "secondary"}
              type="submit"
              disabled={isSubmitting}
              className="w-100"
            >
              {!isSubmitting ? "Submit" : "wait..."}
            </Button>
          </Col>
        </Row>
      </Form>
      {words.length > 0 && (
        <div className="mt-4 overflow-auto" style={{ whiteSpace: "nowrap" }}>
          <h5 className="mb-2">Added Verbs:</h5>
          <div className="d-flex flex-wrap gap-2">
            {words.map((word, index) => (
              <Card
                key={index}
                className="border p-2 rounded shadow-sm me-3"
                style={{ width: "150px" }}
              >
                <Card.Body>
                  <Card.Text className="text-center">
                    {arabicWords[index]}
                  </Card.Text>
                  <Card.Title className="text-center mt-2">{word}</Card.Title>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
