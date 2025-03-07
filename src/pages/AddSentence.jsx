// import { useState } from "react";
// import { Form, Button, Container, Row, Col } from "react-bootstrap";
// import config from "../../config";

// const { BASE_URL } = config;

// export default function AddSentence() {
//   const [sent1, setSent1] = useState("");
//   const [sent2, setSent2] = useState("");
//   const [choices, setChoices] = useState(["", "", "", ""]);
//   const [correctChoice, setCorrectChoice] = useState(null);
//   const [arabicSentences, setArabicSentences] = useState(["", "", ""]);
//   const [correctArabicSent, setCorrectArabicSent] = useState(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const data = {
//       sent1,
//       sent2,
//       choices,
//       correct: correctChoice,
//       arabicSents: arabicSentences,
//       correctArabicSent,
//     };
//     fetch(`${BASE_URL}/sentence/addSentence`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then(() => {
//         setSent1("");
//         setSent2("");
//         setChoices(["", "", "", ""]);
//         setCorrectChoice(null);
//         setArabicSentences(["", "", ""]);
//         setCorrectArabicSent(null);
//       })
//       .catch((error) => console.error("Error:", error));
//   };

//   return (
//     <Container className="mt-4 mb-4">
//       <h2 className="text-center mb-4">Add Sentence</h2>
//       <Form
//         onSubmit={(e) => handleSubmit(e)}
//         className="p-3 border rounded shadow-sm bg-light"
//       >
//         <Row>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Sentence 1</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={sent1}
//                 onChange={(e) => setSent1(e.target.value)}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Sentence 2</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={sent2}
//                 onChange={(e) => setSent2(e.target.value)}
//               />
//             </Form.Group>
//           </Col>
//         </Row>
//         <h4 className="mt-4">Choices</h4>
//         {choices.map((choice, index) => (
//           <Form.Group key={index}>
//             <Form.Label>Choice {index + 1}</Form.Label>
//             <Row>
//               <Col md={10}>
//                 <Form.Control
//                   type="text"
//                   value={choice}
//                   onChange={(e) => {
//                     const newChoices = [...choices];
//                     newChoices[index] = e.target.value;
//                     setChoices(newChoices);
//                   }}
//                 />
//               </Col>
//               <Col md={2} className="d-flex align-items-center">
//                 <Form.Check
//                   type="radio"
//                   name="correctChoice"
//                   onChange={() => setCorrectChoice(index)}
//                   checked={correctChoice === index}
//                 />
//               </Col>
//             </Row>
//           </Form.Group>
//         ))}
//         <h4 className="mt-4">Arabic Sentences</h4>
//         {arabicSentences.map((sentence, index) => (
//           <Form.Group key={index}>
//             <Form.Label>Arabic Sentence {index + 1}</Form.Label>
//             <Row>
//               <Col md={10}>
//                 <Form.Control
//                   type="text"
//                   value={sentence}
//                   onChange={(e) => {
//                     const newArabicSentences = [...arabicSentences];
//                     newArabicSentences[index] = e.target.value;
//                     setArabicSentences(newArabicSentences);
//                   }}
//                 />
//               </Col>
//               <Col md={2} className="d-flex align-items-center">
//                 <Form.Check
//                   type="radio"
//                   name="correctArabicSent"
//                   onChange={() => setCorrectArabicSent(index)}
//                   checked={correctArabicSent === index}
//                 />
//               </Col>
//             </Row>
//           </Form.Group>
//         ))}
//         <Row className="justify-content-center mt-4">
//           <Col xs={12} md={6} className="d-flex justify-content-center">
//             <Button variant="primary" type="submit" className="w-100">
//               Submit
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </Container>
//   );
// }

import { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import config from "../../config";
import randomizeChoices from "../modules/randomizeChoices";

const { BASE_URL } = config;

export default function AddSentence() {
  const [dbSentences, setDbSentences] = useState([]);
  const [sentences, setSentences] = useState([]);
  const [sent1, setSent1] = useState("");
  const [sent2, setSent2] = useState("");
  // const [choices, setChoices] = useState(["", "", "", ""]);
  const [choice, setChoice] = useState("");
  const [wrongChoices, setWrongChoices] = useState(["", "", ""]);
  // const [correctChoice, setCorrectChoice] = useState(null);
  const [arabicSentence, setArabicSentence] = useState("");
  // const [arabicSentences, setArabicSentences] = useState(["", "", ""]);
  // const [correctArabicSent, setCorrectArabicSent] = useState(null);

  const handleAdd = () => {
    if (sentences.length >= 6) {
      alert("You must submit these 6 sentences first!");
      return;
    }

    if (
      sentences.some(
        (sentence) =>
          sentence.sent1.toLowerCase() === sent1.toLowerCase() &&
          sentence.sent2.toLowerCase() === sent2.toLowerCase() &&
          sentence.choices.includes(choice.toLowerCase())

        // sentence.choices[sentence.correct].toLowerCase() ===
        //   choices[correctChoice].toLowerCase()
      )
    ) {
      alert("This sentence is already added!");

      return;
    }

    if (
      dbSentences.some(
        (sentence) =>
          sentence.sent1.toLowerCase() === sent1.toLowerCase() &&
          sentence.sent2.toLowerCase() === sent2.toLowerCase() &&
          sentence.choices.includes(choice.toLowerCase())
        // sentence.choices[sentence.correct].toLowerCase() ===
        //   choices[correctChoice].toLowerCase()
      )
    ) {
      alert("This sentence is already in the database!");
      return;
    }

    if (
      !sent1 ||
      !sent2 ||
      !choice ||
      !arabicSentence ||
      wrongChoices.some((choice) => !choice)
      // choices.some((choice) => !choice) ||
      // arabicSentences.some((sentence) => !sentence)
    ) {
      alert("Please fill in all fields before adding.");
      return;
    }

    const newSentence = {
      sent1: sent1,
      sent2: sent2,
      choices: [choice, ...wrongChoices],
      correct: Number(0),
      arabicSentence,
    };

    setSentences([...sentences, newSentence]);
    setSent1("");
    setSent2("");
    setChoice("");
    setWrongChoices(["", "", ""]);
    setArabicSentence("");
    // setChoices(["", "", "", ""]);
    // setCorrectChoice(null);
    // setArabicSentences(["", "", ""]);
    // setCorrectArabicSent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sentences.length !== 6) {
      alert("You must add exactly 6 sentences before submitting.");
      return;
    }

    const newSentences = sentences.map((sentence, index) => ({
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
      } else {
        const data = await response.json();
        alert(data.message);
      }
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
  }, []);

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-center mb-4">Add Sentence</h2>
      <p className="float-end me-1 text-warning fs-6 fw-semibold text-decoration-underline">
        Add 6 sentences then Submit
      </p>
      <Form className="p-3 border rounded shadow-sm bg-light">
        <Form.Label>Sentence 1</Form.Label>
        <Row>
          <Col md={10}>
            <Form.Control
              type="text"
              value={sent1}
              onChange={(e) => setSent1(e.target.value)}
            />
          </Col>
        </Row>
        <Form.Label className="text-success fw-semibold">
          Correct Choice
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
        <hr />
        <Form.Label className="text-danger fw-semibold">
          Wrong Choices
        </Form.Label>
        <Row className="row-gap-2">
          <Col md={4}>
            <Form.Control
              className="border-2 border-danger"
              placeholder="Wrong Choice 1"
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
              placeholder="Wrong Choice 2"
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
              placeholder="Wrong Choice 3"
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
        <Form.Label>Sentence in arabic</Form.Label>
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
        {/* </Form.Group> */}
        {/* ))} */}
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
            <Button variant="success" onClick={handleSubmit} className="w-100">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
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
                  <Card.Title>
                    {sentence.sent1} {sentences[index].choices[0]}{" "}
                    {sentence.sent2}
                  </Card.Title>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
