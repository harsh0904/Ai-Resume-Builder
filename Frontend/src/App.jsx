import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addUserData } from "./features/user/userFeatures";
import { startUser } from "./Services/login";
import { resumeStore } from "./store/store";
import { Provider } from "react-redux";

function App() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.editUser.userData);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode == 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
          navigate("/auth/sign-in");
        }
      } catch (error) {
        console.log("Got Error while fetching user from app", error.message);
        dispatch(addUserData(""));
        navigate("/auth/sign-in");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResponse();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <>
      <Provider store={resumeStore}>
        <Header user={user} />
        <Outlet />
        <Toaster />
      </Provider>
    </>
  );
}

export default App;
