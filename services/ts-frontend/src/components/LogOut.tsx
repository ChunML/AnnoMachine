import React, { useEffect } from "react";
import { Link } from "react-router-dom";

interface LogOutProps {
  onLogoutUser(): void;
}

function LogOut(props: LogOutProps) {
  useEffect(() => {
    const { onLogoutUser } = props;
    onLogoutUser();
  }, []);

  return (
    <div
      className="ui center aligned container"
      style={{ margin: "30px auto" }}
    >
      <p>
        You are logged out. Click <Link to="/login">here</Link> to log back in.
      </p>
    </div>
  );
}

export default LogOut;
