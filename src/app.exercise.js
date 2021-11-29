/** @jsx jsx */
import { jsx } from "@emotion/core";

import * as React from "react";
import { useState, useEffect } from "react";
import * as auth from "auth-provider";
import { FullPageSpinner } from "./components/lib";
import * as colors from "./styles/colors";
import { useAsync } from "./utils/hooks";
import { AuthenticatedApp } from "./authenticated-app";
import { UnauthenticatedApp } from "./unauthenticated-app";
import { client } from "utils/api-client.exercise";

const getUser = async () => {
  let storedUser = null;

  const token = await auth.getToken();
  if (token) {
    const data = await client("me", { token });
    storedUser = data.user;
  }

  return storedUser;
};

function App() {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync();

  useEffect(() => {
    run(getUser());
  }, [run]);

  const login = (form) => {
    auth.login(form).then((user) => setData(user));
  };

  const register = (form) => {
    auth.register(form).then((user) => setData(user));
  };

  const logout = () => {
    auth.logout();
    setData(null);
  };

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  if (isSuccess) {
    return user ? (
      <AuthenticatedApp user={user} logout={logout} />
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    );
  }
}

export { App };

/*
eslint
  no-unused-vars: "off",
*/
