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
import { fetchCategories, fetchWords } from "../requests/wordsReq";
import { getWordsCash, setWordsCash } from "../cashStorage/wordsCashStorage";
import { fetchVerbs } from "../requests/verbsReq";

const { BASE_URL } = config;

export default function EditVerbs() {
  const [words, setWords] = useState([]);

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
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
        wordItem.word?.toLowerCase().includes(searchTerm?.toLowerCase())
      )
    );
  }, [searchTerm, words]); // Re-run filtering when search term or words list changes

  const handelFetchWords = async (category, page) => {
    setLoading(true);

    try {
      const data = await fetchVerbs(page);

      const newWords = await Promise.all(
        data.wordsArray.map(async (word) => {
          let cachedData = getWordsCash(word.id);
          if (cachedData) {
            return cachedData;
          }
          setWordsCash(word.id, word); // Store in cache
          return word;
        })
      );

      setWords(newWords);
      setPageCount(data.counter);
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handelFetchWords(page);
  }, [page]);

  // Handle opening the modal and pre-filling form fields
  const handleEditClick = (wordItem) => {
    setSelectedWord(wordItem);
    setWord(wordItem.word || "");
    setArabicWord(wordItem.wordInArabic || "");
    setChoices(wordItem.choices || ["", "", ""]);
    setArabicChoices(wordItem.arabicChoices || ["", "", ""]);
    setEditableFields({
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

  const handleDelete = async () => {
    if (!selectedWord) return;
    if (!window.confirm("Are you sure you want to delete this word?")) return;

    try {
      const response = await fetch(
        `${BASE_URL}/verb/deleteVerb/${selectedWord.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");

      alert("Word deleted successfully!");
      setShowModal(false);
      handelFetchWords(page);
    } catch (error) {
      alert(error.message);
    }
  };

  // Update word details on the backend
  const handleUpdate = async () => {
    if (!selectedWord) return;
    if (
      !word ||
      !arabicWord ||
      choices.some((choice) => choice.trim() === "") ||
      arabicChoices.some((choice) => choice.trim() === "")
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const sentData = {
      id: selectedWord.id,
      word: word.trim().toLowerCase(),
      wordInArabic: arabicWord.trim(),
      choices: choices.map((choice) => choice.trim().toLowerCase()),
      arabicChoices: arabicChoices.map((choice) => choice.trim()),
    };

    try {
      const response = await fetch(`${BASE_URL}/verb/updateVerb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sentData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");
      alert("Word updated successfully!");
      setWordsCash(selectedWord.id, {
        ...selectedWord,
        word,
        wordInArabic: arabicWord,
        choices,
        arabicChoices,
      });
      setShowModal(false);
      setLoading(true);
      handelFetchWords(page); // Reload data
    } catch (err) {
      alert(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <Container className="text-center mb-4 mt-4">
      <h2 className="text-primary fw-bold mb-4">Edit Verbs</h2>
      <Form className="w-50 mb-4 mx-auto">
        <Form.Control
          type="text"
          placeholder="Search words..."
          className="border-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </Form>
      {loading ? (
        <Spinner animation="border" className="h-50 w-50 mt-3" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row className="g-3 justify-content-center">
          {words
            ?.filter((wordItem) =>
              wordItem.word?.toLowerCase().includes(searchTerm)
            )
            .map((wordItem) => (
              <Col xs={6} sm={4} md={3} lg={2} key={wordItem.id}>
                <Card
                  className="bg-info-subtle border-0 rounded shadow-sm text-center py-3"
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
                    <h4 className="text-dark fw-bold">{wordItem.word}</h4>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      )}
      <div className={`d-flex justify-content-center align-items-center mt-4`}>
        <Button
          variant={page === 1 ? "secondary" : "info"}
          onClick={() => {
            page > 1 && setPage((prev) => prev - 1);
            handelFetchWords(page - 1);
          }}
          disabled={page === 1}
        >
          {"<"}
        </Button>
        <input
          className="form-control w-25 ms-3"
          type="number"
          value={page}
          onChange={(e) => {
            setPage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.target.value > pageCount) {
                setPage(pageCount);
                handelFetchWords(pageCount);
              } else if (e.target.value < 1) {
                setPage(1);
                handelFetchWords(1);
              } else {
                setPage(e.target.value);
                handelFetchWords(e.target.value);
              }
            }
          }}
        />
        <span className="fs-6 me-3">of {pageCount}</span>
        <Button
          variant={page >= pageCount ? "secondary" : "info"}
          onClick={() => {
            setPage((prev) => prev + 1);
            handelFetchWords(page + 1);
          }}
          disabled={page >= pageCount}
        >
          {">"}
        </Button>
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Verb</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWord && (
            <>
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
