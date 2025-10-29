/** @jsx createElement */
import { createElement, ComponentProps, useState } from './jsx-runtime';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps extends ComponentProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = (props: TodoItemProps) => {
  const { todo, onToggle, onDelete } = props;

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const itemClass = `todo-item${todo.completed ? ' completed' : ''}`;

  return (
      <li className={itemClass}>
        <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
        />
        <span>{todo.text}</span>
        <button onClick={handleDelete} className="danger">Delete</button>
      </li>
  );
};

interface AddTodoFormProps extends ComponentProps {
  onAdd: (text: string) => void;
}

const AddTodoForm = (props: AddTodoFormProps) => {
  const { onAdd } = props;
  const [getValue, setValue] = useState("");

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setValue(target.value);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const text = getValue().trim();
    if (text) {
      onAdd(text);
      setValue("");
    }
  };

  return (
      <form className="add-todo-form" onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Add a new todo..."
            value={getValue()}
            onInput={handleInput}
        />
        <button type="submit">Add</button>
      </form>
  );
};

export const TodoApp = () => {
  const [getTodos, setTodos] = useState<Todo[]>([]);
  const [getNextId, setNextId] = useState(1);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: getNextId(),
      text,
      completed: false,
    };
    setTodos(currentTodos => [...currentTodos, newTodo]);
    setNextId(id => id + 1);
  };

  const toggleTodo = (id: number) => {
    setTodos(currentTodos =>
        currentTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(currentTodos => currentTodos.filter(t => t.id !== id));
  };

  const todos = getTodos();
  const completedCount = todos.filter(t => t.completed).length;

  return (
      <div className="todo-app">
        <h1>My Todo List</h1>
        <AddTodoForm onAdd={addTodo} />
        <ul className="todo-list">
          {todos.map(todo => (
              <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
              />
          ))}
        </ul>
        <div className="todo-summary">
          Total: {todos.length} | Completed: {completedCount} | Active: {todos.length - completedCount}
        </div>
      </div>
  );
};