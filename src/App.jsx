import React, { useState, useEffect, useRef } from "react";
import "./styles/app.scss";

//Import Components
import Login from "./components/Login";
import Player from "./components/Player";

//Import Context
import { LoginContext } from "./contexts/LoginContext";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userName, setUserName] = useState("'I don't remember my name'");
	const [previouslyLoggedIn, setPreviouslyLoggedIn] = useState(false);
	const isFirstMount = useRef(true);

	useEffect(() => {
		document.documentElement.style.setProperty("--bg-color", "#1a1a1a");
		const storedUserName = localStorage.getItem("userName");
		if (storedUserName) {
			setUserName(storedUserName);
			setIsLoggedIn(true);
			setPreviouslyLoggedIn(true);
		}
	}, []);

	useEffect(() => {
		if (isFirstMount.current) {
			isFirstMount.current = false;
			return;
		}
		localStorage.setItem("userName", userName);
	}, [userName]);

	return (
		<LoginContext.Provider
			value={{
				isLoggedIn,
				setIsLoggedIn,
				userName,
				setUserName,
				previouslyLoggedIn,
			}}
		>
			<div>{!isLoggedIn && <Login />}</div>
			<div
				style={{
					animation: isLoggedIn ? "fadeIn 1.2s" : "none",
				}}
			>
				{isLoggedIn && <Player />}
			</div>
		</LoginContext.Provider>
	);
}

export default App;
