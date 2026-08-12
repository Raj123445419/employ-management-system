import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

// =====================================================
// DJANGO BACKEND URL
// =====================================================

const API_URL = "https://backend-z4sf.onrender.com";

// =====================================================
// EMPLOY LIST COMPONENT
// =====================================================

const Employ_list = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    Employname: "",
    Address: "",
    Employrole: "",
    Designation: "",
    Experince: "",
    Salary: ""
  });

  const navigate = useNavigate();

  // =====================================================
  // GET EMPLOYEE DATA
  // =====================================================

  const getEmployees = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/`, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Employees from Django:", data);
      setEmployees(data);

    } catch (error) {
      console.error("GET Employee Error:", error);
      alert("Backend connection error");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  useEffect(() => {
    getEmployees();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =====================================================
  // ADD EMPLOYEE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: new URLSearchParams(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Employee Added Successfully");
        setShowModal(false);
        setFormData({
          Employname: "",
          Address: "",
          Employrole: "",
          Designation: "",
          Experince: "",
          Salary: ""
        });
        getEmployees();
      } else {
        console.error("Add Employee Error:", data);
        alert(data.error || "Employee add failed");
      }
    } catch (error) {
      console.error("POST Employee Error:", error);
      alert("Backend connection error");
    }
  };

  // =====================================================
  // EDIT EMPLOYEE
  // =====================================================

  const handleEdit = (employee) => {
    navigate("/edit", {
      state: {
        employee: employee
      }
    });
  };

  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/Delete/${id}/`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json"
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Employee Deleted Successfully");
        getEmployees();
      } else {
        console.error("Delete Error:", data);
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("DELETE Employee Error:", error);
      alert("Backend connection error");
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      {/* NAVBAR */}
      <div className="all">
        <nav className="navbar navbar-expand-sm">
          <div className="container-fluid">
            <Link
              className="navbar-brand fontnav px-2 px-md-3 cl1"
              to="/"
            >
              Employ Management System
            </Link>

            <button
              className="navbar-toggler"
              style={{
                backgroundColor: "#018c8c90",
                color: "#FFFFFF"
              }}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapsibleNavbar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse"
              id="collapsibleNavbar"
            >
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

      {/* ADD BUTTON */}
      <div className="col-md-12 d-flex justify-content-end p-2">
        <button
          className="btn add"
          onClick={() => setShowModal(true)}
        >
          + Add Employ
        </button>
      </div>

      {/* TITLE */}
      <main>
        <div className="col-md-12">
          <center>
            {loading ? (
              <div className="skeleton-box skeleton-heading"></div>
            ) : (
              <h1 className="alltext">Employ Details</h1>
            )}
          </center>
        </div>

        {/* TABLE */}
        <div className="employee-table-box">
          <table className="table table-bordered table-hover align-middle employee-table">
            <thead className="table-dark text-center alltext">
              {loading ? (
                // Table Heading Skeleton jab page load ho raha ho
                <tr>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <th key={n}><div className="skeleton-box" style={{ background: "#444" }}></div></th>
                  ))}
                </tr>
              ) : (
                // Real Table Heading
                <tr>
                  <th>Employ Id</th>
                  <th>Employ Name</th>
                  <th>Address</th>
                  <th>Employ Role</th>
                  <th>Designation</th>
                  <th>Experience</th>
                  <th>Salary</th>
                  <th colSpan="2">Manage</th>
                </tr>
              )}
            </thead>
            <tbody>
              {loading ? (
                // Table Body Skeleton (3 rows)
                [1, 2, 3].map((n) => (
                  <tr key={n}>
                    <td><div className="skeleton-box"></div></td>
                    <td><div className="skeleton-box"></div></td>
                    <td><div className="skeleton-box"></div></td>
                    <td><div className="skeleton-box"></div></td>
                    <td><div className="skeleton-box"></div></td>
                    <td><div className="skeleton-box"></div></td>
                    <td><div className="skeleton-box"></div></td>
                    <td><div className="skeleton-box"></div></td>
                    <td><div className="skeleton-box"></div></td>
                  </tr>
                ))
              ) : employees.length === 0 ? (
                // Agar data 0 hai toh table par effect nahi aayega, sirf message dikhega
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    No data found
                  </td>
                </tr>
              ) : (
                // Agar data available hai (3, 10 ya usse zyada)
                employees.map((i) => (
                  <tr key={i.EmployId}>
                    <td>{i.EmployId}</td>
                    <td>
                      <div className="cell-scroll">{i.Employname}</div>
                    </td>
                    <td>
                      <div className="cell-scroll">{i.Address}</div>
                    </td>
                    <td>
                      <div className="cell-scroll">{i.Employrole}</div>
                    </td>
                    <td>
                      <div className="cell-scroll">{i.Designation}</div>
                    </td>
                    <td>
                      <div className="cell-scroll">{i.Experince}</div>
                    </td>
                    <td>
                      <div className="cell-scroll">{i.Salary}</div>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-edit btn-sm"
                        onClick={() => handleEdit(i)}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-delete btn-sm"
                        onClick={() => handleDelete(i.EmployId)}
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
      </main>

      {/* ADD EMPLOYEE MODAL */}
      {showModal && (
        <div className="custom-modal">
          <div className="modal-box">
            <div className="modal-header">
              <h5>Employee Details</h5>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Employ Name</label>
                    {loading ? (
                      <div className="skeleton-input-box"></div>
                    ) : (
                      <input
                        type="text"
                        name="Employname"
                        className="form-control"
                        placeholder="Full Name"
                        value={formData.Employname}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Address</label>
                    {loading ? (
                      <div className="skeleton-input-box" style={{ height: "70px" }}></div>
                    ) : (
                      <textarea
                        name="Address"
                        className="form-control"
                        rows="3"
                        placeholder="Enter complete address"
                        value={formData.Address}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Employ Role</label>
                    {loading ? (
                      <div className="skeleton-input-box"></div>
                    ) : (
                      <input
                        type="text"
                        name="Employrole"
                        className="form-control"
                        placeholder="Employee Role"
                        value={formData.Employrole}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Designation</label>
                    {loading ? (
                      <div className="skeleton-input-box"></div>
                    ) : (
                      <input
                        type="text"
                        name="Designation"
                        className="form-control"
                        placeholder="Designation"
                        value={formData.Designation}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Experince</label>
                    {loading ? (
                      <div className="skeleton-input-box"></div>
                    ) : (
                      <input
                        type="text"
                        name="Experince"
                        className="form-control"
                        placeholder="Experince"
                        value={formData.Experince}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Salary</label>
                    {loading ? (
                      <div className="skeleton-input-box"></div>
                    ) : (
                      <input
                        type="number"
                        name="Salary"
                        className="form-control"
                        value={formData.Salary}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Employ_list;