// Creamos la función para guardar la información de la factura en base a los clientes y productos.
function guardarFactura() {
    // Definimos el cliente respectivo para la factura.
    const clienteId = document.getElementById("cliente_factura").value;
    // Establecemos una alerta en caso de no seleccionar a algún cliente.
    if (!clienteId) {
        alert("Es obligatorio seleccionar el cliente.");
        return;
    }
    // Establecemos una alerta en caso de no seleccionar a algún producto.
    if (itemsFactura.length === 0) {
        alert("Es obligatorio agregar por lo menos un producto.");
        return;
    }
    // Definimos el total para el precio de los productos.
    const total = itemsFactura.reduce((sum, item) => sum + item.subtotal, 0);
    // Establecemos los campos a mostrar en la factura.
    const factura = {
        id: FacturaService.generarID(),
        clienteId,
        productos: itemsFactura,
        total,
        fecha: new Date().toISOString().split("T")[0]
    };
    // Hacemos un llamado a la función obtenerFacturas() que se encarga de generar los datos de la facturación.
    const facturas = FacturaService.obtenerFacturas();
    facturas.push(factura);
    FacturaService.guardarFacturas(facturas);
    // Mostramos la factura con todos los datos elegidos por el usuario.
    mostrarResumenFactura(factura);

    // Hacemos una limpieza de los datos agregados y actualizamos la lista.
    itemsFactura = [];
    mostrarItemsFactura();

    alert("Factura generada sin inconvenientes.");
}

// Creamos la función encargada de mostrar todos los datos de la factura que se va a generar.
function mostrarResumenFactura(factura) {
    // Seleccionamos las funciones obtenerClientes y obtenerProductos.
    const clientes = FacturaService.obtenerClientes();
    const productos = FacturaService.obtenerProductos();
    // Hacemos una búsqueda de algún cliente que se haya registrado previamente.
    const cliente = clientes.find(c => c.id === factura.clienteId);
    // En caso de no existir algun cliente, nos muestre un mensaje indicando Cliente no especificado.
    document.getElementById("resumen_cliente").textContent = cliente ? cliente.nombre : "Cliente no especificado";
    // Definimos la fecha de generación para la factura.
    document.getElementById("resumen_fecha").textContent = factura.fecha;
    // Mostramos los productos seleccionados.
    const tbody = document.getElementById("resumen_items");
    tbody.innerHTML = "";
    // Definimos la búsqueda de algún producto registrado previamente.
    factura.productos.forEach(item => {
        const producto = productos.find(p => p.id === item.idProducto);
        const tr = document.createElement("tr");
        // Establecemos el caso donde no se haya seleccionado algun producto.
        tr.innerHTML = `
        <td>${producto ? producto.nombre : "Producto no especificado"}</td>
        <td>${item.cantidad}</td>
        <td>${producto ? producto.precio.toFixed(2) : "0.00"}</td>
        <td>${item.subtotal.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
    // Mostramos los datos finales de la factura generada.
    document.getElementById("resumen_total").textContent = factura.total.toFixed(2);
    document.getElementById("resumen_factura").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarItemsFactura();
});

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



