//constantes del DOM
const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque")
const sectionReiniciar = document.getElementById("reiniciar")
const botonMascotaJugador = document.getElementById("boton-mascota")
const botonReiniciar = document.getElementById("boton-reiniciar")
// Ocultar la sección de reinicio al principio del juego
sectionReiniciar.style.display = "none"

const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota")
const spanMascotaJugador = document.getElementById("mascota-jugador")
const spanMascotaEnemigo = document.getElementById("mascota-enemigo")
const spanVidasJugador = document.getElementById("vidas-jugador")
const spanVidasEnemigo = document.getElementById("vidas-enemigo")
const sectionMensajes = document.getElementById("resultado")
const ataquesDelJugador = document.getElementById("ataques-del-jugador")
const ataquesDelEnemigo = document.getElementById("ataques-del-enemigo")
const contenedorTarjetas = document.getElementById("contenedorTarjetas")
const contenedorAtaques = document.getElementById("contenedorAtaques")
const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

//variables globales
let jugadorId = null
let enemigoId = null
let mokepones = [] //array donde se almacenan o guardan las mascotas
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDeMokepones
let inputHipodoge
let inputCapipepo
let inputRatigueya
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMokepon
let ataquesMokeponEnemigo
let botonFuego
let botonAgua
let botonTierra
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = "media/mapa.webp"
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350
if (anchoDelMapa > anchoMaximoDelMapa) { anchoDelMapa = anchoMaximoDelMapa - 20 }
alturaQueBuscamos = anchoDelMapa * 600 / 800
mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = 0) {
        //atributos
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }
    //esto es un metodo
    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}
//instancias 
let hipodoge = new Mokepon("Hipodoge", "media/per.1.png", 5, "media/per.1.png")
let capipepo = new Mokepon("Capipepo", "media/per.2.png", 5, "media/per.2.png")
let ratigueya = new Mokepon("Ratigueya", "media/per.3.png", 5, "media/per.3.png")

//definimos ataques
const HIPODOGE_ATAQUES = [
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🌿", id: "boton-tierra" }
]

const CAPIPEPO_ATAQUES = [
    { nombre: "🌿", id: "boton-tierra" },
    { nombre: "🌿", id: "boton-tierra" },
    { nombre: "🌿", id: "boton-tierra" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" },
]

const RATIGUEYA_ATAQUES = [
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🌿", id: "boton-tierra" }
]


//se asignan ataques 
hipodoge.ataques.push(...HIPODOGE_ATAQUES)
capipepo.ataques.push(...CAPIPEPO_ATAQUES)
ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

//empuja o agrega mascotas al array 
mokepones.push(hipodoge, capipepo, ratigueya)

//Función principal que inicia el juego, oculta la sección de reinicio, muestra las opciones de Mokémon y añade eventos a los botones. 
function iniciarJuego() {
    
    sectionSeleccionarAtaque.style.display = "none";
    sectionVerMapa.style.display = "none";

 
    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre} />
        <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
        `;
        
        contenedorTarjetas.innerHTML += opcionDeMokepones;
        
        inputHipodoge = document.getElementById("Hipodoge");
        inputCapipepo = document.getElementById("Capipepo");
        inputRatigueya = document.getElementById("Ratigueya");
    })

    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);
    botonReiniciar.addEventListener("click", reiniciarJuego);
    //se llama una funcion
    unirseAlJuego();
}

//Función que se conecta al servidor para unirse al juego y obtener el ID del jugador. E
function unirseAlJuego() {
    fetch("http://192.168.18.11:8080/unirse")
    .then((res) => {
        if (res.ok) {
            res.text().then((respuesta) => {
                console.log(respuesta)
                jugadorId = respuesta
            })
        }
    })
}

//Función que captura la selección del Mokémon del jugador y lo envía al servidor. 
function seleccionarMascotaJugador() {
    //Esto es un condicional 
    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
    } else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        alert("Selecciona una mascota para empezar tu aventura ")
        return
    }
    sectionSeleccionarMascota.style.display = "none";
    seleccionarMokepon(mascotaJugador)
    extraerAtaques(mascotaJugador)
    sectionVerMapa.style.display = "flex"
    iniciarMapa()
}


// Esta función envía la selección del Mokémon del jugador al servidor.
function seleccionarMokepon(mascotaJugador) {
    fetch(`http://192.168.18.11:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
         body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

//Función que extrae los ataques de la mascota seleccionada y los muestra en pantalla. 
function extraerAtaques(mascotaJugador) {
    let ataques
    for (let i = 0; i < mokepones.length; i++) { 
        if (mascotaJugador === mokepones[i].nombre) { 
            ataques = mokepones[i].ataques 
        } 
    }

    mostrarAtaques(ataques)
}

// Función que crea botones para cada ataque del las mascotas
function mostrarAtaques(ataques) {
    ataques.forEach((ataque) => {
        ataquesMokepon = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMokepon
    })
    
    botonFuego = document.getElementById("boton-fuego")
    botonAgua = document.getElementById("boton-agua")
    botonTierra = document.getElementById("boton-tierra")
    botones = document.querySelectorAll(".BAtaque")

}

//función que añade eventos a los botones de ataque y envía los ataques seleccionados al servidor.
function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            if (e.target.textContent === "🔥") {
                ataqueJugador.push("FUEGO")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
                boton.disabled = true
            } else if (e.target.textContent === "💧") {
                ataqueJugador.push("AGUA")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
                boton.disabled = true
            } else {
                ataqueJugador.push("TIERRA")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
                boton.disabled = true
            }
            if (ataqueJugador.length === 5) { 
                enviarAtaques() 
            }
        })
    })
}

