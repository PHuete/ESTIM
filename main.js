//ESTIM - Pagina de venta de videojuegos
let VIDEOJUEGOS = []

function comprar() { //Funcion para comprar los productos del carrito cogiendo los datos del localstorage
    const productosCarrito = JSON.parse(localStorage.getItem('products'))
    let total = 0
    for (let i = 0; i < productosCarrito.length; i++) {
        total += productosCarrito[i].precio * productosCarrito[i].cantidad
    }
    if (productosCarrito.length > 0) {
        swal.fire({
            title: 'Total: ' + total.toFixed(2) + '€',
            text: "¿Deseas continuar con la compra?",
            icon: 'success',
            confirmButtonText: 'Continuar'
            
        }).then((result) => {
            if (result.value) {
                swal.fire({
                    title: '¡Gracias por tu compra!',
                    text: "En breve recibirás un email con el link de descarga",
                    icon: 'success',
                    confirmButtonText: 'Continuar'
                }).then((result) => {
                    actualizarStockVideojuegos()
                    localStorage.setItem('products', JSON.stringify([]))
                    limpiarCarrito()
                })
            }
        })
    
    } else {
        swal.fire({
            title: 'Error!',
            text: "No has seleccionado ningun juego para comprar",
            icon: 'error',
            confirmButtonText: 'Continuar',
        })
    }         
}
function limpiarCarrito() { //elimina los elementos .productInCart y elimina el mpdal que muestra el carrito
    document.querySelectorAll(".productInCart").forEach(el => el.remove())
    document.getElementById('modal_container').classList.remove('modal-active')

}

function actualizarStockVideojuegos () {
    // Esto deberia de actualizarse con un POST pero no funciona el post con Live server y usando node no funciona la importación de fs
    const productosCarrito = JSON.parse(localStorage.getItem('products'))
    for (let i = 0; i < productosCarrito.length; i++) {
        const videojuego = VIDEOJUEGOS.find(videojuego => videojuego.id == productosCarrito[i].id)
        videojuego.stock = videojuego.stock - productosCarrito[i].cantidad
        document.getElementById(`stock${videojuego.id}`).innerHTML = `Stock: ${videojuego.stock}`
    }
}

function inicializar () { //carga el DOM
    localStorage.setItem('products', JSON.stringify([]))
    
    if (!localStorage.getItem("usuarioLogado")) {
        localStorage.setItem("usuarioLogado", false)
    }

    
    const modalContainer = document.getElementById('modal_container')
    const openCart = document.getElementById('open')
    const closeCart = document.getElementById('close')
    const modalCart = document.getElementById('modalCart')

    const inicioSesionBtn =  document.getElementById("inicioSesionBtn")
    const registroUsuarioBtn =  document.getElementById("registroUsuarioBtn")
    const carritoCompraBtn =  document.getElementById("comprarCarrito")
    const logOutBtn = document.getElementById("LogOutBtn")
    
    const usuarioLogado = localStorage.getItem("usuarioLogado")

    if (usuarioLogado == "false") {
        document.querySelector('#open').disabled = true
    } else {
        document.querySelector('#open').disabled = false
    }

    if(usuarioLogado == "true") {
        logOutBtn.style.display = "block"
        inicioSesionBtn.style.display = "none"
        registroUsuarioBtn.style.display = "none"
     }else {
        logOutBtn.style.display = "none"
        inicioSesionBtn.style.display = "block"
        registroUsuarioBtn.style.display = "block"
    }   

    openCart.addEventListener('click', () => {
        if (!modalCart) {
            modalCart.classList.add('show')
        }
        modalContainer.classList.add('modal-active')
    })

    closeCart.addEventListener('click', () => {
        modalContainer.classList.remove('modal-active')
    })

    modalContainer.addEventListener('click', () => {
        closeCart
    })

    modalCart.addEventListener('click', (e) => {
        e.stopPropagation
    })

    inicioSesionBtn.addEventListener('click', () => {
        window.location.href = "indexLogIn.html"
    })

    registroUsuarioBtn.addEventListener('click', () => {
        window.location.href = "indexRegistro.html"
    })

    carritoCompraBtn.addEventListener('click', () => {
        comprar()
    })  
    logOutBtn.addEventListener('click', () => {
        logOut()
    })  
}


