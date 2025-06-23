# 🏥 Predictor de Reembolsos

Un sistema de predicción de reembolsos médicos que utiliza múltiples modelos de machine learning para predecir la probabilidad de aprobación, montos esperados y tiempos de espera en seguros de salud chilenos.

## 🚀 Características

- **Múltiples Modelos ML**: Integra 3 modelos diferentes para predicciones robustas
  - Regresión Logística: Probabilidad de aprobación/rechazo
  - Red Bayesiana: Monto esperado y días de espera
  - Modelo de Mezcla Gaussiana (GMM): Análisis probabilístico avanzado

- **Interfaz Moderna**: Frontend React con animaciones futuristas y diseño glassmorphism
- **API Robusta**: Backend FastAPI con almacenamiento en Cloudflare R2
- **Predicciones en Tiempo Real**: Ejecuta los 3 modelos concurrentemente
- **Soporte UTF-8**: Compatible con caracteres especiales del español

## 🏗️ Arquitectura

```
predictor-reembolsos/
├── backend/           # FastAPI + ML Models
│   ├── cloudflare/    # R2 Storage Client
│   ├── inference/     # ML Pipeline
│   └── main.py        # API Endpoints
└── frontend/          # React + TypeScript
    ├── src/
    │   ├── components/
    │   ├── lib/
    │   └── routes/
    └── public/
```

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI**: Framework web moderno y rápido
- **Python 3.8+**: Lenguaje principal
- **Cloudflare R2**: Almacenamiento de modelos ML
- **Pydantic**: Validación de datos
- **Asyncio**: Procesamiento asíncrono

### Frontend
- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático
- **TanStack Router**: Enrutamiento moderno
- **Tailwind CSS v4**: Estilos utilitarios
- **Vite**: Build tool y dev server

### Machine Learning
- **Scikit-learn**: Regresión logística
- **Bayesian Networks**: Predicción probabilística
- **Gaussian Mixture Models**: Análisis de clusters

## 📋 Requisitos Previos

- **Node.js** 18+ y npm/yarn
- **Python** 3.8+
- **Cloudflare R2** (para almacenamiento de modelos)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/predictor-reembolsos.git
cd predictor-reembolsos
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.template .env
# Editar .env con tus credenciales de Cloudflare R2
```

**Variables de entorno requeridas:**
```env
# Cloudflare R2
R2_ACCOUNT_ID=tu_account_id
R2_ACCESS_KEY_ID=tu_access_key
R2_SECRET_ACCESS_KEY=tu_secret_key
R2_BUCKET_NAME=tu_bucket_name
R2_ENDPOINT_URL=tu_account_id

# Nombres de modelos en R2
LOGISTIC_MODEL_NAME=logistic_regressor
BAYESIAN_MODEL_NAME=discrete_bayesian_network
GMM_MODEL_NAME=gmm
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.template .env
# La URL del backend (por defecto: http://localhost:8000)
```

## 🏃‍♂️ Ejecución

### Desarrollo

**Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Producción

**Backend:**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Documentation

### Endpoints Principales

#### `POST /predict`
Realiza predicción con todos los modelos disponibles.

**Request Body:**
```json
{
  "isapre": "FONASA",
  "tipo": "CONSULTA_MEDICA", 
  "total": 50000
}
```

**Response:**
```json
{
  "logistic_regression": {
    "probability": 0.85,
    "chosen_class": "approved",
    "interpretation": "Aprobado"
  },
  "bayesian_network": {
    "probability": 0.82,
    "expected_reimbursement": 42000,
    "expected_wait": 3.5
  },
  "gmm": {
    "probability": 0.78
  }
}
```

#### `GET /debug`
Endpoint de prueba que ejecuta inferencia con datos de ejemplo.

### Valores Soportados

**Isapres:**
- FONASA, ISAPRE_COLMENA, BANMEDICA, CONSALUD, CRUZ_BLANCA, NUEVA_MASVIDA, VIDA_TRES, ESENCIAL, OPTIMA

**Tipos de Servicios:**
- CONSULTA_MEDICA, EXAMENES, HOSPITALIZACION, CIRUGIA, DENTAL, MATERNIDAD, URGENCIA, MEDICINA_PREVENTIVA, KINESIOLOGIA, PSICOLOGIA, OFTALMOLOGIA, OTROS

## 🎨 Características de la UI

- **Diseño Futurista**: Efectos glassmorphism y gradientes animados
- **Animaciones Fluidas**: Transiciones suaves y efectos hover
- **Responsive**: Adaptable a todos los tamaños de pantalla
- **Validación en Tiempo Real**: Feedback inmediato del formulario
- **Estados de Carga**: Indicadores visuales durante las predicciones
- **Manejo de Errores**: Mensajes claros y opciones de reintento

## 🧪 Testing

### Backend
```bash
cd backend
python -m pytest tests/
```

### Frontend
```bash
cd frontend
npm run test
```

## 📦 Despliegue

### Backend (Railway/Heroku)
1. Configurar variables de entorno en la plataforma
2. Conectar repositorio
3. Desplegar desde `backend/`

### Frontend (Vercel/Netlify)
1. Conectar repositorio
2. Configurar build command: `npm run build`
3. Configurar output directory: `dist`
4. Configurar variables de entorno

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Reconocimientos

- Basado en las mejores prácticas de [FastAPI Best Practices](https://github.com/zhanymkanov/fastapi-best-practices)
