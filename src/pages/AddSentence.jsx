// import { useState } from "react";

// import config from "../../config";

// const { BASE_URL } = config;

// export default function AddSentence() {
//   const [sent1, setSent1] = useState("");
//   const [sent2, setSent2] = useState("");
//   const [choice1, setChoice1] = useState("");
//   const [choice2, setChoice2] = useState("");
//   const [choice3, setChoice3] = useState("");
//   const [choice4, setChoice4] = useState("");
//   const [correctChoice, setCorrectChoice] = useState(null);
//   const [arabicSent1, setArabicSent1] = useState("");
//   const [arabicSent2, setArabicSent2] = useState("");
//   const [arabicSent3, setArabicSent3] = useState("");
//   const [correctArabicSent, setCorrectArabicSent] = useState(null);
//   const handleClick = () => {
//     const data = {
//       sent1: sent1,
//       sent2: sent2,
//       choices: [choice1, choice2, choice3, choice4],
//       correct: correctChoice,
//       arabicSents: [arabicSent1, arabicSent2, arabicSent3],
//       correctArabicSent: correctArabicSent,
//     };
//     fetch(`${BASE_URL}/sentence/addSentence`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//         setSent1("");
//         setSent2("");
//         setChoice1("");
//         setChoice2("");
//         setChoice3("");
//         setChoice4("");
//         setCorrectChoice(null);
//         setArabicSent1("");
//         setArabicSent2("");
//         setArabicSent3("");
//         setCorrectArabicSent(null);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   return (
//     <div style={{ display: "flex", justifyContent: "center" }}>
//       <div>
//         <label>
//           Sentence 1:
//           <input
//             type="text"
//             name="sent1"
//             value={sent1}
//             onChange={(e) => setSent1(e.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           Sentence 2:
//           <input
//             type="text"
//             name="sent2"
//             value={sent2}
//             onChange={(e) => setSent2(e.target.value)}
//           />
//         </label>
//         <br />
//         <div>
//           <label>
//             Choice 1:
//             <input
//               type="text"
//               name="choice1"
//               value={choice1}
//               onChange={(e) => {
//                 setChoice1(e.target.value);
//                 setCorrectChoice(0);
//               }}
//             />
//             <input
//               type="radio"
//               name="correctChoice"
//               value="choice1"
//               onChange={() => setCorrectChoice(0)}
//             />
//           </label>
//           <br />
//           <label>
//             Choice 2:
//             <input
//               type="text"
//               name="choice2"
//               value={choice2}
//               onChange={(e) => {
//                 setChoice2(e.target.value);
//                 setCorrectChoice(1);
//               }}
//             />
//             <input
//               type="radio"
//               name="correctChoice"
//               value="choice2"
//               onChange={() => setCorrectChoice(1)}
//             />
//           </label>
//           <br />
//           <label>
//             Choice 3:
//             <input
//               type="text"
//               name="choice3"
//               value={choice3}
//               onChange={(e) => {
//                 setChoice3(e.target.value);
//                 setCorrectChoice(2);
//               }}
//             />
//             <input
//               type="radio"
//               name="correctChoice"
//               value="choice3"
//               onChange={() => setCorrectChoice(2)}
//             />
//           </label>
//           <br />
//           <label>
//             Choice 4:
//             <input
//               type="text"
//               name="choice4"
//               value={choice4}
//               onChange={(e) => {
//                 setChoice4(e.target.value);
//                 setCorrectChoice(3);
//               }}
//             />
//             <input
//               type="radio"
//               name="correctChoice"
//               value="choice4"
//               onChange={() => setCorrectChoice(3)}
//             />
//           </label>
//           <br />
//           <label>
//             Arabic Sentence 1:
//             <input
//               type="text"
//               name="arabicSent1"
//               value={arabicSent1}
//               onChange={(e) => setArabicSent1(e.target.value)}
//             />
//             <input
//               type="radio"
//               name="correctArabicSent"
//               value="arabicSent1"
//               onChange={() => setCorrectArabicSent(0)}
//             />
//           </label>
//           <br />
//           <label>
//             Arabic Sentence 2:
//             <input
//               type="text"
//               name="arabicSent2"
//               value={arabicSent2}
//               onChange={(e) => setArabicSent2(e.target.value)}
//             />
//             <input
//               type="radio"
//               name="correctArabicSent"
//               value="arabicSent2"
//               onChange={() => setCorrectArabicSent(1)}
//             />
//           </label>
//           <br />
//           <label>
//             Arabic Sentence 3:
//             <input
//               type="text"
//               name="arabicSent3"
//               value={arabicSent3}
//               onChange={(e) => setArabicSent3(e.target.value)}
//             />
//             <input
//               type="radio"
//               name="correctArabicSent"
//               value="arabicSent3"
//               onChange={() => setCorrectArabicSent(2)}
//             />
//           </label>
//           <br />
//         </div>
//         <button style={{ marginTop: "10px" }} onClick={handleClick}>
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import config from "../../config";

const { BASE_URL } = config;

export default function AddSentence() {
  const [sent1, setSent1] = useState("");
  const [sent2, setSent2] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctChoice, setCorrectChoice] = useState(null);
  const [arabicSentences, setArabicSentences] = useState(["", "", ""]);
  const [correctArabicSent, setCorrectArabicSent] = useState(null);

  const handleSubmit = () => {
    const data = {
      sent1,
      sent2,
      choices,
      correct: correctChoice,
      arabicSents: arabicSentences,
      correctArabicSent,
    };
    fetch(`${BASE_URL}/sentence/addSentence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        setSent1("");
        setSent2("");
        setChoices(["", "", "", ""]);
        setCorrectChoice(null);
        setArabicSentences(["", "", ""]);
        setCorrectArabicSent(null);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-center mb-4">Add Sentence</h2>
      <Form
        onSubmit={handleSubmit}
        className="p-3 border rounded shadow-sm bg-light"
      >
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Sentence 1</Form.Label>
              <Form.Control
                type="text"
                value={sent1}
                onChange={(e) => setSent1(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Sentence 2</Form.Label>
              <Form.Control
                type="text"
                value={sent2}
                onChange={(e) => setSent2(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <h4 className="mt-4">Choices</h4>
        {choices.map((choice, index) => (
          <Form.Group key={index}>
            <Form.Label>Choice {index + 1}</Form.Label>
            <Row>
              <Col md={10}>
                <Form.Control
                  type="text"
                  value={choice}
                  onChange={(e) => {
                    const newChoices = [...choices];
                    newChoices[index] = e.target.value;
                    setChoices(newChoices);
                  }}
                />
              </Col>
              <Col md={2} className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  name="correctChoice"
                  onChange={() => setCorrectChoice(index)}
                  checked={correctChoice === index}
                />
              </Col>
            </Row>
          </Form.Group>
        ))}
        <h4 className="mt-4">Arabic Sentences</h4>
        {arabicSentences.map((sentence, index) => (
          <Form.Group key={index}>
            <Form.Label>Arabic Sentence {index + 1}</Form.Label>
            <Row>
              <Col md={10}>
                <Form.Control
                  type="text"
                  value={sentence}
                  onChange={(e) => {
                    const newArabicSentences = [...arabicSentences];
                    newArabicSentences[index] = e.target.value;
                    setArabicSentences(newArabicSentences);
                  }}
                />
              </Col>
              <Col md={2} className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  name="correctArabicSent"
                  onChange={() => setCorrectArabicSent(index)}
                  checked={correctArabicSent === index}
                />
              </Col>
            </Row>
          </Form.Group>
        ))}
        <Row className="justify-content-center mt-4">
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
