import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import store from './Store/index.js';
import App from "./App.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Provider store = {store}>
            <ChakraProvider>
                <App/>
            </ChakraProvider>
        </Provider>
    </BrowserRouter>
);