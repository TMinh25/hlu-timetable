import React from "react";

// import component
import UserProvider from "./providers/UserProvider";
import Application from "./components/Application";
import Loading from "./components/Loading";

const App = () => {
	return (
		<UserProvider>
			<Application />
		</UserProvider>
	);
};

export default App;
