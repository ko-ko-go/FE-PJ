"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import { useSession } from "next-auth/react";
import { getShops } from "@/libs/shops";
import { getServices } from "@/libs/services";
import { getReservations } from "@/libs/reservations";
import { getUsers } from "@/libs/users";

export default function AdminDashboardPage() {
    const { data: session } = useSession();
    const [counts, setCounts] = useState({ shops: 0, services: 0, bookings: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!session?.user?.token) return;
            try {
                // Fetch summary in parallel
                const [shopsRes, servicesRes, bookingsRes, usersRes] = await Promise.all([
                    getShops(session.user.token),
                    getServices(session.user.token),
                    getReservations(session.user.token),
                    getUsers(session.user.token)
                ]);

                setCounts({
                    shops: shopsRes?.count || shopsRes?.data?.length || 0,
                    services: servicesRes?.count || servicesRes?.data?.length || 0,
                    bookings: bookingsRes?.count || bookingsRes?.data?.length || 0,
                    users: usersRes?.count || usersRes?.data?.length || 0,
                });
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchDashboardData();
        }
    }, [session]);

    const stats = [
        { title: "Total Shops", value: loading ? "..." : counts.shops, icon: <StorefrontIcon fontSize="large" color="primary" /> },
        { title: "Total Services", value: loading ? "..." : counts.services, icon: <RoomServiceIcon fontSize="large" color="secondary" /> },
        { title: "Total Bookings", value: loading ? "..." : counts.bookings, icon: <EventNoteIcon fontSize="large" color="success" /> },
        { title: "Total Users", value: loading ? "..." : counts.users, icon: <PeopleIcon fontSize="large" color="info" /> },
    ];

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" className="text-slate-800">
                Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Welcome to the admin dashboard. Use the sidebar to manage shops, services, bookings, and users.
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {stats.map((stat, i) => (
                    <Card elevation={2} sx={{ borderRadius: 3, display: "flex", alignItems: "center", p: 2 }} key={i}>
                        <Box sx={{ mr: 2 }}>{stat.icon}</Box>
                        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                            <Typography color="text.secondary" variant="subtitle2">
                                {stat.title}
                            </Typography>
                            <Typography variant="h5" fontWeight="bold">
                                {stat.value}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Box>
    );
}
