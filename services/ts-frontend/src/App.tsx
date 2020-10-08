import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar";
import Container from "./components/Container";
import RegisterLoginForm from "./components/RegisterLoginForm";
import LogOut from "./components/LogOut";
import Message from "./components/Message";

export interface MessageType {
  type: null | string;
  text: null | string;
}

interface AppState {
  isAuthenticated: boolean;
  images: ImageType[];
  isLoading: boolean;
  message: MessageType;
  selectedTab: string;
  currentUser: string;
}

interface UserType {
  username: string;
}

export interface BoxType {
  id: number;
  label: string;
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
}

export interface ImageType {
  id: number;
  name: string;
  width: number;
  height: number;
  user: UserType;
  boxes: BoxType[];
  uploaded_at: string;
}

function App(props: any) {
  const [images, setImages] = useState<ImageType[]>([]);
  const [currentUser, setCurrentUser] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [message, setMessage] = useState<MessageType>({
    type: null,
    text: null,
  });

  useEffect(() => {
    getLoginStatus();
    getImages();
  }, [currentUser]);

  const getLoginStatus = () => {
    const { authToken } = window.localStorage;
    fetch(`${process.env.REACT_APP_API_URL}/api/auth/check-status`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          setIsAuthenticated(true);
          setCurrentUser(res.username);
        } else {
          window.localStorage.removeItem("authToken");
        }
      });
  };

  const getImages = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/images/`)
      .then((res) => res.json())
      .then((res) => {
        setImages(res.data);
        setIsLoading(false);
      });
  };

  const handleImageUpload = ({
    image_url,
    image_file,
  }: {
    image_url: string;
    image_file: File;
  }) => {
    const data = new FormData();
    data.append("image_file", image_file);
    data.append("image_url", image_url);
    setIsLoading(true);
    const { authToken } = window.localStorage;
    fetch(`${process.env.REACT_APP_API_URL}/api/images/`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        getImages();
        if (res.status === "fail") {
          throw new Error("Upload failed");
        }
        createMessage("success", "Image has been successfully uploaded.");
      })
      .catch((err) => {
        createMessage("error", "Something went wrong with the uploading.");
        setIsLoading(false);
      });
  };

  const handleDeleteImage = (imageName: string) => {
    const { authToken } = window.localStorage;
    fetch(`${process.env.REACT_APP_API_URL}/api/images/${imageName}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          getImages();
        }
      });
  };

  const handleTabChange = (selectedTab: string) => {
    setSelectedTab(selectedTab);
  };

  const handleRegisterLoginUser = (formData: any, formType: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/auth/${formType}`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.auth_token !== undefined) {
          window.localStorage.setItem("authToken", res.auth_token);
          setIsAuthenticated(true);
          setCurrentUser(res.username);
          createMessage(
            "success",
            `Successfully ${
              formType === "register" ? "registered" : "logged in"
            }.`
          );
        } else {
          throw new Error("Error with authentication");
        }
      })
      .catch((err) => {
        createMessage("error", `Something went wrong. Could not ${formType}.`);
      });
  };

  const createMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => resetMessage(), 5000);
  };

  const resetMessage = () => {
    setMessage({ type: null, text: null });
  };

  const handleLogoutUser = () => {
    window.localStorage.removeItem("authToken");
    setCurrentUser("");
    setIsAuthenticated(false);
  };

  return (
    <React.Fragment>
      <NavBar title="AnnoMachine" isAuthenticated={isAuthenticated} />
      {message.type && message.text && (
        <Message type={message.type} text={message.text} />
      )}
      <Switch>
        <Route
          path="/images"
          render={() => (
            <Container
              onButtonClick={handleImageUpload}
              images={images}
              isLoading={isLoading}
              isAuthenticated={isAuthenticated}
              selectedTab={selectedTab}
              currentUser={currentUser}
              onTabChange={handleTabChange}
              onDeleteImage={handleDeleteImage}
              createMessage={createMessage}
            />
          )}
        />
        <Route
          exact
          path="/register"
          render={() => (
            <RegisterLoginForm
              isAuthenticated={isAuthenticated}
              formType="register"
              onButtonClick={handleRegisterLoginUser}
            />
          )}
        />
        <Route
          exact
          path="/login"
          render={() => (
            <RegisterLoginForm
              isAuthenticated={isAuthenticated}
              formType="login"
              onButtonClick={handleRegisterLoginUser}
            />
          )}
        />
        <Route
          exact
          path="/logout"
          render={() => <LogOut onLogoutUser={handleLogoutUser} />}
        />
        <Route exact path="/" render={() => <Redirect to="/images" />} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
