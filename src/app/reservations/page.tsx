import { getReservations } from "@/libs/reservations";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Link from "next/link";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import ReservationList from "./ReservationList";

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
        <ReservationList initialReservations={reservations} />
      )}
    </main>
  );
}
