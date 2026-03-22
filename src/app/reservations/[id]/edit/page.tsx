"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { updateReservation, getReservations } from "@/libs/reservations";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";

export default function EditReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();

  const [date, setDate] = useState<Dayjs | null>(null);
  const [time, setTime] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const token = session?.user?.token ?? "";

  useEffect(() => {
    if (!token) return;
    getReservations(token).then((res) => {
      const target = res?.data?.find((r: any) => r._id === id);
      if (target) {
        setDate(dayjs(target.appointment_date));
        setTime(dayjs(`2000-01-01T${target.appointment_time}`));
      }
      setLoading(false);
    });
  }, [token, id]);

  const handleUpdate = async () => {
    if (!date || !time) return;
    setSubmitting(true);
    const res = await updateReservation(id, token, {
      appointment_date: date.format("YYYY-MM-DD"),
      appointment_time: time.format("HH:mm"),
    });
    setSubmitting(false);

    if (res) {
      setSnackbar({
        open: true,
        message: "Reservation updated!",
        severity: "success",
      });
      setTimeout(() => router.push("/reservations"), 1200);
    } else {
      setSnackbar({
        open: true,
        message: "Failed to update reservation",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <>
      <main
        style={{
          maxWidth: "42rem",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingTop: "3rem",
          paddingBottom: "5rem",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1E293B",
            mb: 1,
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Edit Reservation
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B", mb: 4 }}>
          Adjust your appointment date and time.
        </Typography>

        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1px solid #F1F5F9",
            p: { xs: 3, md: 4 },
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}
            >
              <DatePicker
                label="Appointment Date"
                value={date}
                onChange={(val) => setDate(val)}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    },
                  },
                }}
              />
              <TimePicker
                label="Appointment Time"
                value={time}
                onChange={(val) => setTime(val)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    },
                  },
                }}
              />
            </Box>
          </LocalizationProvider>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              sx={{
                borderRadius: "10px",
                px: 4,
                textTransform: "none",
                fontWeight: 600,
                color: "#64748B",
                borderColor: "#E2E8F0",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpdate}
              disabled={submitting || !date || !time}
              sx={{
                borderRadius: "10px",
                px: 6,
                textTransform: "none",
                fontWeight: 600,
                color: "white",
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Box>
        </Box>
      </main>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: "12px", minWidth: "300px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
