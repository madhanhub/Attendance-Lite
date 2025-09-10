import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: 300 }}>
        <h2>Register</h2>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <br />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <br />
        <button type="submit">Register</button>
        <p>Already have account? <a href="/">Login</a></p>
      </form>
    </div>
  );
}
