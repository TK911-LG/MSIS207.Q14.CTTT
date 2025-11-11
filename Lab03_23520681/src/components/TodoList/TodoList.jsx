import PropTypes from 'prop-types';
import TodoItem from '../TodoItem/TodoItem.jsx';
import './TodoList.css';

function TodoList({ todos, onToggle, onDelete }) {
    if (todos.length === 0) {
        return (
            <div className="empty-state">
                <p>No tasks yet. Add one above to get started!</p>
            </div>
        );
    }

    return (
        <ul className="todo-list">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}

TodoList.propTypes = {
    todos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            text: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired
        })
    ).isRequired,
    onToggle: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default TodoList;
