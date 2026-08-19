// Catálogo de incidentes real del negocio, agrupado por categoría.
// Los slugs de "categoria" deben coincidir exactamente con NuevoTicketDto.CategoriasValidas del backend.
// Fuente única: NuevoTicketModal (para el selector) y el Dashboard (para las métricas por categoría)
// importan de aquí, para no mantener la misma lista en dos archivos distintos.

// Campos estructurados reutilizables, tomados de las hojas del Excel de macros
// que ya usa el negocio para altas/modificaciones/bajas en Intelisis. Se
// comparten entre varios incidentes (ej. Acreedor y Deudor Diverso usan los
// mismos campos que Proveedor) para no repetir la lista.
// `seccion` agrupa visualmente los campos en el formulario (ver
// NuevoTicketModal) para que incidentes con muchos campos no se sientan un
// solo formulario interminable — cada sección se puede colapsar aparte.
const CAMPOS_DIRECCION = [
  { key: "direccion", label: "Dirección (calle)", seccion: "Dirección" },
  { key: "noExt", label: "No. Exterior", seccion: "Dirección" },
  { key: "noInt", label: "No. Interior", seccion: "Dirección" },
  { key: "colonia", label: "Colonia", seccion: "Dirección" },
  { key: "poblacion", label: "Población", seccion: "Dirección" },
  { key: "estado", label: "Estado", seccion: "Dirección" },
  { key: "pais", label: "País", seccion: "Dirección" },
  { key: "cp", label: "C.P.", seccion: "Dirección" },
];

const CAMPOS_CONTACTO = [
  { key: "telefono", label: "Teléfono", seccion: "Contacto" },
  { key: "correo", label: "Correo", seccion: "Contacto" },
];

const CAMPOS_TIPO_OPERACION = [
  {
    key: "tipoOperacion",
    label: "Tipo de operación",
    tipo: "select",
    opciones: ["Alta", "Modificación", "Baja"],
  },
];

// PERSONAL — alta/mod/baja de empleado
const CAMPOS_EMPLEADO = [
  ...CAMPOS_TIPO_OPERACION,
  { key: "categoria", label: "Categoría" },
  { key: "clave", label: "Clave" },
  { key: "nombre", label: "Nombre completo" },
  { key: "rfc", label: "RFC" },
  ...CAMPOS_DIRECCION,
  ...CAMPOS_CONTACTO,
  { key: "fechaIngreso", label: "Fecha de ingreso", tipo: "date" },
  { key: "puesto", label: "Puesto" },
  { key: "chofer", label: "Chofer (tipo de licencia, si aplica)" },
];

// PROVEEDOR — también usado por Acreedor y Deudor Diverso (mismos campos)
const CAMPOS_PROVEEDOR = [
  ...CAMPOS_TIPO_OPERACION,
  { key: "categoria", label: "Categoría" },
  { key: "clave", label: "Clave" },
  { key: "nombre", label: "Nombre o razón social" },
  { key: "rfc", label: "RFC" },
  ...CAMPOS_DIRECCION,
  ...CAMPOS_CONTACTO,
  { key: "fechaIngreso", label: "Fecha de ingreso", tipo: "date" },
  { key: "razon", label: "Razón" },
  { key: "sucursal", label: "Sucursal" },
];

// CLIENTE
const CAMPOS_CLIENTE = [
  ...CAMPOS_TIPO_OPERACION,
  { key: "clave", label: "Clave" },
  { key: "nombre", label: "Nombre o razón social" },
  { key: "rfc", label: "RFC" },
  ...CAMPOS_DIRECCION,
  ...CAMPOS_CONTACTO,
  { key: "telefono2", label: "Teléfono 2", seccion: "Contacto" },
  { key: "correo2", label: "Correo 2", seccion: "Contacto" },
  { key: "condicionesPago", label: "Condiciones de pago" },
  { key: "limiteCredito", label: "Límite de crédito" },
  { key: "listaPrecios", label: "Lista de precios" },
  { key: "regimenFiscal", label: "Régimen fiscal" },
];

