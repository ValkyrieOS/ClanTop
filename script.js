// Fetch the server data from the JSON file
fetch("lista_completa_servidores.json")
  .then((response) => response.json())
  .then((data) => {
    const allServers = data;
    const searchInput = document.getElementById("searchInput");
    const serverList = document.getElementById("serverList");
    const noResults = document.getElementById("noResults");
    const totalServersElement = document.getElementById("totalServers");
    const totalMembersElement = document.getElementById("totalMembers");

    const totalMembers = allServers.reduce(
      (sum, server) => sum + server.members,
      0
    );

    const updateStats = () => {
      totalServersElement.textContent = allServers.length.toLocaleString();
      totalMembersElement.textContent = totalMembers.toLocaleString();
    };

    function formatNumber(num) {
      return num.toLocaleString();
    }

    function getTopClass(index) {
      if (index === 0) return "border-yellow-400";
      if (index === 1) return "border-gray-400";
      if (index === 2) return "border-orange-400";
      if (index < 5) return "border-purple-400";
      return "border-blue-500";
    }

    function getHoverColor(index) {
      if (index === 0) return "hover:bg-yellow-900 hover:bg-opacity-20";
      if (index === 1) return "hover:bg-gray-700 hover:bg-opacity-30";
      if (index === 2) return "hover:bg-orange-900 hover:bg-opacity-20";
      if (index < 5) return "hover:bg-purple-900 hover:bg-opacity-20";
      return "hover:bg-blue-900 hover:bg-opacity-10";
    }

    function renderServers(searchTerm = "") {
      const filteredServers = allServers.filter((server) =>
        server.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      serverList.innerHTML = "";
      noResults.classList.toggle("hidden", filteredServers.length > 0);

      filteredServers.forEach((server) => {
        const card = document.createElement("div");
        const percentageDomination = (
          (server.members / totalMembers) *
          100
        ).toFixed(2);

        const originalIndex = allServers.findIndex(
          (s) => s.name === server.name
        );
        const topClass = getTopClass(originalIndex);
        const hoverClass = getHoverColor(originalIndex);

        card.className = `server-card rounded-lg p-6 flex items-center ${topClass} ${hoverClass} ${
          originalIndex < 5 ? "top-5" : ""
        } relative overflow-hidden transition-all duration-300 ease-in-out`;

        card.innerHTML = `
          <div class="rank-circle flex-shrink-0 w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mr-6 transition-all duration-300">
            <span class="text-2xl font-bold ${
              originalIndex === 0
                ? "text-yellow-400"
                : originalIndex === 1
                ? "text-gray-400"
                : originalIndex === 2
                ? "text-orange-400"
                : originalIndex < 5
                ? "text-purple-400"
                : "text-blue-500"
            }">#${originalIndex + 1}</span>
          </div>
          <div class="flex-grow">
            <h2 class="text-xl font-bold mb-2 text-white transition-all duration-300">${
              server.name
            }</h2>
            <p class="text-gray-400 mb-2 transition-all duration-300">
              <span class="text-sm">Miembros:</span> 
              <span class="font-semibold">${formatNumber(server.members)}</span>
            </p>
            <div class="w-full">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-semibold text-gray-400 transition-all duration-300">Dominio</span>
                <span class="text-sm font-bold text-blue-400 transition-all duration-300">${percentageDomination}%</span>
              </div>
              <div class="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 progress-bar transition-all duration-500 ease-in-out" style="width: ${percentageDomination}%"></div>
              </div>
            </div>
          </div>
          ${
            originalIndex < 20
              ? '<span class="ml-4 px-3 py-1 bg-blue-500 bg-opacity-30 rounded-full text-xs font-semibold text-blue-300 transition-all duration-300">Top 20</span>'
              : ""
          }
        `;

        serverList.appendChild(card);
      });
    }

    // Initial render
    updateStats();
    renderServers();

    // Search functionality
    searchInput.addEventListener("input", (e) => {
      renderServers(e.target.value);
    });
  })
  .catch((error) => console.error("Error fetching server data:", error));
