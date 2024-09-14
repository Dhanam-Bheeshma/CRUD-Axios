import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: { street: "", suite: "", city: "", zipcode: "" },
    website: ""
  });
  const [editingId, setEditingId] = useState(null);

 
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(API_URL, formData);
      setUsers([...users, response.data]);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: { street: "", suite: "", city: "", zipcode: "" },
        website: ""
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };


  const editUser = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, formData);
      setUsers(
        users.map((user) => (user.id === id ? { ...user, ...response.data } : user))
      );
      setEditingId(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: { street: "", suite: "", city: "", zipcode: "" },
        website: ""
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      editUser(editingId);
    } else {
      addUser();
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || { street: "", suite: "", city: "", zipcode: "" },
      website: user.website || ""
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: {
        ...prevFormData.address,
        [name]: value
      }
    }));
  };

  return (
    <div className="App">
      <h1>USER MANAGEMENT</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.address.street}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="suite"
          placeholder="Suite"
          value={formData.address.suite}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="zipcode"
          placeholder="Zipcode"
          value={formData.address.zipcode}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          placeholder="Website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
        <button className="add-button" type="submit">
          {editingId ? "Update User" : "Add User"}
        </button>
      </form>

      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> <br />
            Email: {user.email} <br />
            Phone: {user.phone} <br />
            Address: {user.address
              ? `${user.address.street || ""}, ${user.address.suite || ""}, ${user.address.city || ""}, ${user.address.zipcode || ""}`
              : "N/A"} <br />
            Website: {user.website || "N/A"} <br />
            <button
              className="edit-button"
              onClick={() => handleEditClick(user)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => deleteUser(user.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
