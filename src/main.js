import axios from 'axios';

const userToken = localStorage.getItem('token');

function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login/';
}
if (document.getElementById('logout-btn') != null) {
    document.getElementById('logout-btn').addEventListener('click', logout);
}


function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    return true;
}



function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        axios({
            url: API_BASE_URL + 'auth/register/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({ data, status }) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        }).catch(function(err) {
            displayErrorToast('An account using same email or username is already here')
        })
    }
}

if (document.getElementById('registerbutton') != null) {
    const registerButton = document.getElementById('registerbutton');
    registerButton.addEventListener('click', register);
}


function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend, login and direct user to home page.
     */






    const username = document.getElementById('inputUsername').value.trim().toString();
    const password = document.getElementById('inputPassword').value.toString();

    const dataForApiRequest = {
        "username": username,
        "password": password
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: dataForApiRequest,
    }).then(function({ data, status }) {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    }).catch(function(err) {
        displayErrorToast('Wrong credentials ! Please try again.')
        
    })
}



if (document.getElementById('loginbutton') != null) {
    const loginButton = document.getElementById('loginbutton');
    loginButton.addEventListener('click', login);
}


function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

    let task = document.querySelector(".form-control").value;
    if (task == "") {
        displayErrorToast("Task title cannot be empty!");
        return;
    }
    const dataForApiRequest = {
        title: task
    }
    const header = {
        'Authorization': `Token ${window.localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }

    axios({
        url: API_BASE_URL + 'todo/create/',
        method: 'post',
        data: dataForApiRequest,
        headers: header
    }).then(function(data, status) {
        getTasks();

        document.querySelector('.form-control').value = ""
        document.querySelector('.form-control').placeholder = "Create a new task."
        displaySuccessToast("To-Do added successfully")
    })






}
if (document.getElementById('addtaskbutton') != null) {
    const addTaskButton = document.getElementById('addtaskbutton');
    addTaskButton.addEventListener('click', addTask);
}


function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    const dataForApiRequest = {
        id: id
    }
    const header = {
        'Authorization': `Token ${window.localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }

    axios({
        url: API_BASE_URL + `todo/${id}/`,
        method: 'delete',
        data: dataForApiRequest,
        headers: header
    }).then(function(data, status) {

        console.log(status)
        getTasks();


        displaySuccessToast("To-Do Removed Sucessfully");
    })

}
if (document.getElementById("delete-task") != null) {
    const deleteTaskBtn = document.getElementById("delete-task");
    deleteTask.addEventListener("click", deleteTask());
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */


    let task = document.querySelector(`#input-button-${id}`).value;
    if (task == "") {
        displayErrorToast("Task Title cannot be left blank!")
        return
    }
    const dataForApiRequest = {
        title: task,
        id: id
    }
    const header = {
        'Authorization': `Token ${window.localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }

    axios({
        url: API_BASE_URL + `todo/${id}/`,
        method: 'patch',
        data: dataForApiRequest,
        headers: header
    }).then(function(data, status) {

        getTasks();

        document.querySelector('.form-control').value = ""
        document.querySelector('.form-control').placeholder = "Create a new task."
        displaySuccessToast("To-Do Updated Successfully!");
    })





}

window.displayErrorToast = displayErrorToast
window.deleteTask = deleteTask;
window.editTask = editTask;
window.updateTask = updateTask;


