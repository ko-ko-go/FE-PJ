"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import register from "@/libs/auth/register";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resp = await register(name, email, phone, password);
      if (resp && resp.success) {
        router.push("/auth/login");
      } else {
        setError(resp?.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #0F172A, #1E293B)",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "450px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1E293B",
                mb: 1,
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Join Poseidon
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Start your journey to tranquility
            </Typography>
          </div>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
          >
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              slotProps={{ htmlInput: { sx: { py: 1.4 } } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              slotProps={{ htmlInput: { sx: { py: 1.4 } } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
            <TextField
              fullWidth
              label="Telephone Number"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              slotProps={{ htmlInput: { sx: { py: 1.4 } } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{ htmlInput: { sx: { py: 1.4 } } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="secondary"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                color: "white",
                mt: 1,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Already have an account?{" "}
              <Link
                href="/auth/login"
                style={{
                  color: "#0D9488",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
            </Typography>
          </div>
        </div>
      </main>
    </>
  );
}
