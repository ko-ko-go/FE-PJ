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
