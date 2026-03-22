"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import WavesIcon from "@mui/icons-material/Waves";
import DiamondIcon from "@mui/icons-material/Diamond";
import StarIcon from "@mui/icons-material/Star";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function TierBadge({ tier }: { tier: string }) {
  if (tier === "vvip_poseidon") {
    return (
      <Chip
        icon={
          <DiamondIcon sx={{ fontSize: 14, color: "#00E5FF !important" }} />
        }
        label="VVIP"
        size="small"
        sx={{
          bgcolor: "#0F172A",
          border: "1px solid #00E5FF",
          color: "#00E5FF",
          fontWeight: 700,
          fontSize: "0.7rem",
        }}
      />
    );
  }
  if (tier === "vip") {
    return (
      <Chip
        icon={<StarIcon sx={{ fontSize: 14, color: "#D4AF37 !important" }} />}
        label="VIP"
        size="small"
        sx={{
          bgcolor: "transparent",
          border: "1px solid #D4AF37",
          color: "#D4AF37",
          fontWeight: 700,
          fontSize: "0.7rem",
        }}
      />
    );
  }
  return null;
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = session
    ? [
        { label: "Shops", href: "/shops" },
        { label: "My Reservations", href: "/reservations" },
      ]
    : [];

  const tier = session?.user?.tier ?? "";
  const displayName = session?.user?.name;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ p: 2, height: "100%", bgcolor: "#0F172A", color: "white" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WavesIcon sx={{ color: "#0D9488" }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Poseidon
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {session && (
        <Box sx={{ mb: 4, px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: "#0D9488" }}>
              {displayName?.[0]?.toUpperCase() ?? "U"}
            </Avatar>
            <div>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {displayName}
              </Typography>
              {tier && <TierBadge tier={tier} />}
            </div>
          </Box>
        </Box>
      )}

      <List>
        {navLinks.map((link) => (
          <ListItem key={link.href} disablePadding>
            <ListItemButton
              component={Link}
              href={link.href}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: "8px",
                mb: 1,
                bgcolor: pathname.startsWith(link.href)
                  ? "rgba(13, 148, 136, 0.1)"
                  : "transparent",
                color: pathname.startsWith(link.href) ? "#2DD4BF" : "#CBD5E1",
              }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 4 }}>
        {session ? (
          <Button
            fullWidth
            variant="outlined"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            startIcon={<LogoutIcon />}
            sx={{
              color: "#F87171",
              borderColor: "#F87171",
              textTransform: "none",
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            fullWidth
            component={Link}
            href="/auth/login"
            variant="contained"
            color="secondary"
            onClick={handleDrawerToggle}
            sx={{ color: "white", textTransform: "none" }}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#0F172A",
        boxShadow: "none",
        borderBottom: "1px solid #1E293B",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "80rem",
          mx: "auto",
          width: "100%",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <WavesIcon sx={{ color: "#0D9488" }} />
          <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
            Poseidon
          </Typography>
        </Link>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1,
          }}
        >
          {navLinks.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              sx={{
                fontSize: "0.875rem",
                color: pathname.startsWith(link.href) ? "#0D9488" : "#CBD5E1",
                textTransform: "none",
                px: 2,
              }}
            >
              {link.label}
            </Button>
          ))}

          {session ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 2 }}>
              {tier && <TierBadge tier={tier} />}
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.85rem",
                  bgcolor: "#0D9488",
                }}
              >
                {displayName?.[0]?.toUpperCase() ?? "U"}
              </Avatar>
              <IconButton
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                size="small"
                sx={{ color: "#94A3B8" }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button
              component={Link}
              href="/auth/login"
              variant="contained"
              color="secondary"
              sx={{ ml: 1, color: "white", textTransform: "none" }}
            >
              Login
            </Button>
          )}
        </Box>

        <IconButton
          color="inherit"
          onClick={handleDrawerToggle}
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{ sx: { width: 280, bgcolor: "#0F172A" } }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
