import { useNavigate, useParams } from 'react-router-dom';
import styles from './TodoItem.module.css';
import { useEffect, useState } from 'react';

export const TodoItem = ({ requestEditTodo, requestDeleteTodo, isRefreshTodos }) => {
	const [todo, setTodo] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
	const [newValue, setNewValue] = useState(todo.title);

	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		fetch(`http://localhost:3000/todos/${params.id}`)
			.then((loadedData) => loadedData.json())
			.then((loadedTodo) => setTodo(loadedTodo))
			.finally(() => setIsLoading(false));
	}, [params.id, isRefreshTodos, navigate]);

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

	const onConfirmEditClick = () => {
		if (isEdit) {
			requestEditTodo(params.id, newValue);
		}

		setNewValue('');
		setIsEdit(!isEdit);
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
				{isLoading ? <div className={styles.loader}></div> : null}
				{isEdit ? editMode : readMode}
				<div className={styles.buttons}>
					<button onClick={onConfirmEditClick}>
						<img className={styles.imgButton} src={src} alt="edit" />
					</button>
					<button onClick={() => requestDeleteTodo(params.id)}>
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
