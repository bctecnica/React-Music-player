import React, { useState, useRef, useEffect } from "react";

//Import Components
import Controls from "./Controls";
import Song from "./Song";
import Library from "./Library";
import Queue from "./Queue";
import Nav from "./Nav";
import ToastContainer from "./ToastContainer";

//Import data
import playList from "../playlist";

function Player() {
	const audioRef = useRef(null);
	const [songs, setSongs] = useState(playList());
	const [queuedSongs, setQueuedSongs] = useState([]);
	const [currentSong, setCurrentSong] = useState(songs[0]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [songInfo, setSongInfo] = useState({
		currentTime: 0,
		duration: 0,
		animationPercentage: 0,
		volume: 0,
	});
	const [isLibraryOpen, setisLibraryOpen] = useState(false);
	const [isQueueOpen, setisQueueOpen] = useState(false);
	const [toasts, setToasts] = useState([]);

	useEffect(() => {
		document.documentElement.style.removeProperty("--bg-color");
	}, []);

	const timeUpdateHandler = (e) => {
		const current = e.target.currentTime;
		const duration = e.target.duration;

		const roundedCurrent = Math.round(current);
		const roundedDuration = Math.round(duration);
		const percentage = Math.round((roundedCurrent / roundedDuration) * 100);
		setSongInfo({
			...songInfo,
			currentTime: current,
			duration: duration,
			animationPercentage: percentage,
			volume: e.target.volume,
		});
	};

	const playNextQueuedSong = () => {
		const nextSong = queuedSongs[0];
		setCurrentSong(nextSong);

		// Update active state for songs when playing from queue
		const newSongs = songs.map((song) => ({
			...song,
			active: song.name === nextSong.name && song.artist === nextSong.artist,
		}));
		setSongs(newSongs);

		setQueuedSongs(queuedSongs.slice(1));
		setTimeout(() => {
			audioRef.current.play();
		}, 500);
		setIsPlaying(true);
	};

	const songEndHandler = async () => {
		if (queuedSongs.length > 0) {
			playNextQueuedSong();
		} else {
			setIsPlaying(false);
			audioRef.current.currentTime = 0;
		}
	};

	const showToast = (message) => {
		const id = Date.now();
		setToasts((prevToasts) => [...prevToasts, { id, message }]);
	};

	const removeToast = (id) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
	};

	return (
		<div
			className={`application ${isLibraryOpen ? "library-active" : ""} ${
				isQueueOpen ? "queue-active" : ""
			}`}
		>
			<Nav
				isLibraryOpen={isLibraryOpen}
				setisLibraryOpen={setisLibraryOpen}
				isQueueOpen={isQueueOpen}
				setisQueueOpen={setisQueueOpen}
			/>
			<Song isPlaying={isPlaying} currentSong={currentSong} />
			<Controls
				audioRef={audioRef}
				setIsPlaying={setIsPlaying}
				currentSong={currentSong}
				isPlaying={isPlaying}
				songInfo={songInfo}
				setSongInfo={setSongInfo}
				songs={songs}
				setSongs={setSongs}
				setCurrentSong={setCurrentSong}
				queuedSongs={queuedSongs}
				playNextQueuedSong={playNextQueuedSong}
			/>
			<Library
				songs={songs}
				setCurrentSong={setCurrentSong}
				audioRef={audioRef}
				setIsPlaying={setIsPlaying}
				isPlaying={isPlaying}
				setSongs={setSongs}
				isLibraryOpen={isLibraryOpen}
				queuedSongs={queuedSongs}
				setQueuedSongs={setQueuedSongs}
				onSongAddedToQueue={showToast}
			/>
			<Queue
				queuedSongs={queuedSongs}
				isPlaying={isPlaying}
				isQueueOpen={isQueueOpen}
				setQueuedSongs={setQueuedSongs}
				audioRef={audioRef}
				playNextQueuedSong={playNextQueuedSong}
			/>
			<ToastContainer toasts={toasts} removeToast={removeToast} />
			<audio
				onLoadedMetadata={timeUpdateHandler}
				onTimeUpdate={timeUpdateHandler}
				ref={audioRef}
				src={currentSong.audio.default || currentSong.audio}
				onEnded={songEndHandler}
			></audio>
		</div>
	);
}

export default Player;
