import { openDB } from "idb";

let db;

async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                    const store = db.createObjectStore('pessoas', { 
                            //A propriedade nome será o campo chave
                            keyPath: 'name'

                    });
                    // Criando um índice id na store, deve estar contido no objeto do banco.
                    store.createIndex('id', 'id');
                    showResult("Banco de dados criado!");

                }
            }
        });
        showResult("Banco de dados aberto.");

    } catch (e) {
        showResult("Erro ao criar o banco de dados: " + e.message)

    }
}

window.addEventListener("DOMContentLoaded", async event => {
    createDB();
    document.getElementById("input");
    document.getElementById("btnSalvar").addEventListener("click", cadastrar); 
    document.getElementById("btnListar").addEventListener("onchange", listar);
    document.getElementById("btnLimpar").addEventListener("click", limpar)
    document.getElementById("btnBuscar").addEventListener("click", buscar);
    document.getElementById("btnAlterar").addEventListener("click", alterar);
    document.getElementById("btnDeletar").addEventListener("click", deletar);
});

async function cadastrar() {
    let nome = document.getElementById("nome").value
    let idade = document.getElementById("idade").value

    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    store.add({ 
        name: nome,
        year: idade 
    });
    await tx.done
    showResult('Sucesso ao Cadastrar!')
    document.getElementById("nome").value = ''
    document.getElementById("idade").value = ''
}

async function listar() {
    if (db == undefined) { 
    showResult("O banco de dados está fechado"); 
    return;

    }

    const tx = await db.transaction('pessoas', 'readonly')
    const store = tx.objectStore('pessoas');
    const value = await store.getAll();
    if (value) { 
        showResult("busca com sucesso!")
        imprimirListagem(value);

    } else {
    showResult("Não há nenhum dado no banco!")

    }
}

async function deletar() {
    let nome = document.getElementById("nome").value
    let idade = document.getElementById("idade").value

    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    store.deletar({ 
        name: nome,
        year: idade 
    });
    await tx.done
}

function buscar {
     let id_alterar = document.getElementById('idAlterar_nome')

}

async function alterar() {
    let nome = document.getElementById("alterar _nome").value
    let idade = document.getElementById("alterar_idade").value

    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    store.update({ 
        name: nome,
        year: idade 
    });
    await tx.done
}

function limpar() {
    document.getElementById("listar") = ''
}

function showResult(text){
    document.querySelector('output').innerHTML = text;
}

function imprimirListagem(pessoas) {
    let div_listar = document.getElementById("listar")
    
    pessoas.map(item => {
        div_listar.appendChild(`Nome: ${item.nome}, Idade: ${item.idade}`)
    })
}
