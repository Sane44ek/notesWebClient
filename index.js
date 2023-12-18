function toggleModal(modal) {
    closeAllModals();
    modal.style.transformOrigin = 'center center';
    modal.classList.toggle('visible');
}

function closeAllModals() {
    var modals = document.querySelectorAll('.modal.visible');
    modals.forEach(function (modal) {
        modal.style.transformOrigin = 'left top';
        modal.classList.remove('visible');
        // modal.style.transformOrigin = 'center center';
    });
}

var createButton = document.getElementById('createButton');
var readButton = document.getElementById('readButton');
var updateButton = document.getElementById('updateButton');
var deleteButton = document.getElementById('deleteButton');

var createModal = document.querySelector('.create-modal');
var readModal = document.querySelector('.read-modal');
var updateModal = document.querySelector('.update-modal');
var deleteModal = document.querySelector('.delete-modal');

var activeButton;
var closeButtons = document.querySelectorAll('.outer');


createButton.addEventListener('click', function() {
    activeButton = createButton;
    toggleModal(createModal);
});

readButton.addEventListener('click', function() {
    activeButton = readButton;
    toggleModal(readModal);
});

updateButton.addEventListener('click', function() {
    activeButton = updateButton;
    toggleModal(updateModal);
});

deleteButton.addEventListener('click', function() {
    activeButton = deleteButton;
    toggleModal(deleteModal);
});

const animateConnectingLine = () => {
    const connectingLine = document.getElementById('connectingLine');
    connectingLine.classList.add('animate'); // Добавление класса анимации
    setTimeout(() => {
        connectingLine.classList.remove('animate'); // Удаление класса анимации после завершения
    }, 2000); // 2 секунды (время анимации)
};


closeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      closeAllModals();
      animateConnectingLine(); //////////////////////////////////////////////
    });
  });

///////////  connection line

document.addEventListener('DOMContentLoaded', function () {
    const pc = document.getElementById('pc');
    const server = document.getElementById('server');
    const connectingLine = document.getElementById('connectingLine');

    const updateConnectingLine = () => {
        const pcRect = pc.getBoundingClientRect();
        const serverRect = server.getBoundingClientRect();

        const pcX = pcRect.right;
        const pcY = pcRect.top + pcRect.height / 2;

        const serverX = serverRect.left;
        const serverY = serverRect.top + serverRect.height / 2;

        const controlX = (pcX + serverX) / 2; /// здесь меняются параметры кривизны
        const controlY = pcY - serverY / 2;

        // Измените атрибут 'd' для использования кривой Безье
        const path = `M${pcX},${pcY} Q${controlX},${controlY} ${serverX},${serverY}`;
        connectingLine.setAttribute('d', path);
    };

    // Вызов функции при загрузке страницы и изменении размеров окна
    window.addEventListener('resize', updateConnectingLine);
    updateConnectingLine();

});

