import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { BrowserRouter } from "react-router-dom"; 
import { Provider } from "react-redux"; 
import store from "./redux/store"; 

import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <Provider store={store}> 
        <BrowserRouter> 
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </>
);
