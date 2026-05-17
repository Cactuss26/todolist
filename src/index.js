import "./styles.css"
import { format, compareAsc, constructNow, differenceInDays } from "date-fns"

let projects = [];

class TodoItem {
    constructor(title, description, dueDate, prior) {
        this.id = control.createUniqueID();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = prior;
    }

    _priority = "low";
    _check = false

    get priority() {
        return this._priority;
    }

    set priority(val) {
        if (val != "Low" && val != "Medium" && val != "High") {
            console.error("Invalid priority");
        }
        
        else {
            this._priority = val;
        }
    }

    get check() {
        return this._check;
    }

    set check(val) {
        if (check == true || check == false) {
            _check = val;
        }

        else {
            console.error("invalid value of check");
        }
    }

    changePriority(val) {
        this.priority = val;
    }
}


class Project {
    constructor(name) {
        this.id = control.createUniqueID();
        this.name = name;
    }

    todos = [];

    addTodo(todo) {
        this.todos.push(todo);
    }

}


const DOMfunc = (() => {
    const projPopupVisible = () => {
        document.querySelector(".blursheet").classList.remove("hide");
        document.querySelector(".projPopup").classList.remove("hide");
    };

    const projPopupHide = () => {
        document.querySelector(".blursheet").classList.add("hide");
        document.querySelector(".projPopup").classList.add("hide");
    }

    const todoPopupVisible = () => {
        document.querySelector(".blursheet").classList.remove("hide");
        document.querySelector(".todoPopup").classList.remove("hide");
    }

    const todoPopupHide = () => {
        document.querySelector(".blursheet").classList.add("hide");
        document.querySelector(".todoPopup").classList.add("hide");
    }

    const extractProjectName = () => {
        return document.querySelector("#projname").value;
    }

    const extractTodoInfo = () => {
        const todoName = document.querySelector("#todoname").value;
        const todoDesc = document.querySelector("#tododescription").value;
        const todoDate = document.querySelector("#tododate").value;
        const todoPriority = document.querySelector("#todopriority").value;

        return { todoName, todoDesc, todoDate, todoPriority };
    }

    const displayProjectTodos = (project) => {
        const contentBox = document.querySelector(".content");
        const todos = project.todos;
        const projName = document.querySelector(".projName");
        projName.textContent = project.name;

        const todolist = document.createElement("ul");
        for (let i = 0; i < todos.length; i++) {
            const item = document.createElement("li");
            const todoTitle = document.createElement("h5");
            const desc = document.createElement("p");
            const todoDate = document.createElement("p");
            const todoPriority = document.createElement("p");
            desc.classList.add("Description");
            todoDate.classList.add("dueDate");
            todoTitle.classList.add("todoTitle")
            todoPriority.classList.add("todopriority");
            todoDate.textContent = `${format(todos[i].dueDate, "do MMM yyyy")} -
             ${control.findRemainingDays(todos[i])} days remaining`;

            if (control.criticalTime(todos[i])) {
                todoDate.style.color = "red";
            }
            else {
                todoDate.style.color = "rgba(0, 247, 0, 0.788)";
            }

            todoTitle.textContent = todos[i].title;
            desc.textContent = todos[i].description;
            todoPriority.textContent = `Priority: ${todos[i].priority}`;
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("tododiv");
            todoDiv.append(todoTitle, desc, todoDate, todoPriority);
            const delButton = document.createElement("button");
            delButton.type = "button";
            delButton.classList.add("delbutton");
            delButton.id = todos[i].id;
            delButton.textContent = "Delete";
            delButton.addEventListener("click", control.deleteTodo);
            item.append(todoDiv, delButton);
            todolist.appendChild(item);
        }

        contentBox.replaceChildren(todolist);
    }

    const displayProjects = () => {
        const projList = document.createElement("ul");
        projList.classList.add("projListButtons");
        for (let proj = 0; proj < projects.length; proj++) {
            const item = document.createElement("li");
            const projButton = document.createElement("button");
            projButton.type = "button";
            projButton.classList.add("blackProjButton");
            projButton.textContent = projects[proj].name;
            projButton.id = `${projects[proj].id}`;
            projButton.addEventListener("click", control.setCurrentProject)
            item.appendChild(projButton);
            projList.appendChild(item);
        }
        
        document.querySelector(".sidebar").replaceChildren(projList);
    }

    const selectProjButton = (project) => {
        document.querySelector(`#${project.id}`).classList.add("whiteProjButton");
    }

    const deselectProjButton = (project) => {
        document.querySelector(`#${project.id}`).classList.remove("whiteProjButton");
    }

    return { displayProjectTodos, projPopupVisible, projPopupHide, extractProjectName,
    todoPopupVisible, todoPopupHide, extractTodoInfo, displayProjects, selectProjButton, deselectProjButton };
})();


