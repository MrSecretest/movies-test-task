import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useState } from "react";
import { userCreate } from "../features/users/usersSlice";
import "../styles/auth.css";

export default function SignUp() {
  const sessionStatus = useSelector((state: RootState) => state.session.status);
  const error = useSelector((state: RootState) => state.session.error);
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(userCreate({ email, name, password, confirmPassword }));
  };
  return (
    <form onSubmit={handleSubmit} className="auth-box">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        type="name"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        required
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Password"
        type="password"
        required
      />
      <button type="submit">Sign Up</button>
      {sessionStatus === "loading" && <p>Signing you up...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
