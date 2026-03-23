"use client";
import React, { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getShops, createShop, updateShop, deleteShop } from "@/libs/shops";
import { useSession } from "next-auth/react";

export default function AdminShopsPage() {
    const { data: session } = useSession();
    const [shops, setShops] = useState<any[]>([]);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog states
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedShop, setSelectedShop] = useState<any>(null);

    // Form states
    const [formData, setFormData] = useState({ name: "", address: "", tel: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as any });

    const fetchShops = () => {
        if (session?.user?.token) {
            getShops(session.user.token).then(data => {
                if (data && data.data) setShops(data.data);
            });
        }
    };

    useEffect(() => {
        fetchShops();
    }, [session]);

    const handleOpenAdd = () => {
        setFormData({ name: "", address: "", tel: "" });
        setOpenAdd(true);
    };

    const handleOpenEdit = (shop: any) => {
        setSelectedShop(shop);
        setFormData({ name: shop.name || "", address: shop.address || "", tel: shop.tel || "" });
        setOpenEdit(true);
    };

    const handleOpenDelete = (shop: any) => {
        setSelectedShop(shop);
        setOpenDelete(true);
    };

    const handleSaveAdd = async () => {
        if (!session?.user?.token) return;
        const res = await createShop(session.user.token, formData);
        if (res?.success) {
            setSnackbar({ open: true, message: "Shop created successfully!", severity: "success" });
            setOpenAdd(false);
            fetchShops();
        } else {
            setSnackbar({ open: true, message: res?.message || "Failed to create shop", severity: "error" });
        }
    };

    const handleSaveEdit = async () => {
        if (!session?.user?.token || !selectedShop) return;
        const res = await updateShop(selectedShop._id, session.user.token, formData);
        if (res?.success) {
            setSnackbar({ open: true, message: "Shop updated successfully!", severity: "success" });
            setOpenEdit(false);
            fetchShops();
        } else {
            setSnackbar({ open: true, message: res?.message || "Failed to update shop", severity: "error" });
        }
    };

    const handleConfirmDelete = async () => {
        if (!session?.user?.token || !selectedShop) return;
        const res = await deleteShop(selectedShop._id, session.user.token);
        if (res?.success) {
            setSnackbar({ open: true, message: "Shop deleted successfully!", severity: "success" });
            setOpenDelete(false);
            fetchShops();
        } else {
            setSnackbar({ open: true, message: res?.message || "Failed to delete shop", severity: "error" });
        }
    };

    const filteredShops = shops.filter(shop => {
        const searchString = `${shop.name} ${shop.address} ${shop.tel}`.toLowerCase();
        return searchString.includes(searchQuery.toLowerCase());
    });

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Manage Shops
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                    Add Shop
                </Button>
            </Box>

            {/* Filter Toolbar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Search Shops"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, bgcolor: 'white' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, Address, or Phone"
                />
            </Box>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="shops table">
                    <TableHead sx={{ bgcolor: "grey.100" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Telephone</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredShops.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    No shops found matching records.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredShops.map((shop) => (
                                <TableRow key={shop._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">{shop._id?.substring(0, 8)}...</TableCell>
                                    <TableCell>{shop.name}</TableCell>
                                    <TableCell>{shop.address}</TableCell>
                                    <TableCell>{shop.tel}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" size="small" onClick={() => handleOpenEdit(shop)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" size="small" onClick={() => handleOpenDelete(shop)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Shop Dialog */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add New Shop</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Name" fullWidth variant="outlined"
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ mb: 2, mt: 1 }} />
                    <TextField margin="dense" label="Address" fullWidth variant="outlined"
                        value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} sx={{ mb: 2 }} />
                    <TextField margin="dense" label="Telephone" fullWidth variant="outlined"
                        value={formData.tel} onChange={(e) => setFormData({ ...formData, tel: e.target.value })} sx={{ mb: 1 }} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAdd(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSaveAdd} variant="contained" color="primary">Create</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Shop Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Shop</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Name" fullWidth variant="outlined"
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ mb: 2, mt: 1 }} />
                    <TextField margin="dense" label="Address" fullWidth variant="outlined"
                        value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} sx={{ mb: 2 }} />
                    <TextField margin="dense" label="Telephone" fullWidth variant="outlined"
                        value={formData.tel} onChange={(e) => setFormData({ ...formData, tel: e.target.value })} sx={{ mb: 1 }} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEdit(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Shop Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Delete Shop</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete {selectedShop?.name}? This action cannot be undone.</Typography>
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
