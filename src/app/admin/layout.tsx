import React from "react";
import Link from "next/link";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";

const drawerWidth = 240;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", mt: "64px" },
                }}
            >
                <Box sx={{ overflow: "auto" }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} href="/admin">
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} href="/admin/shops">
                                <ListItemIcon>
                                    <StorefrontIcon />
                                </ListItemIcon>
                                <ListItemText primary="Shops" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} href="/admin/services">
                                <ListItemIcon>
                                    <RoomServiceIcon />
                                </ListItemIcon>
                                <ListItemText primary="Services" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} href="/admin/bookings">
                                <ListItemIcon>
                                    <EventNoteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Bookings" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} href="/admin/users">
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Users" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
                {children}
            </Box>
        </Box>
    );
}
