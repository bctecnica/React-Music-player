import React from "react";
import { v4 as uuidv4 } from "uuid";

const LibrarySong = ({
	name,
	artist,
	cover,
	id,
	setCurrentSong,
	songs,
	audioRef,
	isPlaying,
	setIsPlaying,
	setSongs,
	active,
	queuedSongs,
	setQueuedSongs,
	onSongAddedToQueue,
}) => {
	const songSelectHandler = () => {
		const selectedSong = songs.filter((state) => state.id === id);
		setCurrentSong({ ...selectedSong[0] });
		//Set Active in library
		const newSongs = songs.map((song) => {
			if (song.id === id) {
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

		setIsPlaying(true);
		setTimeout(() => {
			audioRef.current.play();
		}, 500);
	};

	const addSongToQueue = (e) => {
		e.stopPropagation();
		const selectedSong = songs.find((song) => song.id === id);
		const selectedSongWithUniqueId = {
			...selectedSong,
			id: uuidv4(), // Generate ID only when adding to queue
		};
		setQueuedSongs([...queuedSongs, selectedSongWithUniqueId]);
		onSongAddedToQueue(`Added "${name}" by ${artist} to your queue`);
	};
	return (
		<div
			onClick={songSelectHandler}
			className={`library-song ${active ? "selected" : ""}`}
		>
			<div className="library-song__image">
				<img src={cover} alt="" />
				{active && isPlaying && (
					<div className="library-song__playing">
						<div className="box box1"></div>
						<div className="box box2"></div>
						<div className="box box3"></div>
						<div className="box box4"></div>
						<div className="box box5"></div>
					</div>
				)}
			</div>
			<div className="library-song__description">
				<h3>{name}</h3>
				<h4>{artist}</h4>
			</div>
			<div onClick={addSongToQueue} className="library-song__add-to-queue">
				+
			</div>
		</div>
	);
};

export default LibrarySong;
