class Model {
    constructor(){
        this.todoList = [
            {title:'Learn Javascript', checked:false, id:1, notes:'', priority:'high'},
            {title:'Reading', checked:false, id:2, notes:'', priority:'low'}, 
            {title:'Hiking', checked:true, id:3, notes:'', priority:'low'},
        ];
    }
    
    addTodo(todoTitle){

        const ids = this.todoList.map(object => {
            return object.id;
        });

        const maxId = Math.max(...ids);

        const todo = {
            title: todoTitle, 
            checked: false, 
            id: this.todoList.length > 0 ? maxId + 1 : 1,
            notes: '',
            priority: 'low'
        }

        this.todoList.push(todo);

        this.whenTodoListChanged(this.todoList);

        console.log(this.todoList);
    }

    deleteTodo(todoId){
        const indexOfTodo = this.todoList.findIndex(element => element.id === todoId );
        this.todoList.splice( indexOfTodo, 1);
        console.log(this.todoList);

        this.whenTodoListChanged(this.todoList);
    }

    editTodo(todoId, changedTodo){
        
        for (const obj of this.todoList) {
            if (obj.id === todoId) {
              obj.title = changedTodo;
              break;
            }
        }

        console.log(this.todoList);
        this.whenTodoListChanged(this.todoList);
    }

    changeCheckedStatus(todoId){
        const indexOfTodo =  this.todoList.findIndex(element => element.id === todoId );
        this.todoList[indexOfTodo].checked = this.todoList[indexOfTodo].checked ? false : true;
        console.log(this.todoList);

        this.whenTodoListChanged(this.todoList);
    }

    changePriority(todoId, selectedPriority){
        for (const obj of this.todoList) {
            if (obj.id === todoId) {
              obj.priority = selectedPriority;
              break;
            }
        }
        
        this.sortByPriority();
        this.whenTodoListChanged(this.todoList);
        console.log(this.todoList);
    }

    sortByPriority(){
        this.todoList.sort(function (a, b) {
            console.log(a, b);
            if(a.priority === b.priority)
                return 0;
            else if(a.priority==='high' || (a.priority==='medium' && b.priority==='low'))
                return -1;
            else if((a.priority==='low' && (b.priority==='medium' || b.priority==='high'))
                    || (a.priority==='medium' && b.priority=='high')
            )
                return 1;
        });
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

        // delete what is currently displayed in the list
        while (this.todoListDiv.firstChild) {
            this.todoListDiv.removeChild(this.todoListDiv.firstChild);
        }

        // if the list is empty
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
                editableLabel.classList.add('title');

                const deleteButton = this.createElement('img','delete-btn');
                deleteButton.src = "bin.png";

                const priorityList = this.createElement("select");
                const priority = new Map();

                priority.set('low', '#fff1cc');
                priority.set('medium', '#ffd8b3');
                priority.set('high','#ffb3b3');

                for (let [value, color] of priority) {
                    var option = document.createElement("option");
                    option.value = value;
                    option.text = value;

                    if(todo.priority==value){
                        option.selected = true;
                        priorityList.style.backgroundColor=color;
                    }

                    priorityList.appendChild(option);
                }
                
                const todoHeader = this.createElement("div", "todo-header");
                todoHeader.append(checkbox, editableLabel, deleteButton);
                todoDiv.append(todoHeader, priorityList); 

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
                const id = parseInt(event.target.parentElement.parentElement.id);
                handler(id);
            }
        })
    }

    checkboxStatusEventListener(handler){
        this.todoListDiv.addEventListener('change', event => {
            if(event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.parentElement.id)
                handler(id);
            }
        })
    }

    editTodoEventListener(handler){
        this.todoListDiv.addEventListener('change', event => {
            if(event.target.type === 'text') {
                const id = parseInt(event.target.parentElement.parentElement.id)
                handler(id, event.target.value);
            }
        })
    }

    priorityEventListener(handler){
        this.todoListDiv.addEventListener('change', event => {
            if(event.target.type === 'select-one') {
                console.log("select change triggered");
                const id = parseInt(event.target.parentElement.id);
                handler(id, event.target.value);
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
        this.view.editTodoEventListener(this.editTodoHandler);
        this.view.priorityEventListener(this.priorityHandler);

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
 
    editTodoHandler = (todoId, changedTitle) => {
        this.model.editTodo(todoId,changedTitle);
    }

    priorityHandler = (todoId, newPriority) => {
        this.model.changePriority(todoId,newPriority);
    }

    checkedStatusHandler = (todoId) => {
        this.model.changeCheckedStatus(todoId);
    }
}

const app = new Controller(new Model(), new View());
