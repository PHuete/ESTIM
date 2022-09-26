class Videojuego {
    constructor(id, nombre, precio, categoria, stock, img) {
        id = parseInt(Math.random() * 100000)
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.categoria = categoria
        this.stock = stock
        this.img = img
    }

}