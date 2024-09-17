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
      if (!token) {
        console.error("Token não encontrado no localStorage");
        router.push("/login");
        return;
      }

      console.log("Token sendo enviado:", token); // Adicione este log

      try {
        const response = await fetch("/api/task", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data.data);
        } else {
          // Log ou exiba uma mensagem de erro
          console.error("Erro ao buscar tarefas:", await response.text());
          router.push("/login");
        }
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        router.push("/login");
      }
    };

    fetchTasks();
  }, [router]);

  const addTask = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTask }),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks([...tasks, data.data]);
        setNewTask("");
      } else {
        // Log ou exiba uma mensagem de erro
        console.error("Erro ao adicionar tarefa:", await response.text());
      }
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/task`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
      } else {
        // Log ou exiba uma mensagem de erro
        console.error("Erro ao excluir tarefa:", await response.text());
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  const startEditTask = (task) => {
    setEditTaskId(task._id);
    setEditTitle(task.title);
  };

  const updateTask = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/task`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: editTaskId, title: editTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(
          tasks.map((task) => (task._id === data.data._id ? data.data : task))
        );
        setEditTaskId(null);
        setEditTitle("");
      } else {
        // Log ou exiba uma mensagem de erro
        console.error("Erro ao atualizar tarefa:", await response.text());
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
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
