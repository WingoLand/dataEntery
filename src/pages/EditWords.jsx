import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Modal,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import config from "../../config";

const { BASE_URL } = config;

export default function EditWords() {
  const [words, setWords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [categories, setCategories] = useState([]);
  const [chosenCategory, setChosenCategory] = useState("");
  const [category, setCategory] = useState("");
  const [word, setWord] = useState("");
  const [arabicWord, setArabicWord] = useState("");
  const [wordPic, setWordPic] = useState(null);
  const [choices, setChoices] = useState(["", "", ""]);
  const [arabicChoices, setArabicChoices] = useState(["", "", ""]);
  const [tempWordPic, setTempWordPic] = useState(null);
  const [editableFields, setEditableFields] = useState({
    category: false,
    word: false,
    arabicWord: false,
    choices: [false, false, false],
    arabicChoices: [false, false, false],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(words);

  useEffect(() => {
    setFilteredData(
      words?.map((wordItem) =>
        wordItem.word.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, words]); // Re-run filtering when search term or words list changes

  // Fetch all words from the backend
  const fetchWords = async (category) => {
    setChosenCategory(category);
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/word/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      });
      if (!response.ok) throw new Error("Failed to load words.");
      const data = await response.json();

      setWords(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/word/categories`);
      if (!response.ok) throw new Error("Failed to load categories.");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle opening the modal and pre-filling form fields
  const handleEditClick = (wordItem) => {
    setSelectedWord(wordItem);
    setCategory(wordItem.category || "");
    setWord(wordItem.word || "");
    setArabicWord(wordItem.wordInArabic || "");
    setWordPic(wordItem.pic || null);
    setChoices(wordItem.choices || ["", "", ""]);
    setArabicChoices(wordItem.arabicChoices || ["", "", ""]);
    setTempWordPic(null);
    setEditableFields({
      category: false,
      word: false,
      arabicWord: false,
      choices: Array(wordItem.choices?.length || 3).fill(false),
      arabicChoices: Array(wordItem.arabicChoices?.length || 3).fill(false),
    });
    setShowModal(true);
  };

  // Toggle editable state for fields
  const toggleEditable = (field, index = null) => {
    setEditableFields((prev) => {
      if (index !== null) {
        if (field === "choices") {
          const updatedChoices = [...prev.choices];
          updatedChoices[index] = !updatedChoices[index];
          return { ...prev, choices: updatedChoices };
        }
        if (field === "arabicChoices") {
          const updatedChoices = [...prev.arabicChoices];
          updatedChoices[index] = !updatedChoices[index];
          return { ...prev, arabicChoices: updatedChoices };
        }
      }
      return { ...prev, [field]: !prev[field] };
    });
  };

  // Handle file upload and convert to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempWordPic(reader.result); // Full base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    if (!selectedWord) return;
    if (!window.confirm("Are you sure you want to delete this word?")) return;

    try {
      const response = await fetch(
        `${BASE_URL}/word/deleteWord/${selectedWord.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");

      alert("Word deleted successfully!");
      setShowModal(false);
      fetchWords(chosenCategory);
    } catch (error) {
      alert(error.message);
    }
  };

  // Update word details on the backend
  const handleUpdate = async () => {
    if (!selectedWord) return;
    if (
      !category ||
      !word ||
      !arabicWord ||
      choices.some((choice) => choice.trim() === "") ||
      arabicChoices.some((choice) => choice.trim() === "")
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("id", selectedWord.id);
    formData.append("category", category.trim().toLowerCase());
    formData.append("word", word.trim().toLowerCase());
    formData.append("wordInArabic", arabicWord.trim());
    choices.forEach((choice) => {
      formData.append("choices", choice.trim().toLowerCase());
    });
    arabicChoices.forEach((choice) => {
      formData.append("arabicChoices", choice.trim());
    });
    if (tempWordPic) {
      const binary = atob(tempWordPic.split(",")[1]);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(array)], { type: "image/jpeg" });
      formData.append("pic", blob);
    }

    try {
      const response = await fetch(`${BASE_URL}/word/updateWord`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");
      alert("Word updated successfully!");
      setShowModal(false);
      setLoading(true);
      fetchWords(); // Reload data
    } catch (err) {
      alert(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <Container className="mt-4 mb-4 text-center">
      <h2 className="fw-bold text-primary mb-4">Edit Words</h2>
      <Form className="mb-4 w-50 mx-auto">
        <Form.Control
          type="text"
          placeholder="Search words..."
          className="border-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </Form>
      {loading ? (
        <Spinner animation="border" className="mt-3" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : !categories ? (
        <Alert variant="info">No categories available.</Alert>
      ) : chosenCategory && words.length === 0 ? (
        <Alert variant="info">No words available.</Alert>
      ) : (
        <Row className="justify-content-center g-3">
          <h3 className="fw-semibold text-info mb-1">
            {!chosenCategory ? (
              "Categories"
            ) : (
              <>
                Words in{" "}
                <span className="text-light fw-normal fs-6 bg-secondary p-2 rounded-3">
                  {chosenCategory}{" "}
                  <i
                    className="bi bi-x-circle"
                    style={{ cursor: "pointer" }}
                    onClick={() => setChosenCategory("")}
                  ></i>
                </span>
              </>
            )}
          </h3>
          {!chosenCategory &&
            categories.map((category, i) => (
              <Col xs={6} sm={4} md={3} lg={2} key={i}>
                <Card
                  className="shadow-sm border-0 rounded text-center py-3 bg-warning-subtle"
                  style={{ transition: "transform 0.2s", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onClick={() => fetchWords(category)}
                >
                  <Card.Body>
                    <h4 className="fw-bold text-dark">{category}</h4>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          {chosenCategory &&
            words
              .filter((wordItem) =>
                wordItem.word.toLowerCase().includes(searchTerm)
              )
              .map((wordItem) => (
                <Col xs={6} sm={4} md={3} lg={2} key={wordItem.id}>
                  <Card
                    className="shadow-sm border-0 rounded text-center py-3 bg-info-subtle"
                    style={{ transition: "transform 0.2s", cursor: "pointer" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() => handleEditClick(wordItem)}
                  >
                    <Card.Body>
                      <h4 className="fw-bold text-dark">{wordItem.word}</h4>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
        </Row>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Word</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWord && (
            <>
              {/* Category */}
              <Form.Group>
                <Form.Label className="fw-semibold">Category</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    disabled
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    readOnly={!editableFields.category}
                  />
                  {/* <i
                    className={`ms-2 bi ${
                      editableFields.category
                        ? "bi-check-circle-fill text-success"
                        : "bi-pencil-square text-primary"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleEditable("category")}
                  ></i> */}
                </div>
              </Form.Group>

              {/* Word */}
              <Form.Group className="mt-3">
                <Form.Label className="fw-semibold">Word</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    readOnly={!editableFields.word}
                  />
                  <i
                    className={`ms-2 bi ${
                      editableFields.word
                        ? "bi-check-circle-fill text-success"
                        : "bi-pencil-square text-primary"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleEditable("word")}
                  ></i>
                </div>
              </Form.Group>

              {/* Arabic Word */}
              <Form.Group className="mt-3">
                <Form.Label className="fw-semibold">Arabic Word</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    value={arabicWord}
                    onChange={(e) => setArabicWord(e.target.value)}
                    readOnly={!editableFields.arabicWord}
                  />
                  <i
                    className={`ms-2 bi ${
                      editableFields.arabicWord
                        ? "bi-check-circle-fill text-success"
                        : "bi-pencil-square text-primary"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleEditable("arabicWord")}
                  ></i>
                </div>
              </Form.Group>

              {/* Word Picture */}
              <Form.Group className="mt-3">
                <Form.Label className="fw-semibold">Word Picture</Form.Label>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {tempWordPic || wordPic.contentType ? (
                    <Image
                      src={
                        tempWordPic
                          ? tempWordPic
                          : wordPic
                          ? `data:${wordPic.contentType};base64,${wordPic.data}`
                          : "https://via.placeholder.com/100?text=No+Image"
                      }
                      className="img-thumbnail rounded-circle shadow-sm border border-secondary"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <label
                      className="img-thumbnail rounded-circle shadow-sm border border-secondary d-flex justify-content-center align-items-center"
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    >
                      no Image
                    </label>
                  )}
                  <Form.Control type="file" onChange={handleFileChange} />
                </div>
              </Form.Group>

              {/* English Choices */}
              <Form.Group className="mt-3">
                <Form.Label className="fw-semibold">English Choices</Form.Label>
                {choices.map((choice, index) => (
                  <div key={index} className="d-flex align-items-center mt-2">
                    <Form.Control
                      type="text"
                      value={choice}
                      onChange={(e) => {
                        const updatedChoices = [...choices];
                        updatedChoices[index] = e.target.value;
                        setChoices(updatedChoices);
                      }}
                      readOnly={!editableFields.choices[index]}
                    />
                    <i
                      className={`ms-2 bi ${
                        editableFields.choices[index]
                          ? "bi-check-circle-fill text-success"
                          : "bi-pencil-square text-primary"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleEditable("choices", index)}
                    ></i>
                  </div>
                ))}
              </Form.Group>

              {/* Arabic Choices */}
              <Form.Group className="mt-3">
                <Form.Label className="fw-semibold">Arabic Choices</Form.Label>
                {arabicChoices.map((choice, index) => (
                  <div key={index} className="d-flex align-items-center mt-2">
                    <Form.Control
                      type="text"
                      value={choice}
                      onChange={(e) => {
                        const updatedChoices = [...arabicChoices];
                        updatedChoices[index] = e.target.value;
                        setArabicChoices(updatedChoices);
                      }}
                      readOnly={!editableFields.arabicChoices[index]}
                    />
                    <i
                      className={`ms-2 bi ${
                        editableFields.arabicChoices[index]
                          ? "bi-check-circle-fill text-success"
                          : "bi-pencil-square text-primary"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleEditable("arabicChoices", index)}
                    ></i>
                  </div>
                ))}
              </Form.Group>
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