const control = (() => {
    const today = new Date();
    let currentProject;

    const findRemainingDays = (todo) => {
        return differenceInDays(todo.dueDate, today);
    };

    const criticalTime = (todo) => {
        return findRemainingDays(todo) <= 2;
    };
    
    const addProj = (e) => {
        e.preventDefault();
        const name = DOMfunc.extractProjectName();
        DOMfunc.projPopupHide();
        const project = new Project(name);
        projects.push(project);
        DOMfunc.displayProjectTodos(project);
        DOMfunc.displayProjects();
        DOMfunc.deselectProjButton(currentProject);
        currentProject = project;
        DOMfunc.selectProjButton(currentProject);
        storeData();
    }

    const addProjAction = (e) => {
        DOMfunc.projPopupVisible();
    }

    const addProjectTodo = (e) => {
        e.preventDefault();
        const todoInfo = DOMfunc.extractTodoInfo();
        if (todoInfo.todoName == "" || todoInfo.todoDate == "" || todoInfo.todoPriority == "") {
            alert("Please fill the required fields");
            return;
        }

        const dateObj = new Date(todoInfo.todoDate)
        const todo = new TodoItem(todoInfo.todoName, todoInfo.todoDesc, dateObj, todoInfo.todoPriority);
        currentProject.addTodo(todo);
        DOMfunc.displayProjectTodos(currentProject);
        DOMfunc.todoPopupHide();
        storeData();
    }

    const setCurrentProject = (e) => {
        const projName = e.target.textContent;
        let selectedProject;
        for (let proj of projects) {
            if (projName == proj.name) {
                selectedProject = proj
            }
        }
        DOMfunc.deselectProjButton(currentProject);
        currentProject = selectedProject;
        DOMfunc.selectProjButton(currentProject);
        DOMfunc.displayProjectTodos(selectedProject);
    }

    const addProjectTodoAction = (e) => {
        DOMfunc.todoPopupVisible();
    }

    const deleteTodo = (e) => {
        const listItem = e.target.parentNode;
        const list = listItem.parentNode;

        list.removeChild(listItem);
        const todoList = currentProject.todos;
        for (let i = 0; i < todoList.length; i++) {
            if (todoList[i].id == e.target.id) {
                todoList.splice(i, 1);
                break;
            }
        }
        
        DOMfunc.displayProjectTodos(currentProject);
        storeData();
    }

    const createUniqueID = () => {
        const chars = "abcdefghijklmnopqrstuvwxyz"
        let s = "";
        for (let i = 0; i < 30; i++) {
            s += chars[Math.floor(Math.random() * 10)]
        }

        return s;
    }

    const retrieveData = () => {
        const storedProjects = localStorage.getItem("projects");
        
        if (storedProjects !== null) {
            projects = JSON.parse(storedProjects);
            for (let i = 0; i < projects.length; i++) {
                projects[i].addTodo = (todo) => {
                    projects[i].todos.push(todo);
                };
            }
            return true;
        }

        return false;
    }

    const storeData = () => {
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    const init = () => {
        document.querySelector(".newproject").addEventListener("click", addProjAction);
        document.querySelector(".addTodoButton").addEventListener("click", addProjectTodoAction);
        document.querySelector(".todoSubmitButton").addEventListener("click", addProjectTodo);
        document.querySelector(".projSubmitButton").addEventListener("click", addProj);
        
        
        if (!retrieveData()) {
            const defaultProject = new Project("Untitled Project");
            projects.push(defaultProject);
            currentProject = defaultProject;
        }
        else {
            currentProject = projects[0];
        }

        DOMfunc.displayProjects();
        DOMfunc.selectProjButton(currentProject);
        DOMfunc.displayProjectTodos(currentProject);
        storeData();
    }

    return { init, findRemainingDays, criticalTime, setCurrentProject, createUniqueID, deleteTodo }
})();

document.addEventListener("DOMContentLoaded", () => {
    control.init();
})