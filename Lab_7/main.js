function showAlert(msg) {
    let alertsContainer = document.querySelector('.alert');
    let newAlert = document.querySelector('.alert').cloneNode(true);
    newAlert.querySelector('.msg').innerHTML = msg;
    newAlert.classList.remove('d-none');
    alertsContainer.append(newAlert);
}

function createTaskElement(form){
    let newTaskElement = document.getElementById('task-template').cloneNode(true);
    newTaskElement.id = taskCounter++;
    newTaskElement.querySelector('.task-name').textContent = form.elements('name').value;
    newTaskElement.querySelector('.task-description').textContent = form.elements('description').value;
    newTaskElement.classList.remove('d-none');
    return newTaskElement;
}

function updateTask(form) {
    let taskElement = document.getElementById(form.elements['task-id'].value);
    taskElement.querySelector('.task-name').textContent = form.elements['name'].value;
    taskElement.querySelector('.task-description').textContent = form.elements['description'].value;

}

function actionTaskBtnHandler(event){
    let alertMsg;
    let form = this.closest('.modal').querySelector('form');
    let action = form.elements['action'].value;
    if (action == 'new'){
        document.getElementById(`${form.elements['column'].value}-list`).append(createTaskElement(form));
        alertMsg = `Задача ${form.elements['name']} создана успешно!`;
        form.reset();   
    }else if (action == 'edit'){
        updateTask(form);
        alertMsg = `Задача ${form.elements['name']} обновлена успешно!`;
    }
    if (alertMsg) showAlert(alertMsg);
}

let taskCounter = 0;
let titels = {
    'new' : 'Создание новой задачи',
    'edit' : 'Редактирование новой задачи',
    'show' : 'Просмотр задачи'
}
let titels = {
    'new' : 'Создать',
    'edit' : 'Сохранить',
    'show' : 'Ок'
}

window.onload = function() {
    document.querySelector('.action-task-btn').onclick = actionTaskBtnHandler;
    let taskModal = document.getElementById('.task-modal');
    taskModal.addEventListener('show.bs.modal', function(event){
        let form = document.querySelector('form');
        let action = event.relatedTarget.dataset.action || 'new';
        form.elements['action'].value = action;
        this.querySelector('.modal-tittle').textContent = tittles[action];
        this.querySelector('.action-task-btn').textContent = actionBtnText[action];
        if (action =='edit'){
            setFormValues(form, event.relatedTarget.closest)
        }
    })
}