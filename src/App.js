import CONFIG from './config.json'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

// Components
import StreamApp from './components/StreamApp'
import Error404 from './components/Error404'

export default function App() {
	return (
		<Router>
			<Switch>
				{CONFIG.ROOMS.map((room, i) => (
					<Route key={room} exact path={['/', `/kanal/${i + 1}`, `/kanal/${room}`]}>
						<StreamApp room={room} />
					</Route>
				))}

				<Route path="*">
					<Error404 />
				</Route>
			</Switch>
		</Router>
	)
}
