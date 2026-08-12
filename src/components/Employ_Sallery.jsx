import "../App.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// =====================================================
// DJANGO BACKEND URL
// =====================================================
const API_URL = "https://backend-z4sf.onrender.com";

const Employ_Sallery = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET SALARY DATA
  // =====================================================

  const getSalaryData = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/Employ_Sallery/`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch salary data");
      }

      const data = await response.json();
      console.log("Salary data from Django:", data);

      setSalaryData(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.log("Salary Error:", error);
      setSalaryData([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD SALARY
  // =====================================================

  useEffect(() => {
    getSalaryData();
  }, []);

  // =====================================================
  // MONTH NAME
  // =====================================================

  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const index = Number(month) - 1;

    if (index < 0 || index > 11) {
      return month;
    }

    return months[index];
  };

  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}

      <header>
        <div className="all">
          <nav className="navbar navbar-expand-sm">
            <div className="container-fluid">
              {/* LOGO */}
              <Link
                className="navbar-brand fontnav px-2 px-md-3 cl1"
                to="/"
              >
                Employ Management System
              </Link>

              {/* TOGGLER */}
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
                <span className="navbar-toggler-icon" />
              </button>

              {/* NAV LINKS */}
              <div
                className="collapse navbar-collapse"
                style={{
                  justifyContent: "end"
                }}
                id="collapsibleNavbar"
              >
                <ul className="navbar-nav">
                  {/* EMPLOY LIST */}
                  <li className="nav-item">
                    <Link
                      className="nav-link px-2 px-md-3 cl1"
                      to="/"
                    >
                      Employ List
                    </Link>
                  </li>

                  {/* ATTENDANCE */}
                  <li className="nav-item">
                    <Link
                      className="nav-link px-2 px-md-3 cl1"
                      to="/attendance"
                    >
                      Employ Attendance
                    </Link>
                  </li>

                  {/* SALARY */}
                  <li className="nav-item">
                    <Link
                      className="nav-link px-2 px-md-3 cl1"
                      to="/salary"
                    >
                      Employ Sallery Count
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <div
        className="col-md-12 mt-4 alltext"
        style={{
          textAlign: "center"
        }}
      >
        {loading ? (
          <div className="skeleton-box skeleton-heading" style={{ margin: "0 auto" }}></div>
        ) : (
          <h1>Employ Sallery Count</h1>
        )}
      </div>

      {/* =================================================
          SALARY TABLE CONTAINER
      ================================================= */}

      <div
        className="w-100 overflow-hidden mt-4 px-3"
      >
        <table
          className="table table-bordered table-striped alltext salary-table"
        >
          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <thead className="table-dark">
            {loading ? (
              <tr>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <th key={n}>
                    <div className="skeleton-box" style={{ background: "#444" }}></div>
                  </th>
                ))}
              </tr>
            ) : (
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Month</th>
                <th>Monthly Salary</th>
                <th>Present</th>
                <th>Half Day</th>
                <th>Absent</th>
                <th>Total Salary</th>
              </tr>
            )}
          </thead>

          {/* =================================================
              TABLE BODY
          ================================================= */}

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
                  <td><div className="skeleton-box"></div></td>
                  <td><div className="skeleton-box"></div></td>
                </tr>
              ))
            ) : salaryData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No data found
                </td>
              </tr>
            ) : (
              salaryData.map((p) => (
                <tr
                  key={`
                    ${p.EmployId}-
                    ${p.Month}-
                    ${p.Year}
                  `}
                >
                  {/* EMPLOYEE ID */}
                  <td>
                    {p.EmployId}
                  </td>

                  {/* EMPLOYEE NAME */}
                  <td>
                    <div
                      className="cell-scroll"
                    >
                      {p.Employname}
                    </div>
                  </td>

                  {/* MONTH */}
                  <td>
                    <div
                      className="cell-scroll"
                    >
                      {getMonthName(p.Month)}{" "}
                      {p.Year}
                    </div>
                  </td>

                  {/* MONTHLY SALARY */}
                  <td>
                    <div
                      className="cell-scroll"
                    >
                      ₹{" "}
                      {Number(
                        p.MonthlySalary ??
                        p.Salary ??
                        0
                      ).toFixed(2)}
                    </div>
                  </td>

                  {/* PRESENT */}
                  <td>
                    {p.Present}
                  </td>

                  {/* HALF DAY */}
                  <td>
                    {p.HalfDay}
                  </td>

                  {/* ABSENT */}
                  <td>
                    {p.Absent}
                  </td>

                  {/* TOTAL SALARY */}
                  <td>
                    <div
                      className="cell-scroll"
                    >
                      <b>
                        ₹{" "}
                        {Number(
                          p.TotalSalary ?? 0
                        ).toFixed(2)}
                      </b>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Employ_Sallery;