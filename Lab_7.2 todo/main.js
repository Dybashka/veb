let api_key = '50d2199a-42dc-447d-81ed-d68a443b697e';
let mainUrl = new URL('http://tasks-api.std-900.ist.mospolytech.ru/');

async function getTasks() { //для получ json
    let url = new URL('api/tasks', mainUrl); //'то, что в 4 строчке' //маинюрл - уже сущ объект
    url.searchParams.set('api_key', api_key);  //работа с апи

    let response = await fetch(url); //гет-запрос на наш юрл

    let json = await response.json();//преобразование в json
    if (json.error) {               //проверка на ошибки 
        showAlert(json.error);
    }
    else { 
      return json;
    }

}
function renderTaskElement(elem) { //обработка нашего элемента
    
    let newTaskElement = document.getElementById('task-template').cloneNode(true); //создаем нов элем
    newTaskElement.id = elem.id; //присваеваем айди
    newTaskElement.querySelector('.task-name').innerHTML = elem.name; //вставляем имя для задачи 
    newTaskElement.querySelector('.task-description').innerHTML = elem.desc; //вставл описание
    newTaskElement.classList.remove('d-none'); //удаление
    for (let btn of newTaskElement.querySelectorAll('.move-btn')) { //пр нажатии на кнопку перемещения
        btn.onclick = moveBtnHandler;
    }

    return newTaskElement;
}

function parseJSON(json) {// читает число (для элем задаем в какою сторону уходит задача)
    
    for (let elem of json.tasks) {
        let listElement = document.getElementById(`${elem.status}-list`); //какой статус
        listElement.append(renderTaskElement(elem));
        
        let tasksCounterElement = listElement.closest('.card').querySelector('.tasks-counter');  //подсчет
        tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) + 1;
    }
}


function showAlert(msg, category='alert-danger') { //обработка ошибки (само соо и категория)
    let alertsContainer = document.querySelector('.alerts');
    let newAlertElement = document.getElementById('alerts-template').cloneNode(true);
    if (msg == undefined) { 
        return;  //закончить функцию при проверке 
    }
    newAlertElement.querySelector('.msg').innerHTML = msg;
    newAlertElement.classList.add(category);
    newAlertElement.classList.remove('d-none');
    alertsContainer.append(newAlertElement);
}

function createTaskElement(form) { //создание элем (из окошка забираем данные)
    let newTaskElement = document.getElementById('task-template').cloneNode(true);
    newTaskElement.id = form.elements['task-id'].value;
    newTaskElement.querySelector('.task-name').innerHTML = form.elements['name'].value;
    newTaskElement.querySelector('.task-description').innerHTML = form.elements['description'].value;
    newTaskElement.classList.remove('d-none');
    for (let btn of newTaskElement.querySelectorAll('.move-btn')) {
        btn.onclick = moveBtnHandler;
    }
    return newTaskElement
}

function updateTask(form) { //обновляем при изменении 
    let taskElement = document.getElementById(form.elements['task-id'].value);
    taskElement.querySelector('.task-name').innerHTML = form.elements['name'].value;
    taskElement.querySelector('.task-description').innerHTML = form.elements['description'].value;
}

 //ниже создание элем на сервере (async для вовращ промиса и работа с эвейт)

async function createTaskRequest(form) { //созд элем
    let data = new FormData(form); // форма, куда вписываются статус и описание и т.д.
    data.set('status', form.elements['column'].value);
    data.set('desc', form.elements['description'].value); //описание
    let url = new URL('api/tasks', mainUrl); //создается юрл
    url.searchParams.set('api_key', api_key); //прикрепл апи
    let response = await fetch(url, {  //передаем тут форму
        method: 'POST',
        body: data
      });
    let result = await response.json(); //преобраз ответ

    
    if (result.error) {  //если какая-то ошибка
        return Promise.reject;
    }   
    return result;
}

