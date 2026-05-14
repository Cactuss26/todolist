import "./styles.css"
import { format, compareAsc, constructNow, differenceInDays } from "date-fns"

class TodoItem {
    constructor(title, description, dueDate, prior) {
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
        if (val != "low" && val != "medium" && val != "high") {
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
        this.name = name;
    }

    todos = [];

    addTodo(todo) {
        this.todos.push(todo);
    }

}


const DOMfunc = (() => {
    const today = new Date();

    const findRemainingDays = (todo) => {
        return differenceInDays(todo.dueDate, today);
    }

    const criticalTime = (todo) => {
        return findRemainingDays(todo) <= 2;
    }

    const displayProjectTodos = (project) => {
        const contentBox = document.querySelector(".content");

        const todos = project.todos;
        const projectName = document.createElement("h3");
        projectName.textContent = project.name;

        const todolist = document.createElement("ul");
        for (let i = 0; i < todos.length; i++) {
            const item = document.createElement("li");
            const todoTitle = document.createElement("h5");
            const desc = document.createElement("p");
            const todoDate = document.createElement("p");
            desc.classList.add("Description");
            todoDate.classList.add("dueDate");
            todoTitle.classList.add("todoTitle")
            todoDate.textContent = `${format(todos[i].dueDate, "do MMM yyyy")} -
             ${findRemainingDays(todos[i])} days remaining`;

            if (criticalTime(todos[i])) {
                todoDate.style.color = "red";
            }
            else {
                todoDate.style.color = "rgba(0, 247, 0, 0.788)";
            }

            todoTitle.textContent = todos[i].title;
            desc.textContent = todos[i].description;
            item.append(todoTitle, desc, todoDate);
            todolist.appendChild(item);
        }
        
        contentBox.appendChild(projectName);
        contentBox.appendChild(todolist);
    }

    return { displayProjectTodos }
})();

const control = (() => {
    const init = () => {
        const defaultProject = new Project("Untitled Project");
        const date1 = new Date(2026, 4, 20);
        const date2 = new Date(2026, 4, 17);
        const todo1 = new TodoItem("Todo-1", "A default todo for testing", date1, "low");
        const todo2 = new TodoItem("Todo-2", "Another one of those", date2, "high");
        defaultProject.addTodo(todo1);
        defaultProject.addTodo(todo2);
    
        DOMfunc.displayProjectTodos(defaultProject);
    }

    return { init }
})();

document.addEventListener("DOMContentLoaded", () => {
    control.init();
})