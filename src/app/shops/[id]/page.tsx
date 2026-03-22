import { getShop } from "@/libs/shops";
import { getServices } from "@/libs/services";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ServiceCard from "@/components/ServiceCard";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || "";
  const userTier = session?.user?.tier || "vip";

  const [shopRes, servicesRes] = await Promise.all([
    getShop(id, token),
    getServices(token, id),
  ]);

  const shop = shopRes?.data;
  const services = servicesRes?.data || [];

  if (!shop) {
    return (
      <>
        <main style={{ padding: "5rem", textAlign: "center" }}>
          <Typography variant="h5">Shop not found</Typography>
        </main>
      </>
    );
  }

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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem",
            marginBottom: "4rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div>
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
                {shop.name}
              </Typography>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                  color: "#64748B",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <LocationOnIcon
                    sx={{ fontSize: "1.1rem", color: "#94A3B8" }}
                  />
                  <Typography variant="body2">{shop.address}</Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <PhoneIcon sx={{ fontSize: "1.1rem", color: "#94A3B8" }} />
                  <Typography variant="body2">{shop.tel}</Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <AccessTimeIcon
                    sx={{ fontSize: "1.1rem", color: "#94A3B8" }}
                  />
                  <Typography variant="body2">
                    {shop.open_time} - {shop.close_time}
                  </Typography>
                </div>
              </div>
            </div>

            <Divider sx={{ my: 2 }} />

            <div style={{ maxWidth: "48rem" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1E293B", mb: 1.5 }}
              >
                About this Shop
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#475569", lineHeight: 1.7 }}
              >
                Experience the pinnacle of relaxation at {shop.name}. Our
                professional therapists are dedicated to providing you with a
                rejuvenating experience tailored to your needs. Located in the
                heart of {shop.address.split(",")[0]}, we offer a variety of
                premium services to help you unwind.
              </Typography>
            </div>

            <Button
              component={Link}
              href={`/reservations/new?shopId=${shop._id}`}
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                alignSelf: "start",
                px: 6,
                py: 1.75,
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "1.125rem",
                textTransform: "none",
                color: "white",
                boxShadow: "0 10px 15px -3px rgba(13, 148, 136, 0.3)",
              }}
            >
              Book Here
            </Button>
          </div>
        </div>

        <section style={{ marginTop: "5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1E293B",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Available Services
            </Typography>
          </div>

          {services.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                paddingTop: "3rem",
                paddingBottom: "3rem",
                backgroundColor: "#F8FAFC",
                borderRadius: "1rem",
                border: "2px dashed #E2E8F0",
              }}
            >
              <Typography variant="body1" sx={{ color: "#94A3B8" }}>
                No services listed for this shop yet.
              </Typography>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "2rem",
              }}
            >
              {services.map((svc: any) => (
                <ServiceCard key={svc._id} service={svc} userTier={userTier} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
