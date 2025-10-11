//import {back_dir} from '../backend';

const dirs = ["registro", "login", "simulacion", "mod_scoring"];
var urls = [];

dirs.forEach((item, index) => {
	urls.push(<a href={"/" + item}>{item}</a>);
	urls.push(" ");
});

export default function Index(){
	return (
	<div id="index">
		{urls}
	</div>
	);
}
