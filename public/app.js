$(document).ready(function(){
    $.getJSON('api/todos')
        .then(addTodos);

    $('#todoInput').keypress(function(event){
        if(event.which == 13){
            createTodo();
        }
    });

    $('.list').on('click', 'li', function() {
        updateTodo($(this));
    });

    $('.list').on('click', 'span', function(e){
        e.stopPropagation();
        removeTodo($(this).parent());
    });
});

function addTodos(todos) {
    todos.forEach(function(todo){
        // console.log(todo);
        addTodo(todo);
    });
}

function addTodo(todo){
    const newTodo = $('<li class="task">' + todo.name + ' <span>X</span></li>');
    newTodo.data('id', todo._id);
    newTodo.data('completed', todo.completed);
    if (todo.completed){
        newTodo.addClass('done');
    }
    $('.list').append(newTodo);
}

function createTodo(){
    const usrInput = $('#todoInput').val();
    $.post('/api/todos', {name:  usrInput})
        .then(function(newTodo){
            $('#todoInput').val('');
            addTodo(newTodo);
        })
        .catch(function(err){
            console.log(err);
        });
}

function removeTodo(todo) {
    const clickedId = todo.data('id');
    const deleteUrl = '/api/todos/' + clickedId;
    $.ajax({
        method: 'DELETE',
        url: deleteUrl
    })
    .then(function(data){
        todo.remove();
    })
    .catch(function(err){
        console.log(err);
    });
}

function updateTodo(todo) {
    const updateUrl = '/api/todos/' + todo.data('id');
    const isDone = !todo.data('completed');
    const updateData = {completed: isDone};
    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData
    })
    .then(function(updatedTodo){
        console.log(todo.data('completed'));
        todo.toggleClass('done');
        todo.data('completed', isDone);
    });
}