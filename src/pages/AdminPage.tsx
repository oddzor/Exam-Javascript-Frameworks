import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import UserList from "../components/UserList";
import Waitlist from "../components/WaitList";
import { User } from "../types/types";
import "../styles/pages/adminpage.css";

function AdminPage() {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.auth);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<User | null>(
    null
  );

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "user">("user");

  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState<"admin" | "user">("user");

  const fetchUsers = useCallback(async () => {
    const res = await fetch("http://localhost:5000/api/users", {
      credentials: "include",
    });
    if (res.ok) {
      const data: User[] = await res.json();
      setUsers(data);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && role === "admin") {
      fetchUsers();
    }
  }, [isLoggedIn, role, fetchUsers]);

  const handleUsersUpdated = () => {
    fetchUsers();
  };

  if (!isLoggedIn) {
    return <p>Please log in</p>;
  }

  if (role !== "admin") {
    return <p>Admin access only</p>;
  }

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
      }),
    });
    if (res.ok) {
      alert("User created");
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("user");
      handleUsersUpdated();
    } else {
      alert("Failed to create user");
    }
  };

  const handleEditUserRequest = (user: User) => {
    setSelectedUserToEdit(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserToEdit) return;

    const res = await fetch(
      `http://localhost:5000/api/users/${selectedUserToEdit._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editUserName,
          email: editUserEmail,
          role: editUserRole,
        }),
      }
    );
    if (res.ok) {
      alert("User updated");
      setSelectedUserToEdit(null);
      handleUsersUpdated();
    } else {
      alert("Failed to update user");
    }
  };

  const handleCancelEdit = () => {
    setSelectedUserToEdit(null);
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      <div className="register-user-section" style={{ marginBottom: "2rem" }}>
        <h3>Register New User</h3>
        <form onSubmit={handleRegisterUser}>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <div className="register-user-actions">
            <select
              value={newUserRole}
              onChange={(e) =>
                setNewUserRole(e.target.value as "admin" | "user")
              }
            >
              <option value="" disabled hidden>
                Select Role
              </option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Register User</button>
          </div>
        </form>
      </div>
      <div className="admin-page-columns">
        <div className="admin-page-left">
          <div className="waitlist">
            <Waitlist onUsersUpdated={handleUsersUpdated} />
          </div>

          {selectedUserToEdit && (
            <div className="edit-user-section" style={{ marginTop: "2rem" }}>
              <h3>Edit User</h3>
              <form onSubmit={handleEditUserSubmit}>
                <input
                  type="text"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
                <select
                  value={editUserRole}
                  onChange={(e) =>
                    setEditUserRole(e.target.value as "admin" | "user")
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit">Update User</button>
                <button type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="admin-page-right">
          <div className="userlist">
            <UserList
              users={users}
              onUsersUpdated={handleUsersUpdated}
              onEditUser={handleEditUserRequest}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
