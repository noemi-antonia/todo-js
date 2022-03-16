let todoList = [{title:'Reading', checked:false, id:1, notes:'', priority:'low'}, {title:'Hiking', checked:true, id:2, notes:'', priority:'low'}];


window.addEventListener('load', (event) => {
    let addButton = document.getElementById("add-button");
    addButton.addEventListener('click', preventEmptyInput);
    createTodoList();
});

function preventEmptyInput(){

    var inputValue = document.getElementById("input-value").value;

    if(inputValue === ''){

        alert("You must write something!");

    } else {
        addTodo(inputValue);
    }
}

function createTodoList(){

    if(Boolean(todoList)){
        // create a div for all of the todos
        todoListDiv = document.createElement("div");
        todoListDiv.setAttribute("id", "task-list");
        document.body.appendChild(todoListDiv);

        // create DOM elements for all the todos from our array
        todoList.forEach(todo => createDOMelement(todo));
    }
}

function addToTodoList(todo){
    todoList.push(todo);
    console.log(todoList);
}

function addTodo(title){

    const todo = {
        title: title,
        checked: false,
        id: Date.now(),
        notes: '',
        priority: 'low'
    }

    // update the array of todos
    addToTodoList(todo);

    // create DOM element
    createDOMelement(todo);

    // clean the input
    document.getElementById("input-value").value = '';
}

function deleteTodo(id){
    var indexOfTodo =  todoList.findIndex(element => element.id === id );
    todoList.splice( indexOfTodo, 1);
    console.log(todoList)
}

function createDOMelement(todo){

        var newTodoElement = document.createElement("div");
        newTodoElement.className = "task";
        todoListDiv.appendChild(newTodoElement);

        var newCheckBox = document.createElement('input');
        newCheckBox.type = 'checkbox'; 
        newTodoElement.appendChild(newCheckBox);
        newCheckBox.checked = todo.checked;

        var newEditableLabel = document.createElement('input');
        newEditableLabel.type = 'text';
        newEditableLabel.value = todo.title;
        newTodoElement.appendChild(newEditableLabel);

        var newDeleteButton = document.createElement('img');
        newDeleteButton.src="bin.png";
        newDeleteButton.classList.add('delete-btn');
        newTodoElement.appendChild(newDeleteButton);

        handleCheckboxStates(newCheckBox, newEditableLabel);

        newCheckBox.addEventListener('change', ()=>{ changeCheckedStatus(todo.id); handleCheckboxStates(newCheckBox, newEditableLabel);});

        newDeleteButton.addEventListener('click', (event)=>{
            deleteTodo(todo.id);
            event.target.parentElement.remove();
        });
}

function handleCheckboxStates(checkboxElement, inputElement){
    if(checkboxElement.checked){
        inputElement.readOnly= 'readOnly';
        inputElement.classList.add("strikethrough","hideborder");
    }
    else{
        inputElement.removeAttribute('readOnly');
        inputElement.classList.remove("strikethrough","hideborder");
    }
}

function changeCheckedStatus(id){
    var indexOfTodo =  todoList.findIndex(element => element.id === id );

    if(todoList[indexOfTodo].checked)
        todoList[indexOfTodo].checked = false;
    else
        todoList[indexOfTodo].checked = true;
    console.log(todoList);
}
