var TodoContainer = React.createClass({
  loadTodosFromServer: function() {
    $.get(this.props.dataUrl, function(data) {
      this.setState({data: data});
    }.bind(this));
  },

  handleTodoSubmit: function(newTodo) {
    //optimistic update state
    var todos = this.state.data;
    todos.push(newTodo);
    this.setState({
      data: todos
    });

    //push new data to server
    $.post(this.props.dataUrl, newTodo, function(data) {
      //update with the data from the server
      this.setState({data: data});
    }.bind(this));
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function () {
    this.loadTodosFromServer();
  },

  render: function() {
    return (
      <div className="todoList">
        <h1>Todos</h1>
        <TodoForm onTodoSubmit={this.handleTodoSubmit}/>
        <TodoList data={this.state.data}/>
      </div>
    )
  }
});

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.refs.title.value.trim();
    if (!title) { return; }
    this.props.onTodoSubmit({
      title: title,
      date: new Date().toLocaleDateString()
    });
    this.refs.title.value = '';
    return;
  },

  render: function() {
    return (
      <form className="todoForm" onSubmit={this.handleSubmit}>
        <input ref="title" type="text" placeholder="Do something..."/>
        <input type="submit" value="Save"/>
      </form>
    )
  }
});

var TodoList = React.createClass({
  render: function() {
    var listItems = this.props.data.map(function(todo, i) {
      return (<Todo title={todo.title} date={todo.date} key={i} />);
    });

    return (
      <div className="todoList-container">
        <h3>Here's that list header.</h3>
        <ul className="todoList">
          {listItems}
        </ul>
      </div>
    )
  }
});

var Todo = React.createClass({
  render: function() {
    return (
      <li className="todo">
        <div className="todo-title">
          {this.props.title}
        </div>
        <div className="todo-date">
          {this.props.date}
        </div>
      </li>
    )
  }
});

ReactDOM.render(
  <TodoContainer dataUrl="/api/todos" />,
  document.getElementById('todo-content')
);
