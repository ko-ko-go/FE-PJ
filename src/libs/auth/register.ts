"use server";

const Register = async (
  name: string,
  email: string,
  phone: string,
  password: string,
) => {
  try {
    const response = await fetch(`${process.env.API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data;
  } catch (err) {
    console.error("Register Error:", err);
    return null;
  }
};

export default Register;
