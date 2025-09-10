import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);
      localStorage.setItem("user_token", res.data.user_token);
      localStorage.setItem("userId", res.data.data._id);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: 300 }}>
        <h2>Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <br />
        <button type="submit">Login</button>
        <p>New user? <a href="/register">Register</a></p>
      </form>
    </div>
  );
}
