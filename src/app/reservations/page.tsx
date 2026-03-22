import { getReservations } from "@/libs/reservations";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Link from "next/link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import StatusBadge from "@/components/StatusBadge";
import ReservationActions from "./ReservationActions";
import dayjs from "dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentsIcon from "@mui/icons-material/Payments";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HistoryIcon from "@mui/icons-material/History";

export default async function ReservationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const resData = await getReservations(session.user.token);
  const reservations = resData?.data || [];
  const now = dayjs();

  return (
    <main
      style={{
        maxWidth: "64rem",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "3rem 1.5rem 5rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <div>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            My Reservations
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Manage your upcoming and past massage sessions.
          </Typography>
        </div>
        <Button
          component={Link}
          href="/shops"
          variant="contained"
          color="secondary"
          sx={{ borderRadius: "8px", px: 3, fontWeight: 700 }}
        >
          New Booking
        </Button>
      </Box>

      {reservations.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "white",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
          }}
        >
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 2 }}>
            No reservations found
          </Typography>
          <Button
            component={Link}
            href="/shops"
            variant="outlined"
            color="secondary"
          >
            Browse Shops
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {reservations.map((res: any) => {
            const appointmentDateTime = dayjs(`${res.appointment_date}T${res.appointment_time}`);
            const isPast = appointmentDateTime.isBefore(now);

            return (
              <Card
                key={res._id}
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "none",
                  opacity: isPast ? 0.6 : 1,
                  filter: isPast ? "grayscale(0.5)" : "none",
                  transition: "all 0.2s",
                  position: "relative",
                  "&:hover": {
                    borderColor: isPast ? "#E2E8F0" : "#0D9488",
                  }
                }}
              >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: isPast ? "#F1F5F9" : "#F8FAFC",
                        borderRight: "1px solid #E2E8F0",
                        minWidth: 100,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 800, color: isPast ? "#64748B" : "inherit" }}>
                        {dayjs(res.appointment_date).format("DD")}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "text.secondary",
                          textTransform: "uppercase",
                        }}
                      >
                        {dayjs(res.appointment_date).format("MMM YYYY")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 700, color: isPast ? "#64748B" : "inherit" }}>
                            {res.service?.name}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <StatusBadge status={res.status} />
                            {isPast && (
                              <Chip 
                                label="Passed" 
                                size="small" 
                                icon={<HistoryIcon sx={{ fontSize: "14px !important" }} />}
                                sx={{ 
                                  height: 22, 
                                  fontSize: "0.7rem", 
                                  fontWeight: 700,
                                  bgcolor: "#E2E8F0",
                                  color: "#475569",
                                  "& .MuiChip-icon": { color: "#475569" }
                                }} 
                              />
                            )}
                          </Box>
                        </Box>
                        {!isPast && <ReservationActions reservation={res} />}
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          color: "text.secondary",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <StorefrontIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {res.service?.shop?.name}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {res.appointment_date} {res.appointment_time}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <PaymentsIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            ฿{res.service?.price.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </main>
  );
}
