import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";

function Analytics() {
  const [okrs, setOkrs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("quarter");
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Analytics Calculations
  const totalOKRs = okrs.length;
  const completedOKRs = okrs.filter(okr => okr.status === "completed").length;
  const inProgressOKRs = okrs.filter(okr => okr.status === "in-progress").length;
  const completionRate = totalOKRs > 0 ? Math.round((completedOKRs / totalOKRs) * 100) : 0;
  const averageProgress = okrs.length > 0 ? Math.round(okrs.reduce((sum, okr) => sum + (okr.progress || 0), 0) / okrs.length) : 0;

  // Organization Performance
  const orgPerformance = okrs.reduce((acc, okr) => {
    if (!acc[okr.organization]) {
      acc[okr.organization] = { total: 0, completed: 0, progress: 0 };
    }
    acc[okr.organization].total++;
    if (okr.status === "completed") acc[okr.organization].completed++;
    acc[okr.organization].progress += okr.progress || 0;
    return acc;
  }, {});

  // Department Performance
  const deptPerformance = okrs.reduce((acc, okr) => {
    if (!acc[okr.department]) {
      acc[okr.department] = { total: 0, completed: 0, progress: 0 };
    }
    acc[okr.department].total++;
    if (okr.status === "completed") acc[okr.department].completed++;
    acc[okr.department].progress += okr.progress || 0;
    return acc;
  }, {});

  // Team Performance
  const teamPerformance = okrs.reduce((acc, okr) => {
    if (!acc[okr.team]) {
      acc[okr.team] = { total: 0, completed: 0, progress: 0 };
    }
    acc[okr.team].total++;
    if (okr.status === "completed") acc[okr.team].completed++;
    acc[okr.team].progress += okr.progress || 0;
    return acc;
  }, {});

  // Top Performing Teams
  const topTeams = Object.entries(teamPerformance)
    .map(([team, data]) => ({
      team,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      avgProgress: data.total > 0 ? Math.round(data.progress / data.total) : 0
    }))
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5);

  // OKR Health Score (0-100)
  const calculateHealthScore = () => {
    if (totalOKRs === 0) return 100;
    
    const progressScore = averageProgress * 0.4; // 40% weight
    const completionScore = completionRate * 0.4; // 40% weight
    const balanceScore = Math.min(100, (inProgressOKRs / totalOKRs) * 100) * 0.2; // 20% weight
    
    return Math.round(progressScore + completionScore + balanceScore);
  };

  const healthScore = calculateHealthScore();

  // Predict Success Rate
  const predictSuccessRate = () => {
    if (totalOKRs === 0) return 0;
    
    const highProgressOKRs = okrs.filter(okr => (okr.progress || 0) >= 70).length;
    const recentCompletions = completedOKRs;
    
    const prediction = Math.round(((highProgressOKRs + recentCompletions) / totalOKRs) * 100);
    return Math.min(100, prediction);
  };

  const successPrediction = predictSuccessRate();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">MyOKR Analytics</div>
        <div className="navbar-user">
          {currentUser && (
            <span>Welcome, {currentUser.name} ({currentUser.role})</span>
          )}
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      
      <div className="container">
        <h2>Smart Analytics Dashboard</h2>
        
        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Total OKRs</h3>
            <div className="metric-value">{totalOKRs}</div>
            <div className="metric-label">Active Objectives</div>
          </div>
          
          <div className="metric-card">
            <h3>Completion Rate</h3>
            <div className="metric-value">{completionRate}%</div>
            <div className="metric-label">Success Rate</div>
          </div>
          
          <div className="metric-card">
            <h3>Average Progress</h3>
            <div className="metric-value">{averageProgress}%</div>
            <div className="metric-label">Team Progress</div>
          </div>
          
          <div className="metric-card">
            <h3>Health Score</h3>
            <div className="metric-value">{healthScore}/100</div>
            <div className="metric-label">Overall Health</div>
          </div>
        </div>

        {/* Progress Distribution */}
        <div className="analytics-section">
          <h3>Progress Distribution</h3>
          <div className="progress-distribution">
            <div className="progress-bar-container">
              <div className="progress-label">Completed</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill completed" 
                  style={{ width: `${(completedOKRs / totalOKRs) * 100}%` }}
                ></div>
              </div>
              <div className="progress-value">{completedOKRs} OKRs</div>
            </div>
            
            <div className="progress-bar-container">
              <div className="progress-label">In Progress</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill in-progress" 
                  style={{ width: `${(inProgressOKRs / totalOKRs) * 100}%` }}
                ></div>
              </div>
              <div className="progress-value">{inProgressOKRs} OKRs</div>
            </div>
          </div>
        </div>

        {/* Organization Performance */}
        <div className="analytics-section">
          <h3>Organization Performance</h3>
          <div className="performance-grid">
            {Object.entries(orgPerformance).map(([org, data]) => (
              <div key={org} className="performance-card">
                <h4>{org}</h4>
                <div className="performance-stats">
                  <div>Total: {data.total}</div>
                  <div>Completed: {data.completed}</div>
                  <div>Rate: {data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Teams */}
        <div className="analytics-section">
          <h3>Top Performing Teams</h3>
          <div className="leaderboard">
            {topTeams.map((team, index) => (
              <div key={team.team} className="leaderboard-item">
                <div className="rank">#{index + 1}</div>
                <div className="team-name">{team.team}</div>
                <div className="team-stats">
                  <span className="completion-rate">{team.completionRate}%</span>
                  <span className="avg-progress">{team.avgProgress}% avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Prediction */}
        <div className="analytics-section">
          <h3>Success Prediction</h3>
          <div className="prediction-card">
            <div className="prediction-value">{successPrediction}%</div>
            <div className="prediction-label">Predicted Success Rate</div>
            <div className="prediction-description">
              Based on current progress and historical completion patterns
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="analytics-section">
          <h3>Smart Insights</h3>
          <div className="insights-list">
            {healthScore >= 80 && (
              <div className="insight positive">
                🎉 Excellent! Your team is performing exceptionally well with a health score of {healthScore}.
              </div>
            )}
            {healthScore < 60 && (
              <div className="insight warning">
                ⚠️ Your team needs attention. Consider reviewing OKRs with low progress.
              </div>
            )}
            {completionRate > 70 && (
              <div className="insight positive">
                🚀 Great completion rate! Your team is consistently achieving goals.
              </div>
            )}
            {averageProgress < 50 && (
              <div className="insight warning">
                📈 Focus needed on progress. Consider breaking down larger OKRs into smaller milestones.
              </div>
            )}
            {topTeams.length > 0 && (
              <div className="insight info">
                🏆 {topTeams[0].team} is your top-performing team with {topTeams[0].completionRate}% completion rate.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics; 