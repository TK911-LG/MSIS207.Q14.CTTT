import { useState } from 'react';
import PropTypes from 'prop-types';
import './TodoForm.css';

function TodoForm({ onAddTodo }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();

        if (trimmedValue === '') {
            return;
        }

        onAddTodo(trimmedValue);
        setInputValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done?"
                className="todo-input"
                maxLength={100}
            />
            <button type="submit" className="add-btn">
                Add Task
            </button>
        </form>
    );
}

TodoForm.propTypes = {
    onAddTodo: PropTypes.func.isRequired
};

export default TodoForm;
