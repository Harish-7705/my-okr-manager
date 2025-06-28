import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";

function Dashboard() {
  const [okrs, setOkrs] = useState([]);
  const [selectedOKR, setSelectedOKR] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [filterOrg, setFilterOrg] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
      return;
    }
    
    const fetchData = async () => {
      try {
        // Get current user profile
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: userDoc.id, ...userDoc.data() });
        }
        
        // Fetch OKRs
        const okrCollection = collection(db, "okrs");
        const okrSnapshot = await getDocs(okrCollection);
        const okrsList = okrSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOkrs(okrsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "okrs", id));
      setOkrs(okrs.filter(okr => okr.id !== id));
      setSelectedOKR(null);
    } catch (error) {
      console.error("Error deleting OKR:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Filter OKRs based on hierarchy and status
  const filteredOKRs = okrs.filter(okr => {
    const matchesStatus = showCompleted ? okr.status === "completed" : okr.status !== "completed";
    const matchesOrg = !filterOrg || okr.organization?.toLowerCase().includes(filterOrg.toLowerCase());
    const matchesDept = !filterDept || okr.department?.toLowerCase().includes(filterDept.toLowerCase());
    const matchesTeam = !filterTeam || okr.team?.toLowerCase().includes(filterTeam.toLowerCase());
    
    return matchesStatus && matchesOrg && matchesDept && matchesTeam;
  });

  // Get unique values for filter dropdowns
  const organizations = [...new Set(okrs.map(okr => okr.organization).filter(Boolean))];
  const departments = [...new Set(okrs.map(okr => okr.department).filter(Boolean))];
  const teams = [...new Set(okrs.map(okr => okr.team).filter(Boolean))];

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your OKRs...</div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">MyOKR</div>
        <div className="navbar-user">
          {currentUser && (
            <span>Welcome, {currentUser.name} ({currentUser.role})</span>
          )}
          <button onClick={() => navigate("/analytics")}>📊 Analytics</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>{showCompleted ? "Completed OKRs" : "Current OKRs"}</h2>
          <div>
            <button 
              className={!showCompleted ? "" : "secondary"}
              onClick={() => setShowCompleted(false)}
            >
              Current
            </button>
            <button 
              className={showCompleted ? "" : "secondary"}
              onClick={() => setShowCompleted(true)}
            >
              History
            </button>
          </div>
        </div>
        
        {/* Hierarchy Filters */}
        <div className="filter-controls">
          <select 
            className="filter-select"
            value={filterOrg} 
            onChange={(e) => setFilterOrg(e.target.value)}
          >
            <option value="">All Organizations</option>
            {organizations.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
          
          <select 
            className="filter-select"
            value={filterDept} 
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select 
            className="filter-select"
            value={filterTeam} 
            onChange={(e) => setFilterTeam(e.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
        
        {!showCompleted && (
          <Link to="/add-okr">
            <button style={{ marginBottom: 20 }}>➕ Add New OKR</button>
          </Link>
        )}
        
        <ul className="okr-list">
          {filteredOKRs.map(okr => (
            <li key={okr.id} className="okr-item" onClick={() => setSelectedOKR(okr)}>
              <div className="okr-title">
                {okr.title}
                {okr.status === 'completed' && (
                  <span className="status-badge completed">✓ Completed</span>
                )}
              </div>
              
              <div className="okr-hierarchy">
                <span>{okr.organization}</span>
                <span className="separator">›</span>
                <span>{okr.department}</span>
                <span className="separator">›</span>
                <span>{okr.team}</span>
                {okr.assignedTo && (
                  <>
                    <span className="separator">•</span>
                    <span>Assigned to: {okr.assignedTo}</span>
                  </>
                )}
              </div>
              
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${okr.status === 'completed' ? 'completed' : 'in-progress'}`}
                    style={{ width: `${okr.progress || 0}%` }}
                  ></div>
                </div>
                <span className="progress-text">{okr.progress || 0}%</span>
              </div>
              
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {!showCompleted && (
                  <button 
                    className="secondary"
                    onClick={e => { e.stopPropagation(); navigate(`/add-okr?id=${okr.id}`); }}
                  >
                    Edit
                  </button>
                )}
                <button 
                  className="secondary"
                  onClick={e => { e.stopPropagation(); handleDelete(okr.id); }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        {showCompleted && filteredOKRs.length === 0 && (
          <div className="empty-state">
            <h3>No completed OKRs found</h3>
            <p>Complete some OKRs to see them in your history!</p>
          </div>
        )}
        
        {!showCompleted && filteredOKRs.length === 0 && (
          <div className="empty-state">
            <h3>No current OKRs found</h3>
            <p>Add your first OKR to get started on your goals!</p>
          </div>
        )}
        
        {selectedOKR && (
          <div className="okr-details">
            <h3>{selectedOKR.title}</h3>
            <p><strong>Description:</strong> {selectedOKR.description || 'No description provided'}</p>
            <p><strong>Organization:</strong> {selectedOKR.organization}</p>
            <p><strong>Department:</strong> {selectedOKR.department}</p>
            <p><strong>Team:</strong> {selectedOKR.team}</p>
            <p><strong>Assigned to:</strong> {selectedOKR.assignedTo || 'Not assigned'}</p>
            <p><strong>Progress:</strong> {selectedOKR.progress || 0}%</p>
            <p><strong>Status:</strong> {selectedOKR.status === 'completed' ? 'Completed' : 'In Progress'}</p>
            <button className="secondary" onClick={() => setSelectedOKR(null)}>Close</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;