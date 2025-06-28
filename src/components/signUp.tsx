import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useState } from "react";
import { userCreate } from "../features/users/usersSlice";
import { motion } from "motion/react";

interface SignUpProps {
  onSuccess: () => void;
}

export default function SignUp({ onSuccess }: SignUpProps) {
  const userStatus = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const accountInfo = useSelector((state: RootState) => state.user.infoStatus);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    dispatch(userCreate({ email, name, password, confirmPassword }))
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
        placeholder="Repeat password"
        type="password"
        required
      />
      <button style={{ marginTop: "30px" }} type="submit">
        Sign Up
      </button>
      {userStatus === "loading" && <p>Signing you up...</p>}

      {accountInfo ? (
        <p style={{ color: "green", marginTop: "20px", width: "200px" }}>
          {accountInfo}
        </p>
      ) : (
        error && (
          <p style={{ color: "red", marginTop: "20px", width: "200px" }}>
            {error}
          </p>
        )
      )}
    </motion.form>
  );
}
