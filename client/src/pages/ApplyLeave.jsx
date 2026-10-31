import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ApplyLeave() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "startDate" && previous.endDate < value
        ? { endDate: "" }
        : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason.trim()
    ) {
      setError("Please fill in all the fields.");
      return;
    }

    if (formData.startDate < today) {
      setError("Start date cannot be in the past.");
      return;
    }

    if (formData.endDate < formData.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/leaves", formData);

      setSuccess(response.data.message);

      setFormData({
        leaveType: "Casual",
        startDate: "",
        endDate: "",
        reason: "",
      });

      setTimeout(() => {
        navigate("/employee-dashboard");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit leave application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Apply for Leave
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Fill in the details below to submit your leave request.
        </Typography>

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

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Leave Type"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="Casual">Casual Leave</MenuItem>
            <MenuItem value="Sick">Sick Leave</MenuItem>
            <MenuItem value="Earned">Earned Leave</MenuItem>
          </TextField>

          <Typography sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
            Start Date *
          </Typography>

          <TextField
            fullWidth
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            inputProps={{ min: today }}
            required
          />

          <Typography sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
            End Date *
          </Typography>

          <TextField
            fullWidth
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            inputProps={{
              min: formData.startDate || today,
            }}
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Leave"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            margin="normal"
            placeholder="Enter your reason for requesting leave"
            required
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit Application"
              )}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/employee-dashboard")}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ApplyLeave;