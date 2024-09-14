import { NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect"; // Verifique o caminho correto
import Task from "../../../models/Task"; // Verifique o caminho correto

// Função para obter todas as tarefas
export async function GET(request) {
  try {
    const userId = request.userId; // Acesse o userId aqui
    const tasks = await getTasksForUser(userId); // Por exemplo, obtenha tarefas para o usuário
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error("Erro ao obter tarefas:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao obter tarefas" },
      { status: 400 }
    );
  }
}

// POST: criar uma nova tarefa
export async function POST(request) {
  await dbConnect();

  try {
    const { name, value, transactionType, done, date } = await request.json();

    if (!name || !value || !transactionType || !date) {
      return NextResponse.json(
        { message: "Dados incompletos." },
        { status: 400 }
      );
    }

    const newTask = new Task({ name, value, transactionType, done, date });
    await newTask.save();

    return NextResponse.json(
      { message: "Tarefa criada com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return NextResponse.json(
      { message: "Erro ao criar tarefa." },
      { status: 500 }
    );
  }
}
