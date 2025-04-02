import { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  FormControl,
} from "react-bootstrap";
import config from "../../config";
import randomizeChoices from "../modules/randomizeChoices.js";

const { BASE_URL } = config;

export default function AddVerb() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbWords, setDbWords] = useState([]);
  const [word, setWord] = useState("");
  const [arabicWord, setArabicWord] = useState("");
  const [arabicWords, setArabicWords] = useState([]);
  const [counter, setCounter] = useState(6);
  const [category, setCategory] = useState("");
  const [arabicCategory, setArabicCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newArabicCategory, setNewArabicCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [words, setWords] = useState([]);
  const [genCategory, setGenCategory] = useState("");
  const [choices, setChoices] = useState([]);
  const [arabicChoices, setArabicChoices] = useState([]);
  const [allChoices, setAllChoices] = useState([]);
  const [allArabicChoices, setAllArabicChoices] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/verb/categories`);
      if (response.ok) {
        const data = await response.json();
        const newData = data.map((category) => category.en);
        setCategories(newData);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchWords = async () => {
    try {
      const response = await fetch(`${BASE_URL}/verb`);
      if (response.ok) {
        const data = await response.json();
        setDbWords(data);
      }
    } catch (error) {
      console.log("Error fetching words:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchWords();
  }, []);

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    if (!Array.isArray(words) || words.length != counter) {
      alert(`You must add exactly ${counter} words before submitting.`);
      setIsSubmitting(false);
      return;
    }

    const newWords = words.map((word, index) => {
      if (counter >= 4) {
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
      } else {
        return {
          word: word.trim().toLowerCase(),
          wordInArabic: arabicWords[index].trim().toLowerCase(),
          choices: allChoices[index],
          arabicChoices: allArabicChoices[index],
        };
      }
    });

    let data = {
      category: newCategory
        ? newCategory.trim().toLowerCase()
        : category.trim().toLowerCase(),
      categoryInArabic: newArabicCategory
        ? newArabicCategory.trim()
        : arabicCategory.trim(),
      words: newWords,
    };

    try {
      const response = await fetch(`${BASE_URL}/verb/addVerbs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Verbs uploaded successfully");
        setWords([]);
        setArabicWords([]);
        setCategory("");
        setArabicCategory("");
        setNewCategory("");
        setNewArabicCategory("");
        setChoices(["", "", ""]);
        setArabicChoices(["", "", ""]);
        setAllChoices([]);
        setAllArabicChoices([]);
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

  function validateCategory(genCategory, newCategory, category) {
    // Helper function to normalize category values
    const normalize = (value) => {
      if (!value || typeof value !== "string") return ""; // Handle invalid inputs
      return value.trim().toLowerCase();
    };

    // Normalize all category values
    const normalizedGenCategory = normalize(genCategory);
    const normalizedNewCategory = normalize(newCategory);
    const normalizedCategory = normalize(category);

    // Determine the effective category to use
    const effectiveCategory = normalizedNewCategory || normalizedCategory;

    // If genCategory is not set, initialize it
    if (!normalizedGenCategory) {
      return effectiveCategory; // Return the new category to set
    }

    // Ensure all words belong to the same category
    if (normalizedGenCategory !== effectiveCategory) {
      throw new Error("All words must belong to the same category.");
    }

    // Return the existing genCategory if everything is valid
    return normalizedGenCategory;
  }

  const handleAdd = () => {
    try {
      const updatedGenCategory = validateCategory(
        genCategory,
        newCategory,
        category
      );
      setGenCategory(updatedGenCategory); // Update the category state
    } catch (error) {
      alert(error.message); // Display the error message to the user
    }

    if (words.length - 1 >= counter - 1)
      return alert(`Submit these ${counter} words first !`);

    if (!word || !arabicWord || (!arabicCategory && !newArabicCategory)) {
      alert("Please fill in all fields before adding.");
      return;
    }
    let wordExists = dbWords.some(
      (dbWord) =>
        dbWord.word.toLowerCase() === word.toLowerCase() &&
        dbWord.category === (newCategory ? newCategory : category)
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

    if (counter < 4) {
      setAllChoices([...allChoices, choices]);
      setAllArabicChoices([...allArabicChoices, arabicChoices]);
      setChoices(["", "", ""]);
      setArabicChoices(["", "", ""]);
    }

    setArabicWord("");
    setWord("");
  };

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-center mb-4">Add Verb</h2>
      <Row className="float-end me-1 text-warning fs-6 fw-semibold w-100 my-1">
        <Col>
          <p className="float-end me-1 text-warning fs-6 fw-semibold text-decoration-underline">
            Add {counter} Verbs of the same category then Submit
          </p>
        </Col>
        <Col>
          <input
            type="number"
            className="form-control"
            value={counter}
            onChange={(e) => {
              if (words.length > 0) return alert("Submit these words first !");
              setCounter(e.target.value);
            }}
            onMouseOut={(e) => {
              if (e.target.value < 2) {
                setCounter(2);
                return alert("Minimum 2 words");
              }
              setCounter(e.target.value);
            }}
          />
        </Col>
      </Row>

      <Form
        onSubmit={handleSubmit}
        className="p-3 border rounded shadow-sm bg-light"
      >
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setArabicCategory(
                    dbWords.find((word) => word.category === e.target.value)
                      ?.categoryInArabic || ""
                  );
                }}
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>New Category</Form.Label>
              <Form.Control
                type="text"
                disabled={category}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Form.Group>
          </Col>
          {newCategory && (
            <Col>
              <Form.Group>
                <Form.Label>New Category in Arabic</Form.Label>
                <Form.Control
                  type="text"
                  value={newArabicCategory}
                  onChange={(e) => setNewArabicCategory(e.target.value)}
                />
              </Form.Group>
            </Col>
          )}
        </Row>
        <hr />
        <Form.Group className="mb-3">
          <Form.Label>Word</Form.Label>
          <Form.Control
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          {counter < 4 && (
            <>
              <Form.Label>wrong Choices</Form.Label>
              <Row className="mb-2">
                <Col>
                  <FormControl
                    spellCheck
                    type="text"
                    className="border-danger focus-ring focus-ring-danger"
                    value={choices[0]}
                    onChange={(e) =>
                      setChoices((prev) => [e.target.value, prev[1], prev[2]])
                    }
                  />
                </Col>
                <Col>
                  <FormControl
                    spellCheck
                    type="text"
                    className="border-danger focus-ring focus-ring-danger"
                    value={choices[1]}
                    onChange={(e) =>
                      setChoices((prev) => [prev[0], e.target.value, prev[2]])
                    }
                  />
                </Col>
                <Col>
                  <FormControl
                    spellCheck
                    type="text"
                    className="border-danger focus-ring focus-ring-danger"
                    value={choices[2]}
                    onChange={(e) =>
                      setChoices((prev) => [prev[0], prev[1], e.target.value])
                    }
                  />
                </Col>
              </Row>
            </>
          )}

          <Form.Label>Meaning in Arabic</Form.Label>
          <Form.Control
            type="text"
            value={arabicWord}
            onChange={(e) => setArabicWord(e.target.value)}
          />
        </Form.Group>
        {counter < 4 && (
          <>
            <Form.Label>wrong Arabic choices</Form.Label>
            <Row className="mb-5">
              <Col>
                <FormControl
                  spellCheck
                  type="text"
                  className="border-danger focus-ring focus-ring-danger"
                  value={arabicChoices[0]}
                  onChange={(e) =>
                    setArabicChoices((prev) => [
                      e.target.value,
                      prev[1],
                      prev[2],
                    ])
                  }
                />
              </Col>
              <Col>
                <FormControl
                  spellCheck
                  type="text"
                  className="border-danger focus-ring focus-ring-danger"
                  value={arabicChoices[1]}
                  onChange={(e) =>
                    setArabicChoices((prev) => [
                      prev[0],
                      e.target.value,
                      prev[2],
                    ])
                  }
                />
              </Col>
              <Col>
                <FormControl
                  spellCheck
                  type="text"
                  className="border-danger focus-ring focus-ring-danger"
                  value={arabicChoices[2]}
                  onChange={(e) =>
                    setArabicChoices((prev) => [
                      prev[0],
                      prev[1],
                      e.target.value,
                    ])
                  }
                />
              </Col>
            </Row>
          </>
        )}

        <Row className="w-100 justify-content-space-between">
          <Col
            xs={6}
            className="d-flex align-items-center justify-content-center"
          >
            <button
              type="button"
              className="w-100 btn btn-outline-primary border-2"
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
          <h5 className="mb-2">Added Words:</h5>
          <div className="d-flex flex-wrap gap-2">
            {words.map((word, index) => (
              <Card
                key={index}
                className="me-3 p-2 border rounded shadow-sm"
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
