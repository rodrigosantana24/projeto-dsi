import { ref , push, set, get, remove } from "firebase/database";
import { database } from "../configs/firebaseConfig";
import ICrud from "./ICrud";
import Agendamento from "../models/Agendamento";

export interface FilmeAgendamentoDTO {
    id: string;
    title: string;
    poster_path: string;
}

export interface AgendamentoDTO {
    userId: string;
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
        const { userId, data: dia, hora, filme } = data; 
        
        const agendamento = new Agendamento(null, userId, dia, hora, filme);

        if (!agendamento.isValid()) {
            throw new Error('Dados do agendamento inválidos. Verifique todos os campos.');
        }

        const userRef = ref(database, `agendamentos/${userId}`);
        const newRef = push(userRef);
        await set(newRef, agendamento.toFirebase());

        return await Agendamento.fromFirebase(newRef.key!, userId, agendamento.toFirebase());
    }

    async read(params: AgendamentoReadParams): Promise<Agendamento[]> {
        const { userId } = params;
        return await Agendamento.getByUser(userId);
    }

    async update(params: AgendamentoUpdateDTO): Promise<Agendamento> {
        const { id, userId, data: dia, hora, filme } = params; 
        
        const agendamento = new Agendamento(id, userId, dia, hora, filme);

        if (!agendamento.isValid()) {
            throw new Error('Dados inválidos para atualização. Verifique todos os campos.');
        }

        const agendamentoRef = ref(database, `agendamentos/${userId}/${id}`);
        await set(agendamentoRef, agendamento.toFirebase());

        return await Agendamento.fromFirebase(id, userId, agendamento.toFirebase());
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