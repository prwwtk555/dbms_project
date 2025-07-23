import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    weight: "",
    height: "",
    exercises: "",
  });
  const [search, setSearch] = useState("");

  const API = "http://localhost:5000/api/members";

  const fetchMembers = async () => {
    try {
      const res = await axios.get(API);
      setMembers(res.data);
    } catch (err) {
      alert("Error fetching members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(API, form);
      setForm({ id: "", name: "", email: "", weight: "", height: "", exercises: "" });
      fetchMembers();
    } catch (err) {
      alert("Error adding member");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchMembers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/${form.id}`, form);
      setForm({ id: "", name: "", email: "", weight: "", height: "", exercises: "" });
      fetchMembers();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${API}/search?query=${search}`);
      setMembers(res.data);
    } catch (err) {
      alert("Search failed");
    }
  };

  return (
    <div className="container">
      <h1>Fitness Management System</h1>

      <div className="form">
        <input name="id" value={form.id} onChange={handleChange} placeholder="ID" />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (kg)" />
        <input name="height" value={form.height} onChange={handleChange} placeholder="Height (cm)" />
        <input name="exercises" value={form.exercises} onChange={handleChange} placeholder="Exercises" />

        <div className="buttons">
          <button onClick={handleSubmit}>Add</button>
          <button onClick={handleUpdate}>Update</button>
        </div>
      </div>

      <div className="search">
        <input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={fetchMembers}>Reset</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Weight</th><th>Height</th><th>Exercises</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.weight}</td>
              <td>{m.height}</td>
              <td>{m.exercises}</td>
              <td>
                <button onClick={() => setForm(m)}>Edit</button>
                <button onClick={() => handleDelete(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
