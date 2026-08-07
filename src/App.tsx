import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

function App() {
    const browserRouter = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<MainLayout/>}>
                <Route index element={<Home/>}/>
            </Route>
        )
    );

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
            <QueryClientProvider client={new QueryClient()}>
                <RouterProvider router={browserRouter}/>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}

export default App;