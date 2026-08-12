import "../App.css";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from 'qrcode.react';

// =====================================================
// DJANGO BACKEND URL
// =====================================================
const API_URL = "https://backend-z4sf.onrender.com";

// =====================================================
// EMPLOYEE ATTENDANCE COMPONENT
// =====================================================

const Employ_attendance = () => {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [showQR, setShowQR] = useState(false);

  // Default date aaj ki set kar rahe hain
  const [formData, setFormData] = useState({
    EmployId: "",
    Date: new Date().toISOString().split("T")[0]
  });

  // ================= GET ATTENDANCE =================
  const getAttendance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/Employ_attendance/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch attendance");
      }

      const data = await response.json();
      setAttendance(data);
    } catch (error) {
      console.log(error);
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  // ================= GET EMPLOYEES =================
  const getEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // ================= USE EFFECT (Run on page load) =================
  useEffect(() => {
    getAttendance();
    getEmployees();

    // Page load hone par form me automatic aaj ki date daal dega
    const today = new Date().toISOString().split("T")[0];
    setFormData((prevData) => ({
      ...prevData,
      Date: today,
    }));
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Agar Employee ID select ki hai toh automatic QR popup khol do
    if (name === "EmployId" && value !== "") {
      setShowQR(true);
    }
  };

  // ================= SAVE ATTENDANCE =================
 const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Form data ke sath automatic "Present" status bhej rahe hain
    const submissionData = {
      ...formData,
      Status: "Present" 
    };

    try {
      const response = await fetch(`${API_URL}/Employ_attendance/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams(submissionData),
      });

      const responseText = await response.text();

      if (response.ok) {
        alert("Attendance Saved Successfully");
        setFormData({
          EmployId: "",
          Date: new Date().toISOString().split("T")[0],
        });
        getAttendance();
      } else {
        alert(
          `Attendance Save Failed\n\nStatus: ${response.status}\n\n${responseText}`
        );
      }
    } catch (error) {
      console.error("Attendance Error:", error);
      alert(`Backend connection error\n\n${error.message}`);
    }
  };
  // ================= RESET =================
  const handleReset = () => {
    setFormData({
      EmployId: "",
      Date: new Date().toISOString().split("T")[0], // Reset par bhi aaj ki date set hogi
    });
    setError("");
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    navigate(`/edit-attendance/${item.id}`, {
      state: {
        attendance: item,
      },
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/Delete_attendance/${id}/`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert("Attendance Deleted Successfully");
        getAttendance();
      } else {
        let data = {};
        try {
          data = await response.json();
        } catch {}
        alert(data.error || "Delete Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Backend connection error");
    }
  };

useEffect(() => {
    let interval;
    if (showQR && formData.EmployId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_URL}/Employ_attendance/`, {
            headers: { Accept: "application/json" },
          });
          if (response.ok) {
            const data = await response.json();
            
            const marked = data.find(
              (item) => 
                String(item.EmployId) === String(formData.EmployId) && 
                item.Date === formData.Date
            );

            if (marked) {
              setShowQR(false);
              getAttendance();
              alert(`Attendance successfully marked for ID: ${formData.EmployId}!`);
              
              setFormData({
                EmployId: "",
                Date: new Date().toISOString().split("T")[0],
              });
            }
          }
        } catch (err) {
          console.log("Background check error", err);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [showQR, formData.EmployId, formData.Date]);






  return (
    <>
      {/* NAVBAR */}
      <div className="all">
        <nav className="navbar navbar-expand-sm">
          <div className="container-fluid">
            <Link className="navbar-brand fontnav px-2 px-md-3 cl1" to="/">
              Employ Management System
            </Link>

            <button
              className="navbar-toggler"
              style={{ backgroundColor: "#018c8c90", color: "#FFFFFF" }}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapsibleNavbar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="collapsibleNavbar">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link px-2 px-md-3 cl1" to="/">
                    Employ List
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-2 px-md-3 cl1" to="/attendance">
                    Employ Attendance
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-2 px-md-3 cl1" to="/salary">
                    Employ Sallery Count
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* MAIN CONTAINER */}
      <div className="container alltext">
        <div className="col-md-12 text-dark mt-5">
          <center>
            {loading ? (
              <div className="skeleton-box skeleton-heading"></div>
            ) : (
              <h1 className="text-center">Employee Attendance</h1>
            )}
          </center>
        </div>

        {/* ATTENDANCE FORM */}
        <div className="card mt-5">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="container mt-4">
                <div className="card shadow">
                  <div className="card-body">
                    <div className="row">
                      {/* EMPLOYEE ID */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Select Employee</label>
                        {loading ? (
                          <div className="skeleton-input-box"></div>
                        ) : (
                          <select
                            name="EmployId"
                            className="form-select"
                            value={formData.EmployId}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Employee</option>
                            {employees.map((emp) => (
                              <option key={emp.EmployId} value={emp.EmployId}>
                                {emp.EmployId} - {emp.Employname}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>


                      {/* DATE */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Attendance Date</label>
                        {loading ? (
                          <div className="skeleton-input-box"></div>
                        ) : (
                          <input
                            type="date"
                            name="Date"
                            className="form-control"
                            value={formData.Date}
                            onChange={handleChange}
                            required
                          />
                        )}
                      </div>

                      {/* STATUS */}

                    </div>
                  </div>

                  {/* FOOTER BUTTONS */}
                  <div className="card-footer text-center">
                    <button type="submit" className="btn btn-save me-2">
                      Save Attendance
                    </button>
                    <button
                      type="button"
                      className="btn btn-reset"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger mt-3 text-center">{error}</div>
        )}

        {/* ATTENDANCE LIST */}
        <div className="card mt-4">
          <div className="card-header">
            <h4>Attendance List</h4>
          </div>

          <div className="card-body">
            <div className="attendance-table-box">
              <table className="table table-bordered table-striped attendance-table">
                <thead>
                  {loading ? (
                    <tr className="table-dark">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <th key={n}>
                          <div
                            className="skeleton-box"
                            style={{ background: "#444" }}
                          ></div>
                        </th>
                      ))}
                    </tr>
                  ) : (
                    <tr className="table-dark">
                      <th>ID</th>
                      <th>Employee Name</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  )}
                </thead>

                <tbody>
                  {loading ? (
                    [1, 2, 3].map((n) => (
                      <tr key={n}>
                        <td><div className="skeleton-box"></div></td>
                        <td><div className="skeleton-box"></div></td>
                        <td><div className="skeleton-box"></div></td>
                        <td><div className="skeleton-box"></div></td>
                        <td><div className="skeleton-box"></div></td>
                        <td><div className="skeleton-box"></div></td>
                      </tr>
                    ))
                  ) : attendance.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((i) => (
                      <tr key={i.id}>
                        <td>{i.EmployId}</td>
                        <td>
                          <div className="cell-scroll">{i.Employname}</div>
                        </td>
                        <td>
                          <div className="cell-scroll">
                            {i.Date ? i.Date.split("-").reverse().join("-") : ""}
                          </div>
                        </td>
                        <td>
                          <div className="cell-scroll">{i.Status}</div>
                        </td>

                        {/* EDIT */}
                        <td className="text-center manage-btn">
                          <button
                            className="btn btn-edit btn-sm"
                            onClick={() => handleEdit(i)}
                          >
                            Edit
                          </button>
                        </td>

                        {/* DELETE */}
                        <td className="text-center manage-btn">
                          <button
                            className="btn btn-delete btn-sm"
                            onClick={() => handleDelete(i.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>




{showQR && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Scan QR for Attendance</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowQR(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p className="fw-bold">Employee ID: {formData.EmployId}</p>
                
                <div className="mb-3 d-inline-block p-2 bg-light border">
                  <QRCodeSVG 
                    value={`${API_URL}/mark-attendance/?EmployId=${formData.EmployId}&Date=${formData.Date}`} 
                    size={160} 
                  />
                </div>
                <small className="text-muted d-block mt-3">
                  Mobile camera se scan karke link open karein, attendance automatic save ho jayegi!
                </small>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowQR(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      
    </>
  );
};

export default Employ_attendance;