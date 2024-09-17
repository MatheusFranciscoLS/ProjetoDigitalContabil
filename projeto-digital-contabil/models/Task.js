import mongoose from "mongoose";

// Definindo o esquema para Tarefa
const TaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refere-se ao modelo 'User'
        required: true
    },
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// Verifica se o modelo já existe para evitar redefinir o modelo
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

export default Task;
