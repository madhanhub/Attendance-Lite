import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/new/user", form);
      alert("User registered!");
      navigate("/");
    } catch (err) {
      alert("Registration failed!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #4285F4, #EA4335, #FBBC05, #34A853)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 320,
          background: "white",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Register</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          style={{
            width: "95%",
            padding: 10,
            marginBottom: 12,
            border: "1px solid #ccc",
            borderRadius: 5,
            outline: "none",
          }}
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={{
            width: "95%",
            padding: 10,
            marginBottom: 12,
            border: "1px solid #ccc",
            borderRadius: 5,
            outline: "none",
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          style={{
            width: "95%",
            padding: 10,
            marginBottom: 12,
            border: "1px solid #ccc",
            borderRadius: 5,
            outline: "none",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Register
        </button>

        <p style={{ marginTop: 15 }}>
          Already have account? <a href="/">Login</a>
        </p>
      </form>
    </div>
  );
}
