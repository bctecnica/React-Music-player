import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlay,
	faAngleLeft,
	faAngleRight,
	faPause,
	faVolumeDown,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
	isPlaying,
	setIsPlaying,
	audioRef,
	songInfo,
	setSongInfo,
	currentSong,
	songs,
	setCurrentSong,
	setSongs,
	queuedSongs,
	playNextQueuedSong,
}) => {
	const [activeVolume, setActiveVolume] = useState(false);
	const activeLibraryHandler = (nextPrev) => {
		const newSongs = songs.map((song) => {
			if (song.id === nextPrev.id) {
				return {
					...song,
					active: true,
				};
			} else {
				return {
					...song,
					active: false,
				};
			}
		});

		setSongs(newSongs);
	};

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--track-color",
			currentSong.color[0]
		);
		document.documentElement.style.setProperty(
			"--thumb-color",
			currentSong.color[1]
		);
	}, [currentSong]);

	const trackAnim = {
		transform: `translateX(${songInfo.animationPercentage}%)`,
	};

	function getTime(time) {
		return (
			Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
		);
	}

	const dragHandler = (e) => {
		audioRef.current.currentTime = e.target.value;
		setSongInfo({ ...songInfo, currentTime: e.target.value });
	};

	const playAudio = () => {
		setTimeout(() => {
			audioRef.current.play();
		}, 1000);
	};

	const playSongHandler = () => {
		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(!isPlaying);
		} else {
			setIsPlaying(!isPlaying);
			playAudio();
		}
	};

	const skipTrackHandler = async (direction) => {
		let currentIndex = songs.findIndex((song) => song.id === currentSong.id);

		if (direction === "skip-forward") {
			if (queuedSongs.length > 0) {
				playNextQueuedSong();
			} else {
				// If no songs in queue, play next song in playlist
				await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
				activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
			}
		}

		if (direction === "skip-back") {
			if (currentIndex === -1) currentIndex = 1;
			if ((currentIndex - 1) % songs.length === -1) {
				await setCurrentSong(songs[songs.length - 1]);
				activeLibraryHandler(songs[songs.length - 1]);
				playAudio();
				return;
			}
			await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
			activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
		}
		if (isPlaying) audioRef.current.play();
	};

	const changeVolume = (e) => {
		let value = e.target.value;
		audioRef.current.volume = value;
		setSongInfo({ ...songInfo, volume: value });
	};

	return (
		<div className="player">
			<div className="time-control">
				<p>{getTime(songInfo.currentTime)}</p>
				<div
					style={{
						background: `linear-gradient(to right, ${currentSong.color[0]},${currentSong.color[1]})`,
					}}
					className="track"
				>
					<input
						className="track-input"
						value={songInfo.currentTime}
						type="range"
						max={songInfo.duration || 0}
						min={0}
						onChange={dragHandler}
					/>
					<div style={trackAnim} className="animate-track"></div>
				</div>
				<p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
			</div>
			<div className="play-control">
				<FontAwesomeIcon
					onClick={() => skipTrackHandler("skip-back")}
					className="skip-back"
					size="2x"
					icon={faAngleLeft}
				/>
				<FontAwesomeIcon
					onClick={playSongHandler}
					className="play"
					size="2x"
					icon={isPlaying ? faPause : faPlay}
				/>
				<FontAwesomeIcon
					className="skip-forward"
					size="2x"
					icon={faAngleRight}
					onClick={() => skipTrackHandler("skip-forward")}
				/>
				<FontAwesomeIcon
					onClick={() => setActiveVolume(!activeVolume)}
					icon={faVolumeDown}
				/>
				{activeVolume && (
					<div className="volume-input">
						<input
							onChange={changeVolume}
							value={songInfo.volume}
							max="1"
							min="0"
							step="0.01"
							type="range"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Player;
