import { updateTask } from "@/controllers/TaskController";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        const data = await req.json();
        const taskId = params.id;
        const task = await updateTask(taskId, data);

        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: task });
    } catch (error) {
        console.error('PUT request error:', error);
        return NextResponse.json({ success: false, message: 'Erro ao atualizar tarefa' }, { status: 500 });
    }
}

import { deleteTask } from "@/controllers/TaskController";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        const taskId = params.id;
        await deleteTask(taskId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE request error:', error);
        return NextResponse.json({ success: false, message: 'Erro ao deletar tarefa' }, { status: 500 });
    }
}
