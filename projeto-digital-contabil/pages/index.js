import { useState } from "react";
import styles from "./styles.module.css"; // Importa o arquivo de estilos CSS

const Home = () => {
  // Estado inicial para despesas
  const [expenses, setExpenses] = useState([]);

  // Estado para nova tarefa
  const [newTask, setNewTask] = useState({
    title: "",
    price: "",
    transactionType: "entrada", // Tipo de transação padrão: entrada
    completed: false,
  });

  // Estado para controlar a visibilidade do formulário de adição
  const [isAdding, setIsAdding] = useState(false);
  // Estado para filtro das despesas
  const [filter, setFilter] = useState(null);

  // Função para marcar/desmarcar uma despesa como feita
  const handleDone = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, done: !expense.done } : expense
      )
    );
  };

  // Função para deletar uma despesa
  const handleDelete = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  };

  // Função para atualizar o estado da nova tarefa conforme o input do usuário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Função para adicionar uma nova despesa
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    try {
      // Ajusta o valor com base no tipo de transação
      const adjustedPrice =
        newTask.transactionType === "entrada"
          ? parseFloat(newTask.price)
          : -parseFloat(newTask.price);

      // Envia os dados da nova tarefa para o servidor
      const response = await fetch("/api/auth/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTask.title,
          value: adjustedPrice.toFixed(2),
          transactionType: newTask.transactionType,
          done: newTask.completed,
          date: new Date().toISOString().split("T")[0], // Adiciona a data
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Atualiza a lista de despesas com a nova tarefa
        setExpenses((prevExpenses) => [
          ...prevExpenses,
          {
            id: Date.now(), // Gera um ID temporário para a nova tarefa
            name: newTask.title,
            value: adjustedPrice.toFixed(2),
            done: newTask.completed,
            transactionType: newTask.transactionType,
          },
        ]);
        // Reseta o formulário para uma nova tarefa
        setNewTask({
          title: "",
          price: "",
          transactionType: "entrada",
          completed: false,
        });
        setIsAdding(false); // Fecha o formulário
      } else {
        alert(result.message || "Erro desconhecido"); // Exibe mensagem de erro
      }
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      alert("Erro ao adicionar tarefa."); // Exibe mensagem de erro
    }
  };

  // Filtra despesas com base no tipo de transação selecionado
  const filteredExpenses = expenses.filter((expense) => {
    if (!filter) return true; // Se não houver filtro, retorna todas
    return expense.transactionType === filter;
  });

  // Função para alternar o filtro de despesas
  const handleFilterClick = (type) => {
    setFilter((prevFilter) => (prevFilter === type ? null : type));
  };

  // Calcula o total de entradas
  const totalEntries = filteredExpenses
    .filter((expense) => expense.transactionType === "entrada")
    .reduce(
      (total, expense) => total + parseFloat(expense.value.replace(",", ".")),
      0
    );

  // Calcula o total de saídas (como valor negativo)
  const totalExits = filteredExpenses
    .filter((expense) => expense.transactionType === "saida")
    .reduce(
      (total, expense) => total + parseFloat(expense.value.replace(",", ".")),
      0
    );

  // Calcula o saldo como a diferença entre total de entradas e saídas
  const balance = totalEntries + totalExits;

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Minha Finança</h1>
        <button
          className={styles.addBtn}
          onClick={() => setIsAdding((prev) => !prev)}
        >
          Add Nova Tarefa
        </button>
      </div>

      {isAdding && (
        <form className={styles.addTaskForm} onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            placeholder="Título"
            required
          />
          <input
            type="number"
            name="price"
            value={newTask.price}
            onChange={handleChange}
            placeholder="Valor"
            step="0.01"
            required
          />
          <select
            name="transactionType"
            value={newTask.transactionType}
            onChange={handleChange}
            required
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
          <button type="submit">Adicionar</button>
        </form>
      )}

      <div className={styles.balance}>
        <div className={styles.balanceItem}>
          <div
            className={`${styles.balanceItem} ${
              filter === "entrada" ? styles.activeFilter : ""
            }`}
            onClick={() => handleFilterClick("entrada")}
          >
            <p>Entradas: R${totalEntries.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.balanceItem}>
          <div
            className={`${styles.balanceItem} ${
              filter === "saida" ? styles.activeFilter : ""
            }`}
            onClick={() => handleFilterClick("saida")}
          >
            <p>Saídas: R${totalExits.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.balanceItem}>
          <p>Saldo: R${balance.toFixed(2)}</p> {/* Exibe o saldo calculado */}
        </div>
      </div>

      <div className={styles.expenses}>
        {/* Renderiza a lista de despesas filtradas */}
        {filteredExpenses.map((expense) => (
          <div key={expense.id} className={styles.expenseItem}>
            <p>{expense.value}</p>
            <p>{expense.name}</p>
            <div className={styles.actions}>
              <button onClick={() => handleDone(expense.id)}>
                {expense.done ? "Desmarcar" : "Marcar como feito"}
              </button>
              <button onClick={() => handleDelete(expense.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
