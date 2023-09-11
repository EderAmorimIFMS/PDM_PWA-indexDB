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
    document.getElementById("btnSalvar").addEventListener("click", addData); 
    document.getElementById("btnListar").addEventListener("click", getData);
    document.getElementById("btnLimpar").addEventListener("click", limpar)
});

async function addData() {
    let nome = document.getElementById("nome").value
    let idade = document.getElementById("idade").value

    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    store.add({ 
        name: nome,
        year: idade 
    });
    await tx.done
}

async function getData() {
    if (db == undefined) { 
    showResult("O banco de dados está fechado"); 
    return;

    }

    const tx = await db.transaction('pessoas', 'readonly')
    const store = tx.objectStore('pessoas');
    const value = await store.getAll();
    if (value) { 
        imprimirListagem(value);

    } else {
    showResult("Não há nenhum dado no banco!")

    }
}

function limpar() {
    document.getElementById("nome").value = ''
    document.getElementById("idade").value = ''
}

function showResult(text){
    document.querySelector('output').innerHTML = text;
}

function imprimirListagem(pessoas) {
    let div_listar = document.getElementById("listar")

    pessoas.map(item => {
        div_listar.append(`
              Nome: ${item.name}, idade: ${item.year}.
        `)
    })
}
