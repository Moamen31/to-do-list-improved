//get elements
let taskInput = document.querySelector(".task-input")
let tasksUl = document.querySelector(".tasks")
let spanOfItems = document.querySelector(".items-count")
let clearBtn = document.querySelector(".clear")
let filters = document.querySelectorAll(".filters li")


//[9] check if there's tasks in local storage if no return an empty array
let arrayOfObject = JSON.parse(window.localStorage.getItem("task")) || [];
addToPage("all");
checkItemsLeft()


//[1] when enter is pressed
taskInput.addEventListener("keyup", (e) => {
    let inputValue = taskInput.value
    if (e.key === "Enter" && inputValue !== "") {
        //[2] make a task object
        let task = {
            title: inputValue,
            status: "pending",
        }
        //[3] push the task in the array
        arrayOfObject.push(task)
        //[4] save the tasks in local storage
        saveToLocalStorage(arrayOfObject);

        //[6]empty the input
        taskInput.value = ""

        //[7]add task to page
        addToPage("all")
    }
})

//[5] make the function to save to local storage
function saveToLocalStorage(arr) {
    window.localStorage.setItem("task", JSON.stringify(arr))
}

//[8] add to page function
function addToPage(filter) {
    //delete any repeated tasks
    document.querySelectorAll(".task-container").forEach(ele => ele.remove());
    //loop the array and use index to know the checkbox of each task
    arrayOfObject.forEach((task, index) => {

        //[11] after we check the finished tasks and save them in localstorage
        //we add checked to the checked task
        let ifCompeleted = task.status === "completed" ? "checked" : ""

        //[15]
        //if the filter which is the btn we click on had id equal to the task's status
        //then build the task and add it to the page and show only the one that's equal
        //to the btn id. 
        if (filter === task.status || filter === "all") {
            //create the div container and the task
            let taskContainer = document.createElement("div")
            taskContainer.className = "task-container"
            taskContainer.setAttribute("draggable", true)
            taskContainer.innerHTML =
                `<label for="${index}">
                <input onclick="updateTasks(this)" type="checkbox" id="${index}" ${ifCompeleted}>
                <li class="task ${ifCompeleted}" id="task">${task.title}</li>
            </label>
                <i onclick="deleteTask(${index})" class="fa-solid fa-trash-can"></i>`
            tasksUl.appendChild(taskContainer)
            checkItemsLeft()
        }
    })
}


//[10] on checkbox click
function updateTasks(checkBox) {
    //get the li task
    let ourTask = checkBox.nextElementSibling
    //when chcked add class to put line through it
    if (checkBox.checked) {
        ourTask.classList.add("checked")
        //change the status
        arrayOfObject[checkBox.id].status = "completed"
    }
    else {
        ourTask.classList.remove("checked")
        //change the status
        arrayOfObject[checkBox.id].status = "pending"
    }
    saveToLocalStorage(arrayOfObject)
    checkItemsLeft()
}

//[12] delete task function
function deleteTask(delBtnIndex) {
    //delete only the task of index
    arrayOfObject.splice(delBtnIndex, 1)
    //update local storage
    saveToLocalStorage(arrayOfObject)
    addToPage("all")
    checkItemsLeft()
}

//[13] delete all tasks on clear all
clearBtn.addEventListener("click", () => {
    //filter the array and get only the pending tasks
    let filtered = arrayOfObject.filter((ele) => {
        return ele.status === "pending"
    })
    // console.log(filtered)
    arrayOfObject = filtered
    //and save and add to page
    saveToLocalStorage(arrayOfObject);
    addToPage("all")
})

//[14] work on filtering the tasks
filters.forEach(filter => {
    filter.addEventListener("click", () => {
        filters.forEach(ft => {
            ft.classList.remove("active")
        })
        filter.classList.add("active")
        addToPage(filter.id)
    })
})

//[16] light and dark mode
let modes = document.querySelectorAll(".themes svg")
let moon = document.querySelector(".moon")
let sun = document.querySelector(".sun")
modes.forEach(mode => {
    mode.addEventListener("click", () => {
        document.body.classList.toggle("light")
        if (document.body.classList.contains("light")) {
            document.querySelector("header img").src = "images/bg-desktop-light.jpg"
            sun.classList.remove("active")
            moon.classList.add("active")
        }
        else {
            document.querySelector("header img").src = "images/bg-desktop-dark.jpg"
            moon.classList.remove("active")
            sun.classList.add("active")
        }
    })
})

// dragstart =>	Fired when the drag starts when we click on the element to drag it.
// dragend =>	Fired when the drag stops when we drop it.
// drag =>	As the element is being dragged around.
// dragenter =>	When the mouse enters the boundaries of an element.
// dragover =>	As the element is being dragged over another element.
// dragleave =>	When the mouse exits the boundaries of an element.
// drop =>	Fired when the element is being dropped.

//[17] drag and drop tasks
let taskToDrag = document.querySelectorAll(".task-container")
let draggedElement;
window.onload = sortList

function sortList() {
    taskToDrag.forEach(ele => {
        ele.addEventListener("dragstart", () => {
            draggedElement = ele
            taskToDrag.forEach(tsk => {
                if (tsk !== draggedElement) {
                    tsk.classList.add("dragging")
                }
            })
        })
        ele.addEventListener("dragenter", () => {
            if (ele !== draggedElement) {
                ele.classList.add("active")
            }
        })
        ele.addEventListener("dragleave", () => {
            if (ele !== draggedElement) {
                ele.classList.remove("active")
            }
        })
        ele.addEventListener("dragend", () => {
            taskToDrag.forEach(tsk => {
                tsk.classList.remove("dragging")
                tsk.classList.remove("active")
            })
        })
        ele.addEventListener("dragover", (e) => {
            e.preventDefault();
        })
        ele.addEventListener("drop", (e) => {
            e.preventDefault();
            if (ele !== draggedElement) {
                let draggedPos, droppedPos;
                for (let i = 0; i < taskToDrag.length; i++) {
                    if (draggedElement === taskToDrag[i]) { //the element we are dragging
                        draggedPos = i
                        console.log(i)
                    }
                    if (ele === taskToDrag[i]) { //the element we will drop on
                        droppedPos = i
                        console.log(i)
                    }
                }
                if (draggedPos < droppedPos) {
                    ele.parentNode.insertBefore(draggedElement, ele.nextSibling)
                }
                else {
                    ele.parentNode.insertBefore(draggedElement, ele)
                }
            }
        })
    })
}

//put the number of tasks in the span
// spanOfItems.innerText = arrayOfObject.length


// let content = document.querySelector("content")
// window.onload = () => {
//     if(arrayOfObject.length > 0){
//         //put the number of tasks in the span
//         spanOfItems.innerText = arrayOfObject.length
//     }
//     else{
//         spanOfItems.innerText = "0"
//     }
// }

//[18]
function checkItemsLeft(){
    let itemLeft = arrayOfObject.filter((ele) => {
        return ele.status === "pending"
    })
    
    if(itemLeft.length === 0){
        spanOfItems.innerText = "0"
    }else{
        spanOfItems.innerText = itemLeft.length
    }
}