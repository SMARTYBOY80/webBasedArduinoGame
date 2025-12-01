const leaderboardText = document.getElementById("leaderboard");

async function loadLeaderboard() {
	try {
		const response = await fetch("/api/leaderboard");
		const data = await response.json();

		// Clear previous
		leaderboardText.innerHTML = "";

		const scores = data;

		// Sort highest first
		scores.sort((a, b) => b.score - a.score);

		// Show top 10
		scores.slice(0, 10).forEach((player, index) => {
			const row = document.createElement("p");
			row.innerText = `${index + 1}. ${player.name} — ${player.score}`;
			leaderboardText.appendChild(row);
		});
	} catch (error) {
		console.error("Error loading leaderboard:", error);
		leaderboardText.innerText = "Failed to load leaderboard.";
	}
}

loadLeaderboard();
