const nombre = document.getElementById('nombre')
const apellido = document.getElementById('apellido')
const registroButton = document.getElementById('registroButton')
const username = document.getElementById('username')
const password = document.getElementById('password')

registroButton.addEventListener('click', (e) => {
    e.preventDefault()  
    registroUsuario()
})
function registroUsuario() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios"))
    usuarios = usuarios ? usuarios : []
    
    if (nombre.value !== null || nombre.value !== "" || apellido.value !== null || apellido.value !== "" || username.value !== null || username.value !== "" || password.value !== null || password.value !== "") {
        // Defining new data to be added
        let nuevoUsuario = {
            nombre: nombre.value,
            apellido: apellido.value,
            username: username.value,
            password: password.value,
        }
        localStorage.setItem("usuarios", JSON.stringify([...usuarios, nuevoUsuario]))
        Swal.fire({
            title: '¡Enhorabuena!',
            text: "Usuario '" + username.value + "' ha sido creado con éxito",
            icon: 'success',
            confirmButtonText: 'Continuar'
        }).then((result) => {
            window.location.href = "indexLogin.html"
        })
    }  
    else {   
        Swal.fire({
            title: 'Alto!',
            text: "Parece que hay algun campo sin completar. Por favor, revisalo",
            icon: 'info',
            confirmButtonText: 'Revisar!'
        })
    }
} 