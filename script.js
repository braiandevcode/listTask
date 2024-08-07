// VARIABLE CONTANTE PARA ABREVIAR LA PALABRA REPETIDA DE DOCUMENT.
const d = document;
// REFERENCIANDO A ELEMENTO POR SU CLASE
const $listTasks = d.querySelector(".task-list");
const $totalTask = d.getElementById("totalTasks");
const $completedTask = d.getElementById("completedTasks");



const fragment = d.createDocumentFragment();

// ARREGLO DE OBJETOS CON LA INFORMACION DE CADA TAREA
const tasks = [
    { title: 'Hacer la compra', category: 'personal', date: '2024-08-06', completed: false },
    { title: 'Terminar el proyecto', category:'work', date: '2024-08-10', completed: false },
    { title: 'Llamar al médico', category: 'urgent', date: '2024-08-05', completed: true },
    { title: 'Limpiar la casa', category: 'personal', date: '2024-08-07', completed: false },
    { title: 'Reunión con el equipo', category: 'work', date: '2024-08-08', completed: true }
];

// FUNCION PARA CALCULAR EL TOTAL DE TAREAS COMPLETADAS
const calculateCompletedTask = (acc, task) => {
    //el acc sera un objeto acumulador donde tendra promiedades acumuladoras
    acc.total ++; // Incrementa el total de tareas
    if (task.completed) acc.completed ++; // Incrementa las tareas completadas
    return acc;
};

// Función para calcular estadísticas
const calculateStatistics = (tasks) => tasks.reduce(calculateCompletedTask,{ total: 0, completed: 0 }); // Valor inicial del acumulador

// Función para actualizar las estadísticas en el DOM
const updateStatistics = (tasks) => {
    const stats = calculateStatistics(tasks);
    $totalTask.textContent = stats.total; // Actualiza el total de tareas en el DOM
    $completedTask.textContent = stats.completed; // Actualiza las tareas completadas en el DOM
};

// FUNCION QUE EVALUA EL IDIOMA DE LA CATEGORIA PARA PASARLA A ESPAÑOL.
const evaluateLangCategory = (lang)=>{
    switch(lang){
        case "work":{
            return "Trabajo";
        };
        case "personal":{
            return "Personal";
        }
        case "urgent":{
            return "Urgente";
        }
    }
};

// FUNCION QUE SE ENCARGA DE EVALUAR QUE METODO ESTAMOS USANDO DEL CLASSLIST
const evaluateMethodClassList = (el, method, nameClass)=>{
    switch(method){
        case "add":
            el.classList.add(nameClass);
            break;
        case "remove":
            el.classList.remove(nameClass);
            break;
        case "toggle":
            el.classList.toggle(nameClass);
        break;
        default:
            console.error("ese metodo no existe");
            break;
    }
}
// FUNCION QUE SE PUEDE UTILIZAR PARA AÑADIR,QUITAR O EVALUAR SI EXISTE  UNA CLASE
const updateAddOrRemoveOrToggleClass = (el, method, ...className)=>{
    if(el){
        if(method && className.length > 1){
            className.forEach(nameClass => {
                evaluateMethodClassList(el, method, nameClass);
            });
            return true;
        }
        if(method && className.length === 1){
            evaluateMethodClassList(el, method, className);
            return true;
        }
    }
    return false; 
};

// FUNCION PARA CREAR LAS INTERFACES DE TAREAS USANDO EL DOM
const createListTasksDom = (task, fragment)=>{
    //DESESTRUCTURAMOS OBJETO
    const { title, category, date, completed } = task;

    const listItem = d.createElement("LI");
    const containerTask = d.createElement("DIV");
    const subTitleTask = d.createElement("H2");
    const paragraphDate = d.createElement("P");
    const paragraphCategory = d.createElement("P");
    const inputTask = d.createElement("INPUT");
    inputTask.setAttribute("type", "checkbox");
    inputTask.checked = completed;
    inputTask.setAttribute("data-check", `${completed}`);
    inputTask.setAttribute("placeholder", "check");

    updateAddOrRemoveOrToggleClass(listItem, "add", "task-item");
    updateAddOrRemoveOrToggleClass(containerTask, "add", "task-info");
    updateAddOrRemoveOrToggleClass(inputTask, "add", "task-completed");


    subTitleTask.textContent= title;
    paragraphDate.textContent= date;
    paragraphCategory.textContent= evaluateLangCategory(category);
    containerTask.append(subTitleTask);
    containerTask.append(paragraphDate);
    containerTask.append(paragraphCategory);

    listItem.append(containerTask);
    listItem.append(inputTask);

    fragment.append(listItem);

    return fragment;
};

// FUNCION PARA RENDERIZAR LAS TODAS LAS LISTAS DE TAREAS
const renderListTasks = ()=>{
    $listTasks.innerHTML="";
    tasks.forEach(task => createListTasksDom(task, fragment));
    $listTasks.append(fragment);
    updateStatistics(tasks); // Actualiza estadísticas después de renderizar tareas
};

// FUNCION QUE SE ENCARGARA DE FILTRAR LAS OPCIONES REUTILIZANDO FUNCION QUE CREA EL DOM
const filterOptionsTasks = (value)=>{
    if(tasks.length > 0) {
        const filterTasks = tasks.filter(({ category }) => category === value);
        if(filterTasks.length > 0) return filterTasks;
        return false;
    }
};

// FUNCION PARA EVALUAR LA OPCION ELEGUIDA
const evaluateOptionChange = (value)=>{
    switch(value){
        case "work":{
            createListTasksOption(value);
            break;
        };
        case "personal":{
            createListTasksOption(value);
            break;
        }
        case "urgent":{
            createListTasksOption(value);
            break;
        }
        default:{
            renderListTasks(value);
            break;
        }
    }
};

// FUNCION PARA EVALUAR LOS EVENTOS DE CAMBIOS
const evaluateElementChanges =(e)=>{
    switch (true) {
        case e.target.matches("#categoryOption"):{
            evaluateOptionChange(e.target.value);
            break;
        };
        case e.target.matches(".task-item input"):{
            // Actualizar el estado del task
            const taskTitle = e.target.parentElement.querySelector("h2").textContent;
            const task = tasks.find(t => t.title === taskTitle);
            if (task){
                task.completed = e.target.checked;
            } 
            updateStatistics(tasks);
            break;
        };
    }
};

//FUNCION PARA RECORRER Y CREAR LAS LISTAS DE TAREAS SEGUN OPCIÓN ELEGIDA
const createListTasksOption = (e)=>{
    $listTasks.innerHTML="";
    const tasks = filterOptionsTasks(e);
    tasks?.forEach(task => createListTasksDom(task, fragment)); 
    $listTasks.append(fragment); 
    updateStatistics(tasks); // Actualiza estadísticas después de filtrar tareas
};

// FUNCION EVENTOS CHANGE
const eventChanges = ()=> d.addEventListener("change", evaluateElementChanges);

// FUNCION QUE SE ENCARGARIA DE EJECUTAR TODO LO QUE TIENE QUE VERSE EN LA PAGINA
const initPage = ()=>{
    // RENDERIZAR PAFINA TAREAS
    renderListTasks();
    // EVALUAR EVENTO CHANGE
    eventChanges();
};

// EVENTO DE CARGA QUE EJECUTA EL INICIO DE LA PAGINA SOLO AL ESCUCHAR EL EVENTO DE CARGA.
d.addEventListener("DOMContentLoaded", initPage);

