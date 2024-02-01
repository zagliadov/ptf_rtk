import { useLayoutEffect, useState } from "react";
import { setUserEmail } from "src/store/authSlice";
import { useAppDispatch } from "src/store/store";

function useApp() {
  const [permissionAllowed, setPermissionAllowed] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [emailParams, setEmailParams] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.token && params.email) {
      setPermissionAllowed(true);
      setToken(params.token);
      setEmailParams(params.email);
      dispatch(setUserEmail(params.email));
    }
  }, [dispatch, permissionAllowed]);

  return {
    permissionAllowed,
    setPermissionAllowed,
    token,
    emailParams,
  };
}

export default useApp;