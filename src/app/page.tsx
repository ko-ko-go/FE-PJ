import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import WavesIcon from "@mui/icons-material/Waves";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <main>
        <section
          style={{
            padding: "5rem 1rem",
            textAlign: "center",
            backgroundColor: "#0F172A",
            color: "white",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Poseidon Massage
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: "#94A3B8",
              maxWidth: "40rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Experience the ultimate relaxation with our premium massage
            services.
          </Typography>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Button
              component={Link}
              href="/shops"
              variant="contained"
              color="secondary"
              sx={{ px: 4, py: 1.5, borderRadius: "8px", fontWeight: 700 }}
            >
              Book Now
            </Button>
            {session && (
              <Button
                component={Link}
                href="/reservations"
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                  fontWeight: 700,
                  color: "white",
                  borderColor: "white",
                  "&:hover": { borderColor: "#2DD4BF", color: "#2DD4BF" },
                }}
              >
                My Reservations
              </Button>
            )}
          </div>
        </section>

        <section style={{ padding: "5rem 1.5rem", backgroundColor: "#F8FAFC" }}>
          <div
            style={{
              maxWidth: "80rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                Why Poseidon?
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748B" }}>
                Discover our world-class facilities and expert care.
              </Typography>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {[
                {
                  icon: (
                    <WavesIcon sx={{ fontSize: "2.5rem", color: "#0D9488" }} />
                  ),
                  title: "Premium Shops",
                  desc: "Handpicked massage and spa centers with expert therapists.",
                },
                {
                  icon: (
                    <CalendarMonthIcon
                      sx={{ fontSize: "2.5rem", color: "#0D9488" }}
                    />
                  ),
                  title: "Easy Booking",
                  desc: "Reserve up to 3 upcoming sessions at your preferred time.",
                },
                {
                  icon: (
                    <AutoAwesomeIcon
                      sx={{ fontSize: "2.5rem", color: "#0D9488" }}
                    />
                  ),
                  title: "Membership Tiers",
                  desc: "Unlock exclusive VIP benefits and premium services.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    backgroundColor: "white",
                    borderRadius: "16px",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div style={{ marginBottom: "1.5rem" }}>{f.icon}</div>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, color: "#1E293B" }}
                  >
                    {f.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748B", lineHeight: 1.6 }}
                  >
                    {f.desc}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            paddingTop: "4rem",
            paddingBottom: "4rem",
            backgroundColor: "#0D9488",
            color: "white",
            textAlign: "center",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: "1.875rem",
              fontWeight: 700,
              mb: 2,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Ready to unwind?
          </Typography>
          <Typography
            component="p"
            sx={{
              color: "#CCFBF1",
              mb: 4,
              fontSize: "1.125rem",
            }}
          >
            Browse our partner shops and book your session today.
          </Typography>
          <Button
            component={Link}
            href={session ? "/shops" : "/auth/register"}
            variant="contained"
            size="large"
            sx={{
              bgcolor: "white",
              color: "#0F766E",
              px: 5,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: "12px",
              "&:hover": {
                bgcolor: "#F0FDFA",
              },
            }}
          >
            Explore Shops
          </Button>
        </section>
      </main>
    </>
  );
}
