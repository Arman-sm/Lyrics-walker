const lyricsGUI = document.getElementById("lyricsGUI")

window.lyricsID = 0

document.getElementById("lyricsFile").addEventListener("change", function() {
	window.lyricsID += 1
	const reader = new FileReader()
	reader.onload = function() {
		window.lyrics = new Lyrics(reader.result)
		lyricsGUI.innerHTML = "<div data-time='0'></div>"
		for ([index, line] of window.lyrics.lyrics.entries()) {
			lyricsGUI.innerHTML += 
				`<span data-time="${line.second}">${line.content}</span>`
		}

		window.currentLyricsElement = document.querySelector("#lyricsGUI :nth-child(1)")

		setTimeout(() => updateLyrics(window.lyricsID), window.currentLyricsElement.nextSibling.getAttribute("data-time") * 1000)
	}
	
	reader.readAsText(this.files[0])
})

function updateLyrics(operatingLyricsID) {
	if (window.lyricsID != operatingLyricsID)
		return

	const nextElement = window.currentLyricsElement.nextSibling
	if (!nextElement)
		return

	window.currentLyricsElement.classList.toggle("lyrics-focused", false)
	nextElement.classList.toggle("lyrics-focused", true)

	const nextLinesTime = nextElement.getAttribute("data-time")
	const currentLinesTime = window.currentLyricsElement.getAttribute("data-time")

	nextElement.scrollIntoView({block:"center", behavior:"smooth"})

	window.currentLyricsElement = nextElement
	setTimeout(() => updateLyrics(operatingLyricsID), (nextLinesTime - currentLinesTime) * 1000);
}