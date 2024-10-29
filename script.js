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
    const selectedServers1 = document.getElementById("selectedServers1");
    const selectedServers2 = document.getElementById("selectedServers2");
    const comparisonResult = document.getElementById("comparisonResult");
    const listTab = document.getElementById("listTab");
    const compareTab = document.getElementById("compareTab");
    const listSection = document.getElementById("listSection");
    const compareSection = document.getElementById("compareSection");

    const totalMembers = allServers.reduce(
      (sum, server) => sum + server.members,
      0
    );

    let selectedServersArray1 = [];
    let selectedServersArray2 = [];

    const updateStats = () => {
      totalServersElement.textContent = allServers.length.toLocaleString();
      totalMembersElement.textContent = totalMembers.toLocaleString();
    };

    function formatNumber(num) {
      return num.toLocaleString();
    }

    function toggleServerSelection(server, group) {
      const array = group === 1 ? selectedServersArray1 : selectedServersArray2;
      const index = array.findIndex((s) => s.name === server.name);
      if (index === -1) {
        if (array.length < 5) {
          array.push(server);
        } else {
          alert(
            `Puedes seleccionar un máximo de 5 servidores para el Grupo ${group}.`
          );
          return;
        }
      } else {
        array.splice(index, 1);
      }
      updateSelectedServers();
      updateComparisonResult();
    }

    function updateSelectedServers() {
      updateSelectedServerGroup(selectedServers1, selectedServersArray1, 1);
      updateSelectedServerGroup(selectedServers2, selectedServersArray2, 2);
    }

    function updateSelectedServerGroup(element, array, group) {
      element.innerHTML = "";
      array.forEach((server) => {
        const serverElement = document.createElement("div");
        serverElement.className =
          "bg-gray-700 rounded-lg p-4 flex justify-between items-center";
        serverElement.innerHTML = `
          <div>
            <h3 class="font-semibold text-lg">${server.name}</h3>
            <p class="text-sm text-gray-400">Miembros: ${formatNumber(
              server.members
            )}</p>
          </div>
          <button class="text-red-500 hover:text-red-700" onclick="removeServer('${
            server.name
          }', ${group})">Eliminar</button>
        `;
        element.appendChild(serverElement);
      });
    }

    function updateComparisonResult() {
      if (
        selectedServersArray1.length > 0 ||
        selectedServersArray2.length > 0
      ) {
        comparisonResult.classList.remove("hidden");
        const group1Total = selectedServersArray1.reduce(
          (sum, server) => sum + server.members,
          0
        );
        const group2Total = selectedServersArray2.reduce(
          (sum, server) => sum + server.members,
          0
        );
        const grandTotal = group1Total + group2Total;

        comparisonResult.innerHTML = `
          <h3 class="text-2xl font-bold mb-6 text-center">Resultados de la comparación</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="comparison-card rounded-lg p-6">
              <h4 class="text-xl font-semibold mb-4">Grupo 1</h4>
              ${generateComparisonHTML(
                selectedServersArray1,
                group1Total,
                grandTotal
              )}
            </div>
            <div class="comparison-card rounded-lg p-6">
              <h4 class="text-xl font-semibold mb-4">Grupo 2</h4>
              ${generateComparisonHTML(
                selectedServersArray2,
                group2Total,
                grandTotal
              )}
            </div>
          </div>
          <div class="mt-8 text-center">
            <h4 class="text-xl font-semibold mb-2">Comparación entre grupos</h4>
            <p class="text-lg">
              Grupo 1: ${formatNumber(group1Total)} miembros (${(
          (group1Total / grandTotal) *
          100
        ).toFixed(2)}%)
            </p>
            <p class="text-lg">
              Grupo 2: ${formatNumber(group2Total)} miembros (${(
          (group2Total / grandTotal) *
          100
        ).toFixed(2)}%)
            </p>
            <div class="w-full bg-gray-700 rounded-full h-4 mt-2">
              <div class="bg-blue-600 h-4 rounded-full" style="width: ${
                (group1Total / grandTotal) * 100
              }%"></div>
            </div>
          </div>
        `;
      } else {
        comparisonResult.classList.add("hidden");
      }
    }

    function generateComparisonHTML(servers, groupTotal, grandTotal) {
      return servers
        .map(
          (server) => `
        <div class="mb-4">
          <h5 class="font-semibold">${server.name}</h5>
          <p class="text-sm mb-1">Miembros: ${formatNumber(server.members)}</p>
          <p class="text-sm mb-2">
            ${((server.members / groupTotal) * 100).toFixed(2)}% del grupo, 
            ${((server.members / grandTotal) * 100).toFixed(2)}% del total
          </p>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full" style="width: ${
              (server.members / groupTotal) * 100
            }%"></div>
          </div>
        </div>
      `
        )
        .join("");
    }

    function renderServers(searchTerm = "") {
      const filteredServers = allServers.filter((server) =>
        server.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      serverList.innerHTML = "";
      noResults.classList.toggle("hidden", filteredServers.length > 0);

      filteredServers.forEach((server, index) => {
        const card = document.createElement("div");
        const percentageDomination = (
          (server.members / totalMembers) *
          100
        ).toFixed(2);

        card.className =
          "server-card rounded-lg p-6 flex items-center relative overflow-hidden transition-all duration-300 ease-in-out hover:bg-blue-900 hover:bg-opacity-10";

        card.innerHTML = `
          <div class="flex-grow">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-xl font-bold text-white">${server.name}</h2>
              <span class="text-lg font-bold text-blue-500">#${index + 1}</span>
            </div>
            <p class="text-gray-400 mb-2">
              <span class="text-sm">Miembros:</span> 
              <span class="font-semibold">${formatNumber(server.members)}</span>
            </p>
            <div class="w-full">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-semibold text-gray-400">Dominio</span>
                <span class="text-sm font-bold text-blue-400">${percentageDomination}%</span>
              </div>
              <div class="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 progress-bar" style="width: ${percentageDomination}%"></div>
              </div>
            </div>
          </div>
          <div class="ml-4 flex flex-col  space-y-2">
            <button class="bg-blue-500 text-white px-3 py-1 rounded text-xs compare-btn" onclick="toggleServerSelection(${JSON.stringify(
              server
            ).replace(/"/g, "&quot;")}, 1)">
              Grupo 1
            </button>
            <button class="bg-purple-500 text-white px-3 py-1 rounded text-xs compare-btn" onclick="toggleServerSelection(${JSON.stringify(
              server
            ).replace(/"/g, "&quot;")}, 2)">
              Grupo 2
            </button>
          </div>
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

    // Tab functionality
    listTab.addEventListener("click", () => {
      listTab.classList.add("active");
      compareTab.classList.remove("active");
      listSection.classList.remove("hidden");
      compareSection.classList.add("hidden");
    });

    compareTab.addEventListener("click", () => {
      compareTab.classList.add("active");
      listTab.classList.remove("active");
      compareSection.classList.remove("hidden");
      listSection.classList.add("hidden");
    });

    // Expose functions to window for onclick events
    window.toggleServerSelection = toggleServerSelection;
    window.removeServer = (serverName, group) => {
      const array = group === 1 ? selectedServersArray1 : selectedServersArray2;
      const index = array.findIndex((s) => s.name === serverName);
      if (index !== -1) {
        array.splice(index, 1);
        updateSelectedServers();
        updateComparisonResult();
      }
    };
  })
  .catch((error) => console.error("Error fetching server data:", error));
