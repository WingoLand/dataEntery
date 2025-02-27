// import { useState } from "react";
// import { Container } from "react-bootstrap";

// import Login from "./pages/Login";
// import useLogInStore from "./store/loginStore";
// import AddNew from "./pages/AddNew";

// function App() {
//   const { isLoggedIn } = useLogInStore();
//   const [whatToShow, setWhatToShow] = useState("");

//   return (
//     <Container className="mt-4">
//       {!isLoggedIn ? (
//         <Login />
//       ) : (
//         <>
//           {whatToShow === "" && (
//             <button title="Add data" onClick={() => setWhatToShow("addNew")}>
//               Add data
//             </button>
//           )}
//           {whatToShow === "addNew" && <AddNew />}
//         </>
//       )}
//     </Container>
//   );
// }

// export default App;

import { Container, Button, Card } from "react-bootstrap";

import Login from "./pages/Login";
import useLogInStore from "./store/loginStore";
import useViewStore from "./store/viewStore";
import AddNew from "./pages/AddNew";
import Edit from "./pages/Edit";

function App() {
  const { isLoggedIn } = useLogInStore();
  const { view, setView } = useViewStore();

  return (
    <Container className="mt-4 d-flex justify-content-center align-items-center">
      {!isLoggedIn ? (
        <Login />
      ) : (
        <>
          {view === "" && (
            <Card
              className="p-4 shadow-lg text-center w-100 gap-2"
              style={{ maxWidth: "500px" }}
            >
              <Button
                variant="primary"
                className="w-100"
                onClick={() => setView("addNew")}
              >
                Add Data
              </Button>
              <Button
                variant="primary"
                className="w-100"
                onClick={() => setView("edit")}
              >
                Edit Data
              </Button>
            </Card>
          )}
          {view === "addNew" && <AddNew />}
          {view === "edit" && <Edit />}
        </>
      )}
    </Container>
  );
}

export default App;
