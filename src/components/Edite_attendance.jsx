import React, {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import "../App.css";

// =====================================================
// DJANGO BACKEND URL
// =====================================================

const API_URL = "https://backend-z4sf.onrender.com";

// =====================================================
// EDIT ATTENDANCE COMPONENT
// =====================================================

function Edite_attendence() {

  const location = useLocation();
  const navigate = useNavigate();

  // Previous attendance data
  const previousAttendance =
    location.state?.attendance || {};

  const [attendance, setAttendance] = useState({
    id: previousAttendance.id || "",
    EmployId: previousAttendance.EmployId || "",
    Employname: previousAttendance.Employname || "",
    Date: previousAttendance.Date || "",
    Status: previousAttendance.Status || ""
  });

  const [loading, setLoading] = useState(true);

  // Page reload/refresh hone par skeleton effect dikhane ke liye
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // =====================================================
  // DATE CHANGE
  // =====================================================

  const handleDateChange = (e) => {
    setAttendance({
      ...attendance,
      Date: e.target.value
    });
  };

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = (e) => {
    setAttendance({
      ...attendance,
      Status: e.target.value
    });
  };

  // =====================================================
  // UPDATE ATTENDANCE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!attendance.id) {
      alert("Attendance ID not found");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/Edite_attendance/${attendance.id}/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",

            "Accept":
              "application/json"
          },

          body: new URLSearchParams({
            Date: attendance.Date,
            Status: attendance.Status
          })
        }
      );

      if (response.ok) {
        alert(
          "Attendance Updated Successfully"
        );

        // Attendance List par wapas
        navigate("/attendance");

      } else {
        const data = await response.json().catch(() => ({}));

        alert(
          data.error ||
          "Attendance Update Failed"
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

  // =====================================================
  // ATTENDANCE DATA NOT FOUND
  // =====================================================

  if (!previousAttendance.id) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          Attendance data not found.
          <br />
          <button
            className="btn btn-primary mt-3"
            onClick={() =>
              navigate("/attendance")
            }
          >
            Go To Attendance List
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card edit-attendance-card">

            {/* HEADER */}
            <div className="card-header edit-attendance-header text-center">
              {loading ? (
                <div className="skeleton-box skeleton-heading" style={{ margin: "0 auto", width: "220px", height: "25px" }}></div>
              ) : (
                <h3>Edit Employee Attendance</h3>
              )}
            </div>

            {/* BODY */}
            <div className="card-body">
              <form onSubmit={handleSubmit}>

                {/* Employee ID */}
                <div className="mb-3">
                  <label className="form-label">
                    Employee ID
                  </label>
                  {loading ? (
                    <div className="skeleton-input-box"></div>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={attendance.EmployId}
                      readOnly
                    />
                  )}
                </div>

                {/* Employee Name */}
                <div className="mb-3">
                  <label className="form-label">
                    Employee Name
                  </label>
                  {loading ? (
                    <div className="skeleton-input-box"></div>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={attendance.Employname}
                      readOnly
                    />
                  )}
                </div>

                {/* Date */}
                <div className="mb-3">
                  <label className="form-label">
                    Date
                  </label>
                  {loading ? (
                    <div className="skeleton-input-box"></div>
                  ) : (
                    <input
                      type="date"
                      name="Date"
                      className="form-control"
                      value={attendance.Date}
                      onChange={handleDateChange}
                      required
                    />
                  )}
                </div>

                {/* Status */}
                <div className="mb-3">
                  <label className="form-label">
                    Attendance Status
                  </label>
                  {loading ? (
                    <div className="skeleton-input-box"></div>
                  ) : (
                    <select
                      name="Status"
                      className="form-select"
                      value={attendance.Status}
                      onChange={handleStatusChange}
                      required
                    >
                      <option value="Present">
                        Present
                      </option>
                      <option value="Leave">
                        Leave
                      </option>
                      <option value="Half Day">
                        Half Day
                      </option>
                      <option value="Absent">
                        Absent
                      </option>
                    </select>
                  )}
                </div>

                {/* BUTTONS */}
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-success me-2 px-4"
                    disabled={loading}
                  >
                    {loading
                      ? "Updating..."
                      : "Update Attendance"
                    }
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() =>
                      navigate("/attendance")
                    }
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
}

export default Edite_attendence;