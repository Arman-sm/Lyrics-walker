class Lyrics {
	// raw lyrics in text format
	#rawLyrics
	// parsed metadata
	metadata = {}
	// parsed lyrics -> list[{second: number, content: string}]
	lyrics

	constructor(lyrics) {
		this.rawLyrics = lyrics
	}

	set rawLyrics(lyrics) {
		this.#rawLyrics = lyrics
		// eg. [ar:adele]
		// metadata[1] -> metadata name eg. "ar"
		// metadata[2] -> metadata data eg. "addle"
		for (const metadata of this.#rawLyrics.matchAll(/^\[([^0-9][^:]*):(.+)\]/gm)) {
			this.metadata[metadata[1]] = metadata[2]
		}

		this.lyrics = []
		//     [mm:ss.xx]...
		// eg. [00:06.08]Hello, it's me
		//      ^^                         minute(s)
		//         ^^^^^                   second(s)
		//               ^^^^^^^^^^^^^^    text
		for (const [, minutes, seconds, text,] of this.#rawLyrics.matchAll(/^\[([0-9]+):(.+)\](.*)/gm)) {
			this.lyrics.push({second: Number(minutes * 60) + Number(seconds), content: text})
		}
	}

	get rawLyrics() {
		return this.#rawLyrics
	}

	getInSeconds(seconds) {
		for (const [index, lyric] of this.lyrics.entries()) {
			if (seconds < lyric[0]) return {index: (index < 0 ? 0 : index -1), lyric: this.lyrics[index < 0 ? 0 : index -1]}
		}
	}
}