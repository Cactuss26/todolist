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
    const projPopupVisible = () => {
        document.querySelector(".blursheet").classList.remove("hide");
        document.querySelector(".projPopup").classList.remove("hide");
    };

    const projPopupHide = () => {
        document.querySelector(".blursheet").classList.add("hide");
        document.querySelector(".projPopup").classList.add("hide");
    }

    const extractProjectName = () => {
        return document.querySelector("#projname").value;
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
             ${control.findRemainingDays(todos[i])} days remaining`;

            if (control.criticalTime(todos[i])) {
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
        
        contentBox.replaceChildren(projectName, todolist);
    }

    return { displayProjectTodos, projPopupVisible, projPopupHide, extractProjectName }
})();

const control = (() => {
    const today = new Date();

    const findRemainingDays = (todo) => {
        return differenceInDays(todo.dueDate, today);
    };

    const criticalTime = (todo) => {
        return findRemainingDays(todo) <= 2;
    };

    const newProjAction = (e) => {
        DOMfunc.projPopupVisible();
        document.querySelector(".submitButton").addEventListener("click", (e) => {
            e.preventDefault();
            const name = DOMfunc.extractProjectName();
            DOMfunc.projPopupHide();
            const project = new Project(name);
            DOMfunc.displayProjectTodos(project);
        });
    }

    const init = () => {
        const newProjButton = document.querySelector(".newproject");
        newProjButton.addEventListener("click", newProjAction);

        const defaultProject = new Project("Untitled Project");
        // const date1 = new Date(2026, 4, 25);
        // const todo1 = new TodoItem("Todo-1", "A testing thingy", date1, "low");
        // defaultProject.addTodo(todo1);
        DOMfunc.displayProjectTodos(defaultProject);
    }

    return { init, newProjAction, findRemainingDays, criticalTime }
})();

document.addEventListener("DOMContentLoaded", () => {
    control.init();
})