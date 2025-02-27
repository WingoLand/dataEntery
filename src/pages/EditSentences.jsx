import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Card,
  Modal,
} from "react-bootstrap";
import config from "../../config";

const { BASE_URL } = config;

export default function EditSentences() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sentences, setSentences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSentence, setSelectedSentence] = useState(null);

  useEffect(() => {
    fetchSentences();
  }, []);

  const fetchSentences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/sentence`);
      const data = await response.json();
      setSentences(data);
    } catch (error) {
      setError("Error fetching sentences");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (sentence) => {
    setSelectedSentence({ ...sentence });
    setShowModal(true);
  };

  const handleInputChange = (e, field) => {
    setSelectedSentence({ ...selectedSentence, [field]: e.target.value });
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = [...selectedSentence.choices];
    newChoices[index] = value;
    setSelectedSentence({ ...selectedSentence, choices: newChoices });
  };

  const handleArabicChange = (index, value) => {
    const newArabicSents = [...selectedSentence.arabicSents];
    newArabicSents[index] = value;
    setSelectedSentence({ ...selectedSentence, arabicSents: newArabicSents });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sentence/updateSentence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedSentence),
      });
      const data = await response.json();
      if (!response.ok) alert(data.message || "Update failed");
      alert("Word updated successfully!");
      setShowModal(false);
      setLoading(true);
      fetchSentences();
    } catch (error) {
      console.error("Error updating sentence:", error);
    }
  };

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-center mb-4">Edit Sentence</h2>
      <Form className="mb-4 w-50 mx-auto">
        <Form.Control
          type="text"
          placeholder="Search sentences..."
          className="border-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </Form>
      {loading ? (
        <Spinner animation="border" className="mt-3" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : sentences.length === 0 ? (
        <Alert variant="info">No words available.</Alert>
      ) : (
        <Row className="justify-content-center g-3">
          {sentences
            .filter((s) =>
              (s.sent1 + " " + s.choices[s.correct] + " " + s.sent2)
                .toLowerCase()
                .includes(searchTerm)
            )
            .map((s) => (
              <Col xs={6} sm={4} md={3} lg={2} key={s._id}>
                <Card
                  className="shadow-sm border-0 rounded text-center py-3 bg-info-subtle"
                  style={{ transition: "transform 0.2s", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onClick={() => handleEditClick(s)}
                >
                  <Card.Body>
                    <h4 className="fw-bold text-dark">
                      {s.sent1 + " " + s.choices[s.correct] + " " + s.sent2}
                    </h4>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      )}
      {selectedSentence && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Sentence</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Sentence 1</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedSentence.sent1}
                  onChange={(e) => handleInputChange(e, "sent1")}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Sentence 2</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedSentence.sent2}
                  onChange={(e) => handleInputChange(e, "sent2")}
                />
              </Form.Group>
              <h5 className="mt-3">Choices</h5>
              {selectedSentence.choices.map((choice, index) => (
                <Form.Group key={index}>
                  <Row>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        value={choice}
                        onChange={(e) =>
                          handleChoiceChange(index, e.target.value)
                        }
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Check
                        type="radio"
                        name="correctChoice"
                        checked={selectedSentence.correct === index}
                        onChange={() =>
                          setSelectedSentence({
                            ...selectedSentence,
                            correct: index,
                          })
                        }
                      />
                    </Col>
                  </Row>
                </Form.Group>
              ))}
              <h5 className="mt-3">Arabic Sentences</h5>
              {selectedSentence.arabicSents.map((sentence, index) => (
                <Form.Group key={index}>
                  <Row>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        value={sentence}
                        onChange={(e) =>
                          handleArabicChange(index, e.target.value)
                        }
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Check
                        type="radio"
                        name="correctArabicSent"
                        checked={selectedSentence.correctArabicSent === index}
                        onChange={() =>
                          setSelectedSentence({
                            ...selectedSentence,
                            correctArabicSent: index,
                          })
                        }
                      />
                    </Col>
                  </Row>
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button variant="warning" className="w-25" onClick={handleSubmit}>
              update
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}
