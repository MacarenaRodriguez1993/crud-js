"use strict";
const IDBRequest = indexedDB.open("usuarios",1);

IDBRequest.addEventListener("upgradeneeded",()=>{
    const db=IDBRequest.result;
    db.createObjectStore("nombres",{
        autoIncrement: true
    });
    
})
IDBRequest.addEventListener("success", ()=>{
    leerObjetos();
});
IDBRequest.addEventListener("error", ()=>{
    console.log("error");
});

document.getElementById('agregar').addEventListener("click", ()=>{
    let nombre = document.getElementById("nombre").value;
    if(nombre.length>0){
        if(document.querySelector(".posible") != undefined){
            if(confirm("HAY COSAS SIN GUARDAR")){
                agregarObjeto({nombre})
                leerObjetos();
            }
        }else{
            agregarObjeto({nombre})
            leerObjetos();
        }
        
    }
});

/*agregar objeto */
const agregarObjeto = objeto => {
    const db =IDBRequest.result;
    const IDBTransaction = db.transaction("nombres", "readwrite");
    const objectStore= IDBTransaction.objectStore("nombres");
    objectStore.add(objeto);
    IDBTransaction.addEventListener("complete",()=>{
        console.log("el objeto se agrego correctamente");
    })
}

/*leer objeto*/  
const leerObjetos =()=>{
    const db = IDBRequest.result;
    const IDBTransaction = db.transaction("nombres", "readonly");
    const objectStore= IDBTransaction.objectStore("nombres");
    const cursor = objectStore.openCursor();
    const fragment = document.createDocumentFragment();
    document.querySelector(".nombres").innerHTML="";
    cursor.addEventListener("success",()=>{
        if(cursor.result){
            let elemento = nombresHTML(cursor.result.key, cursor.result.value);
            fragment.appendChild(elemento)
            cursor.result.continue();
        }else document.querySelector(".nombres").appendChild(fragment)
    })
}
/*editar objeto */
const editarObjeto = (key,objeto) => {
    const db =IDBRequest.result;
    const IDBTransaction = db.transaction("nombres", "readwrite");
    const objectStore= IDBTransaction.objectStore("nombres");
    objectStore.put(objeto,key);
    IDBTransaction.addEventListener("complete",()=>{
        console.log("el objeto se edito correctamente");
    })
}
/*ELIMINAR objeto */
const eliminarObjeto = (key) => {
    const db =IDBRequest.result;
    const IDBTransaction = db.transaction("nombres", "readwrite");
    const objectStore= IDBTransaction.objectStore("nombres");
    objectStore.delete(key);
    IDBTransaction.addEventListener("complete",()=>{
        console.log("el objeto se elimino correctamente");
    })
}

const nombresHTML = (id,nombre) => {
    const container = document.createElement("div");
    const h2 = document.createElement("h2");
    const options = document.createElement("div");
    const saveButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    container.classList.add("nombre");
    options.classList.add("options");
    saveButton.classList.add("imposible");
    deleteButton.classList.add("eliminar");

    saveButton.textContent= "Guardar";
    deleteButton.textContent="Eliminar";
    h2.textContent = nombre.nombre;
    h2.setAttribute("contenteditable", "true");
    h2.setAttribute("spellcheck", "false");

    options.appendChild(saveButton);
    options.appendChild(deleteButton);

    container.appendChild(h2);
    container.appendChild(options);

    h2.addEventListener("keyup",()=>{
        saveButton.classList.replace("imposible","posible");
    })

    saveButton.addEventListener("click",()=>{
        if(saveButton.className == "posible"){
            editarObjeto(id,{nombre:h2.textContent});
            saveButton.classList.replace("posible", "imposible");
        
        }
    })

    deleteButton.addEventListener("click",()=>{
        eliminarObjeto(id);
        document.querySelector(".nombres").removeChild(container)
    });

    return container;

}