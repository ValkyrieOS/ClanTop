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

    function calculatePercentages(server, listTotal) {
      return {
        percentageOfList: ((server.members / listTotal) * 100).toFixed(2),
        percentageDomination: ((server.members / totalMembers) * 100).toFixed(
          2
        ),
      };
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
          "bg-gray-800 rounded-lg p-4 flex justify-between items-center mb-2 transition-all duration-300 hover:bg-gray-700";
        serverElement.innerHTML = `
          <div>
            <h3 class="font-semibold text-lg text-white">${server.name}</h3>
            <p class="text-sm text-gray-400">Miembros: ${formatNumber(
              server.members
            )}</p>
          </div>
          <button class="text-red-400 hover:text-red-600 transition-colors duration-300" 
                  onclick="removeServer('${server.name}', ${group})"
                  aria-label="Eliminar ${server.name} del Grupo ${group}">
            Eliminar
          </button>
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
        const groupResults = [selectedServersArray1, selectedServersArray2].map(
          (group, index) => {
            const groupTotal = group.reduce(
              (sum, server) => sum + server.members,
              0
            );
            const groupDomination = group.reduce(
              (sum, server) => sum + (server.members / totalMembers) * 100,
              0
            );
            return {
              groupTotal,
              groupDomination,
              servers: group,
              index: index + 1,
            };
          }
        );

        const grandTotal = groupResults.reduce(
          (sum, group) => sum + group.groupTotal,
          0
        );

        comparisonResult.innerHTML = `
          <h3 class="text-2xl font-bold mb-6 text-center text-white">Resultados de la comparación</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            ${groupResults
              .map(
                (group) => `
              <div class="comparison-card rounded-lg p-6 bg-gray-800 shadow-lg">
                <h4 class="text-xl font-semibold mb-4 text-white">Grupo ${
                  group.index
                }</h4>
                ${generateComparisonHTML(
                  group.servers,
                  group.groupTotal,
                  grandTotal,
                  totalMembers
                )}
              </div>
            `
              )
              .join("")}
          </div>
          <div class="mt-8 text-center">
            <h4 class="text-xl font-semibold mb-2 text-white">Comparación entre grupos</h4>
            ${groupResults
              .map(
                (group) => `
              <p class="text-lg text-gray-300 mb-2">
                Grupo ${group.index}: ${formatNumber(
                  group.groupTotal
                )} miembros 
                (${((group.groupTotal / grandTotal) * 100).toFixed(
                  2
                )}% del total comparado, 
                ${group.groupDomination.toFixed(2)}% de dominio)
              </p>
            `
              )
              .join("")}
            <div class="w-full bg-gray-700 rounded-full h-4 mt-4">
              <div class="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out" 
                   style="width: ${
                     (groupResults[0].groupTotal / grandTotal) * 100
                   }%"></div>
            </div>
          </div>
        `;
      } else {
        comparisonResult.classList.add("hidden");
      }
    }

    function generateComparisonHTML(
      servers,
      groupTotal,
      grandTotal,
      totalMembers
    ) {
      return servers
        .map(
          (server) => `
        <div class="mb-4 p-4 bg-gray-700 rounded-lg transition-all duration-300 hover:bg-gray-600">
          <h5 class="font-semibold text-white">${server.name}</h5>
          <p class="text-sm mb-1 text-gray-300">Miembros: ${formatNumber(
            server.members
          )}</p>
          <p class="text-sm mb-2 text-gray-400">
            ${((server.members / groupTotal) * 100).toFixed(2)}% del grupo, 
            ${((server.members / grandTotal) * 100).toFixed(
              2
            )}% del total comparado,
            ${((server.members / totalMembers) * 100).toFixed(2)}% de dominio
          </p>
          <div class="w-full bg-gray-600 rounded-full h-2 mb-2">
            <div class="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out" 
                 style="width: ${(server.members / groupTotal) * 100}%"></div>
          </div>
          <div class="w-full bg-gray-600 rounded-full h-2">
            <div class="bg-purple-500 h-2 rounded-full transition-all duration-500 ease-in-out" 
                 style="width: ${(server.members / totalMembers) * 100}%"></div>
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

      const listTotal = filteredServers.reduce(
        (sum, server) => sum + server.members,
        0
      );

      filteredServers.forEach((server, index) => {
        const { percentageOfList, percentageDomination } = calculatePercentages(
          server,
          listTotal
        );

        const card = document.createElement("div");
        card.className =
          "server-card rounded-lg p-6 bg-gray-800 shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-700 mb-4";
        card.innerHTML = `
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">${server.name}</h2>
            <span class="text-lg font-bold text-blue-400">#${index + 1}</span>
          </div>
          <p class="text-gray-300 mb-4">
            <span class="text-sm">Miembros:</span> 
            <span class="font-semibold">${formatNumber(server.members)}</span>
          </p>
          <div class="space-y-4">
            ${generateProgressBar(
              "% de la lista",
              percentageOfList,
              "from-purple-500 to-pink-500"
            )}
            ${generateProgressBar(
              "Dominio",
              percentageDomination,
              "from-blue-500 to-green-500"
            )}
          </div>
          <div class="mt-4 flex justify-end space-x-2">
            ${generateGroupButton(server, 1, "bg-blue-500 hover:bg-blue-600")}
            ${generateGroupButton(
              server,
              2,
              "bg-purple-500 hover:bg-purple-600"
            )}
          </div>
        `;

        serverList.appendChild(card);
      });
    }

    function generateProgressBar(label, percentage, gradientColors) {
      return `
        <div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm font-semibold text-gray-400">${label}</span>
            <span class="text-sm font-bold text-white">${percentage}%</span>
          </div>
          <div class="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r ${gradientColors} transition-all duration-500 ease-in-out" 
                 style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    }

    function generateGroupButton(server, group, bgColor) {
      return `
        <button class="${bgColor} text-white px-3 py-1 rounded text-xs transition-colors duration-300"
                onclick="toggleServerSelection(${JSON.stringify(server).replace(
                  /"/g,
                  "&quot;"
                )}, ${group})"
                aria-label="Añadir ${server.name} al Grupo ${group}">
          Grupo ${group}
        </button>
      `;
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
