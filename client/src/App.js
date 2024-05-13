import HomePage from "./components/Pages/HomePage";
import AboutPage from "./components/Pages/AboutPage";
import ProfilePage from "./components/Pages/ProfilePage";
import NotFoundPage from "./components/Pages/NotFoundPage";
import AdminHomePage from "./components/Pages/AdminHomePage";
import AdminLoginPage from "./components/Pages/AdminLoginPage";
import VerifyaccountPage from "./components/Pages/VerifyaccountPage";
import ForgotPasswordPage from "./components/Pages/ForgotPasswordPage";
import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

const App = () => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const isAdminLoggedIn = useSelector(state => state.admin.isLoggedIn);
    return (
        <Switch>
            <Route path = "/" exact><HomePage/></Route>
            {isLoggedIn && <Route path = "/profile" exact><ProfilePage/></Route>}
            <Route path = "/auth/reset/:token"><ForgotPasswordPage/></Route>
            <Route path = "/about" exact><AboutPage/></Route>
            <Route path = "/auth/verify/:token" exact><VerifyaccountPage/></Route>
            <Route path = "/admin" exact><AdminLoginPage/></Route>
            {isAdminLoggedIn && <Route path = "/admin/home" exact><AdminHomePage/></Route>}
            <Route path = "*"><NotFoundPage/></Route>
        </Switch>
    )
}

export default App;