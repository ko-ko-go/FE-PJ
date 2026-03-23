"use server";

export async function getUsers(token: string) {
    try {
        const res = await fetch(`${process.env.API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error("getUsers error:", err);
        return null;
    }
}

export async function createUser(token: string, data: any) {
    try {
        const res = await fetch(`${process.env.API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) return { success: false, message: "Failed to create user" };
        return await res.json();
    } catch (err) {
        console.error("createUser error:", err);
        return { success: false, message: "Network error" };
    }
}

export async function updateUser(id: string, token: string, data: any) {
    try {
        const res = await fetch(`${process.env.API_URL}/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) return { success: false, message: "Failed to update user" };
        return await res.json();
    } catch (err) {
        console.error("updateUser error:", err);
        return { success: false, message: "Network error" };
    }
}

export async function deleteUser(id: string, token: string) {
    try {
        const res = await fetch(`${process.env.API_URL}/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return { success: false, message: "Failed to delete user" };
        return { success: true, data: await res.json() };
    } catch (err) {
        console.error("deleteUser error:", err);
        return { success: false, message: "Network error" };
    }
}
