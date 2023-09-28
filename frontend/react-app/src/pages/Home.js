import Banner from '../components/Banner';
import Highlights from '../components/Highlights';

export default function Home() {

	const data = {
		title: "Virtual Recipe Making",
		content: "Discover new Recipes",
		destination: "/recipes",
		label: "Create Now!"
	};

	return(
		<>
			<Banner data={data} />
			<Highlights />
		</>
	)
};