import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faList } from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../contexts/LoginContext";

const Nav = ({
	setisLibraryOpen,
	isLibraryOpen,
	setisQueueOpen,
	isQueueOpen,
}) => {
	const { userName, previouslyLoggedIn } = useContext(LoginContext);
	const openLibraryHandler = () => {
		setisLibraryOpen(!isLibraryOpen);
	};
	const openQueueHandler = () => {
		setisQueueOpen(!isQueueOpen);
	};

	return (
		<nav>
			<button
				className={isLibraryOpen ? "library--open" : ""}
				onClick={openLibraryHandler}
			>
				Library
				<FontAwesomeIcon icon={faMusic}></FontAwesomeIcon>
			</button>
			{previouslyLoggedIn ? (
				<h1>Welcome back, {userName}</h1>
			) : (
				<h1>Hey {userName}, enjoy my little react music app </h1>
			)}
			<button
				className={`nav__queue-trigger ${isQueueOpen ? "queue--open" : ""}`}
				onClick={openQueueHandler}
			>
				Queue
				<FontAwesomeIcon icon={faList}></FontAwesomeIcon>
			</button>
		</nav>
	);
};

export default Nav;
