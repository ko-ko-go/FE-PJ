import { getShops } from "@/libs/shops";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import Box from "@mui/material/Box";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default async function ShopsPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || "";
  const shopsRes = await getShops(token);
  const shops = shopsRes?.data || [];

  return (
    <>
      <main
        style={{
          maxWidth: "80rem",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingTop: "3rem",
          paddingBottom: "5rem",
        }}
      >
        <Box sx={{ marginBottom: "4rem", textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#0F172A",
              mb: 2,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Massage Shops
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748B",
              maxWidth: "42rem",
              mx: "auto",
              fontSize: "1.125rem",
            }}
          >
            Experience the pinnacle of relaxation. Select one of our premium
            partner shops to begin your journey.
          </Typography>
        </Box>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {shops.map((shop: any) => (
            <Card
              key={shop._id}
              sx={{
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid #F1F5F9",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  borderColor: "#0D9488",
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: "#0F172A",
                  px: 3,
                  py: 2.5,
                  borderBottom: "4px solid #0D9488",
                  background:
                    "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    fontFamily: '"Playfair Display", serif',
                    letterSpacing: "-0.01em",
                  }}
                >
                  {shop.name}
                </Typography>
              </Box>

              <CardContent
                sx={{
                  px: 4,
                  py: 2,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 2,
                    flexGrow: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        bgcolor: "rgba(13, 148, 136, 0.1)",
                        p: 1,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 0.5,
                      }}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: "1.1rem", color: "#0D9488" }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#475569",
                        fontWeight: 500,
                        lineHeight: 1.6,
                      }}
                    >
                      {shop.address}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        bgcolor: "rgba(13, 148, 136, 0.1)",
                        p: 1,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PhoneIcon
                        sx={{ fontSize: "1.1rem", color: "#0D9488" }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#475569", fontWeight: 500 }}
                    >
                      {shop.phone}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        bgcolor: "rgba(13, 148, 136, 0.1)",
                        p: 1,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AccessTimeIcon
                        sx={{ fontSize: "1.1rem", color: "#0D9488" }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#475569", fontWeight: 500 }}
                    >
                      {shop.open_time} - {shop.close_time}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  component={Link}
                  href={`/reservations/new?shopId=${shop._id}`}
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{
                    borderRadius: "14px",
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    color: "white",
                    fontSize: "1rem",
                    boxShadow: "0 10px 15px -3px rgba(13, 148, 136, 0.3)",
                    "&:hover": {
                      boxShadow: "0 15px 20px -5px rgba(13, 148, 136, 0.4)",
                    },
                  }}
                >
                  Book Here
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
