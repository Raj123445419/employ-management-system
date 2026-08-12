import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

// =====================================================
// DJANGO BACKEND URL
// =====================================================

const API_URL = "https://backend-z4sf.onrender.com";

// =====================================================
// EDIT EMPLOYEE COMPONENT
// =====================================================

const Edite_Page = () => {

  const location = useLocation();
  const navigate = useNavigate();

  // Employ_list.jsx se employee ka data aa raha hai
  const employee = location.state?.employee;

  const [formData, setFormData] = useState({
    Employname: employee?.Employname || "",
    Address: employee?.Address || "",
    Employrole: employee?.Employrole || "",
    Designation: employee?.Designation || "",
    Experince: employee?.Experince || "",
    Salary: employee?.Salary || ""
  });

  const [loading, setLoading] = useState(true);

  // Page reload hone par skeleton effect dikhane ke liye
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= UPDATE EMPLOYEE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employee?.EmployId) {
      alert("Employee ID not found");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/Edite/${employee.EmployId}/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",

            "Accept":
              "application/json"
          },

          body: new URLSearchParams(formData)
        }
      );

      if (response.ok) {
        alert(
          "Employee Updated Successfully"
        );

        // Update ke baad Employee List par
        navigate("/");

      } else {
        const data =
          await response.json().catch(() => ({}));

        alert(
          data.error ||
          "Employee Update Failed"
        );
      }

    } catch (error) {
      console.log(error);

      alert(
        "Backend connection error"
      );

    } finally {
      setLoading(false);
    }

  };

  // ================= EMPLOYEE DATA NOT FOUND =================

  if (!employee) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          Employee data not found.
          <br />
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/")}
          >
            Go To Employee List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card edit-employee-card">

            {/* ================= HEADER ================= */}
            <div className="card-header edit-employee-header text-center">
              {loading ? (
                <div className="skeleton-box skeleton-heading" style={{ margin: "0 auto", width: "180px", height: "25px" }}></div>
              ) : (
                <h3>Edit Employee</h3>
              )}
            </div>

            {/* ================= BODY ================= */}
            <div className="card-body">
              <form onSubmit={handleSubmit}>

                {/* ================= EMPLOYEE NAME ================= */}
                <div className="mb-3">
                  <label className="form-label">
                    Employee Name
                  </label>
                  {loading ? (
                    <div className="skeleton-input-box"></div>
                  ) : (
                    <input
                      type="text"
                      name="Employname"
                      className="form-control"
                      value={formData.Employname}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>

                {/* ================= ADDRESS ================= */}
                <div className="mb-3">
                  <label className="form-label">
                    Address
                  </label>
                  {loading ? (
                    <div className="skeleton-input-box" style={{ height: "70px" }}></div>
                  ) : (
                    <textarea
                      name="Address"
                      className="form-control"
                      rows="3"
                      value={formData.Address}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>

                {/* ================= EMPLOYEE ROLE ================= */}
                <div className="mb-3">
                  <label className="form-label">
                    Employee Role
                  </label>
                  {loading ? (
                    <div className="skeleton-input-box"></div>
                  ) : (
                    <input
                      type="text"
                      name="Employrole"
                      className="form-control"
                      value={formData.Employrole}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>

                {/* ================= DESIGNATION ================= */}
                <div className="mb-3">
                  <label className="form-label">
                    Designation
                  </label>
                  {loading ? (
                    <div className="skeleton-input-box"></div>
                  ) : (
                    <input
                      type="text"
                      name="Designation"
                      className="form-control"
                      value={formData.Designation}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>

                {/* ================= EXPERIENCE ================= */}
                <div className="mb-3">
                  <label className="form-label">
                    Experience
                  </label>
                  {loading ? (
                    <div className="skeleton-input-box"></div>
                  ) : (
                    <input
                      type="text"
                      name="Experince"
                      className="form-control"
                      value={formData.Experince}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>

                {/* ================= SALARY ================= */}
                <div className="mb-3">
                  <label className="form-label">
                    Salary
                  </label>
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

                {/* ================= BUTTONS ================= */}
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-success me-2 px-4"
                    disabled={loading}
                  >
                    {loading
                      ? "Updating..."
                      : "Update Employee"
                    }
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

};

export default Edite_Page;