//Función que envía los ataques seleccionados al servidor
function enviarAtaques() {
    console.log("Enviar ataques", ataqueJugador)
    
    fetch(`http://192.168.18.11:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
             ataques: ataqueJugador 
            })
    })
    intervalo = setInterval(obtenerAtaques, 50)
}

//Función que recibe los ataques del enemigo del servidor. 
function obtenerAtaques() {
    console.log("OBTENER ATAQUES")
    
    fetch(`http://192.168.18.11:8080/mokepon/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                .then(function ({ ataques }) {
                    if (ataques.length === 5) {
                        ataqueEnemigo = ataques
                        combate()
                    }
                })
            }
        })
}

// Función para mostrar la información del Pokémon enemigo y 
// iniciar la secuencia de ataque.
function seleccionarMascotaEnemigo(enemigo) {
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
    secuenciaAtaque()
}
// Función para guardar los índices de los ataques 
// seleccionados por el jugador y el enemigo.
function indexAmbosOponente(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}
//Función que compara los ataques del jugador y enemigo y determina el ganador
function combate() {
    clearInterval(intervalo)
    console.log("COMBATE"); 
    
    for (let index = 0; index < ataqueJugador.length; index++) {
        
        if (ataqueJugador[index] === ataqueEnemigo[index]) {
            indexAmbosOponente(index, index)
            crearMensaje("EMPATE")
        } else if (ataqueJugador[index] === "FUEGO" && ataqueEnemigo[index] === "TIERRA") {
            indexAmbosOponente(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if (ataqueJugador[index] === "AGUA" && ataqueEnemigo[index] === "FUEGO") {
            indexAmbosOponente(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if (ataqueJugador[index] === "TIERRA" && ataqueEnemigo[index] === "AGUA") {
            indexAmbosOponente(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else {
            indexAmbosOponente(index, index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
    }
    revisarVidas()
}
// función verifica las victorias de cada jugador y muestra el mensaje final del juego.
function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("Esto fue un empate!!!")
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("FELICITACIONES! Ganaste :)")
    } else {
        crearMensajeFinal("Lo siento, perdiste :(")
    }
}
//funcion para crear un mensaje con el resultado de cada ataque 
function crearMensaje(resultado) {
    
    let nuevoAtaqueDelJugador = document.createElement("p")
    let nuevoAtaqueDelEnemigo = document.createElement("p")
    
    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo
    
    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}
//esta funcion muestra el mensaje final en la interfaz para mostar el ganador o perdedor
function crearMensajeFinal(resultadoFinal) {
    sectionMensajes.innerHTML = resultadoFinal
    sectionReiniciar.style.display = "block"
}
//permine crear una nueva partida
function reiniciarJuego() { 
    location.reload() 
}
//funcion para general nuemeros ramdon 
function aleatorio(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min) 
}
//funcion para que pinta el mapa y mira las posiciones
function pintarCanvas() {
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground, 
        0, 
        0, 
        mapa.width, 
        mapa.height
    )
    
    mascotaJugadorObjeto.pintarMokepon()
    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)
    
    mokeponesEnemigos.forEach(function (mokepon) {
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
}
//esta funcion permite enviar las posiciones al servidor 
function enviarPosicion(x, y) {
    //hace una solicitud
    fetch(`http://192.168.18.11:8080/mokepon/${jugadorId}/posicion`, {
        //metodo de la solicitud 
    method: "post",
    headers: {
        "Content-Type": "application/json"//encabezado de la solucitud 
    },
    body: JSON.stringify({//cuerpo de la solicitud en fromato json 
        //coordenadas 
        x,
        y
    })
})
.then(function (res) {
    //se verefica la respuesta del servidor
    if (res.ok) {
        //si la respuesta fue ok se convierte en JSON
        res.json()
        .then(function ({ enemigos }) {
            //se resibe la info de los enemigos 
            mokeponesEnemigos = enemigos.map(function (enemigo) {
                console.log({enemigo})
                
                //condicional para vereficar si existe la info del mokepon
                let mokeponEnemigo = null
                if (enemigo && enemigo.mokepon && enemigo.mokepon.nombre) {
                    const mokeponNombre = enemigo.mokepon.nombre || ""
                    //se instancia el mokepon segun su nombre 
                    if (mokeponNombre === "Hipodoge") {
                        mokeponEnemigo = new Mokepon("Hipodoge","media/hipodoge.webp", 5, "media/hipodoge.png", enemigo.id)
                    } else if (mokeponNombre === "Capipepo") {
                        mokeponEnemigo = new Mokepon("Capipepo","media/capipepo.webp", 5, "media/capipepo.png", enemigo.id)
                    } else if (mokeponNombre === "Ratigueya") {
                        mokeponEnemigo = new Mokepon("Ratigueya","media/ratigueya.webp", 5, "media/ratigueya.png", enemigo.id)
                    }
                }
                //se ha creado un enemigo  y se le asignan las coordenadas 
                if (mokeponEnemigo) {
                    mokeponEnemigo.x = enemigo.x || 0
                    mokeponEnemigo.y = enemigo.y || 0
                }
                //se retorna el mokepon enemigo 
                return mokeponEnemigo
            })
        })
    }
})
}

//funciones para controlar el movimienrto 
function moverDerecha() { mascotaJugadorObjeto.velocidadX = 5 }
function moverIzquierda() { mascotaJugadorObjeto.velocidadX = -5 }
function moverAbajo() { mascotaJugadorObjeto.velocidadY = 5 }
function moverArriba() { mascotaJugadorObjeto.velocidadY = -5 }

//funcion que dectecta el movimiento 
function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}
//funcion que captura el movimiento de las teclas 
function sePresionoUnaTecla(event) {
    switch (event.key) {
        case "ArrowUp": moverArriba()
            break
        case "ArrowDown": moverAbajo()
            break
        case "ArrowLeft": moverIzquierda()
            break
        case "ArrowRight": moverDerecha()
            break
        default: 
            break
    }
}
//funcion para par iniciar el mapa  
function iniciarMapa() {
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    console.log(mascotaJugadorObjeto, mascotaJugador); 
    intervalo = setInterval(pintarCanvas, 50)
    
    window.addEventListener("keydown", sePresionoUnaTecla)
    window.addEventListener("keyup", detenerMovimiento)

    const nombreMascota = spanMascotaJugador.innerHTML;
    const mascotaNombre = document.querySelector("#mascota-nombre");
    mascotaNombre.textContent = `Recorre el mapa con tu mascota ${nombreMascota}`
}
//funcion para obtener informacion
function obtenerObjetoMascota() {
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            return mokepones[i]
        }
    }
    return null
}

//dectecta a los enemigos y jugador para realizar la colicion 
function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x
    
    const arribaMascota = mascotaJugadorObjeto.y
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = mascotaJugadorObjeto.x

    if (abajoMascota < arribaEnemigo || 
        arribaMascota > abajoEnemigo || 
        derechaMascota < izquierdaEnemigo || 
        izquierdaMascota > derechaEnemigo) { 
        return 
    }

    detenerMovimiento()
    clearInterval(intervalo)
    console.log("Se detecto una colision"); 
    
    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = "flex"
    sectionVerMapa.style.display = "none"
    seleccionarMascotaEnemigo(enemigo)
}
//se añade un detector de eventos al objeto para ejecutar la funcion
//cuando el juego se termine se recarga 
window.addEventListener("load", iniciarJuego);