const cargarContenido = async () => { //Uso de fetch para cargar los videojuegos desde el archivo JSON
    let contenidoHTML = ""
    await fetch('js/estim.json')
        .then(response => response.json())
        .then((data) => {
            VIDEOJUEGOS = data
            VIDEOJUEGOS.forEach(videojuego => {
                const contentVideojuego = renderVideojuego(videojuego)
                contenidoHTML += contentVideojuego

        });
        document.getElementById('product-container').innerHTML = contenidoHTML
    })
    añadirListenerBotones()
}

const renderVideojuego = (videojuego) => { //renderiza las cards de los videojuegos
    return `<div class="card" style="width:16rem;   background-color: rgba(0, 0, 0, 0.5); color: white;">
    
        <img src="${videojuego.img}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${videojuego.titulo}</h5>
            <p class="card-text">Precio:€ ${videojuego.precio}</p>
            <p class="card-text">Categoria: ${videojuego.categoria}</p>
            <p id="stock${videojuego.id}" class="card-text">Stock: ${videojuego.stock}</p>
            <button class="btn-primary" id="buyBtn${videojuego.id}">Comprar</button>
        </div>
    </div>`


}

function añadirListenerBotones() {
 
    VIDEOJUEGOS.forEach(videojuego => {
    
        const botonComprar = document.getElementById(`buyBtn${videojuego.id}`)
       

        botonComprar.onclick = () => {
            const usuarioLogado = localStorage.getItem("usuarioLogado")

            if (usuarioLogado == "false") {
                Swal.fire({
                    title: 'Error!',
                    text: "Debes iniciar sesion para poder comprar",
                    icon: 'error',
                    confirmButtonText: 'Volver'
                })
                return
            } else {
                if (videojuego.stock > 0) {
                    addToCart(videojuego)
                    const producto = obtenerProducto(videojuego.id)
                    document.getElementById(`stock${videojuego.id}`).innerHTML = `Stock: ${videojuego.stock - producto.cantidad}`

                    Swal.fire({
                        title: '¡Enhorabuena!',
                        text: "Has añadido al carrito " + videojuego.titulo + " con exito",
                        icon: 'success',
                        confirmButtonText: 'Continuar'
                    })
                }
                else {
                    swal.fire({
                        title: 'Lo sentimos!',
                        text: "No quedan unidades de " + videojuego.titulo + " en stock",
                        icon: 'error',
                        confirmButtonText: 'Volver'
                    })
                }
            }
        }
    })
}

function aniadirProducto(videojuego) {
    const productos =  JSON.parse(localStorage.getItem('products'))
    const productoIndex = productos.findIndex(producto => producto.id == videojuego.id)
    if (productoIndex != -1) {
        let producto =  productos[productoIndex]
        productos[productoIndex] = {...producto, "cantidad": producto.cantidad + 1}
        localStorage.setItem('products', JSON.stringify(productos))
    }
    else {
        const newProduct = {"id": videojuego.id, "cantidad": 1, "precio": videojuego.precio}
        localStorage.setItem('products', JSON.stringify([...productos, newProduct]))
    }
}
function obtenerProducto(id) {
    const productos =  JSON.parse(localStorage.getItem('products'))
    const productoIndex = productos.findIndex(producto => producto.id == id)
    return productos[productoIndex]
}

const addToCart = (videojuego) => {
    const cantidad = document.getElementById(`count${videojuego.id}`)
    const elementosSeleccionados = cantidad ? (parseInt(cantidad.innerHTML) + 1) : 1 
    const cartContainer = document.getElementById('cart-container')
    aniadirProducto(videojuego)

    if (document.getElementById(`productInCart${videojuego.id}`)) {
        document.getElementById(`count${videojuego.id}`).innerHTML = elementosSeleccionados
    } else {
        let div = document.createElement('div');
        div.id = 'productInCart' + videojuego.id
        div.classList.add(`productInCart`)
        div.innerHTML = `
            <img src=${videojuego.img} style="width:10%" /> 
            <p> ${videojuego.titulo} </p>
            <p> Precio: ${videojuego.precio} </p>
            <p class="counter">
                <button id="restaBtn${videojuego.id}" class="btnMasMenos">-</button>
                <text id="count${videojuego.id}" class="count">1 </text>
                <button id="sumaBtn${videojuego.id}" class="btnMasMenos">+</button>
            </p>
            <button class="btn btn-danger btn-sm" id="deleteBtn${videojuego.id}" >X</button>
        `
                        
        cartContainer.appendChild(div)
        aniadirListenersCarrito(videojuego)

    }
}

