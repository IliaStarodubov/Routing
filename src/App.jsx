import { Navigate, Route, Routes } from 'react-router-dom';
import { TodoList } from './components/TodoList/TodoList';
import { TodoPage } from './components/TodoPage/TodoPage';
import { NotFound } from './components/NotFound/NotFound';

export const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<TodoList />} />
				<Route path="task/:id" element={<TodoPage />} />
				<Route path="/404" element={<NotFound />} />
				<Route path="*" element={<Navigate to="/404" replace />} />
			</Routes>
		</>
	);
};
