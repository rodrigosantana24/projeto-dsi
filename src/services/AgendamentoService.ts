import { ref , push, set, get, remove } from "firebase/database";
import { database } from "../configs/firebaseConfig";
import ICrud from "./ICrud";
import Agendamento from "../models/Agendamento";
// Importar a entidade Filme ou FilmeCriado para buscar os detalhes
// Dependendo de qual tipo de filme você realmente usa no AgendamentoForm
import Filme from "../models/Filme"; // Ou 'FilmeCriado' se for o caso

// Interface para o objeto filme que será salvo no agendamento
export interface FilmeAgendamentoDTO {
    id: string;
    title: string;
    poster_path: string;
}

export interface AgendamentoDTO {
    userId: string;
    // Alteração: filme agora é um objeto
    filme: FilmeAgendamentoDTO; 
    data: string;
    hora: string;
}

export interface AgendamentoUpdateDTO extends AgendamentoDTO {
    id: string;
}

export interface AgendamentoDeleteDTO {
    userId: string;
    id: string;
}

export interface AgendamentoReadParams {
    userId: string;
}

export default class AgendamentoService
    implements ICrud<AgendamentoDTO, AgendamentoReadParams, AgendamentoUpdateDTO, AgendamentoDeleteDTO>
{
    async create(data: AgendamentoDTO): Promise<Agendamento> {
        const { userId, data: dia, hora, filme } = data; // Alteração: Pegar 'filme' diretamente
        
        // Não precisamos mais buscar o filme aqui, pois a DTO já o traz completo
        // Se a DTO viesse apenas com o filmeId, teríamos que fazer a busca aqui.
        // Mas como estamos passando o objeto filme completo na DTO, ele já está pronto.

        const agendamento = new Agendamento(null, userId, dia, hora, filme); // Passa o objeto filme

        if (!agendamento.isValid()) {
            throw new Error('Dados do agendamento inválidos. Verifique todos os campos.');
        }

        const userRef = ref(database, `agendamentos/${userId}`);
        const newRef = push(userRef);
        await set(newRef, agendamento.toFirebase());

        // Retorna o agendamento completo com o ID gerado
        agendamento.id = newRef.key!; // Atribui o ID gerado pelo Firebase
        return agendamento;
    }

    async read(params: AgendamentoReadParams): Promise<Agendamento[]> {
        const { userId } = params;
        // O método getByUser da entidade Agendamento já foi atualizado para lidar com o objeto filme
        return await Agendamento.getByUser(userId);
    }

    async update(params: AgendamentoUpdateDTO): Promise<Agendamento> {
        const { id, userId, data: dia, hora, filme } = params; // Alteração: Pegar 'filme' diretamente
        
        // Não precisamos mais buscar o filme aqui, a DTO já o traz
        const agendamento = new Agendamento(id, userId, dia, hora, filme); // Passa o objeto filme

        if (!agendamento.isValid()) {
            throw new Error('Dados inválidos para atualização. Verifique todos os campos.');
        }

        const agendamentoRef = ref(database, `agendamentos/${userId}/${id}`);
        await set(agendamentoRef, agendamento.toFirebase());

        return agendamento;
    }

    async delete(params: AgendamentoDeleteDTO): Promise<void> {
        const { userId, id } = params;

        if (!userId || !id) {
            throw new Error('userId e id são obrigatórios para excluir um agendamento');
        }

        const agendamentoRef = ref(database, `agendamentos/${userId}/${id}`);
        await remove(agendamentoRef);
    }
}