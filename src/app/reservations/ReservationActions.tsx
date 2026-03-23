"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteReservation } from "@/libs/reservations";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";

export default function ReservationActions({
  reservation,
}: {
  reservation: any;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const token = session?.user?.token ?? "";

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteReservation(reservation._id, token);
    setLoading(false);
    setOpen(false);

    if (res?.success === false) {
      setSnackbar({ open: true, message: res.message || "Failed to cancel reservation", severity: "error" });
    } else {
      setSnackbar({ open: true, message: "Reservation cancelled successfully", severity: "success" });
      setTimeout(() => router.refresh(), 1000);
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <IconButton
          size="small"
          onClick={() => router.push(`/reservations/${reservation._id}/edit`)}
          sx={{
            color: "#64748B",
            "&:hover": { color: "#0D9488" },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{
            color: "#64748B",
            "&:hover": { color: "#F87171" },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>

      <Dialog
        open={open}
        onClose={() => !loading && setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #E2E8F0",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your appointment at{" "}
            <strong>{reservation?.service?.shop?.name}</strong>? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setOpen(false)}
            disabled={loading}
            sx={{ color: "#64748B", textTransform: "none" }}
          >
            No, keep it
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
            sx={{ px: 3, textTransform: "none", boxShadow: "none" }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Yes, Cancel"
            )}
          </Button>
        </DialogActions>
      </Dialog>

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
