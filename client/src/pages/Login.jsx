import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  BusinessCenter,
} from "@mui/icons-material";

import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email: email.trim(),
        password,
        role,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid login response from server.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "employee") {
        navigate("/employee-dashboard");
      } else {
        setError("Invalid user role.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-page">
      <Paper elevation={0} className="login-card">
        <Box className="login-icon">
          <BusinessCenter fontSize="large" />
        </Box>

        <Typography variant="h4" className="login-title">
          Welcome Back!
        </Typography>

        <Typography className="login-subtitle">
          Sign in to your Leave Management account
        </Typography>

        <Typography className="role-label">
          Select your account type
        </Typography>

        <ToggleButtonGroup
          value={role}
          exclusive
          fullWidth
          onChange={(e, value) => {
            if (value) {
              setRole(value);
              setError("");
            }
          }}
          className="role-toggle"
        >
          <ToggleButton value="employee">
            Employee
          </ToggleButton>

          <ToggleButton value="admin">
            Admin
          </ToggleButton>
        </ToggleButtonGroup>

        <Box component="form" onSubmit={handleLogin}>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
              {error}
            </Alert>
          )}

          <Typography className="field-label">
            Email Address
          </Typography>

          <TextField
            fullWidth
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Typography className="field-label">
            Password
          </Typography>

          <TextField
            fullWidth
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    type="button"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Sign In as ${
                role === "employee" ? "Employee" : "Admin"
              }`
            )}
          </Button>
        </Box>

        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account?{" "}
          <Button onClick={() => navigate("/register")}>
            Register
          </Button>
        </Typography>

        <Typography className="login-footer">
          Leave Management System © 2026
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;