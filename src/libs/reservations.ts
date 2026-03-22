"use server";

export async function getReservations(token: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/reservations`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("getReservations error:", err);
    return null;
  }
}

export async function createReservation(
  token: string,
  data: {
    appointment_date: string;
    appointment_time: string;
    service: string;
  },
) {
  try {
    const res = await fetch(`${process.env.API_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      return {
        success: false,
        message: err.message || "Failed to create reservation",
      };
    }
    return await res.json();
  } catch (err) {
    console.error("createReservation error:", err);
    return { success: false, message: "Network error" };
  }
}

export async function updateReservation(
  id: string,
  token: string,
  data: { appointment_date?: string; appointment_time?: string },
) {
  try {
    const res = await fetch(`${process.env.API_URL}/reservations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("updateReservation error:", err);
    return null;
  }
}

export async function deleteReservation(id: string, token: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/reservations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("deleteReservation error:", err);
    return null;
  }
}