// ARTICULO — producto en Intelisis; también base de Activo Fijo (+ extras)
const CAMPOS_PRODUCTO = [
  ...CAMPOS_TIPO_OPERACION,
  { key: "clave", label: "Clave" },
  { key: "descripcion", label: "Descripción" },
  { key: "codProveedor", label: "Código de proveedor" },
  { key: "nombre", label: "Nombre" },
  { key: "unidadCompra", label: "Unidad de compra" },
  { key: "unidadVenta", label: "Unidad de venta" },
  { key: "unidadTraspaso", label: "Unidad de traspaso" },
  { key: "codSat", label: "Código SAT" },
  { key: "codBarras", label: "Código de barras" },
  { key: "peso", label: "Peso" },
  { key: "iva", label: "IVA" },
  { key: "categoriaProducto", label: "Categoría" },
  { key: "grupo", label: "Grupo" },
  { key: "familia", label: "Familia" },
  { key: "linea", label: "Línea" },
  { key: "marca", label: "Marca" },
  { key: "proveedor", label: "Proveedor" },
  { key: "observaciones", label: "Observaciones" },
];

// VEHICULOS — transportes
const CAMPOS_TRANSPORTES = [
  ...CAMPOS_TIPO_OPERACION,
  { key: "clave", label: "Clave" },
  { key: "modelo", label: "Modelo" },
  { key: "marca", label: "Marca" },
  { key: "noSerie", label: "No. de serie" },
  { key: "noMotor", label: "No. de motor" },
  { key: "placa", label: "Placa" },
  { key: "aseguradora", label: "Aseguradora" },
  { key: "poliza", label: "Póliza" },
  { key: "vigencia", label: "Vigencia", tipo: "date" },
  { key: "permisoSct", label: "Permiso SCT" },
  { key: "ejes", label: "Ejes" },
  { key: "pesoBruto", label: "Peso bruto" },
  { key: "capacidad", label: "Capacidad" },
  { key: "sucursalEnUso", label: "Sucursal en uso" },
  { key: "sucursalPropietaria", label: "Sucursal propietaria" },
];

// LIGADO — sucursal
const CAMPOS_SUCURSAL = [
  ...CAMPOS_TIPO_OPERACION,
  { key: "cliente", label: "Cliente" },
  { key: "noSucursal", label: "No. de sucursal" },
  { key: "nombre", label: "Nombre" },
  { key: "razon", label: "Razón" },
  { key: "rfc", label: "RFC" },
  ...CAMPOS_DIRECCION,
  ...CAMPOS_CONTACTO,
  { key: "nombreContacto", label: "Nombre y contacto", seccion: "Contacto" },
];

// PRECIOS
const CAMPOS_PRECIOS = [
  { key: "empresa", label: "Empresa" },
  { key: "sucursal", label: "Sucursal" },
  { key: "articulo", label: "Artículo" },
  { key: "precioPublico", label: "Precio público" },
  { key: "precioMinimo", label: "Precio mínimo" },
];

// AJUSTE — corrección de inventario
const CAMPOS_AJUSTE_INVENTARIO = [
  { key: "autoriza", label: "Autoriza" },
  { key: "tienda", label: "Tienda" },
  { key: "solicita", label: "Solicita" },
  { key: "clave", label: "Clave" },
  { key: "descripcion", label: "Descripción" },
  { key: "unidad", label: "Unidad" },
  { key: "almacen", label: "Almacén" },
  { key: "entrada", label: "Entrada" },
  { key: "salida", label: "Salida" },
  { key: "causa", label: "Causa" },
];

// CAPACITACION
const CAMPOS_CAPACITACION = [
  { key: "modulo", label: "Módulo" },
  { key: "submodulo", label: "Submódulo" },
  { key: "movimiento", label: "Movimiento" },
  {
    key: "teoriaPractica",
    label: "Teoría o práctica",
    tipo: "select",
    opciones: ["Teoría", "Práctica", "Ambas"],
  },
  { key: "observaciones", label: "Observaciones" },
];

