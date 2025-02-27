import { Button } from "react-bootstrap";

import useViewStore from "../store/viewStore";

export default function HomeButton() {
  const { setView } = useViewStore();
  return (
    <Button
      variant="dark"
      size="md"
      className="position-fixed rounded-pill px-4 py-2 shadow"
      style={{ zIndex: 10, top: "0.3rem", left: "1rem" }}
      onClick={() => setView("")}
    >
      ⬅ Home
    </Button>
  );
}