// send form
window.addEventListener("DOMContentLoaded", function () {
  
    document.addEventListener('submit', function(ev) {
        ev.preventDefault();
    
        var form = ev.target;
        var formData = new FormData(form);

        if (ev.submitter.classList.contains("button_save")) {
            var jsonData = {};
            formData.forEach(function(value, key) {
                jsonData[key] = value;
            });
            console.log(jsonData) ///////////////////////////////////////////////////////////////

            fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })

            .then(response => response.json())
            .then(data => {
                if (data["result"] == "Success") {
                    showCreateResult(data["data"]);
                }
                else if (data["result"] == "Error") {
                    showError(data["error"]);
                }
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }

        if (ev.submitter.classList.contains("button_update")) {

            var noteId = form.querySelector('#note_id').value;
            var name = form.querySelector('#firstName').value;
            var lastName = form.querySelector('#lastName').value;
            var text = form.querySelector('#message').value;
        
            // Создать JSON-объект
            var jsonData = {
                index: noteId,
                data: {
                    name: name,
                    last_name: lastName,
                    text: text
                }
            };

            console.log(jsonData)

            fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => response.json())
            .then(data => {
                if (data["result"] == "Success") {
                    showUpdateResult(data["data"]);
                }
                else if (data["result"] == "Error") {
                    showError(data["error"]);
                }
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }

        if (ev.submitter.classList.contains("button_read")) {
            var note_id = form.querySelector('#note_id').value;

            fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: note_id.toString()
            })
            .then(response => response.json())
            .then(data => {
                if (data["result"] == "Success") {
                    showReadResult(data["data"]);
                }
                else if (data["result"] == "Error") {
                    showError(data["error"]);
                }
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }

        if (ev.submitter.classList.contains("button_delete")) {
            var note_id = form.querySelector('#note_id').value;

            fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: note_id.toString()
            })
            .then(response => response.json())
            .then(data => {
                if (data["result"] == "Success") {
                    showDeleteResult();
                }
                else if (data["result"] == "Error") {
                    showError(data["error"]);
                }
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }

        closeAllModals();
        document.querySelectorAll('.modal input').forEach(function(input) {
          input.value = ''; // Очищаем значение в поле ввода
        });
        document.querySelectorAll('.modal textarea').forEach(function(textarea) {
            textarea.value = ''; // Очищаем значение в поле ввода
        });
        
    });

});

function showReadResult(data) {
    var resultBlock = document.getElementById('result-data');
    var resultModal = document.querySelector('.result-modal');
    if (resultBlock != null) {
        resultBlock.remove()
    }
    var resultData = document.createElement('div');
    resultData.id = "result-data"
    resultModal.appendChild(resultData);
    if (typeof data !== 'object') {
        showError("Unsupported type of data in response")
        return
    }
    // if (Object.keys(data).length === 0) {
    //     var resultElement = document.createElement('div');
    //     resultElement.textContent = "Note successfully deleted";
    //     resultData.appendChild(resultElement);
    //     resultData.classList.add('visible');
    //     return
    // }

    const fieldsData = [
        { id: 'responseFirstName', label: 'First Name', type: 'text', readOnly: true },
        { id: 'responseLastName', label: 'Last Name', type: 'text', readOnly: true },
        { id: 'responseMessage', label: 'Message', type: 'textarea', readOnly: true }
    ];
    
    fieldsData.forEach(field => {
    const form = document.createElement('form');
    const formGroup = document.createElement('div');
    const label = document.createElement('label');
    const input = field.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');

    formGroup.className = 'form-group';
    label.htmlFor = field.id;
    label.textContent = field.label;
    input.id = field.id;
    input.name = field.name;
    input.type = field.type;

    if (field.readOnly) {
        input.setAttribute('readonly', true);
    }

    formGroup.appendChild(label);
    formGroup.appendChild(input);
    form.appendChild(formGroup);
    resultData.appendChild(form);
    });

    const responseFirstName = document.getElementById('responseFirstName');
    const responseLastName = document.getElementById('responseLastName');
    const responseMessage = document.getElementById('responseMessage');
  
    // Заполняем значения полей данными
    responseFirstName.value = data.name || '';
    responseLastName.value = data.last_name || '';
    responseMessage.value = data.text || '';

    resultModal.classList.add('visible');
}

function showDeleteResult() {
    var resultBlock = document.getElementById('result-data');
    var resultModal = document.querySelector('.result-modal');
    if (resultBlock != null) {
        resultBlock.remove()
    }
    var resultData = document.createElement('div');
    resultData.id = "result-data"
    resultModal.appendChild(resultData);

    var resultElement = document.createElement('div');
    resultElement.textContent = "Note successfully deleted";
    resultData.appendChild(resultElement);
    resultModal.classList.add('visible');
}

function showUpdateResult(data) {
    var resultBlock = document.getElementById('result-data');
    var resultModal = document.querySelector('.result-modal');
    if (resultBlock != null) {
        resultBlock.remove()
    }
    var resultData = document.createElement('div');
    resultData.id = "result-data"
    resultModal.appendChild(resultData);
    
    var resultElement = document.createElement('div');
    resultElement.textContent = "Note successfully updated. New note ID: " + data;
    resultData.appendChild(resultElement);
    resultModal.classList.add('visible');
}

function showCreateResult(data) {
    var resultBlock = document.getElementById('result-data');
    var resultModal = document.querySelector('.result-modal');
    if (resultBlock != null) {
        resultBlock.remove()
    }
    var resultData = document.createElement('div');
    resultData.id = "result-data"
    resultModal.appendChild(resultData);
    
    var resultElement = document.createElement('div');
    resultElement.textContent = "Note successfully created with ID: " + data;
    // resultElement.classList.add('');
    resultData.appendChild(resultElement);
    resultModal.classList.add('visible');
}

function showError(data) {
    var errorModal = document.querySelector('.error-modal');
    var errorMessageElement = errorModal.querySelector('.error-message');
    errorMessageElement.textContent = data
    errorModal.classList.add('visible');
}