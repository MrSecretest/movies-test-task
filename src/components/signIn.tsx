import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useState } from "react";
import { sessionCreate } from "../features/users/sessionSlice";
import { motion } from "motion/react";

interface SignUpProps {
  onSuccess: () => void;
}
export default function SignUp({ onSuccess }: SignUpProps) {
  const sessionStatus = useSelector((state: RootState) => state.session.status);
  const error = useSelector((state: RootState) => state.session.error);
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(sessionCreate({ email, password }))
      .unwrap()
      .then(() => {
        onSuccess();
      });
  };
  return (
    <motion.form
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{
        duration: 0.2,
      }}
      onSubmit={handleSubmit}
      className="auth-box"
    >
      <p
        style={{ fontSize: "large", fontWeight: "800px", marginBottom: "30px" }}
      >
        Sign In
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
      {sessionStatus === "loading" && <p>Signing you in...</p>}
      {error && (
        <p style={{ color: "red", marginTop: "20px", width: "200px" }}>
          {error}
        </p>
      )}
    </motion.form>
  );
}
