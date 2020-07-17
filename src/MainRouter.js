import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import Orders from "./user/Orders";
import NewPost from "./post/NewPost";
import EditPost from "./post/EditPost";
import SinglePost from "./post/SinglePost";
import PrivateRoute from "./auth/PrivateRoute";
import Cart from "./order/Cart";
//import Payments from "./order/Payments";

const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path="/" component={Home} />
	    <PrivateRoute exact path="/post/create" component={NewPost} />
        <Route exact path="/post/:postId" component={SinglePost} />
        <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
        <PrivateRoute
                exact
                path="/user/Orders"
                component={Orders}
            />
            <Route exact path="/users" component={Users} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signin" component={Signin} />
            <PrivateRoute
                exact
                path="/user/edit/:userId"
                component={EditProfile}
            />
            <PrivateRoute exact path="/user/:userId" component={Profile} />
            <Route exact path="/cart" exact component={Cart} />
        </Switch>
    </div>
);

export default MainRouter;
