// VARIABLE CONTANTE PARA ABREVIAR LA PALABRA REPETIDA DE DOCUMENT.
const d = document;
// REFERENCIANDO A ELEMENTO POR SU CLASE
const $listTasks = d.querySelector(".task-list");
const $viewTask = d.querySelector(".statistics__titleViewTask");
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

// FUNCION PARA CALCULAR EL TOTAL DE TAREAS COMPLETADAS SEGUN UNA LISTA
const calculateCompletedTask = (tasks) => {
    return tasks.reduce((acc, task) => {
        acc.total++; // Incrementa el total de tareas
        if (task.completed) acc.completed++;
        return acc;
    }, { total: 0, completed: 0 });
};

// FUNCION PARA ACTUALIZAR LAS ESTADISTICAS EN EL DOM SEGUN UNA LISTA DE TAREAS
const updateStatistics = (tasks) => {
    const stats = calculateCompletedTask(tasks);
    console.log(stats);
    
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
        };
        default:{
            return "Todas";
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
        if(method && className.length > 0){
            className.forEach(nameClass => evaluateMethodClassList(el, method, nameClass));
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
    inputTask.setAttribute("placeholder", "check");

    updateAddOrRemoveOrToggleClass(listItem, "add", "task-item", "d-flex", "justify-content-between", "align-items-center");
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
    $viewTask.textContent="Todas las tareas" || null;
    tasks.forEach(task => createListTasksDom(task, fragment));
    $listTasks.append(fragment);
    updateStatistics(tasks); 
};

// FUNCION QUE SE ENCARGARA DE FILTRAR LAS OPCIONES REUTILIZANDO FUNCION QUE CREA EL DOM
const filterOptionsTasks = (value)=>{
    if(tasks.length > 0) {
        const filterTasks = tasks.filter(({ category }) => category === value);
        return filterTasks; // Devolver siempre un array
    }
    return []; // Si no hay tareas, devolver un array vacío
};

// FUNCION PARA CREAR LAS LISTAS DE TAREAS SEGUN OPCIÓN ELEGIDA
const createListTasksOption = (value) => {
    $listTasks.innerHTML = "";
    const filteredTasks = filterOptionsTasks(value);
    filteredTasks.forEach(task => createListTasksDom(task, fragment));
    $listTasks.append(fragment);
    updateStatistics(filteredTasks); // Actualizar estadísticas según las tareas filtradas
};

// FUNCION PARA EVALUAR LOS EVENTOS DE CAMBIOS
const evaluateElementChanges = (e) => {
    if (e.target.matches("#categoryOption")) {
        evaluateOptionChange(e);
    } else if (e.target.matches(".task-item input")) {
        // Actualizar el estado del task
        const taskTitle = e.target.parentElement.querySelector("h2").textContent;
        const task = tasks.find(t => t.title === taskTitle);
        if (task) task.completed = e.target.checked;

        const currentOption = d.querySelector("#categoryOption").value;
        const currentTasks = currentOption === "all" ? tasks : filterOptionsTasks(currentOption);
        updateStatistics(currentTasks);
    }
};

// FUNCION PARA EVALUAR LA OPCION ELEGIDA
const evaluateOptionChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === "all") {
        renderListTasks(); // Mostrar todas las tareas
    } else {
        createListTasksOption(selectedCategory);
    };
    $viewTask.textContent = selectedCategory !== "all" ? `Tarea/s ${evaluateLangCategory(selectedCategory)}` : "Todas las tareas";
};

// FUNCION EVENTOS CHANGE
const eventChanges = () => d.addEventListener("change", evaluateElementChanges);

// FUNCION QUE SE ENCARGARIA DE EJECUTAR TODO LO QUE TIENE QUE VERSE EN LA PAGINA
const initPage = () => {
    // RENDERIZAR PAFINA TAREAS
    renderListTasks();
    // EVALUAR EVENTO CHANGE
    eventChanges();
};

// EVENTO DE CARGA QUE EJECUTA EL INICIO DE LA PAGINA SOLO AL ESCUCHAR EL EVENTO DE CARGA.
d.addEventListener("DOMContentLoaded", initPage);