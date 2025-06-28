import "./App.css";
import SignUp from "./components/signUp";
import SignIn from "./components/signIn";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./features/users/sessionSlice";
import type { AppDispatch } from "./store";
import Movies from "./components/movies";
import { AnimatePresence, motion } from "motion/react";

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
    setLoggedIn(false);
  };

  return (
    <>
      <div className="website-page">
        <AnimatePresence mode="wait">
          {loggedIn ? (
            <motion.div
              key="logged-in"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.2 }}
              style={{ placeItems: "center", overflowY: "hidden" }}
            >
              <Movies />
              <button className="caution" onClick={handleLogout}>
                Log out
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.2 }}
            >
              <div className="auth-container">
                <div className="auth-col">
                  {signingUp ? (
                    <SignUp onSuccess={() => setLoggedIn(true)} />
                  ) : (
                    <SignIn onSuccess={() => setLoggedIn(true)} />
                  )}
                  <a
                    style={{ paddingBottom: "10px" }}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
