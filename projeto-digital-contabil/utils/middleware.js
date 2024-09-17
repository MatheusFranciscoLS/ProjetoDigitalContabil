// utils/middleware.js
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function jwtMiddleware(handler) {
  return async (req) => {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token não fornecido" },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Adiciona o usuário decodificado ao objeto req
      return handler(req);
    } catch (error) {
      console.error("Erro de autenticação:", error);
      return NextResponse.json(
        { success: false, message: "Token inválido" },
        { status: 401 }
      );
    }
  };
}

