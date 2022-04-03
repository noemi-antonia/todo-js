class Model {
    constructor(){
        this.todoList = [
            {title:'Reading', checked:false, id:1, notes:'', priority:'low'}, 
            {title:'Hiking', checked:true, id:2, notes:'', priority:'low'},
            {title:'Learn Javascript', checked:false, id:3, notes:'', priority:'high'},
        ];
    }
    
    addTodo(todoTitle){

        const todo = {
            title: todoTitle, 
            checked: false, 
            id: this.todoList.length > 0 ? (this.todoList[this.todoList.length - 1].id + 1) : 1,
            notes: '',
            priority: 'low'
        }

        this.todoList.push(todo);
        console.log(this.todoList);

        this.whenTodoListChanged(this.todoList);
    }

    deleteTodo(todoId){
        const indexOfTodo = this.todoList.findIndex(element => element.id === todoId );
        this.todoList.splice( indexOfTodo, 1);
        console.log(this.todoList);

        this.whenTodoListChanged(this.todoList);
    }

    changeCheckedStatus(todoId){
        const indexOfTodo =  this.todoList.findIndex(element => element.id === todoId );
        this.todoList[indexOfTodo].checked = this.todoList[indexOfTodo].checked ? false : true;
        console.log(this.todoList);

        this.whenTodoListChanged(this.todoList);
    }

    bindTodoListChanged(callback) {
        this.whenTodoListChanged = callback;
    }

}

class View {
    constructor(){

        this.rootElement = document.getElementById("root"); 

        this.newTodoDiv = this.createElement("div","new-todo");

        this.addButton = this.createElement("button","add-btn");
        this.addButton.textContent = "+";

        this.input = this.createElement("input");
        this.input.type = "text";
        this.input.placeholder = "Add a new todo";

        this.rootElement.appendChild(this.newTodoDiv);
        this.newTodoDiv.append(this.addButton, this.input);

        this.todoListDiv = this.createElement("div","todo-list");
        this.rootElement.appendChild(this.todoListDiv);
    }

    createElement(tag, className){
        const element = document.createElement(tag);

        if(className) 
        element.classList.add(className);

        return element;
    }

    inputIsEmpty(){
        if(this.input.value === ''){
    
            alert("You must write something!");
            return true;
        }
        else {
            return false;
        }
    }

    resetInput(){
        this.input.value = '';
    }

    displayTodoList(todoList){

        // sterg ce e afisat momentan in divul listei 
        while (this.todoListDiv.firstChild) {
            this.todoListDiv.removeChild(this.todoListDiv.firstChild);
        }

        // daca nu am in array nimic
        if(todoList.length === 0){
            const emptyTodoListMessage = this.createElement('p');
            emptyTodoListMessage.textContent = "Nothing to do!"
            this.todoListDiv.appendChild(emptyTodoListMessage);
        } else {
            todoList.forEach( todo => {
                const todoDiv = this.createElement("div","task");
                todoDiv.id= todo.id;
                this.todoListDiv.appendChild(todoDiv);
                
                const checkbox = this.createElement("input");
                checkbox.type = 'checkbox'; 
                checkbox.checked = todo.checked;

                const editableLabel = this.createElement("input");
                editableLabel.type = 'text';
                editableLabel.value = todo.title;

                const deleteButton = this.createElement('img','delete-btn');
                deleteButton.src = "bin.png";
                
                todoDiv.append(checkbox, editableLabel, deleteButton); 

                if(checkbox.checked){
                    editableLabel.readOnly= 'readOnly';
                    editableLabel.classList.add("strikethrough","hideborder");
                }
                else{
                    editableLabel.removeAttribute('readOnly');
                    editableLabel.classList.remove("strikethrough","hideborder");
                }
            })
        }
    }

    addTodoEventListener(handler){
        this.addButton.addEventListener('click', event =>{
            if(!this.inputIsEmpty()){
                handler(this.input.value);
                this.resetInput();
            }
        })
    }

    deleteTodoEventListener(handler){
        this.todoListDiv.addEventListener('click', event => {
            if(event.target.className === 'delete-btn') {
                const id = parseInt(event.target.parentElement.id);
                handler(id);
            }
        })
    }

    checkboxStatusEventListener(handler){
        this.todoListDiv.addEventListener('change', event => {
            if(event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id)
                handler(id);
            }
        })
    }

}

class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;

        // display initial todos
        this.whenTodoListChanged(this.model.todoList);

        this.view.addTodoEventListener(this.addTodoHandler);
        this.view.deleteTodoEventListener(this.deleteTodoHandler);
        this.view.checkboxStatusEventListener(this.checkedStatusHandler);

        this.model.bindTodoListChanged(this.whenTodoListChanged);

    }

    whenTodoListChanged = (todoList) => {
        this.view.displayTodoList(todoList);
    }

    addTodoHandler = (todoTitle) => {
        this.model.addTodo(todoTitle);
    }

    deleteTodoHandler = (todoId) => {
        this.model.deleteTodo(todoId);
    }

    checkedStatusHandler = (todoId) => {
        this.model.changeCheckedStatus(todoId);
    }
}

const app = new Controller(new Model(), new View());
