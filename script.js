let addButton = document.getElementById("add-button");
let taskList = document.getElementById("task-list");

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

        var newCheckBox = document.createElement('input');
        newCheckBox.type = 'checkbox'; 
        newTaskElement.appendChild(newCheckBox);

        var newEditableLabel = document.createElement('input');
        newEditableLabel.type = 'text';
        newEditableLabel.value = inputValue;
        newTaskElement.appendChild(newEditableLabel);

        var newDeleteButton = document.createElement('img');
        newDeleteButton.src="bin.png";
        newDeleteButton.classList.add('delete-btn');
        newTaskElement.appendChild(newDeleteButton);
        
    }
    
    // ----- clean the input
    document.getElementById("input-value").value = '';


    // ----- handle checkbox states
    newCheckBox.addEventListener('change', (event) => {
        console.log(event);
        if(newCheckBox.checked){
            newEditableLabel.readOnly= 'readOnly';
            newEditableLabel.classList.add("strikethrough","hideborder");
        }
        else{
            newEditableLabel.removeAttribute('readOnly');
            newEditableLabel.classList.remove("strikethrough","hideborder");
        }
    })

    newDeleteButton.addEventListener('click', (event)=>{
        console.log(event);
        event.target.parentElement.remove();
    });
}


function verifyIfTasklistExist(){
    if(!Boolean(taskList)){
        console.log("tasklist doesn't exist yet");
        taskList = document.createElement("div");
        taskList.setAttribute("id", "task-list");
        document.body.appendChild(taskList);
    }
}
