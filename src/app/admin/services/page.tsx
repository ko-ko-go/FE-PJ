"use client";
import React, { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert,
    Select, MenuItem, InputLabel, FormControl, Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getServices, createService, updateService, deleteService } from "@/libs/services";
import { getShops } from "@/libs/shops";
import { useSession } from "next-auth/react";

export default function AdminServicesPage() {
    const { data: session } = useSession();
    const [services, setServices] = useState<any[]>([]);
    const [shops, setShops] = useState<any[]>([]);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filterShop, setFilterShop] = useState("all");
    const [filterTier, setFilterTier] = useState("all");

    // Dialog states
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);

    // Form states
    const [formData, setFormData] = useState({ name: "", price: "", duration: "", tier: "regular", description: "", shop: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as any });

    const fetchData = async () => {
        if (session?.user?.token) {
            const [servicesRes, shopsRes] = await Promise.all([
                getServices(session.user.token),
                getShops(session.user.token)
            ]);

            if (servicesRes?.data) setServices(servicesRes.data);
            if (shopsRes?.data) setShops(shopsRes.data);
        }
    };

    useEffect(() => {
        fetchData();
    }, [session]);

    const handleOpenAdd = () => {
        setFormData({ name: "", price: "", duration: "", tier: "regular", description: "", shop: shops.length > 0 ? shops[0]._id : "" });
        setOpenAdd(true);
    };

    const handleOpenEdit = (service: any) => {
        setSelectedService(service);
        // Extracts shop ID in case service.shop is populated as an object
        const shopId = service.shop && typeof service.shop === 'object' ? service.shop._id : (service.shop || "");

        setFormData({
            name: service.name || "",
            price: service.price?.toString() || "",
            duration: service.duration?.toString() || "",
            tier: service.tier || "regular",
            description: service.description || "",
            shop: shopId
        });
        setOpenEdit(true);
    };

    const handleOpenDelete = (service: any) => {
        setSelectedService(service);
        setOpenDelete(true);
    };

    const handleSaveAdd = async () => {
        if (!session?.user?.token || !formData.shop) {
            setSnackbar({ open: true, message: "Please select a Shop", severity: "error" });
            return;
        }

        // ensure price and duration are numbers
        const payload = { ...formData, price: Number(formData.price), duration: Number(formData.duration) };
        const shopId = payload.shop;
        delete (payload as any).shop;

        const res = await createService(session.user.token, shopId, payload);
        if (res?.success) {
            setSnackbar({ open: true, message: "Service created successfully!", severity: "success" });
            setOpenAdd(false);
            fetchData();
        } else {
            setSnackbar({ open: true, message: res?.message || "Failed to create service", severity: "error" });
        }
    };

    const handleSaveEdit = async () => {
        if (!session?.user?.token || !selectedService) return;

        const payload = { ...formData, price: Number(formData.price), duration: Number(formData.duration) };

        const res = await updateService(selectedService._id, session.user.token, payload);
        if (res?.success) {
            setSnackbar({ open: true, message: "Service updated successfully!", severity: "success" });
            setOpenEdit(false);
            fetchData();
        } else {
            setSnackbar({ open: true, message: res?.message || "Failed to update service", severity: "error" });
        }
    };

    const handleConfirmDelete = async () => {
        if (!session?.user?.token || !selectedService) return;
        const res = await deleteService(selectedService._id, session.user.token);
        if (res?.success) {
            setSnackbar({ open: true, message: "Service deleted successfully!", severity: "success" });
            setOpenDelete(false);
            fetchData();
        } else {
            setSnackbar({ open: true, message: res?.message || "Failed to delete service", severity: "error" });
        }
    };

    const filteredServices = services.filter(service => {
        const searchString = `${service.name} ${service.description}`.toLowerCase();
        const matchesSearch = searchString.includes(searchQuery.toLowerCase());
        const serviceShopId = service.shop?._id || service.shop;
        const matchesShop = filterShop === "all" || serviceShopId === filterShop;
        const matchesTier = filterTier === "all" || (service.tier || "regular") === filterTier;
        return matchesSearch && matchesShop && matchesTier;
    });

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Manage Services
                </Typography>
                <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                    Add Service
                </Button>
            </Box>

            {/* Filter Toolbar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Search Services"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, bgcolor: 'white' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name or Description"
                />
                <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white' }}>
                    <InputLabel>Shop</InputLabel>
                    <Select
                        value={filterShop}
                        label="Shop"
                        onChange={(e) => setFilterShop(e.target.value)}
                    >
                        <MenuItem value="all">All Shops</MenuItem>
                        {shops.map(shop => (
                            <MenuItem key={shop._id} value={shop._id}>{shop.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
                    <InputLabel>Tier</InputLabel>
                    <Select
                        value={filterTier}
                        label="Tier"
                        onChange={(e) => setFilterTier(e.target.value)}
                    >
                        <MenuItem value="all">All Tiers</MenuItem>
                        <MenuItem value="regular">Regular</MenuItem>
                        <MenuItem value="vip">VIP</MenuItem>
                        <MenuItem value="vvip_poseidon">VVIP Poseidon</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="services table">
                    <TableHead sx={{ bgcolor: "grey.100" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Service Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Shop</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Price / Duration</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Tier</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredServices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    No services found matching filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredServices.map((service) => (
                                <TableRow key={service._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">{service.name}</Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: "block" }}>
                                            {service.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{service.shop?.name || service.shop?.substring?.(0, 10) || "Unknown"}</TableCell>
                                    <TableCell>{service.price ? `$${service.price}` : "N/A"} / {service.duration ? `${service.duration}m` : "N/A"}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={service.tier || "regular"}
                                            color={service.tier === "vvip_poseidon" ? "warning" : service.tier === "vip" ? "primary" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" size="small" onClick={() => handleOpenEdit(service)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" size="small" onClick={() => handleOpenDelete(service)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Service Dialog */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add New Service</DialogTitle>
                <DialogContent sx={{ pt: "10px !important" }}>
                    <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                        <InputLabel>Shop</InputLabel>
                        <Select value={formData.shop} label="Shop" onChange={(e) => setFormData({ ...formData, shop: e.target.value })}>
                            {shops.map(shop => (
                                <MenuItem key={shop._id} value={shop._id}>{shop.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField margin="dense" label="Service Name" fullWidth variant="outlined"
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField label="Price ($)" type="number" fullWidth variant="outlined"
                            value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                        <TextField label="Duration (mins)" type="number" fullWidth variant="outlined"
                            value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                    </Box>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Tier Required</InputLabel>
                        <Select value={formData.tier} label="Tier Required" onChange={(e) => setFormData({ ...formData, tier: e.target.value })}>
                            <MenuItem value="regular">Regular</MenuItem>
                            <MenuItem value="vip">VIP</MenuItem>
                            <MenuItem value="vvip_poseidon">VVIP Poseidon</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField margin="dense" label="Description" fullWidth multiline rows={3} variant="outlined"
                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAdd(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSaveAdd} variant="contained" color="secondary">Create Service</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Service Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Service</DialogTitle>
                <DialogContent sx={{ pt: "10px !important" }}>
                    <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                        <InputLabel>Shop</InputLabel>
                        <Select value={formData.shop} label="Shop" onChange={(e) => setFormData({ ...formData, shop: e.target.value })}>
                            {shops.map(shop => (
                                <MenuItem key={shop._id} value={shop._id}>{shop.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField margin="dense" label="Service Name" fullWidth variant="outlined"
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField label="Price ($)" type="number" fullWidth variant="outlined"
                            value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                        <TextField label="Duration (mins)" type="number" fullWidth variant="outlined"
                            value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                    </Box>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Tier</InputLabel>
                        <Select value={formData.tier} label="Tier Required" onChange={(e) => setFormData({ ...formData, tier: e.target.value })}>
                            <MenuItem value="regular">Regular</MenuItem>
                            <MenuItem value="vip">VIP</MenuItem>
                            <MenuItem value="vvip_poseidon">VVIP Poseidon</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField margin="dense" label="Description" fullWidth multiline rows={3} variant="outlined"
                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEdit(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Service Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Delete Service</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete <strong>{selectedService?.name}</strong>? This action cannot be undone.</Typography>
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
