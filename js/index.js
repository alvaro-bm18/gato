let modo;
let marca;
let juego;
let ptsX = ptsO = ptsE = 0;
const contendorGato = document.querySelector('#GatoContenedor');
const turno = document.querySelector('.turno');
const ptsX_cont = document.querySelector('.pts-x');
const ptsO_cont = document.querySelector('.pts-o');
const ptsE_cont = document.querySelector('.pts-e');

class Juego {
    constructor(modo, marca) {
        let turno = true;
        this.modo = modo;
        this.empate = 0;
        this.ganador = [false, ''];
        this.formasGanar = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        //campos representa los campos disponibles
        this.campos = [];
        for (let c = 0; c < 9; c++) this.campos.push(c);

        this.jugadorDos = new Jugador(false, 'o');

        if (marca === 'o') {
            turno = false;
            this.jugadorDos.turno = true;
            this.jugadorDos.marca = 'x';
        }

        this.jugadorUno = new Jugador(turno, marca);
        this.prepararCampos();
    }
    quienGana(jugadorTurno) {
        let gano = false;
        juego.formasGanar.forEach((fG) => {
            let con = 0;
            jugadorTurno.campos.forEach((jT) => {
                if (jT === fG[0] || jT === fG[1] || jT === fG[2])
                    con++;
            });
            if (con === 3) {
                let clase = (jugadorTurno.marca === 'x') ? 'ganaX' : 'ganaO';
                fG.forEach((id) => document.querySelector('#campo' + id).classList.add(clase));
                gano = true;
            };
        });
        if (gano) {
            this.invalidarCampos();
            this.ganador[0] = gano;
            this.ganador[1] = jugadorTurno.marca;
            (jugadorTurno.marca === 'x')
                ? ptsX++
                : ptsO++;
            this.mensaje(jugadorTurno);
        } else {
            if (this.campos.length === 0) {
                this.invalidarCampos();
                ptsE++;
                this.mensaje('empate');
            }
        }
        return gano;
    }
    xoMod1(tiro) {
        if (this.ganador[0] === false) {
            let jugador1 = this.jugadorUno;
            let jugador2 = this.jugadorDos;
            jugador1.seleccionarCampo(tiro);

            if (jugador1.campos.length >= 3)
                this.quienGana(jugador1);

            if (!this.ganador[0] && this.campos.length >= 1) {
                turno.innerText = jugador2.marca + ' turno';
                let maquinaTiro = jugador2.tiroEstrategico();
                jugador2.seleccionarCampo(maquinaTiro);
                this.quienGana(jugador2);
                turno.innerText = jugador1.marca + ' turno';
            }
        }
    }
    xoMod2(tiro) {
        if (this.ganador[0] === false) {
            let jugadorTurno;
            if (this.jugadorUno.turno === true) {
                jugadorTurno = this.jugadorUno;
                jugadorTurno.turno = false;
                this.jugadorDos.turno = true;
                turno.innerText = this.jugadorDos.marca + ' turno';
            } else {
                jugadorTurno = this.jugadorDos;
                jugadorTurno.turno = false;
                this.jugadorUno.turno = true;
                turno.innerText = this.jugadorUno.marca + ' turno';
            }

            jugadorTurno.seleccionarCampo(tiro);
            //comienzas a checar si ese tiro ha sido el ganador
            if (jugadorTurno.campos.length >= 3) {
                this.quienGana(jugadorTurno);
            }
        }
    }
    prepararCampos() {
        let btns = contendorGato.querySelectorAll('button');
        if (btns)
            btns.forEach((btn) => { btn.remove(); });

        for (let id = 0; id < 9; id++) {
            let btn = document.createElement('button');
            btn.setAttribute('id', 'campo' + id);
            btn.addEventListener('click', () => {
                (this.modo === 1)
                    ? this.xoMod1(id)
                    : this.xoMod2(id);
            });

            contendorGato.appendChild(btn);
        }
    }
    invalidarCampos() {
        for (let id = 0; id < 9; id++) {
            let btn = document.querySelector('#campo' + id);
            btn.disabled = true;
        }
    }
    mensaje(jugador) {
        setTimeout(()=>{
            let contendorMsj = document.querySelector('#mensaje-contenedor');
            let ganadorPerde = document.querySelector('.ganador');
            let ttlGanador = document.querySelector('#ttl');
    
            contendorMsj.style.display = 'flex';
            if (jugador !== 'empate') {
                if (this.modo === 1) {
                    ganadorPerde.innerText = (this.jugadorUno === jugador)
                        ? 'felicidades'
                        : 'perdiste';
                } else {
                    ganadorPerde.innerText = (this.jugadorUno === jugador)
                        ? 'jugador 1 felicidades'
                        : 'jugador 2 felicidades';
                }
                ttlGanador.className = '';
                ttlGanador.classList.add(jugador.marca);
                ttlGanador.innerText = jugador.marca + ' ganó';
            } else {
                ganadorPerde.innerText = 'nadie gana';
                ttlGanador.className = '';
                ttlGanador.classList.add('e');
                ttlGanador.innerText = 'empate';
            }
        }, 1000);
    }
    aplicarFuncion() {
        (this.modo === 1)
            ? this.xoMod1(id)
            : this.xoMod2(id);
    }
}
class Jugador {
    constructor(turno, marca) {
        this.turno = turno;
        this.marca = marca;
        this.campos = [];
    }
    seleccionarCampo(n) {
        let campLong = juego.campos.length;
        if (campLong > 0) {
            for (let dis = 0; dis < campLong; dis++) {
                if (juego.campos[dis] === n) {
                    let btn = document.querySelector('#campo' + n);
                    btn.innerText = this.marca;
                    btn.classList.add(this.marca);
                    btn.disabled = true;
                    this.campos.push(n);
                    juego.campos.splice(dis, 1);
                }
            }
        } else { juego.invalidarCampos(); }
    }
    tiroAleatorio() {
        let tiro;
        let disponible = false;
        do {
            tiro = Math.floor(Math.random() * 9);
            for (let cD = 0; cD < juego.campos.length; cD++) {
                if (tiro === juego.campos[cD]) {
                    disponible = true;
                    break;
                }
            }
        } while (!disponible);
        return tiro;
    }
    tiroEstrategico() {
        let tiro = -1;
        let memoria = [];
        let coincidencia = 0;
        for (let fG of juego.formasGanar) {
            for (let camp of this.campos) {
                if (camp === fG[0] || camp === fG[1] || camp === fG[2])
                    coincidencia++;
            }
            if (coincidencia === 2) memoria.push(fG);
            coincidencia = 0;
        }
        if (memoria.length >= 1) {
            let valido = false;
            for (let mem = 0; mem < memoria.length; mem++) {
                let c = this.campos;
                let m = memoria[mem].filter(i => !c.includes(i));
                for (let cm of juego.campos) {
                    if (cm === m[0]) {
                        tiro = m[0];
                        valido = true;
                        break;
                    }
                }
                if (valido) break;
            }
        }
        if (tiro === -1) tiro = this.tiroAleatorio();
        return tiro;
    }
}
const establecer = (m) => {
    document.querySelector('.menu-inicio').style.display = 'none';
    document.querySelector('.interfaz-juego').style.display = 'block';
    let inp = document.querySelector('input[name=marca]:checked');
    marca = inp.value;
    modo = m;
    juego = new Juego(modo, marca);
    if (modo === 1 && marca === 'o') {
        let tiroUno = juego.jugadorDos.tiroAleatorio();
        juego.jugadorDos.seleccionarCampo(tiroUno);
        turno.innerText = juego.jugadorUno.marca + ' turno';
    }
    if (modo === 2) turno.innerText = 'x turno';
    juego.ganador[0] = false;
    juego.ganador[1] = '';
}
const volverMenu = () => {
    document.querySelector('.interfaz-juego').style.display = 'none';
    document.querySelector('#mensaje-contenedor').style.display = 'none';
    document.querySelector('.menu-inicio').style.display = 'block';

    ptsX = ptsO = ptsE = 0;

    ptsX_cont.innerText = '0';
    ptsE_cont.innerText = '0';
    ptsO_cont.innerText = '0';

    let btns = contendorGato.querySelectorAll('button');
    btns.forEach((btn) => { btn.remove(); });
}
const nuevaRonda = () => {
    document.querySelector('#mensaje-contenedor').style.display = 'none';
    establecer(modo);

    ptsX_cont.innerText = ptsX;
    ptsE_cont.innerText = ptsE;
    ptsO_cont.innerText = ptsO;
}
document.querySelector('#nuevaRonda').addEventListener('click', nuevaRonda);
document.querySelector('#salir').addEventListener('click', volverMenu);
document.querySelector('#inicio').addEventListener('click', volverMenu);
document.querySelector('#continuar').addEventListener('click', nuevaRonda);