'use server'

const Login = async (email: string, password: string) => {
    try {
        const response = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) return null;

        const data = await response.json();

        return data;
    } catch (err) {
        console.error("Login Error:", err);
        return null;
    }
}

export default Login;