const banderas = {
    "Argentina": "🇦🇷",
    "España": "🇪🇸",
    "Estados Unidos": "🇺🇸",
    "Francia": "🇫🇷",
    "Italia": "🇮🇹",
    "Alemania": "🇩🇪",
    "Reino Unido": "🇬🇧",
    "Japón": "🇯🇵",
    "Brasil": "🇧🇷",
    "México": "🇲🇽",
    "Colombia": "🇨🇴",
    "Perú": "🇵🇪",
    "Venezuela": "🇻🇪",
    "Chile": "🇨🇱",
    "Ecuador": "🇪🇨",
    "Bolivia": "🇧🇴",
    "Paraguay": "🇵🇾",
    "Uruguay": "🇺🇾",
    "Costa Rica": "🇨🇷",
    "Panamá": "🇵🇦",
    "Guatemala": "🇬🇹",
    "Honduras": "🇭🇳",
    "El Salvador": "🇸🇻",
    "Nicaragua": "🇳🇮",
    "República Dominicana": "🇩🇴",
    "Cuba": "🇨🇺",
    "Puerto Rico": "🇵🇷",
    // Agregar más países y sus banderas emoji aquí según sea necesario
  };

function calcularEdad(fechaNacimiento, fechaActual) {
    const [diaNac, mesNac, anioNac] = fechaNacimiento.split('/').map(Number);
    const [diaActual, mesActual, anioActual] = fechaActual.split('/').map(Number);

    // Crear objetos de fecha
    const nacimiento = new Date(anioNac, mesNac - 1, diaNac);
    const actual = new Date(anioActual, mesActual - 1, diaActual);

    // Calcular la diferencia de tiempo en milisegundos
    let diferencia = actual.getTime() - nacimiento.getTime();

    // Convertir la diferencia en años
    let edad = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25));

    return edad;
}

const buscarEquipos = (data) => {
    if(JSON.stringify(data)!="null") {
        return data
    }
    return null;
}

fetch('./db.json')
    .then(response => response.json())
    .then(data => {
        const db = buscarEquipos(data);
        console.log(db);

        const equipos = db.equipos;
        const container = document.getElementById('imageContainer');
        let selectedImage = null;

        equipos.forEach((equipo, index) => {
            if (index % 10 === 0 && index !== 0) {
                const rowBreak = document.createElement('div');
                rowBreak.classList.add('w-100');
                container.appendChild(rowBreak);
            }

            const col = document.createElement('div');
            col.className = 'col';

            const img = document.createElement('img');
            img.src = equipo.escudo.src;
            img.alt = equipo.escudo.alt;
            img.className = 'img-thumbnail';
            if (equipo.escudo.style) {
                img.style.cssText = equipo.escudo.style;
            }

            img.addEventListener('click', (event) => {
                selectEquipo(equipo, event.target);
            });

            col.appendChild(img);
            container.appendChild(col);

            if (index === 0) {
                selectedImage = img;
                selectEquipo(equipo, img);
            }
        });

        function selectEquipo(equipo, imgElement) {
            const jugadoresEquipo = equipo.jugadores;
            console.log(jugadoresEquipo);

            const tableBody = document.querySelector("#teamTable tbody");
            tableBody.innerHTML = ''; // Limpiar el contenido existente

            jugadoresEquipo.forEach(player => {
                const row = document.createElement("tr");

                const dorsalCell = document.createElement("td");
                dorsalCell.textContent = player.dorsal === null ? "" : player.dorsal;
                row.appendChild(dorsalCell);

                const nationalityCell = document.createElement("td");
                nationalityCell.textContent = banderas[player.nacionalidad];
                row.appendChild(nationalityCell);

                const nameCell = document.createElement("td");
                nameCell.textContent = player.nombre;
                row.appendChild(nameCell);

                const birthdateCell = document.createElement("td");
                birthdateCell.textContent = calcularEdad(player.nacimiento, "01/06/2001");
                row.appendChild(birthdateCell);

                const positionCell = document.createElement("td");
                positionCell.textContent = player.posicion;
                row.appendChild(positionCell);

                tableBody.appendChild(row);
            });

            // Actualizar la card con la información del equipo
            document.getElementById('teamImage').src = equipo.camisetas.src;
            document.getElementById('teamImage').alt = equipo.escudo.alt;
            document.getElementById('teamName').textContent = equipo.nombre;
            document.getElementById('teamNickname').textContent = equipo.apodo;
            document.getElementById('teamColors').textContent = equipo.colores;
            document.getElementById('teamFoundation').textContent = equipo.fundacion;
            document.getElementById('teamStadium').textContent = equipo.estadio;
            document.getElementById('teamCapacity').textContent = equipo.capacidad.toLocaleString('de-DE');
            document.getElementById('teamBudget').textContent = equipo.presupuesto.toLocaleString();
            document.getElementById('teamAverage').textContent = equipo.media;

            if (selectedImage) {
                selectedImage.classList.remove('selected');
            }
            imgElement.classList.add('selected');
            selectedImage = imgElement;
        }
    })
    .catch(err => console.log(err));