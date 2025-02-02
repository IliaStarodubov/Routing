import styles from './todoitems.module.css';

export const TodoItems = ({ title, id }) => {
	return (
		<div key={id} className={styles.element}>
			<span className={styles.span}>{title}</span>
		</div>
	);
};
