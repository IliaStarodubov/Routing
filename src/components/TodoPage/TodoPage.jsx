import { useNavigate, useParams } from 'react-router-dom';
import styles from './TodoPage.module.css';
import { useEffect, useState } from 'react';

export const TodoPage = () => {
	const [todo, setTodo] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
	const [newValue, setNewValue] = useState(todo.title);
	const { id } = useParams();
	const navigate = useNavigate();

	const src = isEdit ? '/src/assets/check-circle.svg' : '/src/assets/pencil-square.svg';

	const editMode = (
		<div>
			<input
				onChange={({ target }) => setNewValue(target.value)}
				type="text"
				name="edit"
				className={styles.labelInput}
				value={newValue}
			/>
		</div>
	);

	const readMode = <span className={styles.span}>{todo.title}</span>;

	const refetch = () => {
		fetch(`http://localhost:3000/todos/${id}`)
			.then((loadedData) => loadedData.json())
			.then((loadedTodo) => setTodo(loadedTodo))
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		refetch();
	}, []);

	const requestEditTodo = (title) => {
		fetch(`http://localhost:3000/todos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title,
			}),
		}).then(() => refetch());
	};

	const onConfirmEditClick = () => {
		if (isEdit) {
			requestEditTodo?.(newValue);
		}

		setNewValue('');
		setIsEdit(!isEdit);
	};

	const requestDeleteTodo = () => {
		setIsLoading(true);

		fetch(`http://localhost:3000/todos/${id}`, {
			method: 'DELETE',
		})
			.then(() => {
				navigate('/');
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<>
			<h1 className={styles.app}>Todo Item</h1>
			<button onClick={() => navigate(-1)} className={styles.buttonBack}>
				<img
					className={styles.imgButtonBack}
					src="/src/assets/chevron-double-left.svg"
					alt="sort"
				/>
			</button>
			<div className={styles.element}>
				{isLoading ? (
					<div className={styles.loader}></div>
				) : isEdit ? (
					editMode
				) : (
					readMode
				)}
				<div className={styles.buttons}>
					<button onClick={onConfirmEditClick}>
						<img className={styles.imgButton} src={src} alt="edit" />
					</button>
					<button onClick={requestDeleteTodo}>
						<img
							className={styles.imgButton}
							src="/src/assets/trash.svg"
							alt="delete"
						/>
					</button>
				</div>
			</div>
		</>
	);
};
