-- ==============================================================================
-- 🚀 SUPER SCRIPT SQL COMPLETO - SUPABASE
-- PROYECTO: DISTINCIÓN INMOBILIARIA TAVARES
-- (SIN RLS, ACCESO DIRECTO, SIN CONFIRMACIÓN DE EMAIL PARA REGISTRO/LOGIN)
-- ==============================================================================
-- Instrucciones:
-- 1. Copia y pega este script completo en el SQL Editor de tu panel de Supabase.
-- 2. Haz clic en "RUN".
-- ==============================================================================

-- 1. TABLA DE USUARIOS (Registro y Login Directo sin confirmación)
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

-- 2. TABLA DE CONFIGURACIÓN DEL PANEL ADMINISTRATIVO
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id SERIAL PRIMARY KEY,
    admin_key TEXT NOT NULL DEFAULT 'admin2026',
    agency_name TEXT DEFAULT 'Distinción Inmobiliaria Tavares',
    contact_phone TEXT DEFAULT '04128850028',
    contact_email TEXT DEFAULT 'contacto@tavaresinmobiliaria.com',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA DE INMUEBLES / PROPIEDADES
CREATE TABLE IF NOT EXISTS public.properties (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'en-venta', 'en-alquiler', etc.
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

-- 4. TABLA DE ZONAS Y CIUDADES (Variables de búsqueda)
CREATE TABLE IF NOT EXISTS public.zones (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA DE CATEGORÍAS / TIPOS DE OPERACIÓN
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA DE EQUIPO PROFESIONAL (Abogados y Asesores)
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA DE CITAS Y SOLICITUDES DE CONTACTO
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

-- ==============================================================================
-- 🔓 DESACTIVACIÓN TOTAL DE ROW LEVEL SECURITY (RLS) - SIN BLOQUEOS
-- ==============================================================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;

-- Concesión de permisos universales (lectura, escritura, actualización y eliminación directa)
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- ==============================================================================
-- 📦 DATOS INICIALES SEMILLAS (PRE-POBLACIÓN DE LA WEB)
-- ==============================================================================

-- 1. Administrador por defecto y configuración
INSERT INTO public.admin_settings (id, admin_key, agency_name, contact_phone, contact_email)
VALUES (1, 'admin2026', 'Distinción Inmobiliaria Tavares', '04128850028', 'contacto@tavaresinmobiliaria.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (email, name, role, phone)
VALUES ('admin@tavares.com', 'Administrador Principal', 'admin', '04128850028')
ON CONFLICT (email) DO NOTHING;

-- 2. Zonas y Ciudades
INSERT INTO public.zones (name) VALUES
('Las Mercedes'),
('Altamira'),
('Campo Alegre'),
('El Rosal'),
('Valle Arriba'),
('La Castellana'),
('Los Palos Grandes'),
('Prados del Este'),
('Chacao')
ON CONFLICT (name) DO NOTHING;

-- 3. Categorías / Tipos de Operación
INSERT INTO public.categories (id, name) VALUES
('en-venta', 'En Venta'),
('en-alquiler', 'En Alquiler'),
('preventa', 'En Preventa')
ON CONFLICT (id) DO NOTHING;

-- 4. Inmuebles Iniciales
INSERT INTO public.properties (id, title, type, price, "rawPrice", location, city, beds, baths, sqm, image, images, "videoUrl", description, features)
VALUES 
(
  1, 
  'Casa de Lujo en Las Mercedes', 
  'en-venta', 
  '$ 850.000', 
  850000, 
  'Las Mercedes, Caracas', 
  'Las Mercedes', 
  4, 
  4.5, 
  450, 
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000',
  '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000"]'::jsonb,
  'https://www.youtube.com/embed/ScMzIvxBSi4',
  'Espectacular casa de lujo ubicada en el corazón de Las Mercedes, con acabados de primera, amplios espacios sociales, jardín privado, seguridad 24/7 y excelente iluminación natural.',
  '["Jardín privado", "Seguridad 24/7", "Estacionamiento techado", "Pisos de mármol", "Cocina equipada"]'::jsonb
),
(
  2, 
  'Apartamento en Altamira', 
  'en-alquiler', 
  '$ 2.500 / mes', 
  2500, 
  'Altamira, Caracas', 
  'Altamira', 
  3, 
  3, 
  180, 
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
  '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000"]'::jsonb,
  'https://www.youtube.com/embed/ScMzIvxBSi4',
  'Moderno apartamento amoblado en Altamira con vista panorámica al Ávila, planta eléctrica total, ascensor privado y acabados modernos de alta gama.',
  '["Vista al Ávila", "Planta eléctrica", "Ascensor privado", "Amoblado de lujo", "Maletero"]'::jsonb
),
(
  3, 
  'Penthouse en Campo Alegre', 
  'en-venta', 
  '$ 1.200.000', 
  1200000, 
  'Campo Alegre, Caracas', 
  'Campo Alegre', 
  4, 
  5, 
  620, 
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000',
  '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000"]'::jsonb,
  'https://www.youtube.com/embed/ScMzIvxBSi4',
  'Exclusivo penthouse dúplex en Campo Alegre con terraza privada de 360 grados, acabados de ultra lujo, doble altura y máxima seguridad.',
  '["Terraza 360", "Doble altura", "Vigilancia privada", "4 puestos techados", "Jacuzzi"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 5. Equipo Oficial (Abogados y Asesores)
INSERT INTO public.team_members (id, name, role, category, bio, phone, whatsapp, specialty, slogan, email, instagram, tiktok, ci)
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
  NULL, NULL, NULL, NULL, NULL
),
(
  4,
  'Gilberto José Sánchez',
  'Economista, Contador Público y Abogado',
  'abogado',
  'Gilberto José Sánchez es un profesional de alto valor con una sólida y multidisciplinaria preparación académica como Economista, Contador Público y Abogado. Cuenta con amplias destrezas en el ramo inmobiliario y una destacada capacidad para desenvolverse con el público, construyendo relaciones de confianza basadas en la empatía y la excelencia. Su gestión garantiza una absoluta transparencia jurídica y rigurosidad financiera en cada proceso, protegiendo los intereses de cada cliente en todas las etapas de la negociación. Con un liderazgo orientado a resultados, Gilberto aporta el conocimiento y la visión estratégica necesarios para transformar cada negociación en un sueño realizado.',
  '0412-0370903',
  '+584120370903',
  'Economía, Contabilidad & Derecho Inmobiliario Estratégico Multidisciplinario',
  'Tu aliado estratégico: economía, contabilidad y derecho en un solo lugar.',
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
  NULL,
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
  NULL, NULL, NULL, NULL, NULL
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
  NULL, NULL, NULL, NULL, NULL
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
  NULL, NULL, NULL, NULL, NULL
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
  NULL, NULL, NULL, NULL, NULL
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
  NULL, NULL, NULL, NULL, NULL
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
  NULL, NULL, NULL, NULL, '15.734.964'
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
  NULL, NULL, NULL, NULL, NULL
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
  NULL, NULL, NULL, NULL, NULL
)
ON CONFLICT (id) DO NOTHING;

-- 6. Solicitudes de Citas Iniciales
INSERT INTO public.appointments (id, name, phone, email, date, service, message, "createdAt")
VALUES
(
  1,
  'Dra. Carolina Mendoza',
  '0414-2345678',
  'carolina.mendoza@email.com',
  '2026-10-02',
  'Compra de Propiedad',
  'Interesada en coordinar visita a la quinta de Las Mercedes.',
  '28 Sep 2026'
),
(
  2,
  'Ing. Roberto Albornoz',
  '0412-9876543',
  'roberto.albornoz@empresa.com',
  '2026-10-04',
  'Auditoría Documental',
  'Revisión jurídica para adquisición de oficina corporativa.',
  '29 Sep 2026'
)
ON CONFLICT (id) DO NOTHING;
