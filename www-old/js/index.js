function onLoaded() {
	var source = new EventSource("/public");
	source.onmessage = function (event) {
		jsn = JSON.parse(event.data)
		player = document.getElementById("player")
		player.innerHTML = jsn["name"]
		player.style.color = jsn["textcolor"]
		player.style.backgroundColor = jsn["bgcolor"]
	}
}