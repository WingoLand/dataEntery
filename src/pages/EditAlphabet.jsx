import { useEffect, useState } from "react";
import config from "../../config";
import {
  Button,
  Container,
  Row,
  Col,
  Modal,
  Spinner,
  Form,
  Image,
} from "react-bootstrap";

const { BASE_URL } = config;

export default function EditAlphabet() {
  const [alphabet, setAlphabet] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditWord, setIsEditWord] = useState(false);
  const [isEditWordPic, setIsEditWordPic] = useState(false);
  const [isEditCapPic, setIsEditCapPic] = useState(false);
  const [isEditSmallPic, setIsEditSmallPic] = useState(false);

  const [word, setWord] = useState("");
  const [wordPic, setWordPic] = useState(null);
  const [capPic, setCapPic] = useState(null);
  const [smallPic, setSmallPic] = useState(null);

  const [tempWordPic, setTempWordPic] = useState(null);
  const [tempCapPic, setTempCapPic] = useState(null);
  const [tempSmallPic, setTempSmallPic] = useState(null);

  const fetchAlphabet = async () => {
    try {
      const response = await fetch(`${BASE_URL}/alphabet`);
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message);
      } else {
        setAlphabet(data);
        console.log(data[0]);
      }
    } catch (error) {
      setMessage("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlphabet();
  }, []);

  const handelUpdate = async () => {
    if (!selectedLetter) return;

    const formData = new FormData();
    formData.append("capital", selectedLetter.capital);
    formData.append("small", selectedLetter.small);
    formData.append("word", word);

    if (capPic) formData.append("capPic", capPic);
    if (smallPic) formData.append("smallPic", smallPic);
    if (wordPic) formData.append("wordPic", wordPic);

    try {
      const response = await fetch(`${BASE_URL}/alphabet/updateLetter`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      alert("Letter updated successfully!");
      setShowModal(false);
      fetchAlphabet();
    } catch (error) {
      console.error("Error updating letter:", error);
      alert(error.message);
    }
  };

  const handleEditClick = (letter) => {
    setSelectedLetter(letter);
    setWord(letter.word || "");
    setWordPic(letter.wordPic);
    setCapPic(letter.capPic);
    setSmallPic(letter.smallPic);
    setTempWordPic(null);
    setTempCapPic(null);
    setTempSmallPic(null);
    setIsEditWord(false);
    setIsEditWordPic(false);
    setIsEditCapPic(false);
    setIsEditSmallPic(false);
    setShowModal(true);
  };

  const handleFileChange = (e, setTempPic, setPic) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPic({
          contentType: file.type,
          data: reader.result.split(",")[1],
        });
        setPic({
          contentType: file.type,
          data: reader.result.split(",")[1],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPicChange = (tempPic, setPic, setIsEdit) => {
    if (tempPic) {
      setPic(tempPic);
      setIsEdit(false);
    }
  };

  const EditIcon = ({ isActive, onActivate, onConfirm, onCancel }) => (
    <>
      {!isActive ? (
        <i
          className="bi bi-pencil-square text-primary fs-4"
          style={{ cursor: "pointer" }}
          onClick={onActivate}
        ></i>
      ) : (
        <>
          <i
            className="bi bi-check-circle text-success fs-4"
            style={{ cursor: "pointer" }}
            onClick={onConfirm}
          ></i>
          <i
            className="bi bi-x-circle text-danger fs-4"
            style={{ cursor: "pointer" }}
            onClick={onCancel}
          ></i>
        </>
      )}
    </>
  );

  return (
    <Container className="mt-4 text-center">
      <h2 className="mb-4 fw-bold">Edit Alphabet</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : message ? (
        <p className="text-danger">{message}</p>
      ) : (
        <Row className="justify-content-center g-2">
          {alphabet.map((item) => (
            <Col xs={4} sm={3} md={2} lg={1} key={item.id}>
              <Button
                variant="primary"
                className="w-100 shadow-sm rounded-pill"
                onClick={() => handleEditClick(item)}
              >
                {item.capital}
              </Button>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Letter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLetter && (
            <>
              <Form.Group>
                <Form.Label className="fw-semibold">Word</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="text"
                    disabled={!isEditWord}
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                  />
                  <EditIcon
                    isActive={isEditWord}
                    onActivate={() => setIsEditWord(true)}
                    onConfirm={() => setIsEditWord(false)}
                    onCancel={() => {
                      setWord(selectedLetter.word);
                      setIsEditWord(false);
                    }}
                  />
                </div>
              </Form.Group>

              {[
                {
                  label: "Word Picture",
                  pic: wordPic,
                  tempPic: tempWordPic,
                  setPic: setWordPic,
                  setTempPic: setTempWordPic,
                  isEdit: isEditWordPic,
                  setIsEdit: setIsEditWordPic,
                },
                {
                  label: "Capital Letter Picture",
                  pic: capPic,
                  tempPic: tempCapPic,
                  setPic: setCapPic,
                  setTempPic: setTempCapPic,
                  isEdit: isEditCapPic,
                  setIsEdit: setIsEditCapPic,
                },
                {
                  label: "Small Letter Picture",
                  pic: smallPic,
                  tempPic: tempSmallPic,
                  setPic: setSmallPic,
                  setTempPic: setTempSmallPic,
                  isEdit: isEditSmallPic,
                  setIsEdit: setIsEditSmallPic,
                },
              ].map(
                (
                  {
                    label,
                    pic,
                    tempPic,
                    setPic,
                    setTempPic,
                    isEdit,
                    setIsEdit,
                  },
                  index
                ) => (
                  <div
                    key={index}
                    className="mt-3 d-flex align-items-center gap-3 flex-wrap"
                  >
                    <Image
                      src={`data:${
                        tempPic ? tempPic.contentType : pic?.contentType
                      };base64,${tempPic ? tempPic.data : pic?.data}`}
                      className="img-thumbnail rounded-circle shadow-sm border border-secondary"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <EditIcon
                      isActive={isEdit}
                      onActivate={() => setIsEdit(true)}
                      onConfirm={() =>
                        confirmPicChange(tempPic, setPic, setIsEdit)
                      }
                      onCancel={() => {
                        setTempPic(null);
                        setIsEdit(false);
                      }}
                    />
                    {isEdit && (
                      <Form.Control
                        type="file"
                        onChange={(e) =>
                          handleFileChange(e, setTempPic, setPic)
                        }
                      />
                    )}
                  </div>
                )
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
          <Button variant="warning" className="w-25" onClick={handelUpdate}>
            Update
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

// import { useEffect, useState } from "react";
// import config from "../../config";
// import {
//   Button,
//   Container,
//   Row,
//   Col,
//   Modal,
//   Spinner,
//   Form,
//   Image,
//   Tooltip,
//   OverlayTrigger,
// } from "react-bootstrap";
// const { BASE_URL } = config;

// export default function EditAlphabet() {
//   const [alphabet, setAlphabet] = useState([]);
//   const [message, setMessage] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedLetter, setSelectedLetter] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [word, setWord] = useState("");
//   const [wordPic, setWordPic] = useState(null);
//   const [capPic, setCapPic] = useState(null);
//   const [smallPic, setSmallPic] = useState(null);

//   // Fetch alphabet data
//   const fetchAlphabet = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/alphabet`);
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to load data");
//       setAlphabet(data);
//     } catch (error) {
//       setMessage("Failed to load data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAlphabet();
//   }, []);

//   // Handle letter update
//   const handleUpdate = async () => {
//     if (!selectedLetter) return;
//     const formData = new FormData();
//     formData.append("capital", selectedLetter.capital);
//     formData.append("small", selectedLetter.small);
//     formData.append("word", word);
//     if (capPic) formData.append("capPic", capPic);
//     if (smallPic) formData.append("smallPic", smallPic);
//     if (wordPic) formData.append("wordPic", wordPic);

//     try {
//       const response = await fetch(`${BASE_URL}/alphabet/updateLetter`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Update failed");
//       alert("Letter updated successfully!");
//       setShowModal(false);
//       fetchAlphabet(); // Refresh data
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const handleEditClick = (letter) => {
//     setSelectedLetter(letter);
//     setWord(letter.word || "");
//     setWordPic(letter.wordPic);
//     setCapPic(letter.capPic);
//     setSmallPic(letter.smallPic);
//     setShowModal(true);
//   };

//   return (
//     <Container className="mt-5 text-center">
//       <h2 className="mb-4 fw-bold">Edit Alphabet</h2>

//       {/* Loading State */}
//       {loading ? (
//         <Row className="justify-content-center">
//           {[...Array(8)].map((_, i) => (
//             <Col xs={4} sm={3} md={2} lg={1} key={i}>
//               <div className="placeholder-glow">
//                 <span className="placeholder col-12 rounded-pill bg-secondary"></span>
//               </div>
//             </Col>
//           ))}
//         </Row>
//       ) : message ? (
//         <p className="text-danger">{message}</p>
//       ) : (
//         <Row className="justify-content-center g-2">
//           {alphabet.map((item) => (
//             <Col xs={4} sm={3} md={2} lg={1} key={item.id}>
//               <Button
//                 variant="primary"
//                 className="w-100 shadow-sm rounded-pill"
//                 onClick={() => handleEditClick(item)}
//               >
//                 {item.capital}
//               </Button>
//             </Col>
//           ))}
//         </Row>
//       )}

//       {/* Modal */}
//       <Modal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         centered
//         className="shadow-lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Letter</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedLetter && (
//             <>
//               {/* Word Field */}
//               <Form.Group className="mb-3">
//                 <Form.Label className="fw-semibold">Word</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={word}
//                   onChange={(e) => setWord(e.target.value)}
//                   placeholder="Enter word"
//                 />
//               </Form.Group>

//               {/* Images */}
//               <div className="mb-3">
//                 <Form.Label className="fw-semibold">Word Picture</Form.Label>
//                 <ImageUploader
//                   image={wordPic}
//                   onUpload={(file) => setWordPic(file)}
//                 />
//               </div>
//               <div className="mb-3">
//                 <Form.Label className="fw-semibold">
//                   Capital Letter Picture
//                 </Form.Label>
//                 <ImageUploader
//                   image={capPic}
//                   onUpload={(file) => setCapPic(file)}
//                 />
//               </div>
//               <div className="mb-3">
//                 <Form.Label className="fw-semibold">
//                   Small Letter Picture
//                 </Form.Label>
//                 <ImageUploader
//                   image={smallPic}
//                   onUpload={(file) => setSmallPic(file)}
//                 />
//               </div>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="warning" onClick={handleUpdate}>
//             Update
//           </Button>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// function handleFileChange  (e, setPic)  {
//   const file = e.target.files[0];
//   if (file) setPic(file);
// };

// // Reusable ImageUploader Component
// function ImageUploader({ image, onUpload }) {
//   const [preview, setPreview] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result);
//       reader.readAsDataURL(file);
//       onUpload(file);
//     }
//   };

//   return (
//     <div className="d-flex align-items-center gap-3">
//       <div>
//         {preview || image ? (
//           <Image
//             src={preview || `data:${image.contentType};base64,${image.data}`}
//             alt="Preview"
//             className="rounded-circle shadow-sm border border-secondary"
//             style={{ width: "100px", height: "100px", objectFit: "cover" }}
//           />
//         ) : (
//           <div
//             className="bg-light rounded-circle d-flex justify-content-center align-items-center border border-secondary"
//             style={{ width: "100px", height: "100px" }}
//           >
//             No Image
//           </div>
//         )}
//       </div>
//       <Form.Control
//         type="file"
//         accept="image/*"
//         onChange={(e) => handleFileChange(e, setPic)}
//         className="d-none"
//         id="upload-image"
//       />
//       <label htmlFor="upload-image" className="btn btn-primary btn-sm">
//         Upload
//       </label>
//     </div>
//   );
// }