// BONIFICACION — bonificaciones/devoluciones de ventas
const CAMPOS_BONIFICACION = [
  { key: "factura", label: "Factura" },
  { key: "tipo", label: "Tipo" },
  { key: "noCliente", label: "No. de cliente" },
  { key: "articuloCodigo", label: "Artículo (código)" },
  { key: "articuloDescripcion", label: "Artículo (descripción)" },
  { key: "cantidad", label: "Cantidad" },
  { key: "bonificacionPorArticulo", label: "Bonificación por artículo" },
  { key: "totalBonificar", label: "Total a bonificar" },
  { key: "totalVenta", label: "Total de venta" },
];

// Accesos — sin hoja propia en el Excel, campos genéricos ya validados antes
const CAMPOS_ACCESO_USUARIO = [
  { key: "nombreCompleto", label: "Nombre completo" },
  { key: "puestoArea", label: "Puesto / Área" },
  { key: "nivelAcceso", label: "Nivel de acceso solicitado" },
  { key: "sucursal", label: "Sucursal" },
];

// Activo Fijo — mismos campos que Producto, más los datos propios del activo
const CAMPOS_ACTIVO_FIJO = [
  ...CAMPOS_PRODUCTO,
  { key: "noSerieInventario", label: "No. de serie / inventario" },
  { key: "ubicacion", label: "Ubicación" },
  { key: "valor", label: "Valor" },
];

// Cancelación de movimientos — sin hoja propia, campos genéricos ya validados antes
const CAMPOS_CANCELACION_MOVIMIENTO = [
  {
    key: "tipoMovimiento",
    label: "Tipo de movimiento",
    tipo: "select",
    opciones: ["Cobro", "Factura", "Compras", "Gasto"],
  },
  { key: "folio", label: "Folio / número" },
  { key: "motivo", label: "Motivo" },
];

