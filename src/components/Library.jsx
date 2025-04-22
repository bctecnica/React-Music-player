import React from "react";
import LibrarySong from "./LibrarySong";

const Library = ({
	songs,
	setCurrentSong,
	audioRef,
	isPlaying,
	setIsPlaying,
	setSongs,
	isLibraryOpen,
	queuedSongs,
	setQueuedSongs,
	onSongAddedToQueue,
}) => {
	return (
		<div className={`library ${isLibraryOpen ? "library--active" : " "}`}>
			<h2 className="library__title">Library</h2>
			<div className="library__songs">
				{songs.map((song) => (
					<LibrarySong
						songs={songs}
						cover={song.cover}
						name={song.name}
						artist={song.artist}
						active={song.active}
						key={song.id}
						id={song.id}
						setCurrentSong={setCurrentSong}
						audioRef={audioRef}
						setIsPlaying={setIsPlaying}
						isPlaying={isPlaying}
						setSongs={setSongs}
						queuedSongs={queuedSongs}
						setQueuedSongs={setQueuedSongs}
						onSongAddedToQueue={onSongAddedToQueue}
					/>
				))}
			</div>
		</div>
	);
};

export default Library;
