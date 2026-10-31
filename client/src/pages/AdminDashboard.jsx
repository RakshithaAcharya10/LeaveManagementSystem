import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  });

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remarks, setRemarks] = useState({});
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    let loggedInUser = {};

    try {
      loggedInUser = JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      loggedInUser = {};
    }

    if (!token || loggedInUser.role !== "admin") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
      return;
    }

    setUser(loggedInUser);
  }, [navigate]);

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/leaves");

      setLeaves(response.data.leaves || []);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load leave requests."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    let loggedInUser = {};

    try {
      loggedInUser = JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      loggedInUser = {};
    }

    if (token && loggedInUser.role === "admin") {
      fetchLeaves();
    }
  }, [fetchLeaves]);

  const pending = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const approved = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const rejected = leaves.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "success";
    if (status === "Rejected") return "error";
    return "warning";
  };

  const handleStatusUpdate = async (leaveId, status) => {
    try {
      setProcessingId(leaveId);
      setError("");
      setSuccess("");

      const response = await API.patch(
        `/leaves/${leaveId}/status`,
        {
          status,
          adminRemarks: remarks[leaveId] || "",
        }
      );

      setSuccess(response.data.message);

      await fetchLeaves();
    } catch (err) {
      const statusCode = err.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to update leave status."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6f9",
        p: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Admin Dashboard
            </Typography>

            <Typography color="text.secondary">
              Welcome, {user.name || "Admin"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user.email || ""}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Leave Overview
            </Typography>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {[
                {
                  title: "Total Requests",
                  value: leaves.length,
                },
                {
                  title: "Pending",
                  value: pending,
                },
                {
                  title: "Approved",
                  value: approved,
                },
                {
                  title: "Rejected",
                  value: rejected,
                },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.title}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography color="text.secondary">
                        {item.title}
                      </Typography>

                      <Typography variant="h4" fontWeight="bold">
                        {item.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Paper elevation={2} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Employee Leave Requests
                </Typography>

                <Button
                  variant="outlined"
                  onClick={fetchLeaves}
                  disabled={loading || processingId !== null}
                >
                  Refresh
                </Button>
              </Box>

              {leaves.length === 0 ? (
                <Typography color="text.secondary">
                  No leave requests found.
                </Typography>
              ) : (
                <TableContainer sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 1100 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Employee</b></TableCell>
                        <TableCell><b>Email</b></TableCell>
                        <TableCell><b>Leave Type</b></TableCell>
                        <TableCell><b>Start Date</b></TableCell>
                        <TableCell><b>End Date</b></TableCell>
                        <TableCell><b>Days</b></TableCell>
                        <TableCell><b>Reason</b></TableCell>
                        <TableCell><b>Status</b></TableCell>
                        <TableCell><b>Admin Remarks</b></TableCell>
                        <TableCell><b>Action</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {leaves.map((leave) => (
                        <TableRow key={leave._id}>
                          <TableCell>
                            {leave.employee?.name ||
                              leave.employeeName ||
                              "-"}
                          </TableCell>

                          <TableCell>
                            {leave.employee?.email ||
                              leave.employeeEmail ||
                              "-"}
                          </TableCell>

                          <TableCell>{leave.leaveType}</TableCell>

                          <TableCell>
                            {formatDate(leave.startDate)}
                          </TableCell>

                          <TableCell>
                            {formatDate(leave.endDate)}
                          </TableCell>

                          <TableCell>{leave.numberOfDays}</TableCell>

                          <TableCell>{leave.reason}</TableCell>

                          <TableCell>
                            <Chip
                              label={leave.status}
                              color={getStatusColor(leave.status)}
                              size="small"
                            />
                          </TableCell>

                          <TableCell>
                            {leave.status === "Pending" ? (
                              <TextField
                                size="small"
                                placeholder="Enter remarks"
                                value={remarks[leave._id] || ""}
                                onChange={(event) =>
                                  setRemarks((previous) => ({
                                    ...previous,
                                    [leave._id]: event.target.value,
                                  }))
                                }
                              />
                            ) : (
                              leave.adminRemarks || "-"
                            )}
                          </TableCell>

                          <TableCell>
                            {leave.status === "Pending" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                }}
                              >
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  disabled={processingId !== null}
                                  onClick={() =>
                                    handleStatusUpdate(
                                      leave._id,
                                      "Approved"
                                    )
                                  }
                                >
                                  {processingId === leave._id
                                    ? "Processing..."
                                    : "Approve"}
                                </Button>

                                <Button
                                  size="small"
                                  variant="contained"
                                  color="error"
                                  disabled={processingId !== null}
                                  onClick={() =>
                                    handleStatusUpdate(
                                      leave._id,
                                      "Rejected"
                                    )
                                  }
                                >
                                  Reject
                                </Button>
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Processed
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
}

export default AdminDashboard;