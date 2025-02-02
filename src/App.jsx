import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { MainPage } from './components/MainPage/MainPage';
import { TodoItem } from './components/TodoItem/TodoItem';
import { PageError } from './components/PageError/PageError';

export const App = () => {
	const [todos, setTodods] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [newTodo, setNewTodo] = useState('');
	const [isRefreshTodos, setIsRefreshTodo] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		fetch('http://localhost:3000/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => setTodods(loadedTodos))
			.finally(() => setIsLoading(false));
	}, [isRefreshTodos]);

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
			.then(() => setIsRefreshTodo(!isRefreshTodos))
			.finally(() => {
				setIsLoading(false);
				setNewTodo('');
			});

		event.target.reset();
	};

	const requestDeleteTodo = (id) => {
		setIsLoading(true);

		fetch(`http://localhost:3000/todos/${id}`, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then(() => {
				navigate('/');
				console.log('navigate/');

				setIsRefreshTodo(!isRefreshTodos);
			})
			.finally(() => setIsLoading(false));
	};

	const requestEditTodo = (id, title) => {
		setIsLoading(true);

		fetch(`http://localhost:3000/todos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title,
			}),
		})
			.then(() => setIsRefreshTodo(!isRefreshTodos))
			.finally(() => setIsLoading(false));
	};

	const onSearchTodoChange = ({ target }) => {
		setIsLoading(true);

		fetch(`http://localhost:3000/todos?q=${target.value}`)
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => setTodods(loadedTodos))
			.finally(() => setIsLoading(false));
	};

	const onSortTodosClick = () => {
		setIsLoading(true);

		fetch(`http://localhost:3000/todos?_sort=title&_order=asc`)
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => setTodods(loadedTodos))
			.finally(() => setIsLoading(false));
	};

	return (
		<>
			<Routes>
				<Route
					path="/"
					element={
						<MainPage
							onSearchTodoChange={onSearchTodoChange}
							onSortTodosClick={onSortTodosClick}
							isLoading={isLoading}
							todos={todos}
							onSubmit={onSubmit}
							setNewTodo={setNewTodo}
						/>
					}
				/>
				<Route
					path="todos/:id"
					element={
						<TodoItem
							requestEditTodo={requestEditTodo}
							requestDeleteTodo={requestDeleteTodo}
							isRefreshTodos={isRefreshTodos}
						/>
					}
				/>
				<Route path="/404" element={<PageError />} />
				<Route path="*" element={<Navigate to="/404" />} />
			</Routes>
		</>
	);
};
