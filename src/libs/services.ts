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

export async function createService(token: string, shopId: string, data: any) {
  try {
    const res = await fetch(`${process.env.API_URL}/shops/${shopId}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) return { success: false, message: "Failed to create service" };
    return await res.json();
  } catch (err) {
    console.error("createService error:", err);
    return { success: false, message: "Network error" };
  }
}

export async function updateService(id: string, token: string, data: any) {
  try {
    const res = await fetch(`${process.env.API_URL}/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) return { success: false, message: "Failed to update service" };
    return await res.json();
  } catch (err) {
    console.error("updateService error:", err);
    return { success: false, message: "Network error" };
  }
}

export async function deleteService(id: string, token: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { success: false, message: "Failed to delete service" };
    return { success: true, data: await res.json() };
  } catch (err) {
    console.error("deleteService error:", err);
    return { success: false, message: "Network error" };
  }
}
