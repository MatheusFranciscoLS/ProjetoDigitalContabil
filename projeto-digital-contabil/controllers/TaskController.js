import Task from "@/models/Task"; // Importa o modelo "Task" do banco de dados.
import connectMongo from "@/utils/dbConnect"; // Importa a função de conexão com o MongoDB.

export async function getTasks() {
  await connectMongo(); // Garante que a conexão com o MongoDB seja estabelecida.
  try {
    // Busca todas as tarefas no banco de dados e retorna
    return await Task.find();
  } catch (error) {
    // Exibe qualquer erro que ocorra durante a busca
    console.error("Erro ao buscar tarefas:", error);
    throw new Error("Erro ao buscar tarefas"); // Lança um erro para que o erro seja tratado no nível da API
  }
}

export async function createTask(data) {
  await connectMongo(); // Garante que a conexão com o MongoDB seja estabelecida.
  try {
    return await Task.create(data); // Cria uma nova tarefa com os dados fornecidos.
  } catch (error) {
    console.error("Erro ao criar tarefa:", error); // Exibe qualquer erro que ocorra durante a criação.
    throw new Error("Erro ao criar tarefa"); // Lança um erro para que o erro seja tratado no nível da API
  }
}

export async function updateTask(id, data) {
  await connectMongo(); // Garante que a conexão com o MongoDB seja estabelecida.
  try {
    return await Task.findByIdAndUpdate(id, data, {
      new: true, // Retorna o documento atualizado.
      runValidators: true, // Executa as validações definidas no esquema do Mongoose.
    });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error); // Exibe qualquer erro que ocorra durante a atualização.
    throw new Error("Erro ao atualizar tarefa"); // Lança um erro para que o erro seja tratado no nível da API
  }
}

export async function deleteTask(id) {
  await connectMongo(); // Garante que a conexão com o MongoDB seja estabelecida.
  try {
    return await Task.deleteOne({ _id: id }); // Deleta a tarefa com o ID fornecido.
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error); // Exibe qualquer erro que ocorra durante a exclusão.
    throw new Error("Erro ao deletar tarefa"); // Lança um erro para que o erro seja tratado no nível da API
  }
}
