import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "./firebase";
import { collection, addDoc, updateDoc, doc, getDoc, getDocs } from "firebase/firestore";

function AddOKR() {
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("in-progress");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [team, setTeam] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const okrId = searchParams.get("id");

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
      return;
    }
    
    // Fetch users for assignment dropdown
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    fetchUsers();

    if (okrId) {
      const fetchOKR = async () => {
        const okrDoc = await getDoc(doc(db, "okrs", okrId));
        if (okrDoc.exists()) {
          const data = okrDoc.data();
          setTitle(data.title);
          setProgress(data.progress || 0);
          setDescription(data.description || "");
          setStatus(data.status || "in-progress");
          setOrganization(data.organization || "");
          setDepartment(data.department || "");
          setTeam(data.team || "");
          setAssignedTo(data.assignedTo || "");
        }
      };
      fetchOKR();
    }
  }, [okrId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const okrData = {
      title,
      progress,
      description,
      status,
      organization,
      department,
      team,
      assignedTo,
      createdBy: auth.currentUser.uid,
      createdAt: new Date()
    };

    if (okrId) {
      await updateDoc(doc(db, "okrs", okrId), { ...okrData, updatedAt: new Date() });
    } else {
      await addDoc(collection(db, "okrs"), okrData);
    }
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h2>{okrId ? "Edit" : "Add"} OKR</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="OKR Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br/>
        
        <input
          type="text"
          placeholder="Organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          required
        /><br/>
        
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        /><br/>
        
        <input
          type="text"
          placeholder="Team"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          required
        /><br/>
        
        <select 
          value={assignedTo} 
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{ width: '100%', margin: '8px 0', borderRadius: '4px', border: '1px solid #ccc', padding: '8px' }}
          required
        >
          <option value="">Select User to Assign</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.email} ({user.name || 'No name'})
            </option>
          ))}
        </select><br/>
        
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: '100%', margin: '8px 0', borderRadius: '4px', border: '1px solid #ccc', padding: '8px' }}
        /><br/>
        
        <input
          type="number"
          placeholder="Progress (%)"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          min="0"
          max="100"
        /><br/>
        
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: '100%', margin: '8px 0', borderRadius: '4px', border: '1px solid #ccc', padding: '8px' }}
        >
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select><br/>
        
        <button type="submit">{okrId ? "Update" : "Add"} OKR</button>
      </form>
      <button onClick={() => navigate("/dashboard")}>Back</button>
    </div>
  );
}

export default AddOKR;