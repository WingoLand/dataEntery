import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  FormCheck,
  FormGroup,
} from "react-bootstrap";
import config from "../../config";
import randomizeChoices from "../modules/randomizeChoices";
import { getCategories } from "../requests/sentencesReq";
import validateCategory from "../modules/validateCategory";

const { BASE_URL } = config;

export default function AddSentence() {
  const [dbSentences, setDbSentences] = useState([]);
  const [sentences, setSentences] = useState([]);
  const [sent1, setSent1] = useState("");
  const [sent2, setSent2] = useState("");
  const [choice, setChoice] = useState("");
  const [wrongChoices, setWrongChoices] = useState(["", "", ""]);
  const [arabicSentence, setArabicSentence] = useState("");
  const [isQA, setIsQA] = useState(false);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [arabicCategory, setArabicCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newArabicCategory, setNewArabicCategory] = useState("");
  const [genCategory, setGenCategory] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // max limit of 8 sentences
    if (sentences.length >= 8) {
      alert("You must submit these 8 sentences first!");
      return;
    }

    if (
      sentences.some((sentence) =>
        !isQA
          ? sentence.sent1.toLowerCase() === sent1.toLowerCase() &&
            sentence.sent2.toLowerCase() === sent2.toLowerCase() &&
            sentence.choices.includes(choice.toLowerCase())
          : sentence.sent1.toLowerCase() === sent1.toLowerCase() &&
            sentence.choices.includes(choice.toLowerCase())
      )
    ) {
      alert("This sentence is already added!");

      return;
    }

    if (
      dbSentences.some(
        (sentence) =>
          (!isQA
            ? sentence.sent1.toLowerCase() === sent1.toLowerCase() &&
              sentence.sent2.toLowerCase() === sent2.toLowerCase() &&
              sentence.choices.includes(choice.toLowerCase())
            : sentence.sent1.toLowerCase() === sent1.toLowerCase() &&
              sentence.choices.includes(choice.toLowerCase())) &&
          sentence.category === (newCategory ? newCategory : category)
      )
    ) {
      alert("This sentence is already in the database in this category !");
      return;
    }

    if (
      !sent1 ||
      !sent2 ||
      !choice ||
      !arabicSentence ||
      wrongChoices.some((choice) => !choice) ||
      (!arabicCategory && !newArabicCategory)
    ) {
      alert("Please fill in all fields before adding.");
      return;
    }

    const newSentence = {
      category: newCategory
        ? newCategory.trim().toLowerCase()
        : category.trim().toLowerCase(),
      categoryInArabic: newArabicCategory
        ? newArabicCategory.trim()
        : arabicCategory.trim(),
      sent1: sent1,
      sent2: sent2,
      choices: [choice, ...wrongChoices],
      correct: Number(0),
      arabicSentence,
      type: isQA ? "q&a" : "blank",
    };

    setSentences([...sentences, newSentence]);
    setSent1("");
    setSent2("");
    setChoice("");
    setWrongChoices(["", "", ""]);
    setArabicSentence("");
  };

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    // minimum of 4 sentences
    if (sentences.length < 4) {
      alert("minimum of 4 sentences.");
      return;
    }

    const newSentences = sentences.map((sentence, index) => ({
      category: sentence.category,
      categoryInArabic: sentence.categoryInArabic,
      sent1: sentence.sent1,
      sent2: sentence.sent2,
      choices: sentence.choices,
      correct: sentence.correct,
      arabicSents: [
        sentence.arabicSentence,
        ...randomizeChoices(
          sentences
            .filter((_, i) => i !== index)
            .map((s) => s.arabicSentence.trim()),
          3
        ),
      ],
      correctArabicSent: Number(0),
      type: sentence.type,
    }));

    try {
      const response = await fetch(`${BASE_URL}/sentence/addManySentences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sentences: newSentences,
        }),
      });

      if (response.ok) {
        alert("Sentences uploaded successfully");
        setSentences([]);
        setIsQA(false);
        setCategory("");
        setArabicCategory("");
        setNewCategory("");
        setNewArabicCategory("");
        setGenCategory("");
        fetchSentences();
        getCategories().then((data) => {
          const newData = data.map((category) => category.en);
          setCategories(newData);
        });
      } else {
        const data = await response.json();
        alert(data.message);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error uploading sentences:", error);
    }
  };

  const fetchSentences = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sentence`);
      if (response.ok) {
        const data = await response.json();
        setDbSentences(data);
      } else {
        const data = await response.json();
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching sentences:", error);
    }
  };

  useEffect(() => {
    fetchSentences();
    getCategories().then((data) => {
      const newData = data.map((category) => category.en);
      setCategories(newData);
    });
  }, []);

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-center mb-4">Add Sentence</h2>

      <Form className="p-3 border rounded shadow-sm bg-light">
        <Row>
          <Col
            md={6}
            className="d-flex align-items-center justify-content-start"
          >
            {/* instructions */}
            <p className="text-warning fs-6 fw-semibold text-decoration-underline">
              Add at least 4 sentences then Submit
            </p>
          </Col>
          <Col md={6} className="d-flex align-items-center justify-content-end">
            <div
              className={`${
                isQA ? "bg-info border border-2" : "bg-secondary"
              } p-2 rounded-3`}
            >
              {/* switch mode */}
              <FormCheck
                type="checkbox"
                checked={isQA}
                className="fs-6 fw-bold text-light"
                onChange={(e) => {
                  if (sentences.length > 0) {
                    return alert(
                      "Please submit your current sentences before switching to Q&A mode."
                    );
                  }

                  setIsQA(e.target.checked);
                }}
                label="Q & A"
              />
            </div>
          </Col>
        </Row>
        {/* category */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setArabicCategory(
                    dbSentences.find(
                      (sentence) => sentence.category === e.target.value
                    )?.categoryInArabic
                  );
                }}
                disabled={newCategory || genCategory}
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
                disabled={category || genCategory}
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
                  disabled={category || genCategory}
                />
              </Form.Group>
            </Col>
          )}
        </Row>
        <hr />
        {/* sentence 1 | question */}
        <Form.Label>{!isQA ? "Sentence 1" : "Question"}</Form.Label>
        <Row>
          <Col md={10}>
            <Form.Control
              type="text"
              value={sent1}
              onChange={(e) => setSent1(e.target.value)}
            />
          </Col>
        </Row>
        {/* correct choice | answer */}
        <Form.Label className="text-success fw-semibold">
          {!isQA ? "Correct Choice" : "Answer"}
        </Form.Label>
        <Row>
          <Col md={10}>
            <Form.Control
              className="border-3 border-success"
              type="text"
              value={choice}
              onChange={(e) => {
                setChoice(e.target.value);
              }}
            />
          </Col>
        </Row>
        {/* sentence 2 (not shown in Q&A mode) */}
        {!isQA && (
          <>
            <Form.Label>Sentence 2</Form.Label>
            <Row>
              <Col md={10}>
                <Form.Control
                  type="text"
                  value={sent2}
                  onChange={(e) => setSent2(e.target.value)}
                />
              </Col>
            </Row>
          </>
        )}
        <hr />
        {/* wrong choices | wrong answers */}
        <Form.Label className="text-danger fw-semibold">
          {!isQA ? "Wrong Choices" : "Wrong Answers"}
        </Form.Label>
        <Row className="row-gap-2">
          <Col md={4}>
            <Form.Control
              className="border-2 border-danger"
              placeholder={!isQA ? "Wrong Choice 1" : "Wrong Answer 1"}
              type="text"
              value={wrongChoices[0]}
              onChange={(e) => {
                const newWrongChoices = [...wrongChoices];
                newWrongChoices[0] = e.target.value;
                setWrongChoices(newWrongChoices);
              }}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              className="border-2 border-danger"
              placeholder={!isQA ? "Wrong Choice 2" : "Wrong Answer 2"}
              type="text"
              value={wrongChoices[1]}
              onChange={(e) => {
                const newWrongChoices = [...wrongChoices];
                newWrongChoices[1] = e.target.value;
                setWrongChoices(newWrongChoices);
              }}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              className="border-2 border-danger"
              placeholder={!isQA ? "Wrong Choice 3" : "Wrong Answer 3"}
              type="text"
              value={wrongChoices[2]}
              onChange={(e) => {
                const newWrongChoices = [...wrongChoices];
                newWrongChoices[2] = e.target.value;
                setWrongChoices(newWrongChoices);
              }}
            />
          </Col>
        </Row>
        <hr />
        {/* arabic sentence | arabic question */}
        <Form.Label>{!isQA ? "Sentence" : "Question"} in arabic</Form.Label>
        <Row>
          <Col md={10}>
            <Form.Control
              type="text"
              value={arabicSentence}
              onChange={(e) => {
                setArabicSentence(e.target.value);
              }}
            />
          </Col>
        </Row>

        {/* arabic answer (shown only in Q&A mode) */}
        {isQA && (
          <>
            <Form.Label>Answer in arabic</Form.Label>
            <Row>
              <Col md={10}>
                <Form.Control
                  type="text"
                  value={sent2}
                  onChange={(e) => setSent2(e.target.value)}
                />
              </Col>
            </Row>
          </>
        )}

        {/* buttons */}
        <Row className="justify-content-center mt-4">
          <Col xs={6} className="d-flex justify-content-center">
            <Button
              variant="outline-primary"
              onClick={handleAdd}
              className="w-100"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add
            </Button>
          </Col>
          <Col xs={6} className="d-flex justify-content-center">
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-100"
            >
              {isSubmitting ? "wait..." : "Submit"}
            </Button>
          </Col>
        </Row>
      </Form>
      {/* show added sentences */}
      {sentences.length > 0 && (
        <div className="mt-4">
          <h5>Added Sentences:</h5>
          <div className="d-flex flex-wrap gap-3">
            {sentences.map((sentence, index) => (
              <Card
                key={index}
                className="me-3 p-2 border rounded shadow-sm justify-content-center"
                style={{ width: "250" }}
              >
                <Card.Body>
                  {!isQA ? (
                    <Card.Title>
                      {sentence.sent1} {sentences[index].choices[0]}{" "}
                      {sentence.sent2}
                    </Card.Title>
                  ) : (
                    <Card.Title>
                      - {sentence.sent1}
                      <br />* {sentence.choices[0]}
                    </Card.Title>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
