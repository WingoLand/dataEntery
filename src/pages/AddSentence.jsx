import { useState } from "react";

import config from "../../config";

const { BASE_URL } = config;

export default function AddSentence() {
  const [sent1, setSent1] = useState("");
  const [sent2, setSent2] = useState("");
  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");
  const [choice3, setChoice3] = useState("");
  const [choice4, setChoice4] = useState("");
  const [correctChoice, setCorrectChoice] = useState(null);

  const handleClick = () => {
    const data = {
      sent1: sent1,
      sent2: sent2,
      choices: [choice1, choice2, choice3, choice4],
      correct: correctChoice,
    };
    fetch(`${BASE_URL}/sentence/addSentence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setSent1("");
        setSent2("");
        setChoice1("");
        setChoice2("");
        setChoice3("");
        setChoice4("");
        setCorrectChoice(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <label>
          Sentence 1:
          <input
            type="text"
            name="sent1"
            value={sent1}
            onChange={(e) => setSent1(e.target.value)}
          />
        </label>
        <br />
        <label>
          Sentence 2:
          <input
            type="text"
            name="sent2"
            value={sent2}
            onChange={(e) => setSent2(e.target.value)}
          />
        </label>
        <br />
        <div>
          <label>
            Choice 1:
            <input
              type="text"
              name="choice1"
              value={choice1}
              onChange={(e) => {
                setChoice1(e.target.value);
                setCorrectChoice(0);
              }}
            />
            <input
              type="radio"
              name="correctChoice"
              value="choice1"
              onChange={() => setCorrectChoice(0)}
            />
          </label>
          <br />
          <label>
            Choice 2:
            <input
              type="text"
              name="choice2"
              value={choice2}
              onChange={(e) => {
                setChoice2(e.target.value);
                setCorrectChoice(1);
              }}
            />
            <input
              type="radio"
              name="correctChoice"
              value="choice2"
              onChange={() => setCorrectChoice(1)}
            />
          </label>
          <br />
          <label>
            Choice 3:
            <input
              type="text"
              name="choice3"
              value={choice3}
              onChange={(e) => {
                setChoice3(e.target.value);
                setCorrectChoice(2);
              }}
            />
            <input
              type="radio"
              name="correctChoice"
              value="choice3"
              onChange={() => setCorrectChoice(2)}
            />
          </label>
          <br />
          <label>
            Choice 4:
            <input
              type="text"
              name="choice4"
              value={choice4}
              onChange={(e) => {
                setChoice4(e.target.value);
                setCorrectChoice(3);
              }}
            />
            <input
              type="radio"
              name="correctChoice"
              value="choice4"
              onChange={() => setCorrectChoice(3)}
            />
          </label>
        </div>
        <button style={{ marginTop: "10px" }} onClick={handleClick}>
          Submit
        </button>
      </div>
    </div>
  );
}
