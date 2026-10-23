-- ==============================================================================
-- 🚀 SUPER SCRIPT SQL COMPLETO - SUPABASE
-- PROYECTO: DISTINCIÓN INMOBILIARIA TAVARES
-- (SIN ERRORES DE COLUMNA FALTANTE, SIN BLOQUEOS RLS, ACCESO DIRECTO PARA ADMIN Y USUARIOS)
-- ==============================================================================
-- Instrucciones:
-- 1. Copia y pega este script completo en el SQL Editor de tu panel de Supabase.
-- 2. Haz clic en "RUN".
-- ==============================================================================

-- 1. CREACIÓN DE TABLAS (SI NO EXISTEN)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT,
    phone TEXT,
    role TEXT DEFAULT 'client', -- 'admin' o 'client'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_settings (
    id SERIAL PRIMARY KEY,
    admin_key TEXT NOT NULL DEFAULT 'admin2026',
    agency_name TEXT DEFAULT 'Distinción Inmobiliaria Tavares',
    contact_phone TEXT DEFAULT '04128850028',
    secondary_phone TEXT DEFAULT '04144912824',
    contact_email TEXT DEFAULT 'distincioninmobiliariatavares@gmail.com',
    tiktok TEXT DEFAULT '',
    instagram TEXT DEFAULT '',
    threads TEXT DEFAULT '',
    facebook TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.properties (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    price TEXT NOT NULL,
    "rawPrice" NUMERIC DEFAULT 0,
    location TEXT NOT NULL,
    city TEXT,
    beds INTEGER DEFAULT 0,
    baths NUMERIC DEFAULT 0,
    sqm NUMERIC DEFAULT 0,
    image TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    "videoUrl" TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.zones (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.team_members (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    category TEXT NOT NULL, -- 'abogado' o 'asesor'
    bio TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    specialty TEXT,
    slogan TEXT,
    ci TEXT,
    instagram TEXT,
    tiktok TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.appointments (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    date TEXT,
    service TEXT,
    message TEXT,
    "createdAt" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ASEGURAR QUE TODAS LAS COLUMNAS EXISTAN (Prevención de Error 42703 "column does not exist")
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS secondary_phone TEXT DEFAULT '';
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS tiktok TEXT DEFAULT '';
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS instagram TEXT DEFAULT '';
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS threads TEXT DEFAULT '';
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS facebook TEXT DEFAULT '';

ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS instagram TEXT DEFAULT '';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS tiktok TEXT DEFAULT '';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '';

-- 3. ELIMINAR A GILBERTO DE LA BASE DE DATOS (SI EXISTÍA)
DELETE FROM public.team_members WHERE id = 4 OR name LIKE '%Gilberto%';

-- 4. DESACTIVAR ROW LEVEL SECURITY (RLS) PARA ACCESO SIN RESTRICCIONES DDL/DML
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 5. INSERTAR / ACTUALIZAR DATOS INICIALES

-- Configuración de Administración
INSERT INTO public.admin_settings (id, admin_key, agency_name, contact_phone, secondary_phone, contact_email)
VALUES (1, 'admin2026', 'Distinción Inmobiliaria Tavares', '04128850028', '04144912824', 'distincioninmobiliariatavares@gmail.com')
ON CONFLICT (id) DO UPDATE SET 
    contact_email = EXCLUDED.contact_email,
    contact_phone = EXCLUDED.contact_phone;

-- Usuario Administrador Principal
INSERT INTO public.users (email, name, role, phone)
VALUES ('distincioninmobiliariatavares@gmail.com', 'Administradora Principal', 'admin', '04128850028')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Zonas y Ciudades de Búsqueda
INSERT INTO public.zones (name) VALUES
('Caracas'), ('Valencia'), ('Lechería'), ('Maracaibo'), 
('Margarita'), ('Barquisimeto'), ('Maracay'), ('Las Mercedes'), 
('Altamira'), ('Campo Alegre'), ('El Rosal'), ('Valle Arriba'), 
('La Castellana'), ('Los Palos Grandes'), ('Prados del Este'), ('Chacao')
ON CONFLICT (name) DO NOTHING;

-- Tipos de Operación / Categorías
INSERT INTO public.categories (id, name) VALUES
('en-venta', 'En Venta'),
('en-alquiler', 'En Alquiler'),
('preventa', 'En Preventa')
ON CONFLICT (id) DO NOTHING;

-- Equipo Oficial (Abogados y Asesores)
INSERT INTO public.team_members (id, name, role, category, bio, phone, whatsapp, specialty, image, email, instagram, tiktok, ci)
VALUES
(
  2,
  'Abog. Yoselyn Oliveros',
  'Abogada & Broker Inmobiliario | Directora General',
  'abogado',
  'Abogada especialista en negocios inmobiliarios, fundadora y Directora General de firma inmobiliaria. Me enfoco en la gestión, estructuración y cierre de negociaciones exitosas, combinando respaldo legal riguroso con un servicio de alta gama. En nuestra organización, la prioridad son los clientes y nuestro principal pilar es nuestro equipo de asesores: profesionales altamente capacitados para blindar jurídicamente cada transacción y garantizar el éxito de cada operación.',
  '0414-4912824',
  '+584144912824',
  'Especialista en Negocios Inmobiliarios & Blindaje Jurídico Integral',
  'https://i.ibb.co/V0sXFRyj/Joselyntavares.png',
  NULL, NULL, NULL, NULL
),
(
  6,
  'Abog. Michellisabel Mezzadri',
  'Abogada, Asesora Jurídica & Emprendedora Multidisciplinaria',
  'abogado',
  'Abogada, asesora jurídica y emprendedora multidisciplinaria. Su trayectoria destaca por combinar una sólida práctica jurídica con una activa participación en el desarrollo comunitario, institucional y de liderazgo femenino. Creadora de contenido jurídico y directora de su propia agencia de viajes online comercializando boletos aéreos nacionales e internacionales.',
  '0414-3820097',
  '+584143820097',
  'Práctica Jurídica, Asesoría Legal Inmobiliaria & Liderazgo',
  'https://i.ibb.co/QFWNyT2q/Michell.jpg',
  'Abgmezzadri@gmail.com',
  'Abgmezzadri',
  'Abogadamezzadri',
  NULL
),
(
  7,
  'Abg. Juan Carlos Ramírez',
  'Abogado Corporativo, Mercantil & Asesor Inmobiliario',
  'abogado',
  'Abogado especialista en derecho civil, mercantil y corporativo, con amplia trayectoria y destrezas en el ramo inmobiliario. Experto en la estructuración de cierres de negocios, gestión de ventas ante registros, tramitación legal completa y resguardo de operaciones comerciales. Aporta un respaldo jurídico fundamental dentro del equipo, garantizando seguridad, agilidad y transparencia en cada etapa de la negociación para la tranquilidad de la organización y sus clientes.',
  '+58 412-5264370',
  '+584125264370',
  'Derecho Civil, Mercantil, Corporativo, Registros & Tramitación Legal Completa',
  'https://i.postimg.cc/PJtQ4tnX/IMG-20260928-WA0182-jpg.jpg',
  NULL, NULL, NULL, NULL
),
(
  9,
  'Abg. Andrés Barrios',
  'Gestor Inmobiliario & Especialista en Derecho Procesal Civil',
  'abogado',
  'Abogado con estudios de postgrado en Derecho Procesal Civil, experto en redacción jurídica, oratoria profesional y gestión de trámites patrimoniales. Excelente gestor inmobiliario, enfocado en optimizar tiempos de respuesta, revisar expedientes y ofrecer un respaldo legal impecable para la compra, venta, alquiler y formalización de contratos en Distinción Inmobiliaria Tavares.',
  '+58 412-3440267',
  '+584123440267',
  'Derecho Procesal Civil, Redacción Jurídica & Gestión de Trámites Patrimoniales',
  'https://i.ibb.co/3yS3ddZR/Andres-Barrios.jpg',
  NULL, NULL, NULL, NULL
),
(
  1,
  'Lcda. Yessica Tavares',
  'Economista, Contadora Pública & Broker Inmobiliario',
  'asesor',
  'Profesional de las ciencias económicas y contables especializada en la dirección de negocios inmobiliarios y en la estructuración de cierres de negociación de alto nivel. Lidero una agencia inmobiliaria enfocada en brindar asesoría integral de alta calidad, respaldo jurídico y una rigurosa gestión financiera para blindar el capital de cada cliente, garantizando transacciones 100% seguras y sin margen de error.',
  '0412-8850028',
  '+584128850028',
  'Dirección de Negocios Inmobiliarios & Gestión Financiera de Alto Nivel',
  'https://i.postimg.cc/C1ggTKP4/Whats-App-Image-2026-10-13-at-09-07-17.jpg',
  NULL, NULL, NULL, NULL
),
(
  3,
  'Lcdo. Leonardo Morillo',
  'Economista | Contador Público | Auditor | Asesor Inmobiliario',
  'asesor',
  'Profesional calificado de las ciencias económicas y contables, especializado en auditoría, análisis financiero y gestión de negocios inmobiliarios. Combinación sólida de rigor analítico y visión de mercado, orientada a la evaluación de riesgos, la optimización de inversiones y la estructuración de negociaciones de alto valor. Destaca por sus altas habilidades interpersonales, atención al público, liderazgo colaborativo y capacidad para trabajar en equipo dentro de la organización. Su enfoque está orientado a resultados, garantizando un acompañamiento integral y altamente capacitado para lograr cierres exitosos y seguros.',
  '0424-3287033',
  '+584243287033',
  'Auditoría, Análisis Financiero, Evaluación de Riesgos & Negociaciones de Alto Valor',
  'https://i.ibb.co/dJm7yyVH/Leonard.jpg',
  NULL, NULL, NULL, NULL
),
(
  5,
  'Lcda. Liliana Marui Buitrago Torrealba',
  'Licenciada | Especialista en Ventas & Captación Inmobiliaria',
  'asesor',
  'Licenciada experta en ventas y relaciones interpersonales, destacada como una captadora de inmuebles altamente calificada. Su gran capacidad de adaptación y desenvolvimiento eficiente en diversos entornos le permite conectar de manera asertiva con el público y estructurar procesos enfocados en lograr ventas exitosas.',
  '+58 414-9448980',
  '+584149448980',
  'Ventas de Alto Impacto, Captación Inmobiliaria & Conexión con el Cliente',
  'https://i.ibb.co/8RNDcVj/Liliana.jpg',
  NULL, NULL, NULL, NULL
),
(
  8,
  'Yusmarlyk Cárdenas Álvarez',
  'Asesora Inmobiliaria & Especialista en Análisis Financiero de Activos',
  'asesor',
  'Contadora Pública y T.S.U. en Administración (Mención Costos) con alta destreza en la estructuración de negocios y transacciones inmobiliarias. Su sólida formación económico-financiera le permite ofrecer una asesoría integral en valoración de propiedades, análisis de retorno de inversión, estructuración de costos e intermediación segura para la compra, venta y alquiler de bienes inmuebles.',
  '+58 412-4660627',
  '+584124660627',
  'Valoración de Propiedades, Retorno de Inversión (ROI), Costos & Intermediación Segura',
  'https://i.ibb.co/27X8BHZJ/Yusmarlyn.jpg',
  NULL, NULL, NULL, '15.734.964'
),
(
  10,
  'Dailyn Martínez',
  'Asesora Inmobiliaria & Especialista en Ventas',
  'asesor',
  'Dailyn destaca por su gran carisma, capacidad de relacionamiento y sólida experiencia en la atención al público. Su destreza comercial y visión orientada al cliente le permiten entender con precisión las necesidades de cada comprador y vendedor, facilitando negociaciones fluidas y transparentes. En Distinción Inmobiliaria Tavares, Dailyn brinda una asesoría cercana, personalizada y comprometida en transformar cada requerimiento patrimonial en un negocio exitoso.',
  '0412-4209633',
  '+584124209633',
  'Ventas Inmobiliarias, Atención al Cliente & Negociaciones Fluidas',
  'https://i.ibb.co/NctXgF3/Daylin.jpg',
  NULL, NULL, NULL, NULL
),
(
  11,
  'Jaime Herrera',
  'Asesor Comercial Inmobiliario & Especialista en Cierres',
  'asesor',
  'El Sr. Jaime Herrera es un destacado especialista en el área comercial inmobiliaria, reconocido por su excepcional capacidad de negociación y efectividad en el logro de cierres de negocios exitosos. Cuenta con una amplia y sólida cartera de clientes, construida a base de confianza, ética profesional y un profundo conocimiento del mercado patrimonial. Su enfoque estratégico y habilidad para identificar oportunidades de alto valor le permiten conectar con éxito las necesidades de compradores e inversionistas, garantizando transacciones eficientes y de máximo nivel en Distinción Inmobiliaria Tavares.',
  '+58 414-4947960',
  '+584144947960',
  'Cierres de Negocios de Alto Nivel, Estrategia Comercial & Gestión de Inversionistas',
  'https://i.ibb.co/7dDJrgjB/Jaime-herrera.jpg',
  NULL, NULL, NULL, NULL
),
(
  12,
  'Lic. Nicole Machado',
  'Asesora Inmobiliaria',
  'asesor',
  'Asesora inmobiliaria altamente calificada y orientada al cliente. Destaca por su dinamismo, ética profesional y compromiso constante en brindar soluciones habitacionales e de inversión adaptadas a las necesidades de cada comprador y vendedor.',
  '+58 412-8850028',
  '+584128850028',
  'Asesoría Comercial & Soluciones Habitacionales',
  'https://i.ibb.co/j9L3v6YW/Nicol.jpg',
  NULL, NULL, NULL, NULL
),
(
  13,
  'Lic. Marianela Machado',
  'Asesora Inmobiliaria en Distinción Inmobiliaria Tavares',
  'asesor',
  'Licenciada con amplia trayectoria y experiencia comprobada en el área de ventas y relaciones interpersonales. Su habilidad para conectar de manera empática y profesional con los clientes le permite construir relaciones sólidas y de confianza, fundamentales para garantizar negociaciones fluidas y ventas altamente exitosas. Con residencia y dominio del mercado en el Estado Aragua, ofrece una asesoría integral, transparente y personalizada para la compra, venta o alquiler de sus inmuebles.',
  '+58 414-4885686',
  '+584144885686',
  'Ventas de Alto Impacto, Mercado Aragua & Captación Inmobiliaria',
  'https://i.postimg.cc/4xnwqN7d/image.png',
  NULL, NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  specialty = EXCLUDED.specialty,
  image = EXCLUDED.image;

-- FIN DEL SCRIPT SQL COMPLETO
