"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import StarIcon from "@mui/icons-material/Star";
import DiamondIcon from "@mui/icons-material/Diamond";
import LockIcon from "@mui/icons-material/Lock";

type ServiceCardProps = {
  service: {
    _id: string;
    name: string;
    price: number;
    duration: number;
    description?: string;
    tier: "vip" | "vvip_poseidon";
  };
  userTier?: string;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

export default function ServiceCard({
  service,
  userTier,
  selectable,
  selected,
  onSelect,
}: ServiceCardProps) {
  const isVvip = service.tier === "vvip_poseidon";
  const isVip = service.tier === "vip";
  const locked = isVvip && userTier !== "vvip_poseidon";
  return (
    <Card
      sx={{
        transition: "all 0.2s",
        cursor: selectable && !locked ? "pointer" : "default",
        transform: "none",
        outline: selected ? "2px solid #0D9488" : "none",
        ...(isVvip
          ? {
              background: "linear-gradient(135deg, #0F172A, #311B92)",
              color: "white",
              border: "1px solid #00E5FF",
              boxShadow: "0 0 15px rgba(0,229,255,0.2)",
            }
          : isVip
            ? {
                border: "1px solid #D4AF37",
                background: "rgba(212,175,55,0.05)",
              }
            : {}),
        opacity: locked ? 0.6 : 1,
        "&:hover": {
          transform: selectable && !locked ? "scale(1.02)" : "none",
          boxShadow: isVvip
            ? "0 0 20px rgba(0,229,255,0.4)"
            : "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      }}
      onClick={() => {
        if (selectable && !locked && onSelect) onSelect(service._id);
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              color: isVvip ? "white" : "#1E293B",
            }}
          >
            {service.name}
          </Typography>
          {isVvip ? (
            <DiamondIcon
              sx={{ color: "#00E5FF", ml: 1, flexShrink: 0 }}
              fontSize="small"
            />
          ) : (
            <StarIcon
              sx={{ color: "#D4AF37", ml: 1, flexShrink: 0 }}
              fontSize="small"
            />
          )}
        </div>

        {service.description && (
          <Typography
            variant="body2"
            sx={{
              mb: 1.5,
              fontSize: "0.875rem",
              color: isVvip ? "#CBD5E1" : "#64748B",
            }}
          >
            {service.description}
          </Typography>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.875rem",
              color: isVvip ? "#94A3B8" : "#64748B",
            }}
          >
            {service.duration} min
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              color: isVvip ? "#00E5FF" : "#1E293B",
            }}
          >
            ฿{service.price.toLocaleString()}
          </Typography>
        </div>

        {locked && (
          <Typography
            variant="caption"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              mt: 1,
              textAlign: "center",
              color: "#94A3B8",
              fontStyle: "italic",
            }}
          >
            <LockIcon sx={{ fontSize: "0.875rem" }} /> VVIP Poseidon members
            only
          </Typography>
        )}

        {isVvip && !locked && (
          <div style={{ marginTop: 8 }}>
            <Chip
              label="VVIP Poseidon Exclusive"
              size="small"
              sx={{
                background: "rgba(0, 229, 255, 0.1)",
                color: "#00E5FF",
                fontSize: "0.7rem",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                height: 20,
              }}
            />
          </div>
        )}

        {isVip && !isVvip && (
          <div style={{ marginTop: 8 }}>
            <Chip
              label="VIP"
              size="small"
              variant="outlined"
              sx={{
                borderColor: "#D4AF37",
                color: "#D4AF37",
                fontSize: "0.7rem",
                fontWeight: 600,
                height: 20,
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
