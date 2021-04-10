import React from "react";

// import component
import UserProvider from "./providers/UserProvider";
import Application from "./components/Application";
import { ToastContainer } from "react-toastify";

// import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
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
    </ThemeProvider>
  );
};

export default App;
