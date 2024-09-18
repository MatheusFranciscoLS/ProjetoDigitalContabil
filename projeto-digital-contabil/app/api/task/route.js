// app/api/task/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  // Lógica para obter tarefas
  const tasks = []; // Substitua com a lógica real para obter tarefas
  return NextResponse.json({ tasks });
}

export async function POST(request) {
  const data = await request.json();
  // Lógica para adicionar uma nova tarefa
  return NextResponse.json({ task: data });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  // Lógica para excluir uma tarefa
  return NextResponse.json({ success: true });
}
