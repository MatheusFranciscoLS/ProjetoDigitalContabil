"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    console.log("Tentando fazer login com:", { username, password });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Resposta do servidor:", response);

      if (response.ok) {
        const { token } = await response.json();
        console.log("Token recebido:", token);
        localStorage.setItem("token", token);
        router.push("/tasks");
      } else {
        const errorMessage = await response.text(); // Captura a mensagem de erro do servidor
        console.error("Erro ao fazer login:", errorMessage);
        setError("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro na solicitação de login:", error);
      setError("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Não tem uma conta? <a href="/register">Registre-se</a>
      </p>
    </div>
  );
}
