// import { useState } from "react";

// import config from "../../config";

// const { BASE_URL } = config;

// export default function AddAlphabet() {
//   const [letter, setLetter] = useState("");
//   const [word, setWord] = useState("");
//   const [capPic, setCapPic] = useState(null);
//   const [smallPic, setSmallPic] = useState(null);
//   const [wordPic, setWordPic] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const capitalizeFirstLetter = (string) => {
//       if (!string) return string; // Handle empty strings
//       return string.charAt(0).toUpperCase() + string.slice(1);
//     };

//     if (!letter || !word || !capPic || !smallPic || !wordPic) {
//       alert("Please fill in all fields");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("capital", letter.toUpperCase());
//     formData.append("small", letter.toLowerCase());
//     formData.append("word", capitalizeFirstLetter(word));
//     formData.append("capPic", capPic);
//     formData.append("smallPic", smallPic);
//     formData.append("wordPic", wordPic);

//     try {
//       const response = await fetch(`${BASE_URL}/alphabet`, {
//         method: "POST",
//         body: formData,
//       });
//       if (response.ok) {
//         alert("File uploaded successfully");
//         setLetter("");
//         setWord("");
//         setCapPic(null);
//         setSmallPic(null);
//         setWordPic(null);
//         return console.log("File uploaded successfully:", response.data);
//       }
//       await response.json().then((data) => {
//         alert(data.message);
//         console.log(data.err);
//       });
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   return (
//     <div
//       className="App"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div>Add Alphabet</div>
//       <form onSubmit={handleSubmit}>
//         <div style={styles.field}>
//           <label>
//             letter:
//             <input
//               type="text"
//               value={letter}
//               onChange={(e) => setLetter(e.target.value.trim())}
//             />
//           </label>
//         </div>
//         <div style={styles.field}>
//           <label>
//             Word:
//             <input
//               type="text"
//               value={word}
//               onChange={(e) => setWord(e.target.value.trim())}
//             />
//           </label>
//         </div>
//         <div style={styles.field}>
//           <label>
//             Capital Picture:
//             <input type="file" onChange={(e) => setCapPic(e.target.files[0])} />
//           </label>
//         </div>
//         <div style={styles.field}>
//           <label>
//             Small Picture:
//             <input
//               type="file"
//               onChange={(e) => setSmallPic(e.target.files[0])}
//             />
//           </label>
//         </div>
//         <div style={styles.field}>
//           <label>
//             Word Picture:
//             <input
//               type="file"
//               onChange={(e) => setWordPic(e.target.files[0])}
//             />
//           </label>
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// const styles = {
//   field: {
//     margin: 10,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
// };

import { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import config from "../../config";

const { BASE_URL } = config;

export default function AddAlphabet() {
  const [letter, setLetter] = useState("");
  const [word, setWord] = useState("");
  const [capPic, setCapPic] = useState(null);
  const [smallPic, setSmallPic] = useState(null);
  const [wordPic, setWordPic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const capitalizeFirstLetter = (string) => {
      if (!string) return string;
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if (!letter || !word || !capPic || !smallPic || !wordPic) {
      alert("Please fill in all fields");
      return;
    }
    const formData = new FormData();
    formData.append("capital", letter.toUpperCase());
    formData.append("small", letter.toLowerCase());
    formData.append("word", capitalizeFirstLetter(word));
    formData.append("capPic", capPic);
    formData.append("smallPic", smallPic);
    formData.append("wordPic", wordPic);

    try {
      const response = await fetch(`${BASE_URL}/alphabet`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("File uploaded successfully");
        setLetter("");
        setWord("");
        setCapPic(null);
        setSmallPic(null);
        setWordPic(null);
        return console.log("File uploaded successfully:", response.data);
      }
      await response.json().then((data) => {
        alert(data.message);
        console.log(data.err);
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Add Alphabet</h2>
      <Form
        onSubmit={handleSubmit}
        className="p-3 border rounded shadow-sm bg-light"
      >
        <Form.Group className="mb-3">
          <Form.Label>Letter</Form.Label>
          <Form.Control
            type="text"
            value={letter}
            onChange={(e) => setLetter(e.target.value.trim())}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Word</Form.Label>
          <Form.Control
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value.trim())}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Capital Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setCapPic(e.target.files[0])}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Small Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setSmallPic(e.target.files[0])}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Word Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setWordPic(e.target.files[0])}
          />
        </Form.Group>
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
