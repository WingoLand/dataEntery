import { useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";

import useLogInStore from "../store/loginStore";

import config from "../../config";
const { password: correctPassword } = config;

export default function Login() {
  const { setIsLoggedIn } = useLogInStore();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handelClick = () => {
    if (password == correctPassword) return setIsLoggedIn(true);

    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 2000);
  };

  return (
    <MDBContainer fluid className="p-3 my-5 ">
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="img-fluid"
            alt="Phone image"
          />
        </MDBCol>

        <MDBCol
          col="4"
          md="6"
          className="d-flex flex-column justify-content-center align-items-center mt-5"
        >
          <MDBInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
            className="mb-4 "
          />

          <MDBBtn className="mb-4 w-50" onClick={handelClick}>
            Log in
          </MDBBtn>
        </MDBCol>
      </MDBRow>
      {show && (
        <div className="alert alert-danger" role="alert">
          Incorrect password
        </div>
      )}
    </MDBContainer>
  );
}
