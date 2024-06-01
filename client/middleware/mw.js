export default function ({ $auth, route, redirect }) {
    const outsideRoutes = ['/', '/registration', '/forgot-password'];

    if(!$auth.loggedIn && !outsideRoutes.includes(route.path)) {
        redirect('/');
    }

    if($auth.loggedIn && outsideRoutes.includes(route.path)) {
        redirect('/app');
    }

}
