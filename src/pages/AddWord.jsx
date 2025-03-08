import { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import config from "../../config";
import randomizeChoices from "../modules/randomizeChoices.js";

const { BASE_URL } = config;

export default function AddWord() {
  const [dbWords, setDbWords] = useState([]);
  const [word, setWord] = useState("");
  const [arabicWord, setArabicWord] = useState("");
  const [arabicWords, setArabicWords] = useState([]);
  const [pic, setPic] = useState(null);
  // const [choices, setChoices] = useState(["", "", ""]);
  // const [arabicChoices, setArabicChoices] = useState(["", "", ""]);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [words, setWords] = useState([]);
  const [Pics, setPics] = useState([]);
  // const [allChoices, setAllChoices] = useState([]);
  // const [allArabicChoices, setAllArabicChoices] = useState([]);
  const [genCategory, setGenCategory] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/word/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchWords = async () => {
    try {
      const response = await fetch(`${BASE_URL}/word`);
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
    e.preventDefault();

    if (!Array.isArray(words) || words.length !== 6) {
      alert("You must add exactly 6 words before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "category",
      newCategory
        ? newCategory.trim().toLowerCase()
        : category.trim().toLowerCase()
    );

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
    formData.append("words", JSON.stringify(newWords));
    Pics.forEach((pic) => formData.append("pics", pic));

    try {
      const response = await fetch(`${BASE_URL}/word/addWords`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Words uploaded successfully");
        setWords([]);
        setArabicWords([]);
        setPics([]);
        // setAllChoices([]);
        // setAllArabicChoices([]);
        setCategory("");
        setNewCategory("");
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.log("Error uploading words:", error);
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

    if (words.length - 1 >= 5) return alert("Submit these 6 words first !");

    if (
      !word ||
      !arabicWord
      // ||choices.some((choice) => !choice) ||
      // arabicChoices.some((choice) => !choice)
    ) {
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
    setPics([
      ...Pics,
      pic ? pic : new File([""], "dummy.png", { type: "image/png" }),
    ]);
    // setAllChoices([...allChoices, choices]);
    // setAllArabicChoices([...allArabicChoices, arabicChoices]);
    setArabicWord("");
    setWord("");
    setPic(null);
    // setChoices(["", "", ""]);
    // setArabicChoices(["", "", ""]);
  };

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-center mb-4">Add Word</h2>
      <p className="float-end me-1 text-warning fs-6 fw-semibold text-decoration-underline">
        Add 6 words of the same category then Submit
      </p>
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
                onChange={(e) => setCategory(e.target.value)}
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
          <Col>
            <Form.Group>
              <Form.Label>New Category</Form.Label>
              <Form.Control
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Word</Form.Label>
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
        <Form.Group className="mb-3">
          <Form.Label>Picture</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setPic(e.target.files[0])}
          />
        </Form.Group>
        {/* {[...Array(3)].map((_, index) => (
          <Form.Group key={index} className="mb-3">
            <Form.Label>English Choice {index + 1}</Form.Label>
            <Form.Control
              type="text"
              value={choices[index] || ""}
              onChange={(e) => {
                const newChoices = [...choices];
                newChoices[index] = e.target.value;
                setChoices(newChoices);
              }}
            />
          </Form.Group>
        ))} */}
        {/* <hr />
        {[...Array(3)].map((_, index) => (
          <Form.Group key={index} className="mb-3">
            <Form.Label>Arabic Choice {index + 1}</Form.Label>
            <Form.Control
              type="text"
              value={arabicChoices[index] || ""}
              onChange={(e) => {
                const newArabicChoices = [...arabicChoices];
                newArabicChoices[index] = e.target.value;
                setArabicChoices(newArabicChoices);
              }}
            />
          </Form.Group>
        ))} */}
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
            <Button variant="success" type="submit" className="w-100">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
      {words.length > 0 && (
        <div className="mt-4 overflow-auto" style={{ whiteSpace: "nowrap" }}>
          <h5 className="mb-2">Added Words:</h5>
          <div className="d-flex">
            {words.map((word, index) => (
              <Card
                key={index}
                className="me-3 p-2 border rounded shadow-sm "
                style={{ width: "150px" }}
              >
                <Card.Body>
                  {Pics[index].name != "dummy.png" ? (
                    <Card.Img
                      variant="top"
                      src={URL.createObjectURL(Pics[index])}
                      alt={word}
                    />
                  ) : (
                    <Card.Text className="text-center">
                      {arabicWords[index]}
                    </Card.Text>
                  )}
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
