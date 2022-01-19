function removeTaskBtnHandler(event){
    let form = event.target.closest('.modal').querySelector('form');
    let taskElement = document.getElementById(form.elements['task-id'].value);
    taskElement.remove;
}

function resetForm(form){
    form.reset();
    form.elements['name'].classList.remove('form-control-plaintext');
    form.elements['description'].classList.remove('form-control-plaintext');

}

function showAlert(msg){
    let alertsContainer = document.querySelector('.alerts');
    let newAlert = document.querySelector('.alert').cloneNode(true);
    newAlert.querySelector('.msg').innerHTML = msg;
    newAlert.classList.remove('d-none');
    alertsContainer.append(newAlert);
}

function setFormValues(form, taskid){
    let taskElement = document.getElementById(taskid);
    form.elements['name'].value = taskElement.querySelector('.task-name').textContent;
    form.elements['description'].value = taskElement.querySelector('.task-description').textContent;
    form.elements['task-id'].value = taskid;
}

function updateTask(form){
    let taskElement = document.getElementById(form.elements['task-id'].value);
    taskElement.querySelector('.task-name').textContent = form.elements['.name'].value;
    taskElement.querySelector('.task-description').textContent = form.elements['.description'].value;
}

function createTaskElement(form){
    let newTaskElement = document.getElementById('task-template').cloneNode(true);
    newTaskElement.id = taskCounter++;
    newTaskElement.querySelector('.task-name').textContent = form.elements['name'].value;
    newTaskElement.querySelector('.task-description').textContent = form.elements['description'].value;
    newTaskElement.classList.remove('d-none');
    return newTaskElement;
}

function actionTaskBtnHandler(event){
    let alertMsg;
    let form = this.closest('.modal').querySelector('form');
    let action = form.elements['action'].value;
    if (action == 'new'){
        document.getElementById(`${form.elements['column'].value}-list`).append(createTaskElement(form));
        alertMsg = `Задача ${form.elements['name'].value} создана успешно`;
        form.reset();
    }else if (action == 'edit'){
        updateTask(form);
        alertMsg = `Задача ${form.elements['name'].value} обновлена успешно`;
    }
    if (alertMsg) showAlert(alertMsg);
}

let taskCounter = 0;

let titles = {
    'new': 'Создание новой задачи',
    'edit': 'Редактирование задачи',
    'show': 'Просмотр задачи'
}

let actionBtnText = {
    'new': 'Создать',
    'edit': 'Сохранить',
    'show': 'Ок'
}

window.onload = function(){
    document.querySelector('.action-task-btn').onclick = actionTaskBtnHandler;
    let taskModal = document.getElementById('task-modal');
    taskModal.addEventListener('show.bs.modal', function(event){
        let form = document.querySelector('form');
        resetForm(form);
        let action = event.relatedTarget.dataset.action || 'new';
        form.elements['action'].value = action;
        this.querySelector('.modal-title').textContent = titles[action];
        this.querySelector('.action-task-btn').textContent = actionBtnText[action];
        if (action == 'edit' || 'show'){
            setFormValues(form, event.relatedTarget.closest('.task').id);
            //this.querySelector('.select').closest('.form-group').classList.add('d-none');
        }
        if (action == 'show'){
            form.elements['name'].classList.add('form-control-plaintext');
            form.elements['description'].classList.add('form-control-plaintext');
        }
    })
    let taskModal = document.getElementById('remove-task-modal');
    taskModal.addEventListener('show.bs.modal', function(event){
        let taskElement = event.relatedTarget.closest('.task');
        let form = event.target.querySelector('form');
        form.elements['task-id'].value = taskElement.id;
        event.target.querySelector('.task-name').textContent = taskElement.querySelector('.task-name').textContent;
    })
    document.querySelector('.remove-task-btn').onclick = removeTaskBtnHandler;
}