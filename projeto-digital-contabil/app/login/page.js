'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../login/LoginPage.css'; // Importa o arquivo CSS

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        router.push("/");
      } else {
        const { message } = await response.json();
        setError(message || "Credenciais inválidas");
      }
    } catch (error) {
      setError("Erro ao realizar login. Tente novamente.");
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="logoSpace">
          <img src="/img/logo.png" alt="Logo" />
        </div>
        <ul className="navButtons">
          <li><a href="/">Home</a></li>
          <li><a href="/register">Registrar</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </header>

      <main className="main">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button onClick={handleLogin} className="button">
          Login
        </button>
        <p className="text">
          Não tem uma conta?{' '}
          <a href="/register" className="link">
            Registre-se
          </a>
        </p>
      </main>

      <footer className="footer">
        <p>Todos os direitos reservados</p>
      </footer>
    </div>
  );
}