export const CATEGORIAS = [
  {
    categoria: "accesos",
    label: "Accesos",
    icono: "🔑",
    incidentes: [
      {
        asunto: "Alta de Usuario a Intelisis",
        prioridad: "Media",
        campos: CAMPOS_ACCESO_USUARIO,
      },
      { asunto: "Liberación/Autorización de pedidos", prioridad: "Alta" },
    ],
  },
  {
    categoria: "erp_capacitacion",
    label: "ERP - Capacitación",
    icono: "🎓",
    incidentes: [
      {
        asunto: "Capacitación del uso de Intelisis",
        prioridad: "Alta",
        campos: CAMPOS_CAPACITACION,
      },
    ],
  },
  {
    categoria: "erp_catalogo",
    label: "ERP - Catálogo",
    icono: "📋",
    incidentes: [
      {
        asunto: "Alta/Modificación/Baja de Empleado en Intelisis",
        prioridad: "Media",
        campos: CAMPOS_EMPLEADO,
      },
      {
        asunto: "Alta/Modificación/Baja de Proveedor en Intelisis",
        prioridad: "Media",
        campos: CAMPOS_PROVEEDOR,
      },
      {
        asunto: "Alta/Modificación/Baja de Producto en Intelisis",
        prioridad: "Alta",
        campos: CAMPOS_PRODUCTO,
      },
      {
        asunto: "Alta/Modificación/Baja de Cliente en sistema",
        prioridad: "Baja",
        campos: CAMPOS_CLIENTE,
      },
      {
        asunto: "Alta/Modificación/Baja de Acreedor en Intelisis",
        prioridad: "Media",
        // Mismos campos que Proveedor (confirmado)
        campos: CAMPOS_PROVEEDOR,
      },
      {
        asunto: "Alta/Modificación/Baja de Transportes en Intelisis",
        prioridad: "Media",
        campos: CAMPOS_TRANSPORTES,
      },
      {
        asunto: "Alta/Modificación/Baja de Activo Fijo en Intelisis",
        prioridad: "Media",
        campos: CAMPOS_ACTIVO_FIJO,
      },
      {
        asunto: "Actualización de Precios (lista o producto único) en sistema",
        prioridad: "Alta",
        campos: CAMPOS_PRECIOS,
      },
      {
        asunto: "Alta/Modificación/Baja de Deudor Diverso en Intelisis",
        prioridad: "Media",
        // Mismos campos que Proveedor (confirmado)
        campos: CAMPOS_PROVEEDOR,
      },
      {
        asunto: "Alta/Modificación/Baja de Sucursal en Intelisis",
        prioridad: "Critica",
        campos: CAMPOS_SUCURSAL,
      },
      {
        asunto: "Ajuste/Corrección de inventario (solicitud)",
        prioridad: "Alta",
        campos: CAMPOS_AJUSTE_INVENTARIO,
      },
    ],
  },
  {
    categoria: "erp_movimientos",
    label: "ERP - Movimientos",
    icono: "💱",
    incidentes: [
      {
        asunto: "Consumo de tiendas (insumos de productos)",
        prioridad: "Media",
      },
      {
        asunto: "Cancelación de movimientos (cobro, factura, compras o gasto)",
        prioridad: "Alta",
        campos: CAMPOS_CANCELACION_MOVIMIENTO,
      },
      {
        asunto: "Devolución de gastos x comprobar (viáticos)",
        prioridad: "Baja",
      },
      { asunto: "Captura de deudor diverso y/o cobro", prioridad: "Media" },
    ],
  },
  {
    categoria: "facturacion",
    label: "Facturación",
    icono: "🧾",
    incidentes: [
      {
        asunto: "Bonificaciones/Devoluciones de ventas",
        prioridad: "Media",
        campos: CAMPOS_BONIFICACION,
      },
      { asunto: "Timbrado de facturas y/o cobros CFDI", prioridad: "Critica" },
      {
        asunto: "Auditoría de servicio de envío masivo de facturas",
        prioridad: "Media",
      },
    ],
  },
  {
    categoria: "hardware",
    label: "Hardware",
    icono: "🖨️",
    incidentes: [
      {
        asunto: "Impresora en auxilio (no deja imprimir en el ERP)",
        prioridad: "Alta",
      },
      { asunto: "Gestión de compra de equipo de cómputo", prioridad: "Media" },
      {
        asunto: "Configuración de equipo de cómputo nuevo",
        prioridad: "Media",
      },
      {
        asunto:
          "Configuración/Mantenimiento (preventivo/correctivo) de equipo de cómputo",
        prioridad: "Baja",
      },
      {
        asunto:
          "Instalación/Configuración/Mantenimiento de equipo de vigilancia",
        prioridad: "Alta",
      },
    ],
  },
  {
    categoria: "redes",
    label: "Redes",
    icono: "🔌",
    incidentes: [
      {
        asunto: "El sistema no inicia (por router Ubiquiti)",
        prioridad: "Critica",
      },
      { asunto: "Problema de conectividad (por wifiman)", prioridad: "Alta" },
    ],
  },
  {
    categoria: "software",
    label: "Software",
    icono: "💻",
    incidentes: [
      {
        asunto:
          "Alta/Modificación/Baja de cuenta de correo electrónico/Dropbox",
        prioridad: "Media",
      },
      { asunto: "Intelisis en pantalla azul", prioridad: "Critica" },
      {
        asunto:
          "Configuración o corrección de Correo electrónico/Teams/Dropbox/NAS",
        prioridad: "Media",
      },
      {
        asunto: "Actualización de información portales web (Supermat o PAR)",
        prioridad: "Media",
      },
      {
        asunto: "El sistema no inicializa (por actualizaciones)",
        prioridad: "Critica",
      },
      { asunto: "Solicitud de reporte especial", prioridad: "Media" },
    ],
  },
];

// Lista plana (categoria + asunto + prioridad), útil para búsquedas tipo "find" por asunto.
export const catalogoIncidentes = CATEGORIAS.flatMap((grupo) =>
  grupo.incidentes.map((incidente) => ({
    asunto: incidente.asunto,
    categoria: grupo.categoria,
    prioridad: incidente.prioridad,
    campos: incidente.campos ?? null,
  })),
);
