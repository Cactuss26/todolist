import "./styles.css"
import { format, compareAsc, constructNow } from "date-fns"

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
    const displayProjectTodos = (project) => {
        const contentBox = document.querySelector(".content");

        const todos = project.todos;
        const projectName = document.createElement("h3");
        projectName.textContent = project.name;

        const todolist = document.createElement("ul");
        for (let i = 0; i < todos.length; i++) {
            const item = document.createElement("li");
            item.textContent = todos[i].title;
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
        const date1 = new Date(2026, 5, 20);
        const todo1 = new TodoItem("Todo-1", "A default todo for testing", date1, "low");
        defaultProject.addTodo(todo1);
    
        DOMfunc.displayProjectTodos(defaultProject);
    }

    return { init }
})();

document.addEventListener("DOMContentLoaded", () => {
    control.init();
})