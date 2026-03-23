"use client";
import React, { useState, useEffect } from "react";
import {
    Box, Typography, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert,
    Select, MenuItem, InputLabel, FormControl, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getReservations, updateReservation, deleteReservation } from "@/libs/reservations";
import { useSession } from "next-auth/react";

export default function AdminBookingsPage() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState<any[]>([]);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterShop, setFilterShop] = useState("all");
    const [filterPeriod, setFilterPeriod] = useState("all");
    const [sortBy, setSortBy] = useState("appointment_asc");

    // Dialog states
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    // Form states
    const [formData, setFormData] = useState({ appointment_date: "", appointment_time: "", status: "reserve" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as any });

    const fetchBookings = () => {
        if (session?.user?.token) {
            getReservations(session.user.token).then(data => {
                if (data && data.data) {
                    setBookings(data.data);
                }
            });
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [session]);

    const handleOpenEdit = (booking: any) => {
        setSelectedBooking(booking);
        setFormData({
            appointment_date: booking.appointment_date || "",
            appointment_time: booking.appointment_time || "",
            status: booking.status || "reserve"
        });
        setOpenEdit(true);
    };

    const handleOpenDelete = (booking: any) => {
        setSelectedBooking(booking);
        setOpenDelete(true);
    };

    const handleSaveEdit = async () => {
        if (!session?.user?.token || !selectedBooking) return;

        const res = await updateReservation(selectedBooking._id, session.user.token, formData);
        if (res && !res.success && res.message) {
            setSnackbar({ open: true, message: res.message, severity: "error" });
        } else if (res) {
            setSnackbar({ open: true, message: "Booking updated successfully!", severity: "success" });
            setOpenEdit(false);
            fetchBookings();
        } else {
            setSnackbar({ open: true, message: "Failed to update booking", severity: "error" });
        }
    };

    const handleConfirmDelete = async () => {
        if (!session?.user?.token || !selectedBooking) return;
        const res = await deleteReservation(selectedBooking._id, session.user.token);
        if (res && !res.success && res.message) {
            setSnackbar({ open: true, message: res.message, severity: "error" });
        } else if (res) {
            setSnackbar({ open: true, message: "Booking deleted successfully!", severity: "success" });
            setOpenDelete(false);
            fetchBookings();
        } else {
            setSnackbar({ open: true, message: "Failed to delete booking", severity: "error" });
        }
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case "completed": return <Chip label="Completed" color="success" size="small" />;
            case "in_progress": return <Chip label="In Progress" color="info" size="small" />;
            case "reserve": default: return <Chip label="Reserved" color="warning" size="small" />;
        }
    };

    // Calculate details for display when user/service is an object or string
    const formatName = (obj: any) => {
        if (!obj) return "N/A";
        // Due to lack of user population in reservations on backend, we will try to handle if it is object or string
        if (typeof obj === 'object') return obj.name || obj._id || "Unknown";
        return obj.substring(0, 10) + "..."; // It's just an ObjectId
    };

    const uniqueShops = Array.from(new Set(bookings.map(b => {
        if (b.service && typeof b.service === 'object' && b.service.shop) {
            return b.service.shop.name;
        }
        return null;
    }).filter(Boolean))) as string[];

    const today = new Date().toISOString().split('T')[0];

    const filteredBookings = bookings.filter(b => {
        const shopName = b.service && typeof b.service === 'object' && b.service.shop ? b.service.shop.name : "";
        const searchString = `${formatName(b.user)} ${formatName(b.service)} ${shopName}`.toLowerCase();

        const matchesSearch = searchString.includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || b.status === filterStatus;
        const matchesShop = filterShop === "all" || shopName === filterShop;

        let matchesPeriod = true;
        if (filterPeriod === "today") {
            matchesPeriod = b.appointment_date === today;
        } else if (filterPeriod === "upcoming") {
            matchesPeriod = b.appointment_date >= today;
        } else if (filterPeriod === "past") {
            matchesPeriod = b.appointment_date < today;
        }

        return matchesSearch && matchesStatus && matchesShop && matchesPeriod;
    }).sort((a, b) => {
        if (sortBy.startsWith("created")) {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortBy === "created_desc" ? dateB - dateA : dateA - dateB;
        } else {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`).getTime();
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`).getTime();
            return sortBy === "appointment_desc" ? dateB - dateA : dateA - dateB;
        }
    });

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Manage Bookings
                </Typography>
            </Box>

            {/* Filter Toolbar */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <TextField
                    label="Search Bookings"
                    variant="outlined"
                    size="small"
                    sx={{ width: 250, bgcolor: 'white' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="User, Service, Shop..."
                />

                <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'white' }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
                        <MenuItem value="all">All Statuses</MenuItem>
                        <MenuItem value="reserve">Reserved</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'white' }}>
                    <InputLabel>Shop</InputLabel>
                    <Select value={filterShop} label="Shop" onChange={(e) => setFilterShop(e.target.value)}>
                        <MenuItem value="all">All Shops</MenuItem>
                        {uniqueShops.map((name, i) => (
                            <MenuItem key={i} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'white' }}>
                    <InputLabel>Period</InputLabel>
                    <Select value={filterPeriod} label="Period" onChange={(e) => setFilterPeriod(e.target.value)}>
                        <MenuItem value="all">All Time</MenuItem>
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="upcoming">Upcoming</MenuItem>
                        <MenuItem value="past">Past</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white' }}>
                    <InputLabel>Order By</InputLabel>
                    <Select value={sortBy} label="Order By" onChange={(e) => setSortBy(e.target.value)}>
                        <MenuItem value="appointment_asc">Appointment (Earliest)</MenuItem>
                        <MenuItem value="appointment_desc">Appointment (Latest)</MenuItem>
                        <MenuItem value="created_desc">Created (Newest)</MenuItem>
                        <MenuItem value="created_asc">Created (Oldest)</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="bookings table">
                    <TableHead sx={{ bgcolor: "grey.100" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Service</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Shop</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Date & Time</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((b) => (
                                <TableRow key={b._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell>{formatName(b.user)}</TableCell>
                                    <TableCell>{formatName(b.service)}</TableCell>
                                    <TableCell>{b.service && typeof b.service === 'object' && b.service.shop ? b.service.shop.name : "N/A"}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {b.appointment_date}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {b.appointment_time}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusChip(b.status)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" size="small" onClick={() => handleOpenEdit(b)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" size="small" onClick={() => handleOpenDelete(b)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Booking Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Booking</DialogTitle>
                <DialogContent sx={{ pt: "10px !important" }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 1 }}>
                        <TextField label="Date (YYYY-MM-DD)" type="text" fullWidth variant="outlined"
                            value={formData.appointment_date} onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })} />
                        <TextField label="Time (HH:mm)" type="text" fullWidth variant="outlined"
                            value={formData.appointment_time} onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })} />
                    </Box>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={formData.status} label="Status" onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                            <MenuItem value="reserve">Reserved</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEdit(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Booking Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Delete Booking</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this booking? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDelete(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
