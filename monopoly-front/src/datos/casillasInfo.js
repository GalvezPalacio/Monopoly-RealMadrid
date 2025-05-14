const casillasInfo = [
    { id: 0, nombre: "SALIDA", tipo: "salida", direccion: "abajo" },
    {
      id: 1,
      nombre: "Calle de Caminando a Chamartín",
      tipo: "propiedad",
      color: "marron",
      direccion: "abajo",
      precio: 60,
      alquiler: {
        base: 2,
        casa1: 10,
        casa2: 30,
        casa3: 90,
        casa4: 160,
        hotel: 250
      },
      hipoteca: 30,
      costeCasa: 50,
      costeHotel: 50,
      fondo: "/public/fondos-calles/caminando-chamartin.jpg"
    },
    { id: 2, nombre: "Caja de Comunidad", tipo: "comunidad", direccion: "abajo" },
    {
      id: 3,
      nombre: "Calle de De Las Remontadas",
      tipo: "propiedad",
      color: "marron",
      direccion: "abajo",
      precio: 60,
      alquiler: {
        base: 4,
        casa1: 20,
        casa2: 60,
        casa3: 180,
        casa4: 320,
        hotel: 450
      },
      hipoteca: 30,
      costeCasa: 50,
      costeHotel: 50,
      fondo: "/public/fondos-calles/remontadas.jpg"
    },
    { id: 4, nombre: "Impuesto de lujo", tipo: "impuesto", direccion: "abajo" },
    {
        id: 5,
        nombre: "Estación de Padre Damián",
        tipo: "estacion",
        precio: 200,
        alquiler: {
            base: 50,
            2: 100,
            3: 200,
            4: 400
        },
        hipoteca: 100
        ,imagen: "/estacion-padre-damian.png"
    },
    {
      id: 6,
      nombre: "Calle de D. Francisco Gento",
      tipo: "propiedad",
      color: "azul-claro",
      direccion: "abajo",
      precio: 100,
      alquiler: {
        base: 6,
        casa1: 30,
        casa2: 90,
        casa3: 270,
        casa4: 400,
        hotel: 550
      },
      hipoteca: 50,
      costeCasa: 50,
      costeHotel: 50,
      fondo: "/public/fondos-calles/francisco-gento.jpg"
    },
    { id: 7, nombre: "Suerte", tipo: "suerte", direccion: "abajo" },
    {
      id: 8,
      nombre: "Calle De La CMK",
      tipo: "propiedad",
      color: "azul-claro",
      direccion: "abajo",
      precio: 100,
      alquiler: {
        base: 6,
        casa1: 30,
        casa2: 90,
        casa3: 270,
        casa4: 400,
        hotel: 550
      },
      hipoteca: 50,
      costeCasa: 50,
      costeHotel: 50,
      fondo: "/public/fondos-calles/cmk2.jpg"
    },
    {
      id: 9,
      nombre: "Calle de De La Quinta Del Buitre",
      tipo: "propiedad",
      color: "azul-claro",
      direccion: "abajo",
      precio: 120,
      alquiler: {
        base: 8,
        casa1: 40,
        casa2: 100,
        casa3: 300,
        casa4: 450,
        hotel: 600
      },
      hipoteca: 60,
      costeCasa: 50,
      costeHotel: 50,
      fondo: "/public/fondos-calles/quinta-buitre.jpg"
    },
    { id: 10, nombre: "Visita a la cárcel", tipo: "visita-carcel", direccion: "izquierda" },
    {
        id: 11,
        nombre: "Calle De El Madrid Ye-Ye",
        tipo: "propiedad",
        color: "rosa",
        precio: 140,
        alquiler: {
            base: 10,
            casa1: 50,
            casa2: 150,
            casa3: 450,
            casa4: 625,
            hotel: 750
        },
        hipoteca: 70,
        costeCasa: 100,
        costeHotel: 100,
        fondo: "/public/fondos-calles/madrid-ye-ye.jpg"
    },
    {
        id: 12,
        nombre: "Compañía de D. Santiago Bernabéu",
        tipo: "compania",
        precio: 150,
        imagen: "/public/compañia-bernabeu.png"
      },
    {
        id: 13,
        nombre: "Calle de D. Sergio Ramos",
        tipo: "propiedad",
        color: "rosa",
        precio: 140,
        alquiler: {
            base: 10,
            casa1: 50,
            casa2: 150,
            casa3: 450,
            casa4: 625,
            hotel: 750
        },
        hipoteca: 70,
        costeCasa: 100,
        costeHotel: 100,
        fondo: "/public/fondos-calles/sergio-ramos.jpg"
    },
    {
        id: 14,
        nombre: "Calle de Vikingos",
        tipo: "propiedad",
        color: "rosa",
        precio: 160,
        alquiler: {
            base: 12,
            casa1: 60,
            casa2: 180,
            casa3: 500,
            casa4: 700,
            hotel: 900
        },
        hipoteca: 80,
        costeCasa: 100,
        costeHotel: 100,
        fondo: "/public/fondos-calles/vikingos.jpg"
    },
    {
        id: 15,
        nombre: "Estación de La Castellana",
        tipo: "estacion",
        precio: 200,
        alquiler: {
            base: 50,
            2: 100,
            3: 200,
            4: 400
        },
        hipoteca: 100
        ,imagen: "/estacion-la-castellana.png"
    },
    {
        id: 16,
        nombre: "Calle de D. Zinedine Zidane",
        tipo: "propiedad",
        color: "naranja",
        precio: 180,
        alquiler: {
            base: 14,
            casa1: 70,
            casa2: 200,
            casa3: 550,
            casa4: 750,
            hotel: 950
        },
        hipoteca: 90,
        costeCasa: 100,
        costeHotel: 100,
        fondo: "/public/fondos-calles/zinedine-zidane.png"
    },
    {
        id: 17,
        nombre: "Caja de Comunidad",
        tipo: "comunidad"
    },
    {
        id: 18,
        nombre: "Calle de D. Pedja Mijatovic",
        tipo: "propiedad",
        color: "naranja",
        precio: 180,
        alquiler: {
            base: 14,
            casa1: 70,
            casa2: 200,
            casa3: 550,
            casa4: 750,
            hotel: 950
        },
        hipoteca: 90,
        costeCasa: 100,
        costeHotel: 100,
        fondo: "/public/fondos-calles/pedja-mijatovic-2.png"
    },
    {
        id: 19,
        nombre: "Calle de La Esquina Del Bernabéu",
        tipo: "propiedad",
        color: "naranja",
        precio: 200,
        alquiler: {
            base: 16,
            casa1: 80,
            casa2: 220,
            casa3: 600,
            casa4: 800,
            hotel: 1000
        },
        hipoteca: 100,
        costeCasa: 100,
        costeHotel: 100,
        fondo: "/public/fondos-calles/esquina-bernabeu-2.png"
    },
    {
        id: 20,
        nombre: "Palco ViP",
        tipo: "palco-vip"
    },
    {
        id: 21,
        nombre: "Calle de Mejor Club Del Siglo XX",
        tipo: "propiedad",
        color: "rojo",
        precio: 220,
        alquiler: {
            base: 18,
            casa1: 90,
            casa2: 250,
            casa3: 700,
            casa4: 875,
            hotel: 1050
        },
        hipoteca: 110,
        costeCasa: 150,
        costeHotel: 150,
        fondo: "/public/fondos-calles/mejor-siglo-20-4.png"
    },
    {
        id: 22,
        nombre: "Suerte",
        tipo: "suerte"
    },
    {
        id: 23,
        nombre: "Calle de La Décima",
        tipo: "propiedad",
        color: "rojo",
        precio: 220,
        alquiler: {
            base: 18,
            casa1: 90,
            casa2: 250,
            casa3: 700,
            casa4: 875,
            hotel: 1050
        },
        hipoteca: 110,
        costeCasa: 150,
        costeHotel: 150,
        fondo: "/public/fondos-calles/decima.jpg"
    },
    {
        id: 24,
        nombre: "Calle de La Séptima",
        tipo: "propiedad",
        color: "rojo",
        precio: 240,
        alquiler: {
            base: 20,
            casa1: 100,
            casa2: 300,
            casa3: 750,
            casa4: 925,
            hotel: 1100
        },
        hipoteca: 120,
        costeCasa: 150,
        costeHotel: 150,
        fondo: "/public/fondos-calles/septima.jpg"
    },
    {
        id: 25,
        nombre: "Estación de Concha Espina",
        tipo: "estacion",
        precio: 200,
        alquiler: {
            base: 50,
            2: 100,
            3: 200,
            4: 400
        },
        hipoteca: 100
        ,imagen: "/estacion-concha-espina.png"
    },
    {
        id: 26,
        nombre: "Calle de Rey De Europa",
        tipo: "propiedad",
        color: "amarillo",
        precio: 260,
        alquiler: {
            base: 22,
            casa1: 110,
            casa2: 330,
            casa3: 800,
            casa4: 975,
            hotel: 1150
        },
        hipoteca: 130,
        costeCasa: 150,
        costeHotel: 150,
        fondo: "/public/fondos-calles/reyes-europa.jpg"
    },
    {
        id: 27,
        nombre: "Calle de La Cibeles",
        tipo: "propiedad",
        color: "amarillo",
        precio: 260,
        alquiler: {
            base: 22,
            casa1: 110,
            casa2: 330,
            casa3: 800,
            casa4: 975,
            hotel: 1150
        },
        hipoteca: 130,
        costeCasa: 150,
        costeHotel: 150,
        fondo: "/public/fondos-calles/cibeles.jpeg"
    },
    {
        id: 28,
        nombre: "Compañía de D. Florentino Pérez",
        tipo: "compania",
        precio: 150,
        imagen: "/public/compañia-florentino.png"
      },
    {
        id: 29,
        nombre: "Calle de D. Cristiano Ronaldo",
        tipo: "propiedad",
        color: "amarillo",
        precio: 280,
        alquiler: {
            base: 24,
            casa1: 120,
            casa2: 360,
            casa3: 850,
            casa4: 1025,
            hotel: 1200
        },
        hipoteca: 140,
        costeCasa: 150,
        costeHotel: 150,
        fondo: "/public/fondos-calles/cristiano-ronaldo.jpg"
    },
    {
        id: 30,
        nombre: "Vas a la grada",
        tipo: "vas-grada"
    },
    {
        id: 31,
        nombre: "Calle de D. Kylian Mbappé",
        tipo: "propiedad",
        color: "verde",
        precio: 300,
        alquiler: {
            base: 26,
            casa1: 130,
            casa2: 390,
            casa3: 900,
            casa4: 1100,
            hotel: 1275
        },
        hipoteca: 150,
        costeCasa: 200,
        costeHotel: 200,
        fondo: "/public/fondos-calles/kylian-mbappe.jpg"
    },
    {
        id: 32,
        nombre: "Calle de D. Raúl González Blanco",
        tipo: "propiedad",
        color: "verde",
        precio: 300,
        alquiler: {
            base: 26,
            casa1: 130,
            casa2: 390,
            casa3: 900,
            casa4: 1100,
            hotel: 1275
        },
        hipoteca: 150,
        costeCasa: 200,
        costeHotel: 200,
        fondo: "/public/fondos-calles/raul-gonzalez.jpg"
    },
    {
        id: 33,
        nombre: "Caja de Comunidad",
        tipo: "comunidad"
    },
    {
        id: 34,
        nombre: "Calle de D. Alfredo Di Stéfano",
        tipo: "propiedad",
        color: "verde",
        precio: 320,
        alquiler: {
            base: 28,
            casa1: 150,
            casa2: 450,
            casa3: 1000,
            casa4: 1200,
            hotel: 1400
        },
        hipoteca: 160,
        costeCasa: 200,
        costeHotel: 200,
        fondo: "/public/fondos-calles/di-estefano.jpg"
    },
    {
        id: 35,
        nombre: "Estación de Chamartín",
        tipo: "estacion",
        precio: 200,
        alquiler: {
            base: 50,
            2: 100,
            3: 200,
            4: 400
        },
        hipoteca: 100
        ,imagen: "/estacion-chamartin.png"
    },
    {
        id: 36,
        nombre: "Suerte",
        tipo: "suerte"
    },
    {
        id: 37,
        nombre: "Calle de ¡¡ Hey Jude !!",
        tipo: "propiedad",
        color: "azul-oscuro",
        precio: 350,
        alquiler: {
            base: 35,
            casa1: 175,
            casa2: 500,
            casa3: 1100,
            casa4: 1300,
            hotel: 1500
        },
        hipoteca: 175,
        costeCasa: 200,
        costeHotel: 200,
        fondo: "/public/fondos-calles/hey-jude.png"
    },
    {
        id: 38,
        nombre: "Impuesto de lujo",
        tipo: "impuesto"
    },
    {
        id: 39,
        nombre: "Calle de ¡¡ Hasta El Final !!",
        tipo: "propiedad",
        color: "azul-oscuro",
        precio: 400,
        alquiler: {
            base: 50,
            casa1: 200,
            casa2: 600,
            casa3: 1400,
            casa4: 1700,
            hotel: 2000
        },
        hipoteca: 200,
        costeCasa: 200,
        costeHotel: 200,
        fondo: "/public/fondos-calles/hasta-el-final-3.png"
    }
];

export default casillasInfo;