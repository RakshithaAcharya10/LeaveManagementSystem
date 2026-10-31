import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function EmployeeDashboard() {
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get("/leaves/my-leaves");

        setLeaves(response.data.leaves || []);

        if (response.data.user) {
          setUser(response.data.user);

          localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard details. Please login again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const leaveBalances = [
    {
      title: "Casual Leave",
      balance: user.casualLeaveBalance ?? 0,
    },
    {
      title: "Sick Leave",
      balance: user.sickLeaveBalance ?? 0,
    },
    {
      title: "Earned Leave",
      balance: user.earnedLeaveBalance ?? 0,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6f9",
        p: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
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
              Employee Dashboard
            </Typography>

            <Typography color="text.secondary">
              Welcome, {user.name || "Employee"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user.email || ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/apply-leave")}
            >
              Apply Leave
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              My Leave Balance
            </Typography>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {leaveBalances.map((item) => (
                <Grid item xs={12} sm={4} key={item.title}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography color="text.secondary">
                        {item.title}
                      </Typography>

                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="primary"
                      >
                        {item.balance}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Available days
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Leave Summary
            </Typography>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {[
                { title: "Total Requests", value: leaves.length },
                { title: "Pending", value: pending },
                { title: "Approved", value: approved },
                { title: "Rejected", value: rejected },
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
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                My Leave History
              </Typography>

              {leaves.length === 0 ? (
                <Typography color="text.secondary">
                  No leave requests found.
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Leave Type</b></TableCell>
                        <TableCell><b>Start Date</b></TableCell>
                        <TableCell><b>End Date</b></TableCell>
                        <TableCell><b>Days</b></TableCell>
                        <TableCell><b>Status</b></TableCell>
                        <TableCell><b>Admin Remarks</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {leaves.map((leave) => (
                        <TableRow key={leave._id}>
                          <TableCell>{leave.leaveType}</TableCell>

                          <TableCell>
                            {formatDate(leave.startDate)}
                          </TableCell>

                          <TableCell>
                            {formatDate(leave.endDate)}
                          </TableCell>

                          <TableCell>{leave.numberOfDays}</TableCell>

                          <TableCell>
                            <Chip
                              label={leave.status}
                              color={getStatusColor(leave.status)}
                              size="small"
                            />
                          </TableCell>

                          <TableCell>
                            {leave.adminRemarks || "-"}
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

export default EmployeeDashboard;