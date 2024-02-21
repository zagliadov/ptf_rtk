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
    window.parent.postMessage("scheduler-request-current-user", "*");
    const handleMessage = (event: any) => {
      if (event.data?.name === "scheduler-current-user" && event.data?.email) {
        const { email } = event.data;
        console.log(email, "email")
        if (email && params.token) {
          setEmailParams(email);
          dispatch(setUserEmail(email));
          setToken(params.token);
          setPermissionAllowed(true);
        }
      }
    };
    window.addEventListener("message", handleMessage);

    if (params.email && params.token) {
      setEmailParams(params.email);
      dispatch(setUserEmail(params.email));
      setToken(params.token);
      setPermissionAllowed(true);
    }
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch]);

  return {
    permissionAllowed,
    setPermissionAllowed,
    token,
    emailParams,
  };
}

export default useApp;
