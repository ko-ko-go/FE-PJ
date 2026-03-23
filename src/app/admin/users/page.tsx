"use client";
import React, { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert,
    Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsers, createUser, updateUser, deleteUser } from "@/libs/users";
import { useSession } from "next-auth/react";

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<any[]>([]);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterTier, setFilterTier] = useState("all");

    // Dialog states
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Form states
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "user", tier: "vip", password: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as any });

    const fetchUsers = () => {
        if (session?.user?.token) {
            getUsers(session.user.token).then(data => {
                if (data && data.data) {
                    setUsers(data.data);
                }
            });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [session]);

    const handleOpenAdd = () => {
        setFormData({ name: "", email: "", phone: "", role: "user", tier: "vip", password: "" });
        setOpenAdd(true);
    };

    const handleOpenEdit = (user: any) => {
        setSelectedUser(user);
        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "user",
            tier: user.tier || "vip",
            password: ""
        });
        setOpenEdit(true);
    };

    const handleOpenDelete = (user: any) => {
        setSelectedUser(user);
        setOpenDelete(true);
    };

    const handleSaveAdd = async () => {
        if (!session?.user?.token) return;
        const res = await createUser(session.user.token, formData);
        if (res?.success) {
            setSnackbar({ open: true, message: "User created successfully!", severity: "success" });
            setOpenAdd(false);
            fetchUsers();
        } else {
            setSnackbar({ open: true, message: res?.message || "Failed to create user", severity: "error" });
        }
    };

    const handleSaveEdit = async () => {
        if (!session?.user?.token || !selectedUser) return;

        // Don't send empty password on update
        const updateData = { ...formData };
        if (!updateData.password) {
            delete (updateData as any).password;
        }

        const res = await updateUser(selectedUser._id, session.user.token, updateData);
        if (res?.success) {
            setSnackbar({ open: true, message: "User updated successfully!", severity: "success" });
            setOpenEdit(false);
            fetchUsers();
        } else {
            setSnackbar({ open: true, message: res?.message || "Failed to update user", severity: "error" });
        }
    };

    const handleConfirmDelete = async () => {
        if (!session?.user?.token || !selectedUser) return;
        const res = await deleteUser(selectedUser._id, session.user.token);
        if (res?.success) {
            setSnackbar({ open: true, message: "User deleted successfully!", severity: "success" });
            setOpenDelete(false);
            fetchUsers();
        } else {
            setSnackbar({ open: true, message: res?.message || "Failed to delete user", severity: "error" });
        }
    };

    const filteredUsers = users.filter(user => {
        const searchString = `${user.name} ${user.email} ${user.phone}`.toLowerCase();
        const matchesSearch = searchString.includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesTier = filterTier === "all" || (user.tier || "regular") === filterTier;
        return matchesSearch && matchesRole && matchesTier;
    });

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Manage Users
                </Typography>
                <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                    Add User
                </Button>
            </Box>

            {/* Filter Toolbar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Search Users"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, bgcolor: 'white' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, Email, or Phone"
                />
                <FormControl size="small" sx={{ minWidth: 120, bgcolor: 'white' }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={filterRole}
                        label="Role"
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <MenuItem value="all">All Roles</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
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
                <Table sx={{ minWidth: 650 }} aria-label="users table">
                    <TableHead sx={{ bgcolor: "grey.100" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Tier</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No users found matching filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role}
                                            color={user.role === "admin" ? "secondary" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.tier || "regular"}
                                            color={user.tier === "vvip_poseidon" ? "warning" : user.tier === "vip" ? "primary" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" size="small" onClick={() => handleOpenEdit(user)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" size="small" onClick={() => handleOpenDelete(user)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add User Dialog */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Name" fullWidth variant="outlined"
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ mb: 2, mt: 1 }} />
                    <TextField margin="dense" label="Email" type="email" fullWidth variant="outlined"
                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} sx={{ mb: 2 }} />
                    <TextField margin="dense" label="Phone" fullWidth variant="outlined"
                        value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} sx={{ mb: 2 }} />
                    <TextField margin="dense" label="Password" type="password" fullWidth variant="outlined"
                        value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} sx={{ mb: 3 }} />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Role</InputLabel>
                        <Select value={formData.role} label="Role" onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 1 }}>
                        <InputLabel>Tier</InputLabel>
                        <Select value={formData.tier} label="Tier" onChange={(e) => setFormData({ ...formData, tier: e.target.value })}>
                            <MenuItem value="vip">VIP</MenuItem>
                            <MenuItem value="vvip_poseidon">VVIP Poseidon</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAdd(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSaveAdd} variant="contained" color="secondary">Create</Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Name" fullWidth variant="outlined"
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ mb: 2, mt: 1 }} />
                    <TextField margin="dense" label="Email" type="email" fullWidth variant="outlined"
                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} sx={{ mb: 2 }} />
                    <TextField margin="dense" label="Phone" fullWidth variant="outlined"
                        value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} sx={{ mb: 2 }} />
                    <TextField margin="dense" label="New Password (leave blank to keep current)" type="password" fullWidth variant="outlined"
                        value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} sx={{ mb: 3 }} />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Role</InputLabel>
                        <Select value={formData.role} label="Role" onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 1 }}>
                        <InputLabel>Tier</InputLabel>
                        <Select value={formData.tier} label="Tier" onChange={(e) => setFormData({ ...formData, tier: e.target.value })}>
                            <MenuItem value="vip">VIP</MenuItem>
                            <MenuItem value="vvip_poseidon">VVIP Poseidon</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEdit(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.</Typography>
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
