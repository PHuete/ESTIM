
const loginName = document.getElementById('loginName')
const loginPassword = document.getElementById('loginPassword')
const loginButton = document.getElementById('loginButton')

localStorage.setItem("usuarioLogado", false)
localStorage.setItem("accesoLogin", true)

loginButton.addEventListener('click', (e) => {
    e.preventDefault()
    login()
})

const login = async () => { 
    let usuarios = JSON.parse(localStorage.getItem("usuarios"))
    usuarios = usuarios ? usuarios : []
    localStorage.setItem("usuarios", JSON.stringify(usuarios))

    let usuarioLogado = false

    if (loginName.value == "" || loginPassword.value == "") {
       return 
    }

    usuarios.forEach(usuario => {
        if (usuario.username === loginName.value && usuario.password === loginPassword.value) {
            usuarioLogado = true
            localStorage.setItem("usuarioLogado", usuarioLogado)
        }
    })

    if (usuarioLogado) {
        console.log('usuarioLogado: ', usuarioLogado)
        swal.fire({
            title: 'Bienvenido ' + loginName.value + '!',
            icon: 'success',
            confirmButtonText: 'Continuar'
        }).then((result) => {
            window.location.href = "index.html"
        })
    } else {
        swal.fire({
            title: 'Error al inciar sesión',
            text: 'Usuario o contraseña incorrectos. Comprueba que los datos son correctos antes de continuar',
            icon: 'error',
            confirmButtonText: 'Continuar'
        })
    }
}

login()
