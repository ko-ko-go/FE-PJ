"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getShops } from "@/libs/shops";
import { getServices } from "@/libs/services";
import { createReservation } from "@/libs/reservations";
import dayjs, { Dayjs } from "dayjs";
import ServiceCard from "@/components/ServiceCard";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider";

type Shop = {
  _id: string;
  name: string;
  open_time: string;
  close_time: string;
};
type Service = {
  _id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  tier: "vip" | "vvip_poseidon";
};

export default function NewReservationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultShopId = searchParams.get("shopId") ?? "";

  const [shops, setShops] = useState<Shop[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [shopId, setShopId] = useState(defaultShopId);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs().add(1, "day"));
  const [time, setTime] = useState<Dayjs | null>(
    dayjs().hour(10).minute(0).second(0),
  );

  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const token = session?.user?.token ?? "";

  useEffect(() => {
    if (!token) return;
    getShops(token).then((d) => {
      setShops(d?.data ?? []);
      setLoadingShops(false);
    });
  }, [token]);

  useEffect(() => {
    if (!shopId || !token) {
      setServices([]);
      return;
    }
    setLoadingServices(true);
    setServiceId("");
    getServices(token, shopId).then((d) => {
      setServices(d?.data ?? []);
      setLoadingServices(false);
    });
  }, [shopId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopId || !serviceId || !date || !time) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields",
        severity: "error",
      });
      return;
    }

    setSubmitting(true);

    const result = await createReservation(token, {
      appointment_date: date.format("YYYY-MM-DD"),
      appointment_time: time.format("HH:mm"),
      service: serviceId,
    });

    setSubmitting(false);

    if (result?.success === false) {
      setSnackbar({
        open: true,
        message: result.message ?? "Failed to create reservation",
        severity: "error",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Reservation created!",
        severity: "success",
      });
      setTimeout(() => router.push("/reservations"), 1200);
    }
  };

  const userTier = session?.user?.tier ?? "vip";

  return (
    <>
      <main
        style={{
          maxWidth: "48rem",
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
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#1E293B",
            mb: 1,
            fontFamily: '"Playfair Display", serif',
          }}
        >
          New Reservation
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B", mb: 4 }}>
          Select a shop, service, date and time for your booking.
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              border: "1px solid #F1F5F9",
              padding: "1.5rem",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1E293B", mb: 2 }}
            >
              1. Choose Shop
            </Typography>

            {loadingShops ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "1rem",
                }}
              >
                <CircularProgress color="secondary" size={28} />
              </div>
            ) : (
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                <InputLabel>Massage Shop</InputLabel>
                <Select
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  label="Massage Shop"
                >
                  {shops.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              border: "1px solid #F1F5F9",
              padding: "1.5rem",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1E293B", mb: 2 }}
            >
              2. Pick Date & Time
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                <DatePicker
                  label="Date"
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
                  label="Time"
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
              </div>
            </LocalizationProvider>
          </div>

          {shopId && (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                border: "1px solid #F1F5F9",
                padding: "1.5rem",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1E293B", mb: 2 }}
              >
                3. Select Service
              </Typography>

              {loadingServices ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "1rem",
                  }}
                >
                  <CircularProgress color="secondary" size={28} />
                </div>
              ) : services.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{ color: "#94A3B8", textAlign: "center", py: 2 }}
                >
                  No services available for this shop.
                </Typography>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {services.map((svc) => (
                    <ServiceCard
                      key={svc._id}
                      service={svc}
                      userTier={userTier}
                      selectable
                      selected={serviceId === svc._id}
                      onSelect={setServiceId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <Divider sx={{ my: 1 }} />

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
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
              type="submit"
              variant="contained"
              color="secondary"
              disabled={submitting || !shopId || !serviceId || !date || !time}
              sx={{
                borderRadius: "10px",
                px: 6,
                textTransform: "none",
                fontWeight: 600,
                color: "white",
              }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </form>
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
