
import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ========================================
// 1. ELEMENTOS DO HTML
// ========================================

const formTarefa = document.getElementById("formTarefa");
const campoTarefa = document.getElementById("tarefa");
const listaTarefas = document.getElementById("listaTarefas");
const mensagem = document.getElementById("mensagem");
const tituloTarefa = document.getElementById("TituloTarefa");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

// ========================================
// 2. FIRESTORE
// ========================================

const tarefasRef = collection(db, "tarefas");

let idEmEdicao = null;
let carregando = false;

// ========================================
// 3. CREATE E UPDATE
// ========================================

formTarefa.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (carregando) return;

    const texto = campoTarefa.value.trim();

    if (!texto) {
        mensagem.textContent = "Digite uma tarefa.";
        return;
    }

    carregando = true;
    btnSalvar.disabled = true;
    mensagem.textContent = "";

    try {
        if (idEmEdicao) {
            await updateDoc(doc(db, "tarefas", idEmEdicao), {
                titulo: texto,
                atualizadaEm: serverTimestamp()
            });

            mensagem.textContent = "Tarefa atualizada com sucesso!";
        } else {
            await addDoc(tarefasRef, {
                titulo: texto,
                concluida: false,
                criadaEm: serverTimestamp()
            });

            mensagem.textContent = "Tarefa adicionada com sucesso!";
        }

        cancelarEdicao();
    } catch (erro) {
        console.error("Erro ao salvar tarefa:", erro);
        mensagem.textContent =
            "Erro ao salvar. Verifique as regras do Firebase.";
    } finally {
        carregando = false;
        btnSalvar.disabled = false;
    }
});

// ========================================
// 4. READ: LISTAR TAREFAS
// ========================================

onSnapshot(tarefasRef, (snapshot) => {
    listaTarefas.replaceChildren();

    if (snapshot.empty) {
        listaTarefas.textContent = "Nenhuma tarefa cadastrada.";
        return;
    }

    snapshot.forEach((documento) => {
        const tarefa = documento.data();
        const id = documento.id;

        const item = document.createElement("div");
        const texto = document.createElement("span");
        const btnEditar = document.createElement("button");
        const btnExcluir = document.createElement("button");
        const btnConcluir = document.createElement("button");

        texto.textContent = tarefa.titulo;

        if (tarefa.concluida) {
            texto.style.textDecoration = "line-through";
            texto.textContent += " (Concluída)";
        }

        // EDITAR
        btnEditar.type = "button";
        btnEditar.textContent = "Editar";

        btnEditar.addEventListener("click", () => {
            idEmEdicao = id;
            campoTarefa.value = tarefa.titulo;

            tituloTarefa.textContent = "Editar Tarefa";
            btnSalvar.textContent = "Salvar alterações";
            btnCancelar.hidden = false;

            mensagem.textContent = "";
            campoTarefa.focus();
        });

        // EXCLUIR
        btnExcluir.type = "button";
        btnExcluir.textContent = "Excluir";

        btnExcluir.addEventListener("click", async () => {
            if (carregando) return;

            if (!confirm(`Deseja excluir "${tarefa.titulo}"?`)) {
                return;
            }

            try {
                await deleteDoc(doc(db, "tarefas", id));

                if (idEmEdicao === id) {
                    cancelarEdicao();
                }

                mensagem.textContent = "Tarefa excluída com sucesso!";
            } catch (erro) {
                console.error("Erro ao excluir:", erro);
                mensagem.textContent = "Erro ao excluir a tarefa.";
            }
        });

        // CONCLUIR OU REABRIR
        btnConcluir.type = "button";
        btnConcluir.textContent = tarefa.concluida
            ? "Reabrir"
            : "Concluir";

        btnConcluir.addEventListener("click", async () => {
            if (carregando) return;

            try {
                await updateDoc(doc(db, "tarefas", id), {
                    concluida: !tarefa.concluida,
                    atualizadaEm: serverTimestamp()
                });

                mensagem.textContent = tarefa.concluida
                    ? "Tarefa reaberta!"
                    : "Tarefa concluída!";
            } catch (erro) {
                console.error("Erro ao atualizar:", erro);
                mensagem.textContent = "Erro ao atualizar a tarefa.";
            }
        });

        item.append(texto, btnEditar, btnExcluir, btnConcluir);
        item.style.marginBottom = "12px";

        listaTarefas.appendChild(item);
    });
}, (erro) => {
    console.error("Erro ao listar tarefas:", erro);
    mensagem.textContent =
        "Erro ao carregar tarefas. Confira as regras do Firestore.";
});

// ========================================
// 5. CANCELAR EDIÇÃO
// ========================================

function cancelarEdicao() {
    idEmEdicao = null;
    formTarefa.reset();

    tituloTarefa.textContent = "Adicionar Tarefa";
    btnSalvar.textContent = "Adicionar Tarefa";
    btnCancelar.hidden = true;
}

btnCancelar.addEventListener("click", cancelarEdicao);
