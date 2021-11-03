import { Link } from 'react-router-dom';
import './index.css';

export default function Error404() {
	return (
		<div className="error404">
			<div className="noise" />
			<div className="overlay" />
			<div className="terminal">
				<h1>
					Error <span className="errorcode">404</span>
				</h1>
				<p className="output">
					Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı bırakılmış olabilir.
				</p>
				<p className="output">
					Eğer istersen <Link to="/">buraya</Link> tıklayarak uygulamaya geri dönebilirsin.
				</p>
				<p className="output">İyi şanslar.</p>
			</div>
		</div>
	);
}
