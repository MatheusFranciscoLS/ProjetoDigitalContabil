import { jwtMiddleware } from "@/utils/middleware";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/controllers/TaskController";
import { NextResponse } from "next/server";

// Handler para o método GET
async function getHandler(request) {
  try {
    const tasks = await getTasks();
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao listar tarefas" },
      { status: 500 }
    );
  }
}

// Handler para o método POST
async function postHandler(request) {
  try {
    const data = await request.json();
    const task = await createTask(data);
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao criar tarefa" },
      { status: 500 }
    );
  }
}

// Handler para o método PUT
async function putHandler(request) {
  try {
    const data = await request.json();
    const task = await updateTask(data.id, data);
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Tarefa não encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar tarefa" },
      { status: 500 }
    );
  }
}

// Handler para o método DELETE
async function deleteHandler(request) {
  try {
    const { id } = await request.json();
    const result = await deleteTask(id);
    if (!result.deletedCount) {
      return NextResponse.json(
        { success: false, message: "Tarefa não encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Tarefa deletada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao deletar tarefa" },
      { status: 500 }
    );
  }
}

// Aplica o middleware aos handlers
export const GET = jwtMiddleware(getHandler);
export const POST = jwtMiddleware(postHandler);
export const PUT = jwtMiddleware(putHandler);
export const DELETE = jwtMiddleware(deleteHandler);
