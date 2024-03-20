import { useEffect, useState } from "react";
import vvnLogo from "@/assets/vvnfrontlogo.png";
import "./styles/app.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccount,
  setLogoutAction,
  setUserLoginInfo,
} from "./redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

function App() {
  const account = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAccount());
  }, []);

  //console.log(">>>isAuthenticated", isAuthenticated);

  return (
    <div className="home">
      <div>
        <div className="home">
          <div onClick={() => navigate("/login")}>
            <img
              src={vvnLogo}
              className="logo"
              alt="chp logo"
              style={{ width: "400px", height: "400px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
