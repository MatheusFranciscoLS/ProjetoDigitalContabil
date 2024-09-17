import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, password } = await request.json();

  await connectMongo();

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Senha incorreta" },
        { status: 400 }
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      { success: false, message: "Erro no servidor" },
      { status: 500 }
    );
  }
}
