// Creamos una clase para gestionar los productos desde el localStorage.
class ProductoService {
    static obtenerProductos() {
        return JSON.parse(localStorage.getItem("productos")) || [];
    }

    static guardarProductos(productos) {
        localStorage.setItem("productos", JSON.stringify(productos));
    }

    static generarID() {
        return Date.now().toString();
    }
}

// Creamos la función que va a servir para agregar cualquier producto en el aplicativo.
function agregarProducto() {
    const nombre = document.getElementById("nombre_producto").value.trim();
    const precio = parseFloat(document.getElementById("precio_producto").value);
    // Especificamos una invalidación si no existen datos para el producto.
    if (!nombre || isNaN(precio) || precio <= 0) {
        alert("Es obligatorio ingresar los datos del producto.");
        return;
    }
    // Definimos los datos de los productos.
    const productos = ProductoService.obtenerProductos();
    productos.push({
        id: ProductoService.generarID(),
        nombre,
        precio
    });

    ProductoService.guardarProductos(productos);
    mostrarProductos();


    // Si ya se ha ingresado un producto, ejecutamos el operador encargado de limpiar los campos, para poder ingresar mas productos.
    limpiarCamposProducto();
}

// Definimos la función encargada de limpiar los productos una vez que ya hayan sido ingresados.
function limpiarCamposProducto() {
    document.getElementById("nombre_producto").value = "";
    document.getElementById("precio_producto").value = "";
}

// Establecemos la función que va a mostrar la lista de los productos.
function mostrarProductos() {
    const lista = document.getElementById("lista_productos");
    const select = document.getElementById("producto_factura");
    lista.innerHTML = "";
    select.innerHTML = "";

    const productos = ProductoService.obtenerProductos();
    productos.forEach(producto => {
        const li = document.createElement("li");
        // Definimos el texto del producto que haya sido ingresado.
        li.textContent = `${producto.nombre} - $${producto.precio.toFixed(2)}`;

        // Definimos un botón para que el usuario pueda editar a un producto que ya haya sido ingresado.
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.style.marginLeft = "10px";
        btnEditar.onclick = () => editarProducto(producto.id);

        // Establecemos un botón para eliminar a un producto que ya haya sido ingresado.
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.style.marginLeft = "5px";
        btnEliminar.onclick = () => eliminarProducto(producto.id);
        // Definimos los botones implementados dentro de la lista li.
        li.appendChild(btnEditar);
        li.appendChild(btnEliminar);

        lista.appendChild(li);

        // Establecemos una opción para seleccionar el identificador del producto.
        const option = document.createElement("option");
        option.value = producto.id;
        option.textContent = producto.nombre;
        select.appendChild(option);
    });
}


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

