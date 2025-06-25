import "./App.css";
import SignUp from "./components/signUp";
import SignIn from "./components/signIn";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./features/users/sessionSlice";
import type { AppDispatch } from "./store";
import Movies from "./components/movies";
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [loggedIn, setLoggedIn] = useState(false);
  const [signingUp, setSigningUp] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (
      token &&
      token !== undefined &&
      token.trim() !== "" &&
      token != "undefined"
    ) {
      setLoggedIn(true);
      console.log("Token:", token);
    } else {
      setLoggedIn(false);
    }
  }, []);
  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  return (
    <>
      <div className="c">
        <div className="auth-wrapper">
          {loggedIn ? (
            <>
              <Movies />
              <button
                style={{ backgroundColor: "#200C0C" }}
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              {signingUp ? <SignUp /> : <SignIn />}
              <div style={{ marginTop: "1rem" }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSigningUp(!signingUp);
                  }}
                >
                  {signingUp
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
