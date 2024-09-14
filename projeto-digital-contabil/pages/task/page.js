"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      console.log("Token obtido:", token);

      if (!token) {
        console.log("Token não encontrado, redirecionando para login...");
        router.push("/login");
        return;
      }

      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Resposta ao buscar tarefas:", response);

      if (response.ok) {
        const data = await response.json();
        console.log("Tarefas recebidas:", data);
        setTasks(data.data);
      } else {
        console.log("Falha ao buscar tarefas, redirecionando para login...");
        router.push("/login");
      }
    };

    fetchTasks();
  }, [router]);

  const addTask = async () => {
    const token = localStorage.getItem("token");
    console.log("Adicionando tarefa com token:", token);

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTask }),
    });

    console.log("Resposta ao adicionar tarefa:", response);

    if (response.ok) {
      const data = await response.json();
      console.log("Tarefa adicionada:", data);
      setTasks([...tasks, data.data]);
      setNewTask("");
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    console.log("Deletando tarefa com ID:", id, "e token:", token);

    const response = await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    console.log("Resposta ao deletar tarefa:", response);

    if (response.ok) {
      setTasks(tasks.filter((task) => task._id !== id));
    }
  };

  const startEditTask = (task) => {
    setEditTaskId(task._id);
    setEditTitle(task.title);
  };

  const updateTask = async () => {
    const token = localStorage.getItem("token");
    console.log("Atualizando tarefa com ID:", editTaskId, "e token:", token);

    const response = await fetch("/api/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: editTaskId, title: editTitle }),
    });

    console.log("Resposta ao atualizar tarefa:", response);

    if (response.ok) {
      const data = await response.json();
      console.log("Tarefa atualizada:", data);
      setTasks(
        tasks.map((task) => (task._id === data.data._id ? data.data : task))
      );
      setEditTaskId(null);
      setEditTitle("");
    }
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        placeholder="Nova tarefa"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Adicionar Tarefa</button>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {editTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={updateTask}>Salvar</button>
              </>
            ) : (
              <>
                {task.title}
                <button onClick={() => deleteTask(task._id)}>Excluir</button>
                <button onClick={() => startEditTask(task)}>Editar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
