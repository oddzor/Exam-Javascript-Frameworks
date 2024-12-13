import { useState } from "react";
import { User } from "../types/types";
import { useNavigate } from "react-router-dom";
import "../styles/components/userlist.css";

interface UserListProps {
  users: User[];
  onUsersUpdated: () => void;
  onEditUser: (user: User) => void;
}

function UserList({ users, onUsersUpdated, onEditUser }: UserListProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const deleteUser = async (userId: string) => {
    const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      alert("User deleted");
      onUsersUpdated();
    } else {
      alert("Failed to delete user");
    }
  };

  const viewUserCvs = (userEmail: string) => {
    navigate(`/cv?userEmail=${encodeURIComponent(userEmail)}`);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = filteredUsers.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Find Users</h3>
      <div className="user-list-search-container">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="user-list-search"
        />
      </div>
      {sortedUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="user-list-container">
          <ul className="user-list">
            {sortedUsers.map((user) => (
              <li key={user._id} className="user-item">
                <div className="user-info">
                  <div className="user-info-field">
                    <span className="user-label">Name:</span>
                    <span className="user-value">{user.name}</span>
                  </div>
                  <div className="user-info-field">
                    <span className="user-label">Email:</span>
                    <span className="user-value">{user.email}</span>
                  </div>
                  <div className="user-info-field">
                    <span className="user-label">Role:</span>
                    <span className="user-value">{user.role}</span>
                  </div>
                </div>
                {user._id !== "admin-1" && (
                  <div className="user-actions">
                    <button onClick={() => onEditUser(user)}>Edit</button>
                    <button onClick={() => deleteUser(user._id)}>Delete</button>
                    <button onClick={() => viewUserCvs(user.email)}>
                      View CVs
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserList;
