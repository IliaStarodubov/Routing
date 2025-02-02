import { NavLink } from 'react-router-dom';
import { TodoItems } from '../TodoItems/TodoItems';
import styles from './MainPage.module.css';

export const MainPage = ({
	onSearchTodoChange,
	onSortTodosClick,
	isLoading,
	todos,
	onSubmit,
	setNewTodo,
}) => {
	const debounce = (func, delay) => {
		let timeoutId;

		return function executedFunction(...args) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func.apply(this, args), delay);
		};
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
					<NavLink key={id} to={`todos/${id}`}>
						<TodoItems id={id} title={title} />
					</NavLink>
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
