// Creamos una clase para gestionar facturas, productos y clientes desde el localStorage.
class FacturaService {
    static obtenerFacturas() {
        const datos = localStorage.getItem("facturas");
        return datos ? JSON.parse(datos) : [];
    }

    static guardarFacturas(facturas) {
        localStorage.setItem("facturas", JSON.stringify(facturas));
    }

    // Creamos un ID único basado en la fecha actual.
    static generarID() {
        return Date.now().toString();
    }

    static obtenerProductos() {
        const datos = localStorage.getItem("productos");
        return datos ? JSON.parse(datos) : [];
    }

    static obtenerClientes() {
        const datos = localStorage.getItem("clientes");
        return datos ? JSON.parse(datos) : [];
    }
}

// Creamos un arreglo donde se van a guardar los productos agregados a la factura.
let itemsFactura = [];

// Agregamos un producto con su cantidad a la factura.
function agregarItemFactura() {
    const idProducto = document.getElementById("producto_factura").value;
    const cantidad = parseInt(document.getElementById("cantidad_producto").value);

    // validación básica
    if (!idProducto || isNaN(cantidad) || cantidad <= 0) {
        alert("Es obligatorio seleccionar un producto y una cantidad válida.");
        return;
    }

    const productos = FacturaService.obtenerProductos();
    const producto = productos.find(p => p.id === idProducto);

    if (!producto) {
        alert("Producto no encontrado.");
        return;
    }

    // Calculamos el subtotal del producto y lo añadimos a la factura.
    const subtotal = producto.precio * cantidad;
    itemsFactura.push({
        idProducto,
        cantidad,
        subtotal
    });

    mostrarItemsFactura(); // Actualizamos la lista resultante en la pantalla.
    document.getElementById("cantidad_producto").value = ""; // Limpiamos el campo de la cantidad de los productos.
}

// Mostramos los productos agregados y el valor total de la factura.
function mostrarItemsFactura() {
    const lista = document.getElementById("lista_items_factura");
    // Usar 'totalTexto' que es la variable declarada
    const totalTexto = document.getElementById("total_factura");
    lista.innerHTML = "";

    let total = 0;

    // Recorremos los ítems para mostrarlos y hacer el cálculo del total.
    itemsFactura.forEach(item => {
        const producto = FacturaService.obtenerProductos().find(p => p.id === item.idProducto);
        const li = document.createElement("li");
        // Añadir verificación para 'producto' por robustez 
        const nombreProducto = producto ? producto.nombre : "Producto desconocido";
        li.textContent = `${nombreProducto} x ${item.cantidad} = $${item.subtotal.toFixed(2)}`;
        lista.appendChild(li);

        total += item.subtotal;
    });

    // Mostramos el total final de la factura.
    //  Usar 'totalTexto' y añadir verificación 
    if (totalTexto) {
        totalTexto.textContent = `Total: $${total.toFixed(2)}`;
    } else {
        console.error("El elemento con id 'total_factura' no se encontró en el DOM. Asegúrate de que existe en index.html.");
    }
}

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