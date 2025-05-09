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
  Card,
} from "react-bootstrap";
import {
  getAlphabetCash,
  setAlphabetCash,
} from "../cashStorage/alphabetCashStorage";

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
        const newData = await Promise.all(
          data.map(async (item) => {
            const cashData = getAlphabetCash(item.small);
            if (cashData) {
              return cashData;
            }

            const newItem = {
              ...item,
              wordPic: (await convertImageToBase64(item.wordPic)) || null,
              capPic: (await convertImageToBase64(item.capPic)) || null,
              smallPic: (await convertImageToBase64(item.smallPic)) || null,
            };

            setAlphabetCash(item.small, newItem);

            return newItem;
          })
        );

        setAlphabet(newData);
      }
    } catch (error) {
      setMessage("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertImageToBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl); // Fetch the image
      const blob = await response.blob(); // Convert response to Blob

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Get Base64 string
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      return null;
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
      setAlphabetCash(selectedLetter.small, {
        ...selectedLetter,
        word,
        wordPic: previewWordPic,
        capPic: previewCapPic,
        smallPic: previewSmallPic,
      });
      setShowModal(false);
      fetchAlphabet();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedLetter) return;

    if (!window.confirm("Are you sure you want to delete this letter?")) return;

    try {
      const response = await fetch(
        `${BASE_URL}/alphabet/deleteLetter/${selectedLetter.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");

      alert("Letter deleted successfully!");
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
    setPreviewWordPic(letter.wordPic || null);
    setPreviewCapPic(letter.capPic || null);
    setPreviewSmallPic(letter.smallPic || null);

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
        <Row className="justify-content-center g-3">
          {alphabet.map((item) => (
            <Col xs={6} sm={4} md={3} lg={2} key={item.id}>
              <Card
                className="shadow-sm border-0 rounded text-center py-3 bg-info-subtle"
                style={{ transition: "transform 0.2s", cursor: "pointer" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onClick={() => handleEditClick(item)}
              >
                <Card.Body>
                  <h4 className="fw-bold text-dark"> {item.capital}</h4>
                </Card.Body>
              </Card>
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
          {/* <Button variant="danger" className="w-10" onClick={handleDelete}>
            <i className="bi bi-trash"></i>
          </Button> */}
          <Button variant="warning" className="w-25" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
