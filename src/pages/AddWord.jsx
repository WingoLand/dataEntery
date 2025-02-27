import { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import config from "../../config";

const { BASE_URL } = config;

export default function AddWord() {
  const [word, setWord] = useState("");
  const [pic, setPic] = useState(null);
  const [choices, setChoices] = useState(["", "", ""]);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || !pic) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    if (newCategory) {
      formData.append("category", newCategory.trim().toLowerCase());
    } else if (category) {
      formData.append("category", category.trim().toLowerCase());
    } else {
      alert("Please choose a category or enter a new category");
      return;
    }
    formData.append("word", word.trim().toLowerCase());
    formData.append("pic", pic);
    choices.forEach((choice) => {
      formData.append("choices", choice.trim().toLowerCase());
    });

    try {
      const response = await fetch(`${BASE_URL}/word`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Word uploaded successfully");
        fetchCategories();
        setWord("");
        setCategory(newCategory ? newCategory : category);
        setNewCategory("");
        setPic(null);
        setChoices(["", "", ""]);

        return;
      }
      await response.json().then((data) => {
        alert(data.message);
      });
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-center mb-4">Add Word</h2>
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
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Picture</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setPic(e.target.files[0])}
          />
        </Form.Group>
        {[...Array(3)].map((_, index) => (
          <Form.Group key={index} className="mb-3">
            <Form.Label>Choice {index + 1}</Form.Label>
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
        ))}
        <Row className="justify-content-center">
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
