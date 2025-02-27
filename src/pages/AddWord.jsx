// import { useEffect, useState } from "react";
// import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
// import config from "../../config";

// const { BASE_URL } = config;

// export default function AddWord() {
//   const [word, setWord] = useState("");
//   const [pic, setPic] = useState(null);
//   const [choices, setChoices] = useState(["", "", ""]);
//   const [category, setCategory] = useState("");
//   const [newCategory, setNewCategory] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [words, setWords] = useState([]);
//   const [Pics, setPics] = useState([]);
//   const [allChoices, setAllChoices] = useState([]);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/word/categories`);
//       if (response.ok) {
//         const data = await response.json();
//         setCategories(data);
//       }
//     } catch (error) {
//       console.log("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!word || !pic) {
//       alert("Please fill in all fields");
//       return;
//     }

//     const formData = new FormData();
//     if (newCategory) {
//       formData.append("category", newCategory.trim().toLowerCase());
//     } else if (category) {
//       formData.append("category", category.trim().toLowerCase());
//     } else {
//       alert("Please choose a category or enter a new category");
//       return;
//     }
//     formData.append("word", word.trim().toLowerCase());
//     formData.append("pic", pic);
//     choices.forEach((choice) => {
//       formData.append("choices", choice.trim().toLowerCase());
//     });

//     try {
//       const response = await fetch(`${BASE_URL}/word`, {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         alert("Word uploaded successfully");
//         fetchCategories();
//         setWord("");
//         setCategory(newCategory ? newCategory : category);
//         setNewCategory("");
//         setPic(null);
//         setChoices(["", "", ""]);

//         return;
//       }
//       await response.json().then((data) => {
//         alert(data.message);
//       });
//     } catch (error) {
//       console.log("Error uploading file:", error);
//     }
//   };

//   const handelAdd = (e) => {
//     setWords([...words, word]);
//     setAllChoices([...allChoices, choices]);
//     setPics([...Pics, pic]);
//     if (words.length - 1 >= 5) e.target.disabled = true;
//   };

//   return (
//     <Container className="mt-4 mb-4">
//       <h2 className="text-center mb-4">Add Word</h2>
//       <p className="float-end me-1 text-warning fs-6 fw-semibold text-decoration-underline">
//         Add 6 words of the same category then Submit
//       </p>
//       <Form
//         onSubmit={handleSubmit}
//         className="p-3 border rounded shadow-sm bg-light"
//       >
//         <Row className="mb-3">
//           <Col>
//             <Form.Group>
//               <Form.Label>Category</Form.Label>
//               <Form.Select
//                 value={category}
//                 onChange={(e) => {
//                   if (!category && !newCategory)
//                     return setCategory(e.target.value);
//                   alert("enter 6 words of the same category !");
//                 }}
//               >
//                 <option value="">Choose a category</option>
//                 {categories.map((category) => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>New Category</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newCategory}
//                 onChange={(e) => setNewCategory(e.target.value)}
//               />
//             </Form.Group>
//           </Col>
//         </Row>
//         <Form.Group className="mb-3">
//           <Form.Label>Word</Form.Label>
//           <Form.Control
//             type="text"
//             value={word}
//             onChange={(e) => setWord(e.target.value)}
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Picture</Form.Label>
//           <Form.Control
//             type="file"
//             accept="image/*"
//             onChange={(e) => setPic(e.target.files[0])}
//           />
//         </Form.Group>
//         {[...Array(3)].map((_, index) => (
//           <Form.Group key={index} className="mb-3">
//             <Form.Label>Choice {index + 1}</Form.Label>
//             <Form.Control
//               type="text"
//               value={choices[index] || ""}
//               onChange={(e) => {
//                 const newChoices = [...choices];
//                 newChoices[index] = e.target.value;
//                 setChoices(newChoices);
//               }}
//             />
//           </Form.Group>
//         ))}
//         <Row className="w-100 justify-content-space-between">
//           <Col
//             xs={6}
//             className="d-flex align-items-center justify-content-center"
//           >
//             <button
//               type="button"
//               className="w-100 btn btn-outline-primary border-2"
//               onClick={(e) => handelAdd(e)}
//             >
//               <i className="bi bi-plus-circle me-2"></i>
//               Add
//             </button>
//           </Col>
//           <Col
//             xs={6}
//             className="d-flex align-items-center justify-content-center"
//           >
//             <Button variant="success" type="submit" className="w-100">
//               Submit
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </Container>
//   );
// }

import { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import config from "../../config";

const { BASE_URL } = config;

export default function AddWord() {
  const [dbWords, setDbWords] = useState([]);
  const [word, setWord] = useState("");
  const [pic, setPic] = useState(null);
  const [choices, setChoices] = useState(["", "", ""]);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [words, setWords] = useState([]);
  const [Pics, setPics] = useState([]);
  const [allChoices, setAllChoices] = useState([]);

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
    if (words.length !== 6) {
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
    const newWords = words.map((word, index) => ({
      word: word.trim().toLowerCase(),
      choices: allChoices[index].map((choice) => choice.trim().toLowerCase()),
    }));
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
        setPics([]);
        setAllChoices([]);
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

  const handleAdd = () => {
    if (words.length - 1 >= 5) return alert("Submit these 6 words first !");
    if (!word || !pic || choices.some((choice) => !choice)) {
      alert("Please fill in all fields before adding.");
      return;
    }
    const wordExists = dbWords.some(
      (dbWord) => dbWord.word.toLowerCase() === word.toLowerCase()
    );
    if (wordExists) {
      alert("This word already exists in the database.");
      return;
    }
    setWords([...words, word]);
    setPics([...Pics, pic]);
    setAllChoices([...allChoices, choices]);
    setWord("");
    setPic(null);
    setChoices(["", "", ""]);
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
                onChange={(e) => {
                  if (!category && !newCategory)
                    return setCategory(e.target.value);

                  alert("enter 6 words of the same category !");
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
                className="me-3 p-2 border rounded shadow-sm"
                style={{ width: "150px" }}
              >
                <Card.Body>
                  <Card.Img
                    variant="top"
                    src={URL.createObjectURL(Pics[index])}
                    alt={word}
                  />
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
