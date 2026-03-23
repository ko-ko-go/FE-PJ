"use server";

export async function getShops(token: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/shops`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("getShops error:", err);
    return null;
  }
}

export async function getShop(id: string, token: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/shops/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("getShop error:", err);
    return null;
  }
}

export async function createShop(token: string, data: any) {
  try {
    const res = await fetch(`${process.env.API_URL}/shops`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) return { success: false, message: "Failed to create shop" };
    return await res.json();
  } catch (err) {
    console.error("createShop error:", err);
    return { success: false, message: "Network error" };
  }
}

export async function updateShop(id: string, token: string, data: any) {
  try {
    const res = await fetch(`${process.env.API_URL}/shops/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) return { success: false, message: "Failed to update shop" };
    return await res.json();
  } catch (err) {
    console.error("updateShop error:", err);
    return { success: false, message: "Network error" };
  }
}

export async function deleteShop(id: string, token: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/shops/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { success: false, message: "Failed to delete shop" };
    return { success: true, data: await res.json() };
  } catch (err) {
    console.error("deleteShop error:", err);
    return { success: false, message: "Network error" };
  }
}
