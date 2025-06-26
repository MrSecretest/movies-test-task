import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useState } from "react";
import { sessionCreate } from "../features/users/sessionSlice";

export default function SignUp() {
  const sessionStatus = useSelector((state: RootState) => state.session.status);
  const error = useSelector((state: RootState) => state.session.error);
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(sessionCreate({ email, password }));
  };
  return (
    <form onSubmit={handleSubmit} className="auth-box">
      <p
        style={{ fontSize: "large", fontWeight: "800px", marginBottom: "30px" }}
      >
        Create New Account
      </p>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        required
      />
      <button style={{ marginTop: "30px" }} type="submit">
        Sign In
      </button>
      {sessionStatus === "loading" && <p>Signing you up...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
