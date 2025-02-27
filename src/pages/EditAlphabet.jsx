import { useEffect, useState } from "react";
import config from "../../config";
import {
  Button,
  Container,
  Row,
  Col,
  Modal,
  Spinner,
  Form,
  Image,
} from "react-bootstrap";

const { BASE_URL } = config;

export default function EditAlphabet() {
  const [alphabet, setAlphabet] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditWord, setIsEditWord] = useState(false);
  const [word, setWord] = useState("");

  const [wordPic, setWordPic] = useState(null);
  const [capPic, setCapPic] = useState(null);
  const [smallPic, setSmallPic] = useState(null);

  const [previewWordPic, setPreviewWordPic] = useState(null);
  const [previewCapPic, setPreviewCapPic] = useState(null);
  const [previewSmallPic, setPreviewSmallPic] = useState(null);

  const fetchAlphabet = async () => {
    try {
      const response = await fetch(`${BASE_URL}/alphabet`);
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message);
      } else {
        setAlphabet(data);
      }
    } catch (error) {
      setMessage("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlphabet();
  }, []);

  const handleUpdate = async () => {
    if (!selectedLetter) return;

    const formData = new FormData();
    formData.append("capital", selectedLetter.capital);
    formData.append("small", selectedLetter.small);
    formData.append("word", word);

    if (wordPic) formData.append("wordPic", wordPic);
    if (capPic) formData.append("capPic", capPic);
    if (smallPic) formData.append("smallPic", smallPic);

    try {
      const response = await fetch(`${BASE_URL}/alphabet/updateLetter`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      alert("Letter updated successfully!");
      setShowModal(false);
      fetchAlphabet();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (letter) => {
    setSelectedLetter(letter);
    setWord(letter.word || "");

    // Load existing images from database if available
    setPreviewWordPic(
      letter.wordPic
        ? `data:${letter.wordPic.contentType};base64,${letter.wordPic.data}`
        : null
    );
    setPreviewCapPic(
      letter.capPic
        ? `data:${letter.capPic.contentType};base64,${letter.capPic.data}`
        : null
    );
    setPreviewSmallPic(
      letter.smallPic
        ? `data:${letter.smallPic.contentType};base64,${letter.smallPic.data}`
        : null
    );

    setWordPic(null);
    setCapPic(null);
    setSmallPic(null);

    setIsEditWord(false);
    setShowModal(true);
  };

  const handleFileChange = (e, setPic, setPreviewPic) => {
    const file = e.target.files[0];
    if (file) {
      setPic(file); // Store the file for submission
      setPreviewPic(URL.createObjectURL(file)); // Preview the new image
    }
  };

  return (
    <Container className="mt-4 text-center">
      <h2 className="mb-4 fw-bold">Edit Alphabet</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : message ? (
        <p className="text-danger">{message}</p>
      ) : (
        <Row className="justify-content-center g-2">
          {alphabet.map((item) => (
            <Col xs={4} sm={3} md={2} lg={1} key={item.id}>
              <Button
                variant="primary"
                className="w-100 shadow-sm rounded-pill"
                onClick={() => handleEditClick(item)}
              >
                {item.capital}
              </Button>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Letter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLetter && (
            <>
              <Form.Group>
                <Form.Label className="fw-semibold">Word</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="text"
                    disabled={!isEditWord}
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                  />
                  <i
                    className={`bi ${
                      isEditWord
                        ? "bi-check-circle text-success"
                        : "bi-pencil-square text-primary"
                    } fs-4`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsEditWord(!isEditWord)}
                  ></i>
                </div>
              </Form.Group>

              {[
                {
                  label: "Word Picture",
                  previewPic: previewWordPic,
                  setPic: setWordPic,
                  setPreviewPic: setPreviewWordPic,
                },
                {
                  label: "Capital Letter Picture",
                  previewPic: previewCapPic,
                  setPic: setCapPic,
                  setPreviewPic: setPreviewCapPic,
                },
                {
                  label: "Small Letter Picture",
                  previewPic: previewSmallPic,
                  setPic: setSmallPic,
                  setPreviewPic: setPreviewSmallPic,
                },
              ].map(({ label, previewPic, setPic, setPreviewPic }, index) => (
                <div
                  key={index}
                  className="mt-3 d-flex align-items-center gap-3 flex-wrap"
                >
                  {previewPic ? (
                    <>
                      {" "}
                      <Image
                        src={previewPic}
                        className="img-thumbnail rounded-circle shadow-sm border border-secondary"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <label className="text-muted">{label}</label>
                    </>
                  ) : (
                    <div
                      className="img-thumbnail rounded-circle d-flex align-items-center justify-content-center bg-light"
                      style={{
                        width: "100px",
                        height: "100px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <small className="text-muted">No image</small>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    onChange={(e) => handleFileChange(e, setPic, setPreviewPic)}
                  />
                </div>
              ))}
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
          <Button variant="warning" className="w-25" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
