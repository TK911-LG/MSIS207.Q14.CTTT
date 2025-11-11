import { useState } from 'react';
import Card from '../Card/Card.jsx';
import TodoForm from '../TodoForm/TodoForm.jsx';
import TodoList from '../TodoList/TodoList.jsx';
import './TodoApp.css';

function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [nextId, setNextId] = useState(1);

    const addTodo = (text) => {
        const newTodo = {
            id: nextId,
            text: text,
            completed: false
        };
        setTodos([...todos, newTodo]);
        setNextId(nextId + 1);
    };

    const toggleTodo = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const completedCount = todos.filter((todo) => todo.completed).length;
    const activeCount = todos.length - completedCount;

    return (
        <div className="todo-app-container">
            <Card className="todo-app-card">
                <header className="todo-header">
                    <h1>My To-Do List</h1>
                    <div className="todo-stats">
                        <span className="stat">Total: {todos.length}</span>
                        <span className="stat active">Active: {activeCount}</span>
                        <span className="stat completed">Completed: {completedCount}</span>
                    </div>
                </header>

                <TodoForm onAddTodo={addTodo} />
                <TodoList
                    todos={todos}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                />
            </Card>
        </div>
    );
}

export default TodoApp;
