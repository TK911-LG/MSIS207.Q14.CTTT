import PropTypes from 'prop-types';
import './TodoItem.css';

function TodoItem({ todo, onToggle, onDelete }) {
    return (
        <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-item-left">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    className="todo-checkbox"
                    id={`todo-${todo.id}`}
                />
                <label htmlFor={`todo-${todo.id}`} className="todo-text">
                    {todo.text}
                </label>
            </div>
            <button
                onClick={() => onDelete(todo.id)}
                className="delete-btn"
                aria-label="Delete task"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
            </button>
        </li>
    );
}

TodoItem.propTypes = {
    todo: PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired
    }).isRequired,
    onToggle: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default TodoItem;