function aniadirListenersCarrito(videojuego) {
    const sumaBtn = document.getElementById(`sumaBtn${videojuego.id}`)
    const restaBtn = document.getElementById(`restaBtn${videojuego.id}`)
    const deleteBtn = document.getElementById(`deleteBtn${videojuego.id}`)
    const carrito = document.getElementById('cart-container')

    sumaBtn.onclick = () => {suma(videojuego)}
    restaBtn.onclick = () => {resta(videojuego)}
    deleteBtn.onclick = () => {eliminarVideojuego(videojuego)}
}

function suma (videojuego) { //Funcion del boton + de la card del videojuego en carrito
    const producto = obtenerProducto(videojuego.id)
    let cantidadActual = producto.cantidad

    if (parseInt(cantidadActual) < videojuego.stock) {
        let elementosSeleccionados = parseInt(cantidadActual) + 1
        aniadirProducto(videojuego)
        const stockActual = document.getElementById(`stock${videojuego.id}`).innerHTML.split(': ')[1]
        document.getElementById(`count${videojuego.id}`).innerHTML = elementosSeleccionados
        document.getElementById(`stock${videojuego.id}`).innerHTML = `Stock: ${videojuego.stock - elementosSeleccionados}`
        return
    }
    else {
        Swal.fire({
            title: 'Error!',
            text: "No quedan unidades de " + videojuego.titulo + " en stock",
            icon: 'error',
            confirmButtonText: 'Volver'
        })
    }
}

function resta (videojuego) { //Funcion del boton - de la card del videojuego en carrito
    const producto = obtenerProducto(videojuego.id)
    let cantidadActual = producto.cantidad
    if (cantidadActual > 0) {
        let elementosSeleccionados = parseInt(cantidadActual) - 1
        borrarProducto(videojuego.id)
        const stockActual = document.getElementById(`stock${videojuego.id}`).innerHTML.split(': ')[1]
        document.getElementById(`count${videojuego.id}`).innerHTML = elementosSeleccionados
        document.getElementById(`stock${videojuego.id}`).innerHTML = `Stock: ${videojuego.stock - elementosSeleccionados}`
        return
    }
}

function eliminarVideojuego(videojuego) { //Funcion del boton X de la card del videojuego en carrito
    const cantidad = document.getElementById(`count${videojuego.id}`).innerHTML
    const stockActual = document.getElementById(`stock${videojuego.id}`).innerHTML.split(': ')[1]
    document.getElementById(`count${videojuego.id}`).innerHTML = 0
    actualizarCarrito(videojuego.id)

    document.getElementById(`productInCart${videojuego.id}`).remove()
    document.getElementById(`stock${videojuego.id}`).innerHTML = `Stock: ${videojuego.stock}`
}

function actualizarCarrito(videojuegoId) {
    const productosCarrito = JSON.parse(localStorage.getItem('products'))
    const productosFinales = productosCarrito.filter(producto => producto.id !== videojuegoId)
    localStorage.setItem('products', JSON.stringify(productosFinales))
}

function borrarProducto(videojuegoId) { //Funcion para recuperar el stock de un videojuego eliminado del carrito
    const productosCarrito = JSON.parse(localStorage.getItem('products'))

    const productoIndex = productosCarrito.findIndex(producto => producto.id === videojuegoId)
    const producto = productosCarrito[productoIndex]
    productosCarrito[productoIndex]["cantidad"] = producto.cantidad -1

    localStorage.setItem('products', JSON.stringify(productosCarrito))
}

function logOut() { //Funcion para cerrar sesion
    localStorage.setItem('usuarioLogado', "false")
    localStorage.setItem('accesoLogin', "false")   
    const logOutBtn = document.getElementById("LogOutBtn")
    const openCart = document.getElementById('open')
   
    
    swal.fire({
        title: 'Hasta pronto!',
        text: "Gracias por visitarnos",
        icon: 'success',
        confirmButtonText: 'Volver'
    }).then((result) => {
        window.location.href = "index.html"
        
    })
}

inicializar()
cargarContenido()
