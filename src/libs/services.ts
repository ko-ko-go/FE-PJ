"use server";

export async function getServices(token: string, shopId?: string) {
  try {
    const url = shopId
      ? `${process.env.API_URL}/services?shop=${shopId}`
      : `${process.env.API_URL}/services`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("getServices error:", err);
    return null;
  }
}

export async function getService(id: string, token: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("getService error:", err);
    return null;
  }
}
