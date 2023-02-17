import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ children:Children, ...props }) => {
  return (
    <Route>
      {
        () => props.loggedIn ? <Children {...props} /> : <Redirect to="./login" />
      }
    </Route>
)}

export default ProtectedRoute;