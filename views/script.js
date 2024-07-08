document.addEventListener('DOMContentLoaded', () => {

  const createTaskButton = document.getElementById('createTask');
  const refreshButton = document.getElementById('refreshTask');
  const deleteModalClose = document.getElementById('deleteModalClose');
  const closeModalButtons = document.querySelectorAll('.modal .closeButton button');
  var modal = document.querySelector('.modal');
  var checkbox = document.querySelector('checkbox');

  loadTasks();

  refreshButton.addEventListener('click', () => {
    loadTasks();
  });

  createTaskButton.addEventListener('click', () => {
    Add();
  });

  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      modal.style.display = 'none';
      cleanModal();
    });
  });

  deleteModalClose.addEventListener('click', () => {
    deleteConfirm.style.display = 'none';
  });

  checkbox.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      alert('checked');
    } else {
      alert('not checked');
    }
  })

});

function loadTasks() {
  const tasksContainer = document.querySelector('.tasks .scroll');
  fetch('http://localhost:3000')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      let html = '';

      data.forEach(task => {
        const checkboxChecked = task.isActive ? '' : 'checked';
        var color;
        if (task.priority == 1) {
          color = "red";
        }
        else if (task.priority == 2) {
          color = "orange";
        }
        else if (task.priority == 3) {
          color = "yellow";
        }

        html += `
            <div class="task ${color}" data-task-id="${task.id}">
              <div class="flag">
              </div>
              <div class="taskText">
                <div class="taskTitle">${task.title}</div>
                <div class="taskDescription">${task.description}</div>
              </div>
              <div class="taskIcons">
              <button class="editButton"><i class="fa-solid fa-pen" ></i></button>
              <button class="deleteTask"><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>
          `;
      });
      cleanModal();
      tasksContainer.innerHTML = html;

      const deleteButtons = document.querySelectorAll('.deleteTask');
      deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
          const taskId = button.closest('.task').dataset.taskId;
          deleteTask(taskId);
        });
      });

      const editButtons = document.querySelectorAll('.editButton');
      editButtons.forEach(button => {
        button.addEventListener('click', () => {

          const taskId = button.closest('.task').dataset.taskId;
          var selectionData = data.find(d => d.id == taskId);
          Update(selectionData);
        });
      });
    })
    .catch(error => {
      console.error('Hata oluştu:', error);
    });
}

function deleteTask(taskId) {
  const deleteConfirm = document.getElementById('deleteConfirm');
  const deleteyes = document.getElementById('deletetask');
  const nodelete = document.getElementById('nodelete');

  deleteConfirm.style.display = 'flex';

  deleteyes.onclick = function () {

    fetch('http://localhost:3000/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: taskId })
    })
      .then(response => response.text())
      .then(data => {
        console.log('Success:', data);
        deleteConfirm.style.display = 'none';
        loadTasks();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert("Silme işlemi başarısız");
      });
  };

  nodelete.onclick = function () {
    deleteConfirm.style.display = 'none';
  };
  cleanModal();
}

function Add() {
  var modal = document.querySelector('.modal');
  var saveButton = document.getElementById("save");
  var radio1 = document.getElementById("radio1");
  var radio2 = document.getElementById("radio2");
  var radio3 = document.getElementById("radio3");
  var priortyValue;
  var title = document.getElementById("title");
  var description = document.getElementById("description");
  var isActivevalue = true;

  modal.style.display = 'flex';

  saveButton.onclick = () => {

    if (radio1.checked) {
      priortyValue = 1;
    }
    else if (radio2.checked) {
      priortyValue = 2;
    }
    else if (radio3.checked) {
      priortyValue = 3;
    }
    else {
      priortyValue = 4;
    }

    const data = {
      "title": title.value,
      "description": description.value,
      "isActive": isActivevalue,
      "priority": priortyValue
    }
    if (title.value) {

      fetch('http://localhost:3000/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          modal.style.display = 'none';
          loadTasks();

        })
        .catch((error) => {
          console.error('Error:', error);
          alert("kaydedilemedi");
        });
      cleanModal();
    }
    else {
      alert("Title boş bırakılamaz")
    }
  }
}

function Update(selectionData) {

  var modal = document.querySelector('.modal');
  var saveButton = document.getElementById("save");
  var radio1 = document.getElementById("radio1");
  var radio2 = document.getElementById("radio2");
  var radio3 = document.getElementById("radio3");
  var radio4 = document.getElementById("radio4");
  var priortyValue;
  var title = document.getElementById("title");
  var description = document.getElementById("description");

  const data = selectionData;
  modal.style.display = 'flex';
  title.value = data.title;
  description.value = data.description;

  if (data.priority == 1) {
    radio1.checked = true;
  }
  else if (data.priority == 2) {
    radio2.checked = true;
  }
  else if (data.priority == 3) {
    radio3.checked = true;
  }
  else {
    radio4.checked = true;
  }

  saveButton.onclick = () => {

    if (radio1.checked) {
      priortyValue = 1;
    }
    else if (radio2.checked) {
      priortyValue = 2;
    }
    else if (radio3.checked) {
      priortyValue = 3;
    }
    else {
      priortyValue = 4;
    }

    const Updatingdata = {
      "id": data.id,
      "title": title.value,
      "description": description.value,
      "priority": priortyValue,
      "isActive": data.isActive
    }

    console.log(Updatingdata);

    if (data.id && Updatingdata) {
      try {
        console.log(data.id)
        fetch('http://localhost:3000/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: data.id, updates: Updatingdata })
        })
          .then(response => response.text())
          .then(data => {
            console.log('Success:', data);
            modal.style.display = 'none';
            loadTasks();
          })
          .catch((error) => {
            console.error('Error:', error);
            alert("An error occurred while updating the item.");
          });

      } catch (error) {
        alert("Invalid JSON format.");
      }
    }
  }
}

function cleanModal() {
  var radio4 = document.getElementById("radio4");
  var title = document.getElementById("title");
  var description = document.getElementById("description");

  title.value = "";
  description.value = "";
  radio4.checked = true;
}