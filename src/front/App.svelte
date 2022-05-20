<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";
	import Info from "./Info.svelte";
import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'sveltestrap';
	import { onMount } from "svelte";
	import auth from "../authService";
	import { isAuthenticated, user, user_tasks, tasks } from "../store";
	import TaskItem from "../components/TaskItem.svelte";

	import Pneumonia from "./pneumonia-stats/Pneumonia.svelte";
	import EditPneumonia from "./pneumonia-stats/EditPneumonia.svelte";
	import MyGraphPneumonia from "./pneumonia-stats/MyGraphPneumonia.svelte";
	import Cancerdeaths from "./cancerdeaths-stats/Cancerdeaths.svelte";
	import EditCancerdeaths from "./cancerdeaths-stats/EditCancerdeaths.svelte";
	import MyGraphCancerdeaths from "./cancerdeaths-stats/MyGraphCancerdeaths.svelte";
	import MyGraphCancerdeathsC3 from "./cancerdeaths-stats/MyGraphCancerdeathsC3.svelte";
	import Airpollution from "./air-pollution-stats/AirPollution.svelte";
	import EditAirpollution from "./air-pollution-stats/EditAirPollution.svelte";

	import AirPollutionGraph from "./air-pollution-stats/AirPollutionGraph.svelte";
	import MyGraph from "./MyGraph.svelte";
	//export let name;
	let auth0Client;
	let newTask;

	onMount(async () => {
		auth0Client = await auth.createClient();

		isAuthenticated.set(await auth0Client.isAuthenticated());
		user.set(await auth0Client.getUser());
	});

	function login() {
		auth.loginWithPopup(auth0Client);
	}

	function logout() {
		auth.logout(auth0Client);
	}

	function addItem() {
		let newTaskObject = {
			id: genRandom(),
			description: newTask,
			completed: false,
			user: $user.email,
		};

		console.log(newTaskObject);

		let updatedTasks = [...$tasks, newTaskObject];

		tasks.set(updatedTasks);

		newTask = "";
	}

	function genRandom(length = 7) {
		var chars =
			"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var result = "";
		for (var i = length; i > 0; --i)
			result += chars[Math.round(Math.random() * (chars.length - 1))];
		return result;
	}
	const routes = {
		"/": Home,
		"/info": Info,

		"/pneumonia-stats": Pneumonia,
		"/pneumonia/:country/:year": EditPneumonia,
		"/graphpneumonia": MyGraphPneumonia,
		"/cancerdeaths-stats": Cancerdeaths,
		"/cancerdeaths/:country/:year": EditCancerdeaths,
		"/cancerdeaths-graph": MyGraphCancerdeaths,
		"/cancerdeaths-graph-C3": MyGraphCancerdeathsC3,
		"/air-pollution-stats": Airpollution,
		"/air-pollution/:country/:year": EditAirpollution,
		"/graphAirPollution": AirPollutionGraph,
		"/graph": MyGraph,
	};
</script>
<style>
	#main-application {
	  margin-top: 50px;
	}
  </style>
<main>
	<!--<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<Pneumonia /> -->
	<Router {routes} />
	
	
	  
</main>
