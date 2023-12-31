var getTodos = function() {
  $.ajax({
    type: 'GET',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=319',
    dataType: 'json',
    success: function (response, textStatus) {
      $('.list-group').empty();

      var taskList = response.tasks;

      var activeTasks = response.tasks.filter(function(task) {
        if (!task.completed) return task.id;
      });

      var completedTasks = response.tasks.filter (function(task) {
        if (task.completed) return task.id;
      });
      
      var progress = ((completedTasks.length / taskList.length) * 100).toFixed(2);
      $('#footer > div > p').text(progress + "%");
      if (progress != 0) {
        $('#progress-bar').css({'width': progress + "%", "background-color": "#9ce4ba"});
      }
      else {
        $('#progress-bar').css({'width': "100%", "background-color": "#e2e2e2"});
      }

      var filter = $('.active-filter').attr('id');
      if (filter === 'all') taskList = response.tasks;
      else if (filter === 'active') taskList = activeTasks;
      else if (filter === 'completed') taskList = completedTasks;

      taskList.forEach(function(task) {
        $('.list-group').append(
          "<li class='list-group-item'>" +
          "<input class='mark-complete' type='checkbox' value='' id='formCheckBox' data-id='" + task.id + "'" + (task.completed ? "checked" : "") + ">" +
          "<label class='todo-label' for='formCheckBox'>" +
            task.content +
          "</label>" +
          "<button class='btn delete' data-id='" + task.id + "'>" +
            "<i class='fas fa-trash'></i>" +
          "</button>" +
        "</li>"
        )
      });
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

var newTodo = function() {
  $.ajax({
    type: 'POST',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=319',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      task: {
        content: $('.what-do').val()
      }
    }),
    success: function (response, textStatus) {
      $('.what-do').val('');
      getTodos();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

var removeTodo = function(id) {
  $.ajax({
    type: 'DELETE',
    url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=319',
    success: function (response, textStatus) {
      getTodos();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

var markCompleted = function(id) {
  $.ajax({
    type: 'PUT',
    url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_complete?api_key=319',
    dataType: 'json',
    success: function (response, textStatus) {
      getTodos();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
   });
}

var markActive = function(id) {
  $.ajax({
    type: 'PUT',
    url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_active?api_key=319',
    dataType: 'json',
    success: function (response, textStatus) {
      getTodos();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

var toggleFilter = function(filter) {
  $('#filterTasks').children().removeClass('active-filter');
  $(filter).toggleClass('active-filter');
  getTodos();
}

$(document).ready(function() {
  getTodos();
  $('#todo-item').on('submit', function(event) {
    event.preventDefault();
    newTodo();
  });
  $(document).on('click', '.delete', function() {
    removeTodo($(this).data('id'));
  });
  $(document).on('click', '.what-do', function() {
    $('.what-do').attr('placeholder', '');
  });
  $(document).on('change', '.mark-complete', function() {
    if (this.checked) markCompleted($(this).data('id'));
    else markActive($(this).data('id'));
  })
  $("#filterTasks > li").on('click', function() {
    toggleFilter(this);
  })
});