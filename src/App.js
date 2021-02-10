import React from "react";

// import component
import UserProvider from "./providers/UserProvider";
import Application from "./components/Application";
import {ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
	return (
		<UserProvider>
			<ToastContainer
				position="bottom-right"
				autoClose={2000}
				hideProgressBar={false}
				pauseOnHover
				newestOnTop={false}
				closeOnClick
				draggable
			/>
			<Application />
		</UserProvider>
	);
};

export default App;
