// Cambiamos el contenido del formulario para editar el producto.
function editarProducto(id) {
    const productos = ProductoService.obtenerProductos();
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    // llenamos los campos con los datos actuales del producto.
    document.getElementById("nombre_producto").value = producto.nombre;
    document.getElementById("precio_producto").value = producto.precio;

    // Cambiamos el botón para que diga "Actualizar".
    const btnAgregar = document.getElementById("btn_producto");
    btnAgregar.textContent = "Actualizar Producto";

    // Se guarda la función de actualizar para cuando se dé click.
    btnAgregar.onclick = () => actualizarProducto(id);
}

// Se guardan los cambios después de editar un producto.
function actualizarProducto(id) {
    const nombre = document.getElementById("nombre_producto").value.trim();
    const precio = parseFloat(document.getElementById("precio_producto").value);

    // Se valida que los campos no estén vacíos o mal.
    if (!nombre || isNaN(precio) || precio <= 0) {
        alert("Es obligatorio ingresar los datos del producto.");
        return;
    }

    const productos = ProductoService.obtenerProductos();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return;

    // Cambiamos el producto en la lista.
    productos[index] = { id, nombre, precio };

    // Guardamos los datos actualizados.
    ProductoService.guardarProductos(productos);

    // Mostramos de nuevo la lista.
    mostrarProductos();

    // Se hace una limpieza de los campos del formulario.
    limpiarCamposProducto();

    // Se cambia otra vez el botón a su función original.
    const btnAgregar = document.getElementById("btn_producto");
    btnAgregar.textContent = "Agregar Producto";
    btnAgregar.onclick = agregarProducto;
}

// Borramos un producto cuando el usuario lo confirma
function eliminarProducto(id) {
    const confirmacion = confirm("¿Desea eliminar este producto?");
    if (!confirmacion) return;

    let productos = ProductoService.obtenerProductos();
    productos = productos.filter(p => p.id !== id);
    ProductoService.guardarProductos(productos);

    // se vuelve a mostrar la lista sin ese producto
    mostrarProductos();
}

// se muestra la lista de productos cuando la página carga
document.addEventListener("DOMContentLoaded", mostrarProductos);



