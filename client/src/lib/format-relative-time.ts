import { formatDate } from './format-date';

export const formatRelativeTime = (timestamp: string) => {
	const date = new Date(timestamp);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	const rtf = new Intl.RelativeTimeFormat('ru-RU', { numeric: 'auto' });

	if (seconds < 60) {
		return rtf.format(-seconds, 'second');
	} else if (seconds < 60 * 60) {
		const minutes = Math.floor(seconds / 60);
		return rtf.format(-minutes, 'minute');
	} else if (seconds < 60 * 60 * 24) {
		const hours = Math.floor(seconds / (60 * 60));
		return rtf.format(-hours, 'hour');
	} else if (seconds < 60 * 60 * 24 * 2) {
		return 'вчера';
	} else {
		return formatDate(timestamp);
	}
};
