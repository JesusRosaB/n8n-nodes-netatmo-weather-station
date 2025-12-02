# n8n-nodes-netatmo-weather-station

Este es un nodo de n8n para obtener datos de estaciones meteorológicas Netatmo.

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

## Tabla de contenidos

- [Instalación](#instalación)
- [Configuración](#configuración)
- [Operaciones](#operaciones)
- [Credenciales](#credenciales)
- [Uso](#uso)
- [Compatibilidad](#compatibilidad)
- [Recursos](#recursos)

## Instalación

### Instalación desde la comunidad (cuando esté publicado)

```bash
npm install n8n-nodes-netatmo-weather-station
```

### Instalación local para desarrollo

1. Clona o descarga este repositorio
2. Navega al directorio del proyecto
3. Instala las dependencias:

```bash
npm install
```

4. Compila el proyecto:

```bash
npm run build
```

5. Enlaza el paquete localmente:

```bash
npm link
```

6. En tu instalación de n8n, enlaza el nodo:

```bash
cd ~/.n8n/custom
npm link n8n-nodes-netatmo-weather-station
```

7. Reinicia n8n

## Configuración

### Requisitos previos

Antes de usar este nodo, necesitas:

1. Una cuenta de Netatmo
2. Una estación meteorológica Netatmo configurada
3. Una aplicación registrada en el portal de desarrolladores de Netatmo

### Crear una aplicación en Netatmo

1. Ve a [https://dev.netatmo.com](https://dev.netatmo.com)
2. Inicia sesión con tu cuenta de Netatmo
3. Ve a "My Apps" y crea una nueva aplicación
4. Anota el **Client ID** y **Client Secret**
5. Configura la URL de redirección (por ejemplo: `http://localhost`)

### Obtener el Refresh Token

Para obtener el Refresh Token, necesitas completar el flujo OAuth2:

1. Construye la URL de autorización:
```
https://api.netatmo.com/oauth2/authorize?client_id=TU_CLIENT_ID&redirect_uri=TU_REDIRECT_URI&scope=read_station&state=STATE
```

2. Abre esta URL en tu navegador e inicia sesión
3. Autoriza la aplicación
4. Serás redirigido a tu URL con un código de autorización en la URL
5. Intercambia el código por tokens usando:

```bash
curl -X POST https://api.netatmo.com/oauth2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=TU_CLIENT_ID" \
  -d "client_secret=TU_CLIENT_SECRET" \
  -d "code=TU_CODIGO" \
  -d "redirect_uri=TU_REDIRECT_URI"
```

6. La respuesta incluirá el `refresh_token` que necesitas guardar

## Credenciales

Para configurar las credenciales en n8n:

1. Ve a **Credentials** en el menú de n8n
2. Haz clic en **New Credential**
3. Busca y selecciona **Netatmo API**
4. Completa los campos:
   - **Client ID**: El Client ID de tu aplicación Netatmo
   - **Client Secret**: El Client Secret de tu aplicación Netatmo
   - **Refresh Token**: El Refresh Token obtenido del flujo OAuth2
5. Haz clic en **Save**

## Operaciones

### Get Station Data

Obtiene datos de una o más estaciones meteorológicas Netatmo.

#### Parámetros

- **Device ID** (opcional): El ID del dispositivo de tu estación Netatmo
  - Si se deja vacío, se obtendrán datos de todas tus estaciones
  - Formato: `70:ee:50:xx:xx:xx`
  
- **Get Favorites** (boolean): Si se marca, recupera las estaciones favoritas
  - Por defecto: `false`

#### Respuesta

El nodo devuelve un objeto JSON con la estructura definida por la API de Netatmo:

```json
{
  "devices": [
    {
      "_id": "70:ee:50:xx:xx:xx",
      "station_name": "Mi Estación",
      "module_name": "Interior",
      "dashboard_data": {
        "time_utc": 1234567890,
        "Temperature": 22.5,
        "Humidity": 65,
        "CO2": 450,
        "Pressure": 1013.5,
        "Noise": 35
      },
      "modules": [...]
    }
  ]
}
```

## Uso

### Ejemplo básico

1. Arrastra el nodo **Netatmo** a tu workflow
2. Selecciona la operación **Get Station Data**
3. Configura tus credenciales
4. (Opcional) Introduce el Device ID de una estación específica
5. Ejecuta el nodo

### Ejemplo de workflow

```
Trigger (Schedule) → Netatmo → Procesar datos → Guardar en base de datos
```

### Casos de uso

- **Monitoreo continuo**: Programa el nodo para obtener datos cada hora
- **Alertas**: Combina con nodos de condición para enviar notificaciones cuando se superen ciertos umbrales
- **Análisis histórico**: Almacena datos en una base de datos para análisis posteriores
- **Dashboard**: Envía datos a servicios de visualización como Grafana

## Compatibilidad

- **n8n version**: 1.0.0 o superior
- **Node.js**: 14.x o superior

## Estructura del proyecto

```
n8n-nodes-netatmo-weather-station/
├── credentials/
│   └── NetatmoApi.credentials.ts
├── nodes/
│   └── Netatmo/
│       └── Netatmo.node.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Desarrollo

### Compilar el proyecto

```bash
npm run build
```

### Modo desarrollo (watch)

```bash
npm run dev
```

### Formatear código

```bash
npm run format
```

### Lint

```bash
npm run lint
npm run lintfix
```

## Recursos

- [Documentación de Netatmo API](https://dev.netatmo.com/apidocumentation/weather)
- [Documentación de n8n](https://docs.n8n.io/)
- [Crear nodos personalizados en n8n](https://docs.n8n.io/integrations/creating-nodes/)

## Licencia

ISC

## Autor

Jesus Rosa Bilbao

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

## Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la [documentación de Netatmo](https://dev.netatmo.com/)
2. Consulta los [logs de n8n](https://docs.n8n.io/hosting/logging-monitoring/)
3. Abre un issue en el repositorio del proyecto

## Changelog

### 1.0.0
- Versión inicial
- Soporte para obtener datos de estaciones meteorológicas
- Operación Get Station Data implementada