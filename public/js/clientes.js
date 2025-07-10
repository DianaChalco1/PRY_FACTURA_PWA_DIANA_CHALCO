
// Creamos una clase para gestionar los clientes desde el localStorage.
class ClienteService {
    static obtenerClientes() {
        return JSON.parse(localStorage.getItem("clientes")) || [];
    }

    static guardarClientes(clientes) {
        localStorage.setItem("clientes", JSON.stringify(clientes));
    }

    static generarID() {
        return Date.now().toString();
    }
}
// Creamos la función que va a servir para agregar cualquier cliente en el aplicativo.
function agregarCliente() {
    const nombre = document.getElementById("nombre_cliente").value.trim();
    const cedula = document.getElementById("cedula_cliente").value.trim();
    const direccion = document.getElementById("direccion_cliente").value.trim();
    // Especificamos una invalidación si no existen datos para el cliente.
    if (!nombre || !cedula || !direccion) {
        alert("Se deben rellenar todos los datos del cliente.");
        return;
    }
    // Definimos los datos de los clientes.
    const clientes = ClienteService.obtenerClientes();
    clientes.push({
        id: ClienteService.generarID(),
        nombre,
        cedula,
        direccion
    });

    ClienteService.guardarClientes(clientes);
    mostrarClientes();

    // Si ya se ha ingresado un cliente, ejecutamos el operador encargado de limpiar los campos, para poder ingresar mas clientes.
    limpiarCamposCliente();
}

// Definimos la función encargada de limpiar los registros una vez que ya hayan sido ingresados.
function limpiarCamposCliente() {
    document.getElementById("nombre_cliente").value = "";
    document.getElementById("cedula_cliente").value = "";
    document.getElementById("direccion_cliente").value = "";
}

// Establecemos la función que va a mostrar la lista de los clientes.
function mostrarClientes() {
    const lista = document.getElementById("lista_clientes");
    const select = document.getElementById("cliente_factura");
    lista.innerHTML = "";
    select.innerHTML = "";

    const clientes = ClienteService.obtenerClientes();

    clientes.forEach(cliente => {
        const li = document.createElement("li");

        // Definimos el texto del cliente que haya sido ingresado.
        li.textContent = `${cliente.nombre} (${cliente.cedula}) - ${cliente.direccion} `;

        // Definimos un botón para que el usuario pueda editar a un cliente que ya haya sido ingresado.
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.style.marginLeft = "10px";
        btnEditar.onclick = () => editarCliente(cliente.id);

        // Establecemos un botón para eliminar a un cliente que ya haya sido ingresado.
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.style.marginLeft = "5px";
        btnEliminar.onclick = () => eliminarCliente(cliente.id);

        // Definimos los botones implementados dentro de la lista li.
        li.appendChild(btnEditar);
        li.appendChild(btnEliminar);

        lista.appendChild(li);

        // Establecemos una opción para seleccionar el identificador del cliente.
        const option = document.createElement("option");
        option.value = cliente.id;
        option.textContent = cliente.nombre;
        select.appendChild(option);
    });
}

// Creamos la función que va a servir para editar un cliente ingresado.
function editarCliente(id) {
    const clientes = ClienteService.obtenerClientes();
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;

    // Especificamos los campos a editar del cliente ingresado.
    document.getElementById("nombre_cliente").value = cliente.nombre;
    document.getElementById("cedula_cliente").value = cliente.cedula;
    document.getElementById("direccion_cliente").value = cliente.direccion;

    // Hacemos un cambio del botón agregar hacia el boton actualizar, para actualizar la información.
    const btnAgregar = document.querySelector('button[onclick="agregarCliente()"]');
    btnAgregar.textContent = "Actualizar Cliente";

    // Eliminamos el parámetro onclick de agregar cliente y lo especificamos para que se pueda actualizar los datos del cliente.
    btnAgregar.onclick = () => actualizarCliente(id);
}

// Creamos la función para actualizar los datos de los clientes que ya hayan sido ingresados.
function actualizarCliente(id) {
    const nombre = document.getElementById("nombre_cliente").value.trim();
    const cedula = document.getElementById("cedula_cliente").value.trim();
    const direccion = document.getElementById("direccion_cliente").value.trim();
    // Establecemos una condición para invalidar cualquier valor diferente de los datos establecidos.
    if (!nombre || !cedula || !direccion) {
        alert("Es obligatorio ingresar los datos del cliente.");
        return;
    }
    // Buscamos el identificador de los clientes a actualizar.
    const clientes = ClienteService.obtenerClientes();
    const index = clientes.findIndex(c => c.id === id);
    if (index === -1) return;
    // Establecemos las variables de los datos a actualizar.
    clientes[index] = { id, nombre, cedula, direccion };
    ClienteService.guardarClientes(clientes);

    mostrarClientes();
    limpiarCamposCliente();
    // Restauramos el boton para agregar nuevamente a los clientes.
    const btnAgregar = document.querySelector('button[onclick]');
    btnAgregar.textContent = "Agregar Cliente";
    btnAgregar.onclick = agregarCliente;
}

// Establecemos la función para eliminar algún cliente que haya sido registrado.
function eliminarCliente(id) {
    if (!confirm("¿Desea eliminar este cliente?")) return;
    // Buscamos el identificador del cliente a eliminar.
    let clientes = ClienteService.obtenerClientes();
    clientes = clientes.filter(c => c.id !== id);
    ClienteService.guardarClientes(clientes);

    mostrarClientes();
}
document.addEventListener("DOMContentLoaded", mostrarClientes);



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
