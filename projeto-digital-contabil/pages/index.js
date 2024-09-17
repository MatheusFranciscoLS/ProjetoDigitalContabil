import { useState } from "react";
import styles from "./styles.module.css"; // Importa o arquivo de estilos CSS

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    price: "",
    transactionType: "entrada",
    completed: false,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null); // Estado para controle de edição
  const [filter, setFilter] = useState(null);
  const [successMessage, ] = useState("");

  const handleDone = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, done: !expense.done } : expense
      )
    );
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Tem certeza de que deseja excluir esta tarefa?");
    if (confirmDelete) {
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const adjustedPrice =
        newTask.transactionType === "entrada"
          ? parseFloat(newTask.price)
          : -parseFloat(newTask.price);

      if (isEditing !== null) {
        setExpenses((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense.id === isEditing
              ? {
                  ...expense,
                  name: newTask.title,
                  value: adjustedPrice.toFixed(2),
                  transactionType: newTask.transactionType,
                }
              : expense
          )
        );
        setIsEditing(null); // Encerra o modo de edição
      } else {
        const response = await fetch("/api/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newTask.title,
            value: adjustedPrice.toFixed(2),
            transactionType: newTask.transactionType,
            done: newTask.completed,
            date: new Date().toISOString().split("T")[0],
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setExpenses((prevExpenses) => [
            ...prevExpenses,
            {
              id: Date.now(),
              name: newTask.title,
              value: adjustedPrice.toFixed(2),
              done: newTask.completed,
              transactionType: newTask.transactionType,
            },
          ]);
        } else {
          alert(result.message || "Erro desconhecido");
        }
      }

      setNewTask({
        title: "",
        price: "",
        transactionType: "entrada",
        completed: false,
      });
      setIsAdding(false);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      alert("Erro ao adicionar tarefa.");
    }
  };

  const handleEdit = (expense) => {
    setNewTask({
      title: expense.name,
      price: Math.abs(expense.value),
      transactionType: expense.transactionType,
      completed: expense.done,
    });
    setIsEditing(expense.id); // Marca qual tarefa está sendo editada
    setIsAdding(true); // Abre o formulário de adição para editar
  };

  const filteredExpenses = expenses.filter((expense) => {
    if (!filter) return true;
    return expense.transactionType === filter;
  });

  const handleFilterClick = (type) => {
    setFilter((prevFilter) => (prevFilter === type ? null : type));
  };

  const totalEntries = filteredExpenses
    .filter((expense) => expense.transactionType === "entrada")
    .reduce(
      (total, expense) => total + parseFloat(expense.value.replace(",", ".")),
      0
    );

  const totalExits = filteredExpenses
    .filter((expense) => expense.transactionType === "saida")
    .reduce(
      (total, expense) => total + parseFloat(expense.value.replace(",", ".")),
      0
    );

  const balance = totalEntries + totalExits;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <img src="/img/logo.png" alt="Logo" />
          </div>
          <div className={styles.headerButtons}>
            <button
              className={styles.headerButton}
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
            <button
              className={styles.headerButton}
              onClick={() => (window.location.href = "/register")}
            >
              Cadastro
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Minha Finança</h1>
          <button
            className={styles.addBtn}
            onClick={() => setIsAdding((prev) => !prev)}
          >
            {isEditing ? "Editar Tarefa" : "Add Nova Tarefa"}
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
            <button type="submit">
              {isEditing ? "Salvar Edição" : "Adicionar"}
            </button>
          </form>
        )}

        <div className={styles.balance}>
          <div
            className={`${styles.balanceItem} ${styles.entrada} ${
              filter === "entrada" ? styles.activeFilter : ""
            }`}
            onClick={() => handleFilterClick("entrada")}
          >
            <p>Entradas: R${totalEntries.toFixed(2)}</p>
          </div>

          <div
            className={`${styles.balanceItem} ${styles.saida} ${
              filter === "saida" ? styles.activeFilter : ""
            }`}
            onClick={() => handleFilterClick("saida")}
          >
            <p>Saídas: R${totalExits.toFixed(2)}</p>
          </div>

          <div className={`${styles.balanceItem} ${styles.saldo}`}>
            <p>Saldo: R${balance.toFixed(2)}</p>
          </div>
        </div>

        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        <div className={styles.expenses}>
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className={styles.expenseItem}>
              <p>{expense.value}</p>
              <p>
                {expense.name}{" "}
                {expense.done && (
                  <span className={styles.completed}>--- Concluída</span>
                )}
              </p>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(expense)}>Editar</button>
                <button onClick={() => handleDone(expense.id)}>
                  {expense.done ? "Desmarcar" : "Concluído"}
                </button>
                <button onClick={() => handleDelete(expense.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 Minha Finança. Todos os direitos reservados.</p>
        <div className={styles.socialLinks}>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </footer>
    </>
  );
};

export default Home;