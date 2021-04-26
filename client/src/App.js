import expressConfig from "./config/express.json";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { useSnackbar } from "notistack";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ProtectedRoute from "./router/ProtectedRoute";
import LoginForgetPassword from "./components/loginForgetPassword";
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { ApolloClient, InMemoryCache } from "@apollo/client";
//import { SubscriptionClient } from "subscriptions-transport-ws";
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2d2d2d", //your color
    },
  },
});
function App() {
  const { enqueueSnackbar } = useSnackbar();
  function linkErrorHandler({ graphQLErrors, networkError }) {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );

        // enqueueSnackbar(message, { variant: "error" });
      });

    if (networkError)
      enqueueSnackbar("Unable to connect to server contact admin.", {
        variant: "error",
      });
  }

  const env = process.env.NODE_ENV || "development";
  const config = expressConfig[env];

  const httpLink = new HttpLink({
    uri: `${config.graphql_domain}:${config.port}/${config.graphql_endpoint}`,
    credentials: "include",
  });
  const wsLink = new WebSocketLink({
   
    options: {
      reconnect: true,
      lazy: true,
    },
  });
  wsLink.subscriptionClient.on("connecting", () => {
    console.log("connecting subs " + new Date().toString());
  });
  
  wsLink.subscriptionClient.on("connected", () => {
    console.log("connected subs "  + new Date().toString());
  });
  
  wsLink.subscriptionClient.on("reconnecting", () => {
    console.log("reconnecting subs "  + new Date().toString());
  });
  
  wsLink.subscriptionClient.on("reconnected", () => {
    console.log("reconnected subs "  + new Date().toString());
  });
  
  wsLink.subscriptionClient.on("disconnected", () => {
    console.log("disconnected subs "  + new Date().toString());
  });
  wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
  wsLink.subscriptionClient.maxConnectTimeGenerator.max;
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );
  const ApolloClient_ = new ApolloClient({
    link: splitLink,
    onError: linkErrorHandler,

    cache: new InMemoryCache(),
  });
  
  return (
    <BrowserRouter>
      <ApolloProvider client={ApolloClient_}>
        <Provider store={store}>
          <MuiThemeProvider theme={theme}>
            <Switch>
              <Route
                exact
                strict
                path={["/login", "/resetpassword/:token"]}
                render={(props) => (
                  <LoginForgetPassword
                    {...props}
                    titleLogin={`Login`}
                    titleForgetPassword={"Forget Password"}
                  />
                )}
              ></Route>
              <ProtectedRoute wsLink={wsLink} path="/"></ProtectedRoute>

              <Route path="*" render={() => <div>404</div>}></Route>
            </Switch>
          </MuiThemeProvider>
        </Provider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
