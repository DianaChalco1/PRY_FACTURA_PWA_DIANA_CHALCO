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



