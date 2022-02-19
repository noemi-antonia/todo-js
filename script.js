let addButton = document.getElementById("add-button");
let taskList = document.getElementById("task-list");
let numberOfTasks;

addButton.addEventListener('click', createNewTask);

function createNewTask(){

    verifyIfTasklistExist();

    // ----- get value from input
    var inputValue = document.getElementById("input-value").value;

    if(inputValue === ''){

        alert("You must write something!");

    } else {

        // ----- create elements
        var newTaskElement = document.createElement("div");
        newTaskElement.className = "task";
        taskList.appendChild(newTaskElement);

        var taskIndex = 'task' + numberOfTasks;
        console.log('new task index: ' + taskIndex)

        var newCheckBox = document.createElement('input');
        newCheckBox.type = 'checkbox';   
        newCheckBox.id = taskIndex; 
        newTaskElement.appendChild(newCheckBox);

        var newLabel = document. createElement("Label");
        newLabel. setAttribute("for", newCheckBox.id);
        newLabel. className = "strikethrough";
        newLabel. innerHTML = inputValue;
        newLabel.style = 'display: none;';
        newTaskElement. appendChild(newLabel);

        var newEditableLabel = document.createElement('input');
        newEditableLabel.type = 'text';
        newEditableLabel.value = inputValue;
        newTaskElement. appendChild(newEditableLabel);
        
    }
    
    // ----- clean the input
    document.getElementById("input-value").value = '';

    // ----- synchronize input with label when it is changed
    newEditableLabel.addEventListener('change', (event) => {
        newLabel.innerHTML = event.target.value;
    });

    // ----- handle checkbox states
    newCheckBox.addEventListener('change', () => {
        if(newCheckBox.checked){
            newLabel.style.display = "inline-block";
            newEditableLabel.style.display = "none";
        }
        else{
            newLabel.style.display = "none";
            newEditableLabel.style.display = "inline-block";
        }
    })
}

function verifyIfTasklistExist(){
    if(!taskList){
        console.log("tasklist doesn't exist yet");
        taskList = document.createElement("div");
        taskList.setAttribute("id", "task-list");
        document.body.appendChild(taskList);
        numberOfTasks = 0;
    }
    else{
        var taskDivs = taskList.getElementsByClassName('task');
        numberOfTasks = taskDivs.length;
    }
    console.log("number of tasks:" + numberOfTasks);
}