async function updateTaskRequest(data) { //обновление элем
    let url = new URL(`api/tasks/${data.get('id')}`, mainUrl); 
    url.searchParams.set('api_key', api_key);
   
    let response = await fetch(url, { //получаем ответ
        method: 'PUT',
        body: data
      });
    
    let result = await response.json(); //преобраз ответ

    
    if (result.error) {   //если какая-то ошибка
        return Promise.reject;
    }   
}
function actionTaskBtnHandler(event) { // работа с кнопкой                              
    let form, listElement, alertMsg, action;
    form = event.target.closest('.modal').querySelector('form');
    action = form.elements['action'].value;

    if (action == 'create') { //при созд
        
        createTaskRequest(form)
            .then(function(result) {
                form.elements['task-id'].value = result.id;
                listElement = document.getElementById(`${form.elements['column'].value}-list`);
                listElement.append(createTaskElement(form));
                alertMsg = `Задача ${form.elements['name'].value} была успешно создана!`;
                showAlert(alertMsg, 'alert-success');
            })
            .catch(showAlert());

    } else if (action == 'edit') {  //при изменении (при добавл)
        
        let data = new FormData();
        data.set('desc', form.elements['description'].value);
        data.set('name', form.elements['name'].value);
        data.set('status', form.elements['column'].value);
        data.set('id', form.elements['task-id'].value);
        updateTaskRequest(data)
            .then(function() {
                updateTask(form);
                alertMsg = `Задача ${form.elements['name'].value} была успешно обновлена!`;
                showAlert(alertMsg, 'alert-success');
            })
            .catch(showAlert);
    }

}

function resetForm(form) { //обнуляем форму (пустой делаем)
    form.reset();
    form.querySelector('select').closest('.mb-3').classList.remove('d-none');
    form.elements['name'].classList.remove('form-control-plaintext');
    form.elements['description'].classList.remove('form-control-plaintext');
}

function setFormValues(form, taskId) { //уст знач в форму
    let taskElement = document.getElementById(taskId);
    form.elements['name'].value = taskElement.querySelector('.task-name').innerHTML;
    form.elements['description'].value = taskElement.querySelector('.task-description').innerHTML;
    form.elements['task-id'].value = taskId;
}

function prepareModalContent(event) { //форма показать/редактировать
    let form = event.target.querySelector('form'); 
    resetForm(form);

    let action = event.relatedTarget.dataset.action || 'create';

    form.elements['action'].value = action;
    event.target.querySelector('.modal-title').innerHTML = titles[action];
    event.target.querySelector('.action-task-btn').innerHTML = actionBtnText[action];

    if (action == 'show' || action == 'edit') {
        setFormValues(form, event.relatedTarget.closest('.task').id);
        event.target.querySelector('select').closest('.mb-3').classList.add('d-none');
    }

    if (action == 'show') {
        form.elements['name'].classList.add('form-control-plaintext');
        form.elements['description'].classList.add('form-control-plaintext');
    }

}


async function removeRequest(taskId) { // запрос по удалению
    let url = new URL(`api/tasks/${taskId}`, mainUrl);
    url.searchParams.set('api_key', api_key);
    
    let response = await fetch(url, {
        method: 'DELETE',
      });
      
    let result = await response.json();

    if (result.error) {
        return Promise.reject;
    }
    
}

function removeTaskBtnHandler(event) { //при нажатии запускаем удаление
    let form = event.target.closest('.modal').querySelector('form');
    let taskElement = document.getElementById(form.elements['task-id'].value);

    let tasksCounterElement = taskElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) - 1;
    
    removeRequest(taskElement.id).catch(showAlert);

    taskElement.remove();
}

function moveBtnHandler(event) {  //перенос осущ
    let taskElement = event.target.closest('.task');
    let currentListElement = taskElement.closest('ul');
    let targetListElement = document.getElementById(currentListElement.id == 'to-do-list' ? 'done-list' : 'to-do-list');

    let tasksCounterElement = taskElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) - 1;

    targetListElement.append(taskElement);

    let data = new FormData();
    data.set('id', taskElement.id);
    data.set('status', String(targetListElement.id).substring(0, String(targetListElement.id).indexOf('-list')));
    console.log(data.get('id'), data.get('status'));
    updateTaskRequest(data)
        .catch(showAlert);

    tasksCounterElement = targetListElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) + 1;
}

let taskCounter = 0; //счетчик

let titles = { //названия форм
    'create': 'Создание новой задачи',
    'edit': 'Редактирование задачи',
    'show': 'Просмотр задачи'
}

let actionBtnText = { 
    'create': 'Создать',
    'edit': 'Сохранить',
    'show': 'Ок'
}

window.onload = function () {  //последовательность при загрузке
    getTasks()
        .then(parseJSON)
        .catch(showAlert);
    
    document.querySelector('.action-task-btn').onclick = actionTaskBtnHandler;

    document.getElementById('task-modal').addEventListener('show.bs.modal', prepareModalContent);

    document.getElementById('remove-task-modal').addEventListener('show.bs.modal', function (event) {
        let taskElement = event.relatedTarget.closest('.task');
        let form = event.target.querySelector('form');
        form.elements['task-id'].value = taskElement.id;
        event.target.querySelector('.task-name').innerHTML = taskElement.querySelector('.task-name').innerHTML;
    });
    document.querySelector('.remove-task-btn').onclick = removeTaskBtnHandler;

    
}