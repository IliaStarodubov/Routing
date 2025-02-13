import { useNavigate } from 'react-router-dom';
import { TodoItems } from '../TodoItems/TodoItems';
import styles from './TodoList.module.css';
import { useEffect, useState } from 'react';

const debounce = (func, delay) => {
	let timeoutId;

	return function executedFunction(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func.apply(this, args), delay);
	};
};

export const TodoList = () => {
	const [todos, setTodods] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [newTodo, setNewTodo] = useState('');
	const navigate = useNavigate();

	const refetch = () => {
		fetch('http://localhost:3000/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => setTodods(loadedTodos))
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		refetch();
	}, []);

	const onSubmit = (event) => {
		event.preventDefault();

		setIsLoading(true);

		fetch('http://localhost:3000/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: newTodo,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then(() => refetch())
			.finally(() => setNewTodo(''));

		event.target.reset();
	};

	const onSearchTodoChange = ({ target }) => {
		fetch(`http://localhost:3000/todos?q=${target.value}`)
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => setTodods(loadedTodos));
	};

	const onSortTodosClick = () => {
		fetch(`http://localhost:3000/todos?_sort=title&_order=asc`)
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => setTodods(loadedTodos));
	};

	return (
		<>
			<h1 className={styles.app}>Todo List</h1>
			<form className={styles.form}>
				<input
					onChange={debounce(onSearchTodoChange, 300)}
					className={styles.search}
					type="search"
					placeholder="search todos"
					name="search"
				/>
			</form>
			<button onClick={onSortTodosClick} className={styles.buttonSort}>
				<img
					className={styles.imgButtonSort}
					src="/src/assets/sort-alpha-down.svg"
					alt="sort"
				/>
			</button>
			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				todos.map(({ id, title }) => (
					<div key={id} onClick={() => navigate(`/task/${id}`)}>
						<TodoItems id={id} title={title} />
					</div>
				))
			)}

			<form onSubmit={onSubmit} className={styles.form}>
				<label>Add a new todo...</label>
				<input
					className={styles.labelInput}
					type="text"
					name="add"
					onChange={({ target }) => setNewTodo(target.value)}
				/>
				<button type="submit" className={styles.buttonAdd}>
					Add
				</button>
			</form>
		</>
	);
};
