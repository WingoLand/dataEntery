import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import config from "../../config";

const { BASE_URL } = config;

export default function AddSentence() {
  const [sent1, setSent1] = useState("");
  const [sent2, setSent2] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctChoice, setCorrectChoice] = useState(null);
  const [arabicSentences, setArabicSentences] = useState(["", "", ""]);
  const [correctArabicSent, setCorrectArabicSent] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      sent1,
      sent2,
      choices,
      correct: correctChoice,
      arabicSents: arabicSentences,
      correctArabicSent,
    };
    fetch(`${BASE_URL}/sentence/addSentence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        setSent1("");
        setSent2("");
        setChoices(["", "", "", ""]);
        setCorrectChoice(null);
        setArabicSentences(["", "", ""]);
        setCorrectArabicSent(null);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-center mb-4">Add Sentence</h2>
      <Form
        onSubmit={(e) => handleSubmit(e)}
        className="p-3 border rounded shadow-sm bg-light"
      >
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Sentence 1</Form.Label>
              <Form.Control
                type="text"
                value={sent1}
                onChange={(e) => setSent1(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Sentence 2</Form.Label>
              <Form.Control
                type="text"
                value={sent2}
                onChange={(e) => setSent2(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <h4 className="mt-4">Choices</h4>
        {choices.map((choice, index) => (
          <Form.Group key={index}>
            <Form.Label>Choice {index + 1}</Form.Label>
            <Row>
              <Col md={10}>
                <Form.Control
                  type="text"
                  value={choice}
                  onChange={(e) => {
                    const newChoices = [...choices];
                    newChoices[index] = e.target.value;
                    setChoices(newChoices);
                  }}
                />
              </Col>
              <Col md={2} className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  name="correctChoice"
                  onChange={() => setCorrectChoice(index)}
                  checked={correctChoice === index}
                />
              </Col>
            </Row>
          </Form.Group>
        ))}
        <h4 className="mt-4">Arabic Sentences</h4>
        {arabicSentences.map((sentence, index) => (
          <Form.Group key={index}>
            <Form.Label>Arabic Sentence {index + 1}</Form.Label>
            <Row>
              <Col md={10}>
                <Form.Control
                  type="text"
                  value={sentence}
                  onChange={(e) => {
                    const newArabicSentences = [...arabicSentences];
                    newArabicSentences[index] = e.target.value;
                    setArabicSentences(newArabicSentences);
                  }}
                />
              </Col>
              <Col md={2} className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  name="correctArabicSent"
                  onChange={() => setCorrectArabicSent(index)}
                  checked={correctArabicSent === index}
                />
              </Col>
            </Row>
          </Form.Group>
        ))}
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={6} className="d-flex justify-content-center">
            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
