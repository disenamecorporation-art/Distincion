import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { 
  Building2, Key, Scale, Building, Handshake, Search, 
  MapPin, Bed, Bath, Square, ChevronRight, Phone, Mail, 
  Instagram, Facebook, Linkedin, User, LogOut, CheckCircle, 
  X, Calendar, ArrowRight, ShieldCheck, Users, Megaphone, FileText, Lock, Menu,
  Plus, Trash2, Edit3, Save, LayoutDashboard, Sliders, Check, AlertCircle, Filter,
  Layers, Eye, RefreshCw, ChevronLeft, Shield, Sparkles, Home, DollarSign, Database
} from 'lucide-react';

interface Property {
  id: number;
  title: string;
  type: string; // 'en-venta' | 'en-alquiler' o dinámico
  price: string;
  rawPrice?: number;
  location: string;
  city?: string;
  beds: number;
  baths: number;
  sqm: number;
  image: string;
  images: string[];
  videoUrl: string;
  description?: string;
  features?: string[];
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  category: 'abogado' | 'asesor';
  bio: string;
  phone: string;
  email?: string;
  specialty?: string;
  slogan?: string;
  ci?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
}

const teamMembers: TeamMember[] = [
  // --- CUERPO LEGAL & ABOGADOS ---
  {
    id: 2,
    name: "Abog. Yoselyn Oliveros",
    role: "Abogada & Broker Inmobiliario | Directora General",
    category: "abogado",
    bio: "Abogada especialista en negocios inmobiliarios, fundadora y Directora General de firma inmobiliaria. Me enfoco en la gestión, estructuración y cierre de negociaciones exitosas, combinando respaldo legal riguroso con un servicio de alta gama. En nuestra organización, la prioridad son los clientes y nuestro principal pilar es nuestro equipo de asesores: profesionales altamente capacitados para blindar jurídicamente cada transacción y garantizar el éxito de cada operación.",
    phone: "0414-4912824",
    whatsapp: "+584144912824",
    specialty: "Especialista en Negocios Inmobiliarios & Blindaje Jurídico Integral"
  },
  {
    id: 4,
    name: "Gilberto José Sánchez",
    role: "Economista, Contador Público y Abogado",
    category: "abogado",
    slogan: "Tu aliado estratégico: economía, contabilidad y derecho en un solo lugar.",
    bio: "Gilberto José Sánchez es un profesional de alto valor con una sólida y multidisciplinaria preparación académica como Economista, Contador Público y Abogado. Cuenta con amplias destrezas en el ramo inmobiliario y una destacada capacidad para desenvolverse con el público, construyendo relaciones de confianza basadas en la empatía y la excelencia. Su gestión garantiza una absoluta transparencia jurídica y rigurosidad financiera en cada proceso, protegiendo los intereses de cada cliente en todas las etapas de la negociación. Con un liderazgo orientado a resultados, Gilberto aporta el conocimiento y la visión estratégica necesarios para transformar cada negociación en un sueño realizado.",
    phone: "0412-0370903",
    whatsapp: "+584120370903",
    specialty: "Economía, Contabilidad & Derecho Inmobiliario Estratégico Multidisciplinario"
  },
  {
    id: 6,
    name: "Abog. Michellisabel Mezzadri",
    role: "Abogada, Asesora Jurídica & Emprendedora Multidisciplinaria",
    category: "abogado",
    bio: "Abogada, asesora jurídica y emprendedora multidisciplinaria. Su trayectoria destaca por combinar una sólida práctica jurídica con una activa participación en el desarrollo comunitario, institucional y de liderazgo femenino. Creadora de contenido jurídico y directora de su propia agencia de viajes online comercializando boletos aéreos nacionales e internacionales.",
    phone: "0414-3820097",
    whatsapp: "+584143820097",
    email: "Abgmezzadri@gmail.com",
    instagram: "Abgmezzadri",
    tiktok: "Abogadamezzadri",
    specialty: "Práctica Jurídica, Asesoría Legal Inmobiliaria & Liderazgo"
  },
  {
    id: 7,
    name: "Abg. Juan Carlos Ramírez",
    role: "Abogado Corporativo, Mercantil & Asesor Inmobiliario",
    category: "abogado",
    bio: "Abogado especialista en derecho civil, mercantil y corporativo, con amplia trayectoria y destrezas en el ramo inmobiliario. Experto en la estructuración de cierres de negocios, gestión de ventas ante registros, tramitación legal completa y resguardo de operaciones comerciales. Aporta un respaldo jurídico fundamental dentro del equipo, garantizando seguridad, agilidad y transparencia en cada etapa de la negociación para la tranquilidad de la organización y sus clientes.",
    phone: "+58 412-5264370",
    whatsapp: "+584125264370",
    specialty: "Derecho Civil, Mercantil, Corporativo, Registros & Tramitación Legal Completa"
  },
  {
    id: 9,
    name: "Abg. Andrés Barrios",
    role: "Gestor Inmobiliario & Especialista en Derecho Procesal Civil",
    category: "abogado",
    bio: "Abogado con estudios de postgrado en Derecho Procesal Civil, experto en redacción jurídica, oratoria profesional y gestión de trámites patrimoniales. Excelente gestor inmobiliario, enfocado en optimizar tiempos de respuesta, revisar expedientes y ofrecer un respaldo legal impecable para la compra, venta, alquiler y formalización de contratos en Distinción Inmobiliaria Tavares.",
    phone: "+58 412-3440267",
    whatsapp: "+584123440267",
    specialty: "Derecho Procesal Civil, Redacción Jurídica & Gestión de Trámites Patrimoniales"
  },

  // --- ASESORES INMOBILIARIOS, FINANCIEROS & COMERCIALES ---
  {
    id: 1,
    name: "Lcda. Yessica Tavares",
    role: "Economista, Contadora Pública & Broker Inmobiliario",
    category: "asesor",
    bio: "Profesional de las ciencias económicas y contables especializada en la dirección de negocios inmobiliarios y en la estructuración de cierres de negociación de alto nivel. Lidero una agencia inmobiliaria enfocada en brindar asesoría integral de alta calidad, respaldo jurídico y una rigurosa gestión financiera para blindar el capital de cada cliente, garantizando transacciones 100% seguras y sin margen de error.",
    phone: "0412-8850028",
    whatsapp: "+584128850028",
    specialty: "Dirección de Negocios Inmobiliarios & Gestión Financiera de Alto Nivel"
  },
  {
    id: 3,
    name: "Lcdo. Leonardo Morillo",
    role: "Economista | Contador Público | Auditor | Asesor Inmobiliario",
    category: "asesor",
    bio: "Profesional calificado de las ciencias económicas y contables, especializado en auditoría, análisis financiero y gestión de negocios inmobiliarios. Combinación sólida de rigor analítico y visión de mercado, orientada a la evaluación de riesgos, la optimización de inversiones y la estructuración de negociaciones de alto valor. Destaca por sus altas habilidades interpersonales, atención al público, liderazgo colaborativo y capacidad para trabajar en equipo dentro de la organización. Su enfoque está orientado a resultados, garantizando un acompañamiento integral y altamente capacitado para lograr cierres exitosos y seguros.",
    phone: "0424-3287033",
    whatsapp: "+584243287033",
    specialty: "Auditoría, Análisis Financiero, Evaluación de Riesgos & Negociaciones de Alto Valor"
  },
  {
    id: 5,
    name: "Lcda. Liliana Marui Buitrago Torrealba",
    role: "Licenciada | Especialista en Ventas & Captación Inmobiliaria",
    category: "asesor",
    bio: "Licenciada experta en ventas y relaciones interpersonales, destacada como una captadora de inmuebles altamente calificada. Su gran capacidad de adaptación y desenvolvimiento eficiente en diversos entornos le permite conectar de manera asertiva con el público y estructurar procesos enfocados en lograr ventas exitosas.",
    phone: "+58 414-9448980",
    whatsapp: "+584149448980",
    specialty: "Ventas de Alto Impacto, Captación Inmobiliaria & Conexión con el Cliente"
  },
  {
    id: 8,
    name: "Yusmarlyk Cárdenas Álvarez",
    role: "Asesora Inmobiliaria & Especialista en Análisis Financiero de Activos",
    category: "asesor",
    ci: "15.734.964",
    bio: "Contadora Pública y T.S.U. en Administración (Mención Costos) con alta destreza en la estructuración de negocios y transacciones inmobiliarias. Su sólida formación económico-financiera le permite ofrecer una asesoría integral en valoración de propiedades, análisis de retorno de inversión, estructuración de costos e intermediación segura para la compra, venta y alquiler de bienes inmuebles.",
    phone: "+58 412-4660627",
    whatsapp: "+584124660627",
    specialty: "Valoración de Propiedades, Retorno de Inversión (ROI), Costos & Intermediación Segura"
  },
  {
    id: 10,
    name: "Dailyn Martínez",
    role: "Asesora Inmobiliaria & Especialista en Ventas",
    category: "asesor",
    bio: "Dailyn destaca por su gran carisma, capacidad de relacionamiento y sólida experiencia en la atención al público. Su destreza comercial y visión orientada al cliente le permiten entender con precisión las necesidades de cada comprador y vendedor, facilitando negociaciones fluidas y transparentes. En Distinción Inmobiliaria Tavares, Dailyn brinda una asesoría cercana, personalizada y comprometida en transformar cada requerimiento patrimonial en un negocio exitoso.",
    phone: "0412-4209633",
    whatsapp: "+584124209633",
    specialty: "Ventas Inmobiliarias, Atención al Cliente & Negociaciones Fluidas"
  },
  {
    id: 11,
    name: "Jaime Herrera",
    role: "Asesor Comercial Inmobiliario & Especialista en Cierres",
    category: "asesor",
    bio: "El Sr. Jaime Herrera es un destacado especialista en el área comercial inmobiliaria, reconocido por su excepcional capacidad de negociación y efectividad en el logro de cierres de negocios exitosos. Cuenta con una amplia y sólida cartera de clientes, construida a base de confianza, ética profesional y un profundo conocimiento del mercado patrimonial. Su enfoque estratégico y habilidad para identificar oportunidades de alto valor le permiten conectar con éxito las necesidades de compradores e inversionistas, garantizando transacciones eficientes y de máximo nivel en Distinción Inmobiliaria Tavares.",
    phone: "+58 414-4947960",
    whatsapp: "+584144947960",
    specialty: "Cierres de Negocios de Alto Nivel, Estrategia Comercial & Gestión de Inversionistas"
  }
];

const initialCities: string[] = [
  "Las Mercedes",
  "Altamira",
  "Campo Alegre",
  "El Rosal",
  "Valle Arriba",
  "La Castellana",
  "Los Palos Grandes",
  "Prados del Este",
  "Chacao"
];

const initialProperties: Property[] = [
  {
    id: 1,
    title: "Casa de Lujo en Las Mercedes",
    type: "en-venta",
    price: "$ 850.000",
    rawPrice: 850000,
    location: "Las Mercedes, Caracas",
    city: "Las Mercedes",
    beds: 4,
    baths: 4.5,
    sqm: 450,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1000"
    ],
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    description: "Espectacular casa de lujo ubicada en el corazón de Las Mercedes, con acabados de primera, amplios espacios sociales, jardín privado, seguridad 24/7 y excelente iluminación natural.",
    features: ["Jardín privado", "Seguridad 24/7", "Estacionamiento techado", "Pisos de mármol", "Cocina equipada"]
  },
  {
    id: 2,
    title: "Apartamento en Altamira",
    type: "en-alquiler",
    price: "$ 2.500 / mes",
    rawPrice: 2500,
    location: "Altamira, Caracas",
    city: "Altamira",
    beds: 3,
    baths: 3,
    sqm: 180,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000"
    ],
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    description: "Moderno apartamento amoblado en Altamira con vista panorámica al Ávila, planta eléctrica total, ascensor privado y acabados modernos de alta gama.",
    features: ["Vista al Ávila", "Planta eléctrica", "Ascensor privado", "Amoblado de lujo", "Maletero"]
  },
  {
    id: 3,
    title: "Penthouse en Campo Alegre",
    type: "en-venta",
    price: "$ 1.200.000",
    rawPrice: 1200000,
    location: "Campo Alegre, Caracas",
    city: "Campo Alegre",
    beds: 4,
    baths: 5,
    sqm: 620,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000"
    ],
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    description: "Exclusivo penthouse de dos niveles en la zona más prestigiosa de Campo Alegre. Terraza privada con jacuzzi, techos de doble altura y máxima privacidad.",
    features: ["Terraza con jacuzzi", "Techos de doble altura", "Seguridad blindada", "4 puestos de estacionamiento", "Family room"]
  },
  {
    id: 4,
    title: "Oficina en Torre Empresarial",
    type: "en-alquiler",
    price: "$ 1.800 / mes",
    rawPrice: 1800,
    location: "El Rosal, Caracas",
    city: "El Rosal",
    beds: 2,
    baths: 2,
    sqm: 120,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1504384080396-65bb88b9e4a7?auto=format&fit=crop&q=80&w=1000"
    ],
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    description: "Moderna oficina corporativa en El Rosal, distribuida en despachos privados, área de recepción, sala de conferencias y cableado estructurado.",
    features: ["Sala de conferencias", "Recepción", "Fibra óptica", "Estacionamiento para visitantes", "Vigilancia privada"]
  },
  {
    id: 5,
    title: "Villa Exclusiva en Valle Arriba",
    type: "en-venta",
    price: "$ 1.450.000",
    rawPrice: 1450000,
    location: "Valle Arriba, Caracas",
    city: "Valle Arriba",
    beds: 5,
    baths: 6,
    sqm: 580,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000"
    ],
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    description: "Magnífica villa residencial en la urbanización cerrada Valle Arriba. Cuenta con piscina climatizada, estudio, área de servicio independiente y acabados en madera noble.",
    features: ["Piscina climatizada", "Estudio", "Urbanización cerrada", "Tanque de agua subterráneo", "Sistema de cámaras"]
  },
  {
    id: 6,
    title: "Townhouse Moderno en La Castellana",
    type: "en-venta",
    price: "$ 680.000",
    rawPrice: 680000,
    location: "La Castellana, Caracas",
    city: "La Castellana",
    beds: 3,
    baths: 3.5,
    sqm: 260,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000"
    ],
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    description: "Elegante townhouse con diseño arquitectónico contemporáneo en La Castellana. Espacios integrados, iluminación natural y excelente ubicación.",
    features: ["Diseño contemporáneo", "Patio privado", "Cocina italiana", "Pisos de porcelanato", "Maletero"]
  },
  {
    id: 7,
    title: "Loft Ejecutivo en Los Palos Grandes",
    type: "en-alquiler",
    price: "$ 1.500 / mes",
    rawPrice: 1500,
    location: "Los Palos Grandes, Caracas",
    city: "Los Palos Grandes",
    beds: 1,
    baths: 1.5,
    sqm: 95,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000"
    ],
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    description: "Estiloso loft amoblado en Los Palos Grandes, ideal para ejecutivo o pareja. Cerca de los mejores restaurantes y cafés de la zona.",
    features: ["Amoblado y equipado", "Aire acondicionado central", "Edificio moderno", "Lavandera incorporada", "Internet de alta velocidad"]
  },
  {
    id: 8,
    title: "Quinta Residencial en Prados del Este",
    type: "en-venta",
    price: "$ 920.000",
    rawPrice: 920000,
    location: "Prados del Este, Caracas",
    city: "Prados del Este",
    beds: 4,
    baths: 4,
    sqm: 410,
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000"
    ],
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    description: "Tradicional y espaciosa quinta en Prados del Este con exuberante jardín, área de parrillera, terraza techada y excelente potencial.",
    features: ["Área de parrillera", "Jardín arbolado", "Tanque de 20.000L", "Estacionamiento para 4 vehículos", "Depósito"]
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'properties' | 'property-detail' | 'team' | 'team-detail' | 'admin' | 'user-dashboard'>('home');
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [activeTeamMember, setActiveTeamMember] = useState<TeamMember | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Estados de propiedades y variables de búsqueda
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [cities, setCities] = useState<string[]>(initialCities);
  const [propertyTypes, setPropertyTypes] = useState<{ id: string; name: string }[]>([
    { id: 'en-venta', name: 'En Venta' },
    { id: 'en-alquiler', name: 'En Alquiler' }
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'en-venta' | 'en-alquiler'>('all');
  const [teamFilter, setTeamFilter] = useState<'all' | 'abogado' | 'asesor'>('all');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Filtros del catálogo de propiedades
  const [shopSearch, setShopSearch] = useState('');
  const [shopCategory, setShopCategory] = useState<string>('all');
  const [shopCity, setShopCity] = useState<string>('all');
  const [shopSort, setShopSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  
  // Estado de Usuario y Autenticación
  const [user, setUser] = useState<{ id?: string; name: string; email: string; phone?: string; role?: string; createdAt?: string } | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // Verificación de si el usuario actual es Administrador
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'legaintcorporation@gmail.com';

  // Recuperación de Contraseña
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Dashboard de Usuario
  const [userProfileName, setUserProfileName] = useState('');
  const [userProfileEmail, setUserProfileEmail] = useState('');
  const [userProfilePhone, setUserProfilePhone] = useState('');
  const [userProfileNewPassword, setUserProfileNewPassword] = useState('');
  const [userProfileToast, setUserProfileToast] = useState<string | null>(null);

  // Estados del Panel de Administración
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState<'properties' | 'zones' | 'categories' | 'appointments'>('properties');
  const [adminSearch, setAdminSearch] = useState('');
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  // Formulario de Inmueble
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    type: 'en-venta',
    price: '',
    rawPrice: 0,
    location: '',
    city: 'Las Mercedes',
    beds: 3,
    baths: 2,
    sqm: 120,
    image: '',
    imagesInput: '',
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    description: '',
    featuresInput: ''
  });

  // Formularios de Zonas y Categorías
  const [newCityInput, setNewCityInput] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');

  // Solicitudes y citas recibidas
  const [appointmentsList, setAppointmentsList] = useState<{
    id: number;
    name: string;
    phone: string;
    email: string;
    date: string;
    service: string;
    message: string;
    createdAt: string;
  }[]>([
    {
      id: 1,
      name: "Dra. Carolina Mendoza",
      phone: "0414-2345678",
      email: "carolina.mendoza@email.com",
      date: "2026-10-02",
      service: "Compra de Propiedad",
      message: "Interesada en coordinar visita a la quinta de Las Mercedes.",
      createdAt: "28 Sep 2026"
    },
    {
      id: 2,
      name: "Ing. Roberto Albornoz",
      phone: "0412-9876543",
      email: "roberto.albornoz@empresa.com",
      date: "2026-10-04",
      service: "Auditoría Documental",
      message: "Revisión jurídica para adquisición de oficina corporativa.",
      createdAt: "29 Sep 2026"
    }
  ]);

  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    service: 'Compra de Propiedad',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Carga inicial desde Supabase si está configurado
  useEffect(() => {
    async function loadSupabaseData() {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data: propsData, error: propsError } = await supabase
          .from('properties')
          .select('*')
          .order('id', { ascending: false });

        if (!propsError && propsData && propsData.length > 0) {
          const normalizedProps: Property[] = propsData.map(p => {
            let parsedImages: string[] = [];
            if (Array.isArray(p.images)) {
              parsedImages = p.images;
            } else if (typeof p.images === 'string') {
              try {
                parsedImages = JSON.parse(p.images);
              } catch {
                parsedImages = [p.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000'];
              }
            } else {
              parsedImages = [p.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000'];
            }

            let parsedFeatures: string[] = [];
            if (Array.isArray(p.features)) {
              parsedFeatures = p.features;
            } else if (typeof p.features === 'string') {
              try {
                parsedFeatures = JSON.parse(p.features);
              } catch {
                parsedFeatures = [];
              }
            }

            return {
              id: Number(p.id) || Date.now(),
              title: p.title || 'Inmueble Exclusivo',
              type: p.type || 'en-venta',
              price: p.price || '$0',
              rawPrice: Number(p.rawPrice || p.raw_price) || 0,
              location: p.location || '',
              city: p.city || 'Las Mercedes',
              beds: Number(p.beds) || 0,
              baths: Number(p.baths) || 0,
              sqm: Number(p.sqm) || 0,
              image: p.image || parsedImages[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000',
              images: parsedImages.length > 0 ? parsedImages : [p.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000'],
              videoUrl: p.videoUrl || p.video_url || '',
              description: p.description || '',
              features: parsedFeatures
            };
          });

          setProperties(normalizedProps);
        }

        const { data: zonesData, error: zonesError } = await supabase
          .from('zones')
          .select('name');

        if (!zonesError && zonesData && zonesData.length > 0) {
          setCities(zonesData.map(z => z.name));
        }

        const { data: catsData, error: catsError } = await supabase
          .from('categories')
          .select('*');

        if (!catsError && catsData && catsData.length > 0) {
          setPropertyTypes(catsData);
        }

        const { data: appsData, error: appsError } = await supabase
          .from('appointments')
          .select('*')
          .order('id', { ascending: false });

        if (!appsError && appsData && appsData.length > 0) {
          setAppointmentsList(appsData);
        }
      } catch (err) {
        console.error("Error cargando datos de Supabase:", err);
      }
    }

    loadSupabaseData();
  }, []);

  // Sincronizar campos de edición de perfil cuando el usuario cambia
  useEffect(() => {
    if (user) {
      setUserProfileName(user.name || '');
      setUserProfileEmail(user.email || '');
      setUserProfilePhone(user.phone || '');
    }
  }, [user]);

  // Notificación de éxito para el administrador
  const showAdminToast = (msg: string) => {
    setAdminNotification(msg);
    setTimeout(() => setAdminNotification(null), 3500);
  };

  // Autenticación de Administrador (Clave por defecto: admin2026 o admin)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin2026' || adminPasswordInput === 'admin' || adminPasswordInput === 'tavares2026') {
      setIsAdminAuthenticated(true);
      setAdminLoginError('');
      setAdminPasswordInput('');
      showAdminToast('Sesión de administración iniciada correctamente');
    } else {
      setAdminLoginError('Clave de acceso incorrecta. Intente nuevamente.');
    }
  };

  const handleAdminLogout = () => {
    setCurrentView('home');
  };

  // Abrir formulario para añadir nuevo inmueble
  const handleOpenNewProperty = () => {
    setEditingPropertyId(null);
    setPropertyForm({
      title: '',
      type: propertyTypes[0]?.id || 'en-venta',
      price: '',
      rawPrice: 0,
      location: '',
      city: cities[0] || 'Las Mercedes',
      beds: 3,
      baths: 2,
      sqm: 120,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000',
      imagesInput: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000\nhttps://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000\nhttps://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000',
      videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
      description: '',
      featuresInput: 'Seguridad 24/7, Acabados de lujo, Puestos de estacionamiento, Tanque de agua'
    });
    setIsPropertyModalOpen(true);
  };

  // Abrir formulario para editar inmueble existente
  const handleOpenEditProperty = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setPropertyForm({
      title: prop.title,
      type: prop.type,
      price: prop.price,
      rawPrice: prop.rawPrice || 0,
      location: prop.location,
      city: prop.city || cities[0] || 'Las Mercedes',
      beds: prop.beds,
      baths: prop.baths,
      sqm: prop.sqm,
      image: prop.image,
      imagesInput: (prop.images || [prop.image]).join('\n'),
      videoUrl: prop.videoUrl || '',
      description: prop.description || '',
      featuresInput: (prop.features || []).join(', ')
    });
    setIsPropertyModalOpen(true);
  };

  // Guardar inmueble (Crear o Actualizar)
  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyForm.title || !propertyForm.price) return;

    const parsedImages = propertyForm.imagesInput
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (parsedImages.length === 0 && propertyForm.image) {
      parsedImages.push(propertyForm.image);
    }

    const parsedFeatures = propertyForm.featuresInput
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const numericPrice = Number(propertyForm.rawPrice) || Number(propertyForm.price.replace(/[^0-9]/g, '')) || 0;

    if (editingPropertyId) {
      // Editar existente
      const updatedProp = {
        title: propertyForm.title,
        type: propertyForm.type,
        price: propertyForm.price,
        rawPrice: numericPrice,
        location: propertyForm.location,
        city: propertyForm.city,
        beds: Number(propertyForm.beds),
        baths: Number(propertyForm.baths),
        sqm: Number(propertyForm.sqm),
        image: propertyForm.image || parsedImages[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000',
        images: parsedImages.length > 0 ? parsedImages : [propertyForm.image],
        videoUrl: propertyForm.videoUrl,
        description: propertyForm.description,
        features: parsedFeatures
      };

      setProperties(prev => prev.map(item => {
        if (item.id === editingPropertyId) {
          return { ...item, ...updatedProp };
        }
        return item;
      }));

      if (isSupabaseConfigured && supabase) {
        supabase.from('properties').update(updatedProp).eq('id', editingPropertyId).then();
      }

      showAdminToast('Inmueble actualizado exitosamente');
    } else {
      // Crear nuevo
      const newId = properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1;
      const newProp: Property = {
        id: newId,
        title: propertyForm.title,
        type: propertyForm.type,
        price: propertyForm.price,
        rawPrice: numericPrice,
        location: propertyForm.location,
        city: propertyForm.city,
        beds: Number(propertyForm.beds),
        baths: Number(propertyForm.baths),
        sqm: Number(propertyForm.sqm),
        image: propertyForm.image || parsedImages[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000',
        images: parsedImages.length > 0 ? parsedImages : [propertyForm.image],
        videoUrl: propertyForm.videoUrl,
        description: propertyForm.description,
        features: parsedFeatures
      };
      setProperties(prev => [newProp, ...prev]);

      if (isSupabaseConfigured && supabase) {
        supabase.from('properties').insert([newProp]).then();
      }

      showAdminToast('Nuevo inmueble añadido al catálogo');
    }

    setIsPropertyModalOpen(false);
  };

  // Eliminar inmueble
  const handleDeleteProperty = (id: number) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    if (isSupabaseConfigured && supabase) {
      supabase.from('properties').delete().eq('id', id).then();
    }
    setDeleteConfirmId(null);
    showAdminToast('Inmueble eliminado del catálogo');
  };

  // Gestión de Zonas y Ciudades
  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCityInput.trim();
    if (!trimmed) return;
    if (cities.includes(trimmed)) {
      showAdminToast('La zona ya se encuentra registrada');
      return;
    }
    setCities(prev => [...prev, trimmed]);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('zones').insert([{ name: trimmed }]);
    }
    setNewCityInput('');
    showAdminToast(`Zona "${trimmed}" añadida a las variables de búsqueda`);
  };

  const handleDeleteCity = async (cityName: string) => {
    if (cities.length <= 1) {
      showAdminToast('Debe haber al menos una zona activa');
      return;
    }
    setCities(prev => prev.filter(c => c !== cityName));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('zones').delete().eq('name', cityName);
    }
    showAdminToast(`Zona "${cityName}" eliminada`);
  };

  // Gestión de Categorías / Tipos de Operación
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrimmed = newCategoryName.trim();
    if (!nameTrimmed) return;
    const idSlug = (newCategoryId.trim() || nameTrimmed.toLowerCase().replace(/\s+/g, '-'));
    
    if (propertyTypes.some(t => t.id === idSlug)) {
      showAdminToast('Ya existe un tipo con ese identificador');
      return;
    }

    const newCat = { id: idSlug, name: nameTrimmed };
    setPropertyTypes(prev => [...prev, newCat]);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').insert([newCat]);
    }
    setNewCategoryName('');
    setNewCategoryId('');
    showAdminToast(`Categoría "${nameTrimmed}" añadida con éxito`);
  };

  const handleDeleteCategory = async (typeId: string) => {
    if (propertyTypes.length <= 1) {
      showAdminToast('Debe haber al menos un tipo de operación activo');
      return;
    }
    setPropertyTypes(prev => prev.filter(t => t.id !== typeId));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').delete().eq('id', typeId);
    }
    showAdminToast('Categoría eliminada');
  };

  // Eliminar cita recibida
  const handleDeleteAppointment = async (id: number) => {
    setAppointmentsList(prev => prev.filter(a => a.id !== id));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('appointments').delete().eq('id', id);
    }
    showAdminToast('Registro de solicitud eliminado');
  };

  const filteredShopProperties = properties.filter(p => {
    const matchesSearch = shopSearch === '' || 
      p.title.toLowerCase().includes(shopSearch.toLowerCase()) || 
      p.location.toLowerCase().includes(shopSearch.toLowerCase());
    const matchesCategory = shopCategory === 'all' || p.type === shopCategory;
    const matchesCity = shopCity === 'all' || p.city === shopCity || p.location.includes(shopCity);
    return matchesSearch && matchesCategory && matchesCity;
  }).sort((a, b) => {
    if (shopSort === 'price-asc') return (a.rawPrice || 0) - (b.rawPrice || 0);
    if (shopSort === 'price-desc') return (b.rawPrice || 0) - (a.rawPrice || 0);
    return 0;
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;

    const cleanEmail = authEmail.trim().toLowerCase();
    const defaultRole = cleanEmail === 'legaintcorporation@gmail.com' ? 'admin' : 'client';

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', cleanEmail)
          .single();

        if (!error && data) {
          setUser({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            role: (data.role === 'admin' || cleanEmail === 'legaintcorporation@gmail.com') ? 'admin' : (data.role || 'client'),
            createdAt: data.created_at
          });
        } else {
          // Si no existe, lo crea al instante sin confirmación
          const fallbackName = authName || (cleanEmail === 'legaintcorporation@gmail.com' ? 'Administrador Principal' : cleanEmail.split('@')[0]);
          const { data: newUser } = await supabase.from('users').insert([{
            email: cleanEmail,
            name: fallbackName,
            password_hash: authPassword,
            role: defaultRole
          }]).select().single();

          setUser({
            id: newUser?.id,
            name: newUser?.name || fallbackName,
            email: cleanEmail,
            phone: '',
            role: defaultRole
          });
        }
      } catch (err) {
        setUser({ 
          name: authName || cleanEmail.split('@')[0], 
          email: cleanEmail,
          role: defaultRole
        });
      }
    } else {
      setUser({ 
        name: authName || cleanEmail.split('@')[0], 
        email: cleanEmail,
        role: defaultRole
      });
    }

    setIsLoginOpen(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authName) return;

    const cleanEmail = authEmail.trim().toLowerCase();
    const cleanName = authName.trim();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('users').insert([{
          email: cleanEmail,
          name: cleanName,
          password_hash: authPassword,
          role: 'client'
        }]).select().single();

        setUser({
          id: data?.id,
          name: cleanName,
          email: cleanEmail,
          phone: '',
          role: 'client'
        });
      } catch (err) {
        console.error("Error al registrar en Supabase:", err);
        setUser({ name: cleanName, email: cleanEmail });
      }
    } else {
      setUser({ name: cleanName, email: cleanEmail });
    }

    setIsRegisterOpen(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
  };

  // Restablecer contraseña sin confirmación de email
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotNewPassword) return;

    const cleanEmail = forgotEmail.trim().toLowerCase();
    setForgotError('');
    setForgotSuccess('');

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', cleanEmail)
          .single();

        if (existingUser) {
          await supabase
            .from('users')
            .update({ password_hash: forgotNewPassword, updated_at: new Date().toISOString() })
            .eq('email', cleanEmail);

          setUser({
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            phone: existingUser.phone || '',
            role: existingUser.role || 'client'
          });
          setForgotSuccess('Contraseña restablecida exitosamente. Sesión iniciada.');
          setTimeout(() => {
            setIsForgotPasswordOpen(false);
            setForgotEmail('');
            setForgotNewPassword('');
            setForgotSuccess('');
          }, 1500);
        } else {
          // Crear usuario con nueva clave
          const fallbackName = cleanEmail.split('@')[0];
          const { data: newUser } = await supabase.from('users').insert([{
            email: cleanEmail,
            name: fallbackName,
            password_hash: forgotNewPassword,
            role: 'client'
          }]).select().single();

          setUser({
            id: newUser?.id,
            name: fallbackName,
            email: cleanEmail,
            phone: '',
            role: 'client'
          });
          setForgotSuccess('Cuenta actualizada con su nueva clave.');
          setTimeout(() => {
            setIsForgotPasswordOpen(false);
            setForgotEmail('');
            setForgotNewPassword('');
            setForgotSuccess('');
          }, 1500);
        }
      } catch (err) {
        setForgotError('Ocurrió un error al restablecer. Intente nuevamente.');
      }
    } else {
      setUser({ name: cleanEmail.split('@')[0], email: cleanEmail });
      setForgotSuccess('Contraseña actualizada correctamente.');
      setTimeout(() => {
        setIsForgotPasswordOpen(false);
        setForgotEmail('');
        setForgotNewPassword('');
        setForgotSuccess('');
      }, 1500);
    }
  };

  // Actualizar perfil de usuario desde el Dashboard
  const handleUpdateUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const cleanName = userProfileName.trim() || user.name;
    const cleanEmail = userProfileEmail.trim().toLowerCase() || user.email;
    const cleanPhone = userProfilePhone.trim();

    const updatePayload: Record<string, any> = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      updated_at: new Date().toISOString()
    };

    if (userProfileNewPassword.trim()) {
      updatePayload.password_hash = userProfileNewPassword.trim();
    }

    if (isSupabaseConfigured && supabase) {
      try {
        if (user.id) {
          await supabase.from('users').update(updatePayload).eq('id', user.id);
        } else {
          await supabase.from('users').update(updatePayload).eq('email', user.email);
        }
      } catch (err) {
        console.error("Error al actualizar perfil en Supabase:", err);
      }
    }

    setUser(prev => prev ? {
      ...prev,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone
    } : null);

    setUserProfileNewPassword('');
    setUserProfileToast('Perfil actualizado con éxito');
    setTimeout(() => setUserProfileToast(null), 3500);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Registrar en la lista de citas del administrador
    const newAppointment = {
      id: Date.now(),
      name: appointmentForm.name,
      phone: appointmentForm.phone,
      email: appointmentForm.email,
      date: appointmentForm.date,
      service: appointmentForm.service,
      message: appointmentForm.message || 'Sin mensaje adicional',
      createdAt: 'Hoy'
    };
    setAppointmentsList(prev => [newAppointment, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('appointments').insert([newAppointment]).then();
    }

    setTimeout(() => {
      setFormSubmitted(false);
      setIsAppointmentOpen(false);
      setAppointmentForm({ name: '', phone: '', email: '', date: '', service: 'Compra de Propiedad', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-['Montserrat',sans-serif] selection:bg-[#C5A880]/30">
      
      {/* ----------------- HEADER / NAVBAR (White Super Glassmorphism) ----------------- */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-2xl border-b border-white/60 shadow-lg text-[#2C2A29]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
          
          {/* Logo - Ampliado */}
          <button 
            onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center group cursor-pointer py-1"
          >
            <img 
              src="https://i.postimg.cc/3R3wvxwt/logoweb2.png" 
              alt="Distinción Inmobiliaria Tavares" 
              className="h-16 sm:h-20 md:h-24 max-h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
            />
          </button>

          {/* Navigation Links - Opciones refinadas */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[11px] tracking-[0.16em] font-semibold uppercase text-[#5A5550]">
            <button 
              onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`transition-colors relative py-2 cursor-pointer ${currentView === 'home' ? 'text-[#111111] font-bold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-[2px] after:bg-[#9E7D4E]' : 'hover:text-[#9E7D4E]'}`}
            >
              INICIO
            </button>
            <button 
              onClick={() => { setCurrentView('properties'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`transition-colors relative py-2 cursor-pointer ${currentView === 'properties' ? 'text-[#111111] font-bold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-[2px] after:bg-[#9E7D4E]' : 'hover:text-[#9E7D4E]'}`}
            >
              PROPIEDADES
            </button>
            <button 
              onClick={() => { setCurrentView('team'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`transition-colors relative py-2 cursor-pointer ${currentView === 'team' || currentView === 'team-detail' ? 'text-[#111111] font-bold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-[2px] after:bg-[#9E7D4E]' : 'hover:text-[#9E7D4E]'}`}
            >
              EQUIPO
            </button>
            <button 
              onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }), 50); }} 
              className="hover:text-[#9E7D4E] transition-colors relative py-2 cursor-pointer"
            >
              SERVICIOS
            </button>
            <button 
              onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }), 50); }} 
              className="hover:text-[#9E7D4E] transition-colors relative py-2 cursor-pointer"
            >
              CONTACTO
            </button>
            {isAdmin && (
              <button 
                onClick={() => { setCurrentView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className={`transition-colors relative py-2 cursor-pointer flex items-center space-x-1.5 ${currentView === 'admin' ? 'text-[#9E7D4E] font-bold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-[2px] after:bg-[#9E7D4E]' : 'text-[#9E7D4E] hover:text-[#111111]'}`}
                title="Panel de Administración"
              >
                <Shield className="w-3.5 h-3.5 text-[#9E7D4E]" />
                <span>ADMIN</span>
              </button>
            )}
          </nav>

          {/* Right Action / User */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => { setCurrentView('user-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`flex items-center space-x-2.5 px-3.5 sm:px-4 py-2 rounded-full border transition-all cursor-pointer shadow-xs ${
                    currentView === 'user-dashboard'
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white hover:bg-[#FDFBF7] text-[#111111] border-[#E5E1D8] hover:border-[#9E7D4E]'
                  }`}
                  title="Ir a Mi Perfil"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#C5A880] to-[#9E7D4E] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold tracking-wider uppercase leading-tight">
                      Bienvenido, <span className="text-[#9E7D4E]">{user.name.split(' ')[0]}</span>
                    </p>
                  </div>
                </button>

                <button 
                  onClick={() => { setUser(null); if (currentView === 'user-dashboard') setCurrentView('home'); }}
                  title="Cerrar sesión" 
                  aria-label="Cerrar sesión"
                  className="p-2.5 rounded-full text-[#7A7570] hover:text-red-600 hover:bg-red-50 border border-[#E5E1D8] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-[11px] tracking-wider uppercase font-medium">
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="text-[#5A5550] hover:text-[#C5A880] transition-colors px-3 py-2 flex items-center space-x-1 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Ingresar</span>
                </button>
                <button 
                  onClick={() => setIsRegisterOpen(true)}
                  className="text-[#5A5550] hover:text-[#C5A880] transition-colors px-3 py-2 cursor-pointer hidden sm:inline-block"
                >
                  Registro
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/80 border border-[#E5E1D8] text-[#2C2A29] hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Menú móvil"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-[#E5E1D8] px-6 py-8 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-4 text-xs tracking-[0.15em] uppercase font-medium text-[#5A5550]">
              {user && (
                <button 
                  onClick={() => { setCurrentView('user-dashboard'); setIsMobileMenuOpen(false); }}
                  className="text-left text-[#9E7D4E] font-bold hover:text-[#111111] transition-colors py-2.5 border-b border-[#E5E1D8]/60 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#9E7D4E]" />
                    <span>Bienvenido, {user.name} (Mi Perfil)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#9E7D4E]" />
                </button>
              )}
              <button 
                onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
                className="text-left text-[#2C2A29] font-semibold hover:text-[#C5A880] transition-colors py-2 border-b border-[#E5E1D8]/60 flex items-center justify-between cursor-pointer"
              >
                <span>Inicio</span>
                <ChevronRight className="w-4 h-4 text-[#C5A880]" />
              </button>
              <button 
                onClick={() => { setCurrentView('properties'); setIsMobileMenuOpen(false); }}
                className="text-left hover:text-[#C5A880] transition-colors py-2 border-b border-[#E5E1D8]/60 flex items-center justify-between cursor-pointer"
              >
                <span>Propiedades</span>
                <ChevronRight className="w-4 h-4 text-[#C5A880]" />
              </button>
              <button 
                onClick={() => { setCurrentView('team'); setIsMobileMenuOpen(false); }}
                className="text-left hover:text-[#C5A880] transition-colors py-2 border-b border-[#E5E1D8]/60 flex items-center justify-between cursor-pointer"
              >
                <span>Equipo</span>
                <ChevronRight className="w-4 h-4 text-[#C5A880]" />
              </button>
              <button 
                onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); setTimeout(() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
                className="text-left hover:text-[#C5A880] transition-colors py-2 border-b border-[#E5E1D8]/60 flex items-center justify-between cursor-pointer"
              >
                <span>Servicios</span>
                <ChevronRight className="w-4 h-4 text-[#C5A880]" />
              </button>
              <button 
                onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); setTimeout(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
                className="text-left hover:text-[#C5A880] transition-colors py-2 border-b border-[#E5E1D8]/60 flex items-center justify-between cursor-pointer"
              >
                <span>Contacto</span>
                <ChevronRight className="w-4 h-4 text-[#C5A880]" />
              </button>
              {isAdmin && (
                <button 
                  onClick={() => { setCurrentView('admin'); setIsMobileMenuOpen(false); }}
                  className="text-left text-[#9E7D4E] font-bold hover:text-[#111111] transition-colors py-2 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#9E7D4E]" />
                    <span>Panel de Administración</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#9E7D4E]" />
                </button>
              )}
            </nav>

            {user ? (
              <div className="pt-4 border-t border-[#E5E1D8]">
                <button 
                  onClick={() => { setUser(null); setIsMobileMenuOpen(false); if (currentView === 'user-dashboard') setCurrentView('home'); }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#E5E1D8] flex items-center justify-between gap-4">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsLoginOpen(true); }}
                  className="flex-1 py-3 text-xs tracking-wider uppercase font-semibold text-[#2C2A29] bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-center cursor-pointer"
                >
                  Ingresar
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsRegisterOpen(true); }}
                  className="flex-1 py-3 text-xs tracking-wider uppercase font-semibold text-white bg-[#C5A880] rounded-xl hover:bg-[#B3966D] transition-colors text-center shadow-md cursor-pointer"
                >
                  Registro
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ----------------- VISTA 1: INICIO / PRINCIPAL ----------------- */}
      {currentView === 'home' && (
        <>
          {/* Hero Section */}
          <section id="inicio" className="relative overflow-hidden min-h-[220px] sm:min-h-[540px] lg:min-h-[700px] flex items-end bg-[#FDFBF7]">
            <div 
              className="absolute inset-0 bg-cover bg-center z-0" 
              style={{ backgroundImage: `url('https://i.postimg.cc/3xy1sKYk/Chat-GPT-Image-27-sept-2026-06-14-54-p-m.png')` }}
            ></div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-20 w-full pt-2 sm:pt-12 pb-0 text-[#111111]">
              <div className="grid grid-cols-12 gap-2 sm:gap-6 lg:gap-8 items-end">
                
                {/* Left Content */}
                <div className="col-span-7 sm:col-span-7 lg:col-span-7 space-y-1.5 sm:space-y-4 lg:space-y-5 text-left py-2 sm:py-8 lg:py-16 pl-0">
                  {/* Logo sobre el texto del Hero (Centrado sobre el bloque de texto) */}
                  <div className="flex justify-center max-w-[190px] xs:max-w-[230px] sm:max-w-md lg:max-w-lg pb-0.5 sm:pb-2">
                    <img 
                      src="https://i.postimg.cc/3R3wvxwt/logoweb2.png" 
                      alt="Distinción Inmobiliaria Tavares" 
                      className="h-9 xs:h-11 sm:h-20 md:h-24 lg:h-30 w-auto max-w-full object-contain drop-shadow-md transition-transform hover:scale-105"
                    />
                  </div>

                  <span className="hidden sm:block text-[#9E7D4E] text-xs font-bold tracking-[0.3em] uppercase">
                    TU FUTURO, NUESTRA PRIORIDAD
                  </span>
                  
                  <h1 className="text-xs xs:text-sm sm:text-2xl md:text-3xl lg:text-[2.5rem] xl:text-[2.7rem] font-serif-luxury font-bold leading-tight sm:leading-[1.18] text-[#111111] max-w-[190px] xs:max-w-[230px] sm:max-w-md lg:max-w-lg">
                    Las mejores propiedades, con el <span className="italic text-[#9E7D4E]">respaldo legal que mereces.</span>
                  </h1>
                  
                  <p className="hidden sm:block text-xs md:text-sm lg:text-base font-medium text-[#1a1a1a] leading-relaxed max-w-sm sm:max-w-md lg:max-w-md pl-0">
                    En Distinción Inmobiliaria Tavares te acompañamos en cada paso, con asesoría jurídica y comercial de alto nivel, para que tomes decisiones seguras y exitosas.
                  </p>

                  <div className="pt-0.5 sm:pt-4 flex flex-wrap sm:flex-row items-center gap-1.5 sm:gap-4">
                    <button 
                      onClick={() => {
                        setCurrentView('properties');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center justify-center space-x-1 sm:space-x-3 bg-gradient-to-r from-[#C5A880] via-[#B3966D] to-[#9E7D4E] hover:opacity-90 text-white text-[8px] sm:text-xs tracking-[0.08em] sm:tracking-[0.2em] font-semibold uppercase px-2.5 sm:px-8 py-1.5 sm:py-4 rounded-full shadow-sm sm:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>VER PROPIEDADES</span>
                      <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                    </button>

                    <button 
                      onClick={() => setIsAppointmentOpen(true)}
                      className="inline-flex items-center justify-center space-x-1 sm:space-x-3 bg-[#111111] hover:bg-[#222222] text-white text-[8px] sm:text-xs tracking-[0.08em] sm:tracking-[0.2em] font-semibold uppercase px-2.5 sm:px-8 py-1.5 sm:py-4 rounded-full shadow-xs sm:shadow-md transition-all cursor-pointer"
                    >
                      <span>ASESORÍA</span>
                    </button>
                  </div>
                </div>

                {/* Right Image (Persona pegada exactamente al final del hero al lado derecho tanto en móvil como en escritorio) */}
                <div className="col-span-5 sm:col-span-5 lg:col-span-5 flex justify-end items-end self-end pt-0 -mb-0.5">
                  <img 
                    src="https://i.postimg.cc/zB5ZJqwx/distin2.png" 
                    alt="Asesora Distinción Inmobiliaria Tavares" 
                    className="w-auto h-[175px] xs:h-[200px] sm:h-[440px] md:h-[520px] lg:h-[620px] max-h-[85vh] object-contain object-bottom drop-shadow-xl pointer-events-none block"
                  />
                </div>

              </div>
            </div>
          </section>

          {/* Quick Category Bar */}
          <section className="bg-white border-y border-[#E5E1D8] py-8 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E5E1D8]">
                
                <div 
                  onClick={() => { setCurrentView('properties'); setShopCategory('en-venta'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex flex-col items-center text-center px-4 pt-4 md:pt-0 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-3 group-hover:bg-[#C5A880] group-hover:text-white transition-colors">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#111111] mb-1">COMPRA</h3>
                  <p className="text-xs text-[#333333] font-normal">Encuentra la propiedad ideal para ti.</p>
                </div>

                <div 
                  onClick={() => { setCurrentView('properties'); setShopCategory('en-venta'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex flex-col items-center text-center px-4 pt-4 md:pt-0 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-3 group-hover:bg-[#C5A880] group-hover:text-white transition-colors">
                    <Key className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#111111] mb-1">VENTA</h3>
                  <p className="text-xs text-[#333333] font-normal">Maximiza el valor de tu propiedad.</p>
                </div>

                <div 
                  onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
                  className="flex flex-col items-center text-center px-4 pt-4 md:pt-0 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-3 group-hover:bg-[#C5A880] group-hover:text-white transition-colors">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#111111] mb-1">ASESORÍA LEGAL</h3>
                  <p className="text-xs text-[#333333] font-normal">Seguridad jurídica en cada transacción.</p>
                </div>

                <div 
                  onClick={() => { setCurrentView('properties'); setShopCategory('en-alquiler'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex flex-col items-center text-center px-4 pt-4 md:pt-0 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-3 group-hover:bg-[#C5A880] group-hover:text-white transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#111111] mb-1">ALQUILER</h3>
                  <p className="text-xs text-[#333333] font-normal">Las mejores opciones para tu estilo de vida.</p>
                </div>

                <div 
                  onClick={() => { setCurrentView('properties'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex flex-col items-center text-center px-4 pt-4 md:pt-0 col-span-2 md:col-span-1 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-3 group-hover:bg-[#C5A880] group-hover:text-white transition-colors">
                    <Handshake className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#111111] mb-1">INVERSIONES</h3>
                  <p className="text-xs text-[#333333] font-normal">Haz crecer tu patrimonio con nosotros.</p>
                </div>

              </div>
            </div>
          </section>

          {/* Featured Properties Preview */}
          <section id="propiedades" className="py-20 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <span className="text-[#C5A880] text-xs font-semibold tracking-[0.2em] uppercase block mb-2">
                    PROPIEDADES DESTACADAS
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif-luxury text-[#2C2A29]">
                    Encuentra el espacio perfecto <span className="italic text-[#9E7D4E]">para cada etapa de tu vida.</span>
                  </h2>
                </div>

                <div className="mt-6 md:mt-0 flex items-center space-x-3">
                  <button 
                    onClick={() => { setCurrentView('properties'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#C5A880] hover:text-[#2C2A29] transition-colors cursor-pointer"
                  >
                    <span>Ver Catálogo Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Properties Grid (4 items) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {properties.slice(0, 4).map((prop) => (
                  <div 
                    key={prop.id}
                    onClick={() => {
                      setActiveProperty(prop);
                      setCurrentView('property-detail');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white rounded-2xl overflow-hidden border border-[#E5E1D8] shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img 
                        src={prop.image} 
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-md shadow-xs ${prop.type === 'en-venta' ? 'bg-[#C5A880] text-white' : 'bg-[#2C2A29] text-white'}`}>
                          {prop.type === 'en-venta' ? 'EN VENTA' : 'EN ALQUILER'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-serif-luxury font-bold text-[#2C2A29] mb-1 group-hover:text-[#C5A880] transition-colors">
                          {prop.title}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                          <span className="truncate">{prop.location}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E5E1D8]/60 text-xs text-gray-600 font-light">
                        <div className="flex items-center space-x-1">
                          <Bed className="w-4 h-4 text-[#C5A880]" />
                          <span>{prop.beds} hab</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bath className="w-4 h-4 text-[#C5A880]" />
                          <span>{prop.baths} baños</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Square className="w-4 h-4 text-[#C5A880]" />
                          <span>{prop.sqm} m²</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-lg font-bold text-[#2C2A29]">
                          {prop.price}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <button 
                  onClick={() => { setCurrentView('properties'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-white bg-[#2C2A29] hover:bg-[#3C3A39] px-8 py-4 rounded-full shadow-lg transition-all cursor-pointer"
                >
                  <span>EXPLORAR TODAS LAS PROPIEDADES</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </section>

          {/* Why Choose Us */}
          <section className="py-20 bg-white border-y border-[#E5E1D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-6">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10]">
                    <img 
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" 
                      alt="Interior de Lujo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-6">
                  <span className="text-[#C5A880] text-xs font-semibold tracking-[0.2em] uppercase block">
                    ¿POR QUÉ ELEGIRNOS?
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-serif-luxury text-[#2C2A29]">
                    Experiencia, confianza <span className="italic text-[#9E7D4E]">y resultados.</span>
                  </h2>

                  <p className="text-base text-[#5A5550] font-light leading-relaxed">
                    En Distinción Inmobiliaria Tavares combinamos conocimiento del mercado, asesoría legal y un trato personalizado para ofrecerte una experiencia única y segura.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#E5E1D8]">
                    <div>
                      <h4 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#C5A880] mb-1">+10</h4>
                      <p className="text-xs text-gray-500 font-light">Años de experiencia</p>
                    </div>
                    <div>
                      <h4 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#C5A880] mb-1">+200</h4>
                      <p className="text-xs text-gray-500 font-light">Propiedades gestionadas</p>
                    </div>
                    <div>
                      <h4 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#C5A880] mb-1">100%</h4>
                      <p className="text-xs text-gray-500 font-light">Clientes satisfechos</p>
                    </div>
                    <div>
                      <h4 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#C5A880] mb-1">24/7</h4>
                      <p className="text-xs text-gray-500 font-light">Atención personalizada</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* Banner CTA */}
          <section className="py-24 sm:py-32 bg-[#1A1816] text-white relative overflow-hidden flex items-center">
            <div 
              className="absolute inset-0 bg-cover bg-center z-0 opacity-40" 
              style={{ backgroundImage: `url('https://i.postimg.cc/pdbf3zs4/Chat-GPT-Image-27-sept-2026-06-18-56-p-m.png')` }}
            ></div>
            <div className="absolute inset-0 bg-black/60 z-1"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                
                <div className="space-y-4 text-center lg:text-left max-w-2xl">
                  <span className="text-[#C5A880] text-xs font-semibold tracking-[0.25em] uppercase block">
                    ¿LISTO PARA DAR EL SIGUIENTE PASO?
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-serif-luxury leading-tight">
                    Hablemos de tu <span className="italic text-[#C5A880]">próxima propiedad.</span>
                  </h2>
                  <p className="text-sm sm:text-base text-gray-200 font-light max-w-xl">
                    Nuestro equipo de expertos inmobiliarios está listo para asesorarte y garantizar la mejor inversión de tu vida con absoluta discreción y profesionalismo.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                  <button 
                    onClick={() => setIsAppointmentOpen(true)}
                    className="bg-gradient-to-r from-[#C5A880] to-[#B3966D] hover:from-[#B3966D] hover:to-[#9E7D4E] text-white text-xs tracking-[0.2em] font-semibold uppercase px-9 py-4.5 rounded-full shadow-2xl transition-all flex items-center space-x-2 cursor-pointer border border-white/20"
                  >
                    <span>CONTACTANOS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <img 
                    src="https://i.postimg.cc/3R3wvxwt/logoweb2.png" 
                    alt="Tavares" 
                    className="h-20 sm:h-24 w-auto object-contain opacity-95 hidden sm:block drop-shadow-2xl"
                  />
                </div>

              </div>
            </div>
          </section>

          {/* Services */}
          <section id="servicios" className="py-24 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-[#C5A880] text-xs font-semibold tracking-[0.25em] uppercase block">
                  LO QUE OFRECEMOS
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif-luxury text-[#2C2A29]">
                  Nuestros Servicios <span className="italic text-[#9E7D4E]">Inmobiliarios.</span>
                </h2>
                <p className="text-sm sm:text-base text-[#5A5550] font-light leading-relaxed">
                  Un acompañamiento integral y especializado para cada etapa de su inversión o gestión inmobiliaria, garantizando total seguridad legal y comercial.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                
                <div className="bg-white rounded-[16px] p-8 border border-[#E5E1D8] shadow-xs hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between">
                  <div className="absolute top-6 right-6 font-serif-luxury text-3xl font-bold text-[#C5A880]/30 select-none">
                    01
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-4">
                      <Megaphone className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[#2C2A29]">
                      Captación y Comercialización
                    </h3>
                    <ul className="space-y-2.5 pt-2 text-xs text-[#5A5550] font-light">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Evaluación y valoración de mercado</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Estrategia de marketing y difusión</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Gestión de visitas y clientes potenciales</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[#E5E1D8]/60">
                    <button 
                      onClick={() => setIsAppointmentOpen(true)}
                      className="text-xs font-semibold tracking-wider uppercase text-[#C5A880] hover:text-[#9E7D4E] flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>Solicitar servicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[16px] p-8 border border-[#E5E1D8] shadow-xs hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between">
                  <div className="absolute top-6 right-6 font-serif-luxury text-3xl font-bold text-[#C5A880]/30 select-none">
                    02
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-4">
                      <Key className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[#2C2A29]">
                      Alquileres y Administración
                    </h3>
                    <ul className="space-y-2.5 pt-2 text-xs text-[#5A5550] font-light">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Selección y perfilamiento de inquilinos</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Redacción de contratos de arrendamiento</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Gestión de cobros, mantenimientos e incidencias</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[#E5E1D8]/60">
                    <button 
                      onClick={() => setIsAppointmentOpen(true)}
                      className="text-xs font-semibold tracking-wider uppercase text-[#C5A880] hover:text-[#9E7D4E] flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>Solicitar servicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[16px] p-8 border border-[#E5E1D8] shadow-xs hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between">
                  <div className="absolute top-6 right-6 font-serif-luxury text-3xl font-bold text-[#C5A880]/30 select-none">
                    03
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-4">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[#2C2A29]">
                      Auditoría Documental
                    </h3>
                    <ul className="space-y-2.5 pt-2 text-xs text-[#5A5550] font-light">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Revisión de títulos y saneamiento legal</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Tramitación de solvencias y cédula catastral</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Corrección de documentos y discrepancias</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[#E5E1D8]/60">
                    <button 
                      onClick={() => setIsAppointmentOpen(true)}
                      className="text-xs font-semibold tracking-wider uppercase text-[#C5A880] hover:text-[#9E7D4E] flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>Solicitar servicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[16px] p-8 border border-[#E5E1D8] shadow-xs hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between">
                  <div className="absolute top-6 right-6 font-serif-luxury text-3xl font-bold text-[#C5A880]/30 select-none">
                    04
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-4">
                      <Scale className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[#2C2A29]">
                      Trámites Registrales y Legales
                    </h3>
                    <ul className="space-y-2.5 pt-2 text-xs text-[#5A5550] font-light">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Redacción de opciones a compra y ventas</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Registro de liberaciones de hipoteca y gravámenes</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Protocolización de poderes de representación</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[#E5E1D8]/60">
                    <button 
                      onClick={() => setIsAppointmentOpen(true)}
                      className="text-xs font-semibold tracking-wider uppercase text-[#C5A880] hover:text-[#9E7D4E] flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>Solicitar servicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[16px] p-8 border border-[#E5E1D8] shadow-xs hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between md:col-span-2 lg:col-span-1">
                  <div className="absolute top-6 right-6 font-serif-luxury text-3xl font-bold text-[#C5A880]/30 select-none">
                    05
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-4">
                      <Handshake className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[#2C2A29]">
                      Acompañamiento y Cierre
                    </h3>
                    <ul className="space-y-2.5 pt-2 text-xs text-[#5A5550] font-light">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Acompañamiento a firma en Notaría y Registro</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Liquidación de aranceles e impuestos</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0"></span>
                        <span>Entrega formal de la propiedad</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[#E5E1D8]/60">
                    <button 
                      onClick={() => setIsAppointmentOpen(true)}
                      className="text-xs font-semibold tracking-wider uppercase text-[#C5A880] hover:text-[#9E7D4E] flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>Solicitar servicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              <div id="nosotros" className="bg-[#F5F1EB] rounded-2xl border border-[#E5E1D8] p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif-luxury font-bold text-[#2C2A29]">Respaldo Profesional</h3>
                    <p className="text-sm text-[#5A5550] font-light leading-relaxed">
                      Expertos capacitados y certificados para garantizar transacciones seguras y eficientes. Nuestro equipo jurídico y comercial trabaja en conjunto para proteger su patrimonio.
                    </p>
                  </div>

                  <div className="space-y-4 lg:border-l lg:border-[#E5E1D8] lg:pl-12">
                    <div className="w-12 h-12 rounded-xl bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif-luxury font-bold text-[#2C2A29]">Únete a Nosotros</h3>
                    <p className="text-sm text-[#5A5550] font-light leading-relaxed">
                      Impulsamos el talento. Si eres profesional inmobiliario, súmate a nuestro equipo y haz crecer tu carrera con el respaldo de una marca de prestigio.
                    </p>
                    <div className="pt-2">
                      <button 
                        onClick={() => setIsRegisterOpen(true)}
                        className="inline-flex items-center space-x-2 bg-[#C5A880] hover:bg-[#B3966D] text-white text-xs tracking-widest font-semibold uppercase px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
                      >
                        <span>QUIERO UNIRME</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* NUESTRO EQUIPO (Separados en Cuerpo Jurídico y Asesores Inmobiliarios) */}
          <section className="py-20 bg-white border-t border-[#E5E1D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[#9E7D4E] text-xs font-bold tracking-[0.25em] uppercase block">
                  NUESTRO EQUIPO PROFESIONAL
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#111111]">
                  Especialistas de <span className="italic text-[#9E7D4E]">Confianza</span>
                </h2>
                <p className="text-sm text-[#333333] font-normal">
                  Respaldo legal riguroso y asesoría comercial de alto nivel para blindar y maximizar cada inversión.
                </p>
              </div>

              {/* BLOQUE 1: CUERPO LEGAL & ABOGADOS */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b border-[#E5E1D8] pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E]">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#111111]">
                      Cuerpo Jurídico & Abogados
                    </h3>
                    <p className="text-xs text-[#555555]">
                      Especialistas en derecho mercantil, procesal civil, penal corporativo y blindaje registral
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                  {teamMembers.filter(m => m.category === 'abogado').map((member) => (
                    <div 
                      key={member.id}
                      onClick={() => {
                        setActiveTeamMember(member);
                        setCurrentView('team-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex flex-col items-center text-center group cursor-pointer bg-[#FDFBF7] p-4 sm:p-5 rounded-2xl border border-[#E5E1D8]/80 hover:border-[#9E7D4E] hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative w-16 h-16 sm:w-22 sm:h-22 mb-3 rounded-full p-1 bg-gradient-to-tr from-[#C5A880] via-[#E5E1D8] to-[#9E7D4E] shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <User className="w-8 h-8 sm:w-11 sm:h-11 text-[#C5A880] group-hover:text-[#9E7D4E] transition-colors" />
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-serif-luxury font-bold text-[#111111] group-hover:text-[#9E7D4E] transition-colors line-clamp-2">
                        {member.name}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#555555] font-normal mt-1 line-clamp-2">
                        {member.role}
                      </p>
                      <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold text-[#9E7D4E] mt-2.5 group-hover:underline">
                        <span>Ver perfil</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BLOQUE 2: ASESORES INMOBILIARIOS & FINANCIEROS */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b border-[#E5E1D8] pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#111111]">
                      Equipo de Asesores Inmobiliarios & Financieros
                    </h3>
                    <p className="text-xs text-[#555555]">
                      Especialistas en captación, ventas, análisis financiero y estructuración de cierres de alto nivel
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                  {teamMembers.filter(m => m.category === 'asesor').map((member) => (
                    <div 
                      key={member.id}
                      onClick={() => {
                        setActiveTeamMember(member);
                        setCurrentView('team-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex flex-col items-center text-center group cursor-pointer bg-[#FDFBF7] p-4 sm:p-5 rounded-2xl border border-[#E5E1D8]/80 hover:border-[#9E7D4E] hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative w-16 h-16 sm:w-22 sm:h-22 mb-3 rounded-full p-1 bg-gradient-to-tr from-[#C5A880] via-[#E5E1D8] to-[#9E7D4E] shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <User className="w-8 h-8 sm:w-11 sm:h-11 text-[#C5A880] group-hover:text-[#9E7D4E] transition-colors" />
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-serif-luxury font-bold text-[#111111] group-hover:text-[#9E7D4E] transition-colors line-clamp-2">
                        {member.name}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#555555] font-normal mt-1 line-clamp-2">
                        {member.role}
                      </p>
                      <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold text-[#9E7D4E] mt-2.5 group-hover:underline">
                        <span>Ver perfil</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8">
                <button 
                  onClick={() => { setCurrentView('team'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-[#111111] hover:text-[#9E7D4E] border-b-2 border-[#111111] hover:border-[#9E7D4E] pb-1 transition-colors cursor-pointer"
                >
                  <span>VER INFORMACIÓN COMPLETA DEL EQUIPO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contacto" className="py-20 bg-white border-t border-[#E5E1D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-[#C5A880] text-xs font-semibold tracking-[0.2em] uppercase block">
                    CONTACTO DIRECTO
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif-luxury text-[#2C2A29]">
                    Estamos para <span className="italic text-[#9E7D4E]">atenderle.</span>
                  </h2>
                  <p className="text-sm text-[#5A5550] font-light leading-relaxed">
                    Visítenos en nuestras oficinas o comuníquese con nuestros asesores especializados. Su próxima gran inversión comienza aquí.
                  </p>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] shrink-0 mt-1">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2C2A29]">Oficina Principal</h4>
                        <p className="text-xs text-gray-500 font-light">Torre Financial Center, Piso 8, Las Mercedes, Caracas.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] shrink-0 mt-1">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2C2A29]">Teléfono</h4>
                        <p className="text-xs text-gray-500 font-light">+58 (212) 555-TAVAREZ / +58 (412) 555-0199</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] shrink-0 mt-1">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2C2A29]">Correo Electrónico</h4>
                        <p className="text-xs text-gray-500 font-light">contacto@distinicioninmobiliariatavares.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-[#FDFBF7] p-8 sm:p-10 rounded-2xl border border-[#E5E1D8]">
                  <h3 className="text-xl font-serif-luxury font-bold text-[#2C2A29] mb-6">Envíenos un Mensaje</h3>
                  
                  {formSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl flex items-center space-x-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm">¡Mensaje Enviado con Éxito!</h4>
                        <p className="text-xs text-emerald-700 mt-1">Nos pondremos en contacto con usted a la brevedad posible.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Nombre completo</label>
                          <input 
                            type="text" 
                            required
                            value={appointmentForm.name}
                            onChange={(e) => setAppointmentForm({...appointmentForm, name: e.target.value})}
                            className="w-full bg-white border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                            placeholder="Ej. María Alejandra Pérez"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Teléfono</label>
                          <input 
                            type="tel" 
                            required
                            value={appointmentForm.phone}
                            onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value})}
                            className="w-full bg-white border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                            placeholder="+58 412 0000000"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Correo Electrónico</label>
                          <input 
                            type="email" 
                            required
                            value={appointmentForm.email}
                            onChange={(e) => setAppointmentForm({...appointmentForm, email: e.target.value})}
                            className="w-full bg-white border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                            placeholder="correo@ejemplo.com"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Servicio de Interés</label>
                          <select 
                            value={appointmentForm.service}
                            onChange={(e) => setAppointmentForm({...appointmentForm, service: e.target.value})}
                            className="w-full bg-white border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                          >
                            <option>Captación y Comercialización</option>
                            <option>Alquileres y Administración</option>
                            <option>Auditoría Documental</option>
                            <option>Trámites Registrales y Legales</option>
                            <option>Acompañamiento y Cierre</option>
                            <option>Compra de Propiedad</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Mensaje / Requerimiento</label>
                        <textarea 
                          rows={4}
                          required
                          value={appointmentForm.message}
                          onChange={(e) => setAppointmentForm({...appointmentForm, message: e.target.value})}
                          className="w-full bg-white border border-[#E5E1D8] p-4 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                          placeholder="Describa brevemente cómo podemos ayudarle..."
                        ></textarea>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-[#C5A880] hover:bg-[#B3966D] text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <span>ENVIAR SOLICITUD</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </div>
          </section>
        </>
      )}

      {/* ----------------- VISTA 2: CATÁLOGO DE PROPIEDADES ----------------- */}
      {currentView === 'properties' && (
        <div className="py-12 bg-[#FDFBF7] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="mb-8 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-[#7A7570] tracking-wider uppercase">
                <button onClick={() => setCurrentView('home')} className="hover:text-[#C5A880] cursor-pointer">Inicio</button>
                <span>/</span>
                <span className="text-[#2C2A29] font-semibold">Catálogo de Propiedades</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif-luxury text-[#2C2A29]">
                Catálogo Exclusivo <span className="italic text-[#C5A880]">Inmobiliario</span>
              </h1>
              <p className="text-sm text-[#5A5550] font-light">
                Utiliza los filtros de la izquierda para refinar tu búsqueda por zona, categoría y precio.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Panel de Filtros Lateral */}
              <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E5E1D8] shadow-sm space-y-6 sticky top-28">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D8]">
                  <h3 className="text-sm font-serif-luxury font-bold text-[#2C2A29] uppercase tracking-wider">Filtros de Búsqueda</h3>
                  {(shopSearch || shopCategory !== 'all' || shopCity !== 'all') && (
                    <button 
                      onClick={() => { setShopSearch(''); setShopCategory('all'); setShopCity('all'); setShopSort('featured'); }}
                      className="text-xs text-[#C5A880] hover:underline font-semibold cursor-pointer"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5550]">Palabra Clave</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7570]" />
                    <input 
                      type="text"
                      value={shopSearch}
                      onChange={(e) => setShopSearch(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full bg-[#FDFBF7] border border-[#E5E1D8] pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5550]">Categoría / Estado</label>
                  <select 
                    value={shopCategory}
                    onChange={(e) => setShopCategory(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-3 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium text-[#2C2A29] focus:outline-none focus:border-[#C5A880] cursor-pointer"
                  >
                    <option value="all">Todas las Categorías</option>
                    {propertyTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5550]">Ciudad / Zona</label>
                  <select 
                    value={shopCity}
                    onChange={(e) => setShopCity(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-3 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium text-[#2C2A29] focus:outline-none focus:border-[#C5A880] cursor-pointer"
                  >
                    <option value="all">Todas las Zonas</option>
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Sorting */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5550]">Ordenar Por</label>
                  <select 
                    value={shopSort}
                    onChange={(e) => setShopSort(e.target.value as any)}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-3 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium text-[#2C2A29] focus:outline-none focus:border-[#C5A880] cursor-pointer"
                  >
                    <option value="featured">Destacados</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                  </select>
                </div>
              </div>

              {/* Right Properties Grid */}
              <div className="lg:col-span-9 space-y-6">
                
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-[#E5E1D8] shadow-sm text-xs text-[#7A7570]">
                  <p>Mostrando <span className="font-semibold text-[#2C2A29]">{filteredShopProperties.length}</span> inmuebles</p>
                </div>

                {filteredShopProperties.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-[#E5E1D8] space-y-4">
                    <Building className="w-12 h-12 text-[#C5A880] mx-auto opacity-50" />
                    <h3 className="text-xl font-serif-luxury font-bold text-[#2C2A29]">No se encontraron propiedades</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      Pruebe a cambiar los filtros de búsqueda o categoría seleccionados.
                    </p>
                    <button 
                      onClick={() => { setShopSearch(''); setShopCategory('all'); setShopCity('all'); }}
                      className="bg-[#C5A880] text-white text-xs uppercase font-semibold px-6 py-3 rounded-xl cursor-pointer"
                    >
                      Ver todas las propiedades
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredShopProperties.map((prop) => (
                      <div 
                        key={prop.id}
                        onClick={() => {
                          setActiveProperty(prop);
                          setCurrentView('property-detail');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white rounded-2xl overflow-hidden border border-[#E5E1D8] shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <img 
                            src={prop.image} 
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-md shadow-xs ${prop.type === 'en-venta' ? 'bg-[#C5A880] text-white' : 'bg-[#2C2A29] text-white'}`}>
                              {prop.type === 'en-venta' ? 'EN VENTA' : 'EN ALQUILER'}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h3 className="text-lg font-serif-luxury font-bold text-[#2C2A29] mb-1 group-hover:text-[#C5A880] transition-colors">
                              {prop.title}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                              <span className="truncate">{prop.location}</span>
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E5E1D8]/60 text-xs text-gray-600 font-light">
                            <div className="flex items-center space-x-1">
                              <Bed className="w-4 h-4 text-[#C5A880]" />
                              <span>{prop.beds} hab</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Bath className="w-4 h-4 text-[#C5A880]" />
                              <span>{prop.baths} baños</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Square className="w-4 h-4 text-[#C5A880]" />
                              <span>{prop.sqm} m²</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-lg font-bold text-[#2C2A29]">
                              {prop.price}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-white transition-colors">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ----------------- VIEW 3: DEDICATED PROPERTY DETAIL PAGE TAB (NO POP-UP) ----------------- */}
      {currentView === 'property-detail' && activeProperty && (
        <div className="py-12 bg-[#FDFBF7] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-[#7A7570] tracking-wider uppercase">
                <button onClick={() => setCurrentView('home')} className="hover:text-[#C5A880] cursor-pointer">Inicio</button>
                <span>/</span>
                <button onClick={() => setCurrentView('properties')} className="hover:text-[#C5A880] cursor-pointer">Catálogo</button>
                <span>/</span>
                <span className="text-[#2C2A29] font-semibold truncate max-w-xs">{activeProperty.title}</span>
              </div>
              <button 
                onClick={() => setCurrentView('properties')}
                className="text-xs uppercase font-semibold tracking-wider text-[#C5A880] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>← Volver al Catálogo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              <div className="lg:col-span-8 space-y-8">
                {/* Main Active Image */}
                <div className="bg-white rounded-3xl overflow-hidden border border-[#E5E1D8] shadow-lg aspect-[16/10] relative">
                  <img 
                    src={(activeProperty.images && activeProperty.images[activeImageIndex]) || activeProperty.image} 
                    alt={activeProperty.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    Foto {activeImageIndex + 1} de {(activeProperty.images && activeProperty.images.length) || 1}
                  </div>
                </div>

                {/* 10-Image Gallery Grid Selector */}
                {activeProperty.images && activeProperty.images.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#7A7570]">Galería de Fotos ({activeProperty.images.length} imágenes)</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {activeProperty.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeImageIndex === idx ? 'border-[#C5A880] ring-2 ring-[#C5A880]/40 scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                          <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Video Tour */}
                {activeProperty.videoUrl && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-4">
                    <div className="flex items-center space-x-2 text-[#2C2A29]">
                      <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-serif-luxury font-bold">Video Recorrido del Inmueble</h3>
                    </div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#E5E1D8] shadow-inner bg-black">
                      <iframe 
                        src={activeProperty.videoUrl} 
                        title={`Video de ${activeProperty.title}`}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-6">
                  <div>
                    <span className={`text-[10px] uppercase font-semibold tracking-wider px-3.5 py-1.5 rounded-md shadow-xs inline-block mb-3 ${activeProperty.type === 'en-venta' ? 'bg-[#C5A880] text-white' : 'bg-[#2C2A29] text-white'}`}>
                      {activeProperty.type === 'en-venta' ? 'EN VENTA' : 'EN ALQUILER'}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#2C2A29]">
                      {activeProperty.title}
                    </h1>
                    <p className="text-sm text-gray-500 flex items-center space-x-1 mt-2">
                      <MapPin className="w-4 h-4 text-[#C5A880]" />
                      <span>{activeProperty.location}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#E5E1D8] text-sm font-medium text-[#2C2A29]">
                    <div className="flex items-center space-x-2">
                      <Bed className="w-5 h-5 text-[#C5A880]" />
                      <span>{activeProperty.beds} Habitaciones</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bath className="w-5 h-5 text-[#C5A880]" />
                      <span>{activeProperty.baths} Baños</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Square className="w-5 h-5 text-[#C5A880]" />
                      <span>{activeProperty.sqm} m²</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-serif-luxury font-bold text-[#2C2A29]">Descripción de la Propiedad</h3>
                    <p className="text-sm text-[#5A5550] font-light leading-relaxed">
                      {activeProperty.description || "Espectacular inmueble con excelentes acabados, ubicado en una zona exclusiva con máxima seguridad y confort para toda la familia."}
                    </p>
                  </div>

                  {activeProperty.features && activeProperty.features.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-[#E5E1D8]">
                      <h3 className="text-lg font-serif-luxury font-bold text-[#2C2A29]">Características y Comodidades</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {activeProperty.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs text-[#5A5550]">
                            <CheckCircle className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#F5F1EB] p-4 rounded-2xl flex items-center space-x-3 text-xs text-[#2C2A29]">
                    <ShieldCheck className="w-5 h-5 text-[#C5A880] shrink-0" />
                    <span>Respaldo legal y auditoría documental garantizada por Distinción Inmobiliaria Tavares.</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6 sticky top-28">
                <div className="bg-white p-8 rounded-3xl border border-[#E5E1D8] shadow-xl space-y-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Precio de Inversión</p>
                    <p className="text-3xl font-serif-luxury font-bold text-[#2C2A29]">{activeProperty.price}</p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E1D8] space-y-3">
                    <button 
                      onClick={() => setIsAppointmentOpen(true)}
                      className="w-full bg-gradient-to-r from-[#C5A880] to-[#B3966D] hover:opacity-95 text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Agendar Visita</span>
                    </button>

                    <button 
                      onClick={() => setIsAppointmentOpen(true)}
                      className="w-full bg-[#2C2A29] hover:bg-[#3C3A39] text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Contactar Asesor</span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-[#E5E1D8] text-xs text-gray-500 space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-[#C5A880]" />
                      <span>Asesor Asignado: Equipo Tavares</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-[#C5A880]" />
                      <span>Transacción 100% Segura y Verificada</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ----------------- VIEW 4: TEAM CATALOG TAB ----------------- */}
      {currentView === 'team' && (
        <div className="py-16 bg-[#FDFBF7] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-center space-x-2 text-xs text-[#7A7570] tracking-wider uppercase mb-2">
                <button onClick={() => setCurrentView('home')} className="hover:text-[#C5A880] cursor-pointer">Inicio</button>
                <span>/</span>
                <span className="text-[#111111] font-semibold">Equipo Profesional</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#111111]">
                Nuestro <span className="italic text-[#9E7D4E]">Equipo Profesional</span>
              </h1>
              <p className="text-sm sm:text-base text-[#333333] font-normal leading-relaxed">
                Especialistas con alta formación jurídica, financiera y comercial listos para proteger y maximizar tu inversión inmobiliaria.
              </p>

              {/* Filtro de Categoría */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setTeamFilter('all')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    teamFilter === 'all'
                      ? 'bg-[#111111] text-white shadow-md scale-105'
                      : 'bg-white text-[#555555] border border-[#E5E1D8] hover:border-[#9E7D4E]'
                  }`}
                >
                  Todos los Profesionales ({teamMembers.length})
                </button>
                <button
                  onClick={() => setTeamFilter('abogado')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                    teamFilter === 'abogado'
                      ? 'bg-[#9E7D4E] text-white shadow-md scale-105'
                      : 'bg-white text-[#555555] border border-[#E5E1D8] hover:border-[#9E7D4E]'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>Cuerpo Legal & Abogados ({teamMembers.filter(m => m.category === 'abogado').length})</span>
                </button>
                <button
                  onClick={() => setTeamFilter('asesor')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                    teamFilter === 'asesor'
                      ? 'bg-[#9E7D4E] text-white shadow-md scale-105'
                      : 'bg-white text-[#555555] border border-[#E5E1D8] hover:border-[#9E7D4E]'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Asesores Inmobiliarios ({teamMembers.filter(m => m.category === 'asesor').length})</span>
                </button>
              </div>
            </div>

            {/* SECCIÓN 1: CUERPO LEGAL & ABOGADOS */}
            {(teamFilter === 'all' || teamFilter === 'abogado') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-[#E5E1D8] shadow-xs">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E] shrink-0">
                      <Scale className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#111111]">
                        Cuerpo Jurídico & Abogados
                      </h2>
                      <p className="text-xs sm:text-sm text-[#555555]">
                        Especialistas en derecho mercantil, procesal civil, penal corporativo, trámites registrales y blindaje legal
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-center text-xs font-bold uppercase tracking-wider bg-[#FDFBF7] text-[#9E7D4E] px-3.5 py-1.5 rounded-full border border-[#E5E1D8]">
                    {teamMembers.filter(m => m.category === 'abogado').length} Especialistas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {teamMembers.filter(m => m.category === 'abogado').map((member) => (
                    <div 
                      key={member.id}
                      onClick={() => {
                        setActiveTeamMember(member);
                        setCurrentView('team-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-3xl overflow-hidden border border-[#E5E1D8] shadow-sm hover:shadow-xl hover:border-[#9E7D4E] transition-all duration-300 group cursor-pointer flex flex-col justify-between p-6 text-center"
                    >
                      <div>
                        <div className="w-22 h-22 sm:w-26 sm:h-26 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-[#C5A880] via-[#E5E1D8] to-[#9E7D4E] shadow-sm group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <User className="w-10 h-10 sm:w-12 sm:h-12 text-[#C5A880] group-hover:text-[#9E7D4E] transition-colors" />
                          </div>
                        </div>
                        
                        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#9E7D4E]/10 text-[#9E7D4E] text-[10px] font-bold uppercase tracking-wider mb-2">
                          <Scale className="w-3 h-3" />
                          <span>Legal</span>
                        </div>

                        <h3 className="text-base font-serif-luxury font-bold text-[#111111] group-hover:text-[#9E7D4E] transition-colors mb-1.5 line-clamp-2">
                          {member.name}
                        </h3>
                        
                        <p className="text-xs text-[#9E7D4E] font-bold uppercase tracking-wider mb-3 line-clamp-2">
                          {member.role}
                        </p>

                        {member.slogan && (
                          <p className="text-[11px] italic text-[#555555] bg-[#FDFBF7] p-2 rounded-xl mb-3 border border-[#E5E1D8]/60">
                            "{member.slogan}"
                          </p>
                        )}
                        
                        <p className="text-xs text-[#333333] font-normal leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      </div>

                      <div className="pt-4 mt-6 border-t border-[#E5E1D8]/60 space-y-2.5">
                        <div className="flex items-center justify-center space-x-1.5 text-xs text-[#111111] font-semibold">
                          <Phone className="w-3.5 h-3.5 text-[#9E7D4E]" />
                          <span>{member.phone}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#111111] pt-1">
                          <span className="font-bold text-[#9E7D4E]">Ver perfil completo</span>
                          <ChevronRight className="w-4 h-4 text-[#9E7D4E] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN 2: ASESORES INMOBILIARIOS & FINANCIEROS */}
            {(teamFilter === 'all' || teamFilter === 'asesor') && (
              <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-[#E5E1D8] shadow-xs">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E] shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#111111]">
                        Equipo de Asesores Inmobiliarios & Financieros
                      </h2>
                      <p className="text-xs sm:text-sm text-[#555555]">
                        Especialistas en captación de inmuebles, comercialización, valoración de activos y negociación de alto impacto
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-center text-xs font-bold uppercase tracking-wider bg-[#FDFBF7] text-[#9E7D4E] px-3.5 py-1.5 rounded-full border border-[#E5E1D8]">
                    {teamMembers.filter(m => m.category === 'asesor').length} Asesores
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {teamMembers.filter(m => m.category === 'asesor').map((member) => (
                    <div 
                      key={member.id}
                      onClick={() => {
                        setActiveTeamMember(member);
                        setCurrentView('team-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-3xl overflow-hidden border border-[#E5E1D8] shadow-sm hover:shadow-xl hover:border-[#9E7D4E] transition-all duration-300 group cursor-pointer flex flex-col justify-between p-6 text-center"
                    >
                      <div>
                        <div className="w-22 h-22 sm:w-26 sm:h-26 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-[#C5A880] via-[#E5E1D8] to-[#9E7D4E] shadow-sm group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <User className="w-10 h-10 sm:w-12 sm:h-12 text-[#C5A880] group-hover:text-[#9E7D4E] transition-colors" />
                          </div>
                        </div>
                        
                        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#111111]/5 text-[#111111] text-[10px] font-bold uppercase tracking-wider mb-2">
                          <Building2 className="w-3 h-3" />
                          <span>Asesor</span>
                        </div>

                        <h3 className="text-base font-serif-luxury font-bold text-[#111111] group-hover:text-[#9E7D4E] transition-colors mb-1.5 line-clamp-2">
                          {member.name}
                        </h3>
                        
                        <p className="text-xs text-[#9E7D4E] font-bold uppercase tracking-wider mb-3 line-clamp-2">
                          {member.role}
                        </p>
                        
                        <p className="text-xs text-[#333333] font-normal leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      </div>

                      <div className="pt-4 mt-6 border-t border-[#E5E1D8]/60 space-y-2.5">
                        <div className="flex items-center justify-center space-x-1.5 text-xs text-[#111111] font-semibold">
                          <Phone className="w-3.5 h-3.5 text-[#9E7D4E]" />
                          <span>{member.phone}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#111111] pt-1">
                          <span className="font-bold text-[#9E7D4E]">Ver perfil completo</span>
                          <ChevronRight className="w-4 h-4 text-[#9E7D4E] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ----------------- VIEW 5: TEAM MEMBER DETAIL TAB (NO POP-UP) ----------------- */}
      {currentView === 'team-detail' && activeTeamMember && (
        <div className="py-16 bg-[#FDFBF7] min-h-screen">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-[#7A7570] tracking-wider uppercase">
                <button onClick={() => setCurrentView('home')} className="hover:text-[#C5A880] cursor-pointer">Inicio</button>
                <span>/</span>
                <button onClick={() => setCurrentView('team')} className="hover:text-[#C5A880] cursor-pointer">Equipo</button>
                <span>/</span>
                <span className="text-[#111111] font-semibold">{activeTeamMember.name}</span>
              </div>
              <button 
                onClick={() => setCurrentView('team')}
                className="text-xs uppercase font-bold tracking-wider text-[#9E7D4E] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>← Volver al Equipo</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-xl overflow-hidden p-8 sm:p-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                
                <div className="md:col-span-5 flex flex-col items-center text-center bg-[#FDFBF7] p-8 rounded-3xl border border-[#E5E1D8]">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 bg-gradient-to-tr from-[#C5A880] via-[#E5E1D8] to-[#9E7D4E] shadow-xl mb-5 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <User className="w-20 h-20 sm:w-24 sm:h-24 text-[#C5A880]" />
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-[#9E7D4E] px-3.5 py-1 rounded-full mb-3 shadow-xs">
                    {activeTeamMember.category === 'abogado' ? '⚖️ Abogado Verificado' : '🏢 Asesor Verificado'}
                  </span>
                  
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#111111]">{activeTeamMember.name}</h2>
                  <p className="text-xs text-[#9E7D4E] font-bold mt-1 uppercase tracking-wide">{activeTeamMember.role}</p>

                  {activeTeamMember.ci && (
                    <p className="text-xs text-[#555555] font-semibold mt-1">C.I.: {activeTeamMember.ci}</p>
                  )}

                  {activeTeamMember.slogan && (
                    <div className="mt-4 p-3 bg-white rounded-xl border border-[#E5E1D8] text-xs italic text-[#333333]">
                      "{activeTeamMember.slogan}"
                    </div>
                  )}

                  <div className="w-full mt-6 pt-6 border-t border-[#E5E1D8] space-y-2.5">
                    <a 
                      href={`https://wa.me/${(activeTeamMember.whatsapp || activeTeamMember.phone).replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>WhatsApp Directo</span>
                    </a>

                    <a 
                      href={`tel:${activeTeamMember.phone}`}
                      className="w-full bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Llamar {activeTeamMember.phone}</span>
                    </a>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#9E7D4E] mb-2">Perfil Profesional</h3>
                    <p className="text-sm text-[#222222] font-normal leading-relaxed text-justify">
                      {activeTeamMember.bio}
                    </p>
                  </div>

                  {activeTeamMember.specialty && (
                    <div className="space-y-2 pt-4 border-t border-[#E5E1D8]">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111]">Área de Especialidad</h3>
                      <div className="flex items-start space-x-2.5 text-xs text-[#222222] bg-[#FDFBF7] p-3.5 rounded-xl border border-[#E5E1D8]">
                        <ShieldCheck className="w-5 h-5 text-[#9E7D4E] shrink-0 mt-0.5" />
                        <span className="font-semibold">{activeTeamMember.specialty}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t border-[#E5E1D8]">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111]">Canales de Contacto</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#222222]">
                      <div className="flex items-center space-x-2 bg-[#FDFBF7] p-3 rounded-xl border border-[#E5E1D8]">
                        <Phone className="w-4 h-4 text-[#9E7D4E] shrink-0" />
                        <span className="font-medium">{activeTeamMember.phone}</span>
                      </div>
                      
                      {activeTeamMember.email && (
                        <div className="flex items-center space-x-2 bg-[#FDFBF7] p-3 rounded-xl border border-[#E5E1D8]">
                          <Mail className="w-4 h-4 text-[#9E7D4E] shrink-0" />
                          <span className="font-medium truncate">{activeTeamMember.email}</span>
                        </div>
                      )}

                      {activeTeamMember.instagram && (
                        <a 
                          href={`https://instagram.com/${activeTeamMember.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-[#FDFBF7] hover:bg-[#F5F1EB] p-3 rounded-xl border border-[#E5E1D8] transition-colors cursor-pointer"
                        >
                          <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />
                          <span className="font-medium">@{activeTeamMember.instagram}</span>
                        </a>
                      )}

                      {activeTeamMember.tiktok && (
                        <a 
                          href={`https://tiktok.com/@${activeTeamMember.tiktok}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-[#FDFBF7] hover:bg-[#F5F1EB] p-3 rounded-xl border border-[#E5E1D8] transition-colors cursor-pointer"
                        >
                          <span className="font-bold text-black shrink-0 text-sm">♪</span>
                          <span className="font-medium">@{activeTeamMember.tiktok}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4">
                    <button 
                      onClick={() => setIsAppointmentOpen(true)}
                      className="w-full sm:w-auto bg-gradient-to-r from-[#C5A880] via-[#B3966D] to-[#9E7D4E] hover:opacity-95 text-white text-xs tracking-widest font-bold uppercase px-8 py-4 rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>AGENDAR CITA CON {activeTeamMember.name.split(' ')[0].toUpperCase()}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- VISTA 6: PANEL DE ADMINISTRACIÓN (NO POP-UP) ----------------- */}
      {currentView === 'admin' && (
        <div className="py-12 bg-[#FDFBF7] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Si no es usuario administrador */}
            {!isAdmin ? (
              <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-[#E5E1D8] shadow-2xl p-8 sm:p-10 text-center animate-in fade-in zoom-95 duration-200">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-50 flex items-center justify-center text-[#9E7D4E] shadow-inner">
                  <Shield className="w-8 h-8" />
                </div>

                <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-amber-700 px-3.5 py-1 rounded-full mb-3 inline-block shadow-xs">
                  Acceso Restringido
                </span>

                <h1 className="text-2xl font-serif-luxury font-bold text-[#111111] mb-2">
                  Panel Administrativo
                </h1>
                <p className="text-xs text-[#555555] leading-relaxed mb-6">
                  {user 
                    ? `La cuenta actual (${user.email}) no cuenta con permisos de administrador.`
                    : 'Debes iniciar sesión con tu cuenta de Administrador para gestionar el sistema.'}
                </p>

                <div className="space-y-3">
                  {!user ? (
                    <button 
                      onClick={() => setIsLoginOpen(true)}
                      className="w-full bg-gradient-to-r from-[#C5A880] via-[#B3966D] to-[#9E7D4E] hover:opacity-95 text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>INICIAR SESIÓN COMO ADMIN</span>
                    </button>
                  ) : null}

                  <button 
                    type="button"
                    onClick={() => setCurrentView('home')}
                    className="w-full bg-[#111111] text-white hover:bg-[#222222] text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Volver a la Página Principal
                  </button>
                </div>
              </div>
            ) : (
              /* Panel Autenticado Directo */
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {/* Header Superior del Dashboard */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E1D8] shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E] shrink-0">
                      <LayoutDashboard className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-serif-luxury font-bold text-[#111111]">
                          Panel de Control Administrativo
                        </h1>
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                          Sesión Activa
                        </span>
                      </div>
                      <p className="text-xs text-[#555555] mt-0.5">
                        Gestión en tiempo real del inventario inmobiliario, variables de búsqueda y solicitudes.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button 
                      onClick={() => { setCurrentView('properties'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="inline-flex items-center space-x-1.5 bg-[#FDFBF7] hover:bg-[#F5F1EB] text-[#111111] border border-[#E5E1D8] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#9E7D4E]" />
                      <span>Ver Catálogo Público</span>
                    </button>
                    
                    <button 
                      onClick={handleAdminLogout}
                      className="inline-flex items-center space-x-1.5 bg-[#111111] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>

                {/* Notificación Toast Administrativa */}
                {adminNotification && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{adminNotification}</span>
                  </div>
                )}

                {/* Tarjetas de Métricas / Resumen Ejecutivo */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white p-5 rounded-2xl border border-[#E5E1D8] shadow-xs">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">Total Inmuebles</span>
                      <Building className="w-4 h-4 text-[#9E7D4E]" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">{properties.length}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">Disponibles en el portal</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E5E1D8] shadow-xs">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">En Venta</span>
                      <Key className="w-4 h-4 text-[#9E7D4E]" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">
                      {properties.filter(p => p.type === 'en-venta').length}
                    </p>
                    <p className="text-[10px] text-[#7A7570] mt-1">Propiedades en venta</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E5E1D8] shadow-xs">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">En Alquiler</span>
                      <Building2 className="w-4 h-4 text-[#9E7D4E]" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">
                      {properties.filter(p => p.type === 'en-alquiler').length}
                    </p>
                    <p className="text-[10px] text-[#7A7570] mt-1">Inmuebles en renta</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E5E1D8] shadow-xs">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">Zonas Activas</span>
                      <MapPin className="w-4 h-4 text-[#9E7D4E]" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">{cities.length}</p>
                    <p className="text-[10px] text-[#7A7570] mt-1">Variables de búsqueda</p>
                  </div>
                </div>

                {/* Navegación por Pestañas del Panel */}
                <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E1D8] pb-4">
                  <button
                    onClick={() => setAdminActiveTab('properties')}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                      adminActiveTab === 'properties'
                        ? 'bg-[#111111] text-white shadow-md'
                        : 'bg-white text-[#555555] border border-[#E5E1D8] hover:border-[#9E7D4E]'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Catálogo de Inmuebles ({properties.length})</span>
                  </button>

                  <button
                    onClick={() => setAdminActiveTab('zones')}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                      adminActiveTab === 'zones'
                        ? 'bg-[#9E7D4E] text-white shadow-md'
                        : 'bg-white text-[#555555] border border-[#E5E1D8] hover:border-[#9E7D4E]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Zonas y Ciudades ({cities.length})</span>
                  </button>

                  <button
                    onClick={() => setAdminActiveTab('categories')}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                      adminActiveTab === 'categories'
                        ? 'bg-[#9E7D4E] text-white shadow-md'
                        : 'bg-white text-[#555555] border border-[#E5E1D8] hover:border-[#9E7D4E]'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Tipos de Operación ({propertyTypes.length})</span>
                  </button>

                  <button
                    onClick={() => setAdminActiveTab('appointments')}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                      adminActiveTab === 'appointments'
                        ? 'bg-[#9E7D4E] text-white shadow-md'
                        : 'bg-white text-[#555555] border border-[#E5E1D8] hover:border-[#9E7D4E]'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Citas y Solicitudes ({appointmentsList.length})</span>
                  </button>
                </div>

                {/* CONTENIDO PESTAÑA 1: INMUEBLES */}
                {adminActiveTab === 'properties' && (
                  <div className="space-y-6">
                    {/* Barra de Búsqueda y Botón Añadir */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E1D8] shadow-xs">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7570]" />
                        <input 
                          type="text"
                          value={adminSearch}
                          onChange={(e) => setAdminSearch(e.target.value)}
                          placeholder="Buscar inmueble por título o ubicación..."
                          className="w-full bg-[#FDFBF7] border border-[#E5E1D8] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                        />
                      </div>

                      <button 
                        onClick={handleOpenNewProperty}
                        className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#C5A880] via-[#B3966D] to-[#9E7D4E] hover:opacity-95 text-white text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>AÑADIR NUEVO INMUEBLE</span>
                      </button>
                    </div>

                    {/* Listado de Propiedades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {properties
                        .filter(p => adminSearch === '' || p.title.toLowerCase().includes(adminSearch.toLowerCase()) || p.location.toLowerCase().includes(adminSearch.toLowerCase()))
                        .map((prop) => (
                          <div 
                            key={prop.id}
                            className="bg-white rounded-3xl border border-[#E5E1D8] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                          >
                            <div>
                              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                <img 
                                  src={prop.image} 
                                  alt={prop.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-[#111111]/85 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-xs">
                                  {prop.type === 'en-venta' ? 'En Venta' : prop.type === 'en-alquiler' ? 'En Alquiler' : prop.type}
                                </div>
                                <div className="absolute bottom-3 left-3 bg-[#9E7D4E] text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                                  {prop.price}
                                </div>
                              </div>

                              <div className="p-5 space-y-3">
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7D4E] block">
                                    {prop.city || 'Caracas'}
                                  </span>
                                  <h3 className="text-base font-serif-luxury font-bold text-[#111111] line-clamp-1 mt-0.5">
                                    {prop.title}
                                  </h3>
                                  <p className="text-xs text-[#555555] flex items-center space-x-1 mt-1">
                                    <MapPin className="w-3.5 h-3.5 text-[#9E7D4E] shrink-0" />
                                    <span className="truncate">{prop.location}</span>
                                  </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E5E1D8]/60 text-center text-xs text-[#222222]">
                                  <div>
                                    <span className="text-[10px] text-[#7A7570] block">Hab.</span>
                                    <span className="font-bold">{prop.beds}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-[#7A7570] block">Baños</span>
                                    <span className="font-bold">{prop.baths}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-[#7A7570] block">Área</span>
                                    <span className="font-bold">{prop.sqm} m²</span>
                                  </div>
                                </div>

                                {prop.description && (
                                  <p className="text-xs text-[#555555] line-clamp-2 leading-relaxed">
                                    {prop.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Acciones */}
                            <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-[#E5E1D8]/50 pt-4">
                              <button 
                                onClick={() => handleOpenEditProperty(prop)}
                                className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-[#FDFBF7] hover:bg-[#F5F1EB] text-[#111111] border border-[#E5E1D8] text-xs font-bold uppercase py-2.5 rounded-xl transition-all cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#9E7D4E]" />
                                <span>Editar</span>
                              </button>

                              {deleteConfirmId === prop.id ? (
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => handleDeleteProperty(prop.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                                  >
                                    Confirmar
                                  </button>
                                  <button 
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="bg-gray-200 text-gray-700 text-xs px-2.5 py-2.5 rounded-xl cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setDeleteConfirmId(prop.id)}
                                  className="inline-flex items-center justify-center space-x-1.5 text-red-600 hover:bg-red-50 p-2.5 rounded-xl border border-red-200 transition-colors cursor-pointer"
                                  title="Eliminar inmueble"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* CONTENIDO PESTAÑA 2: ZONAS Y CIUDADES */}
                {adminActiveTab === 'zones' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Formulario Añadir Zona */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-4">
                      <div className="flex items-center space-x-2 pb-3 border-b border-[#E5E1D8]">
                        <MapPin className="w-5 h-5 text-[#9E7D4E]" />
                        <h3 className="text-base font-serif-luxury font-bold text-[#111111]">
                          Añadir Nueva Zona
                        </h3>
                      </div>
                      <p className="text-xs text-[#555555] leading-relaxed">
                        Las zonas registradas aparecen automáticamente en los filtros de búsqueda del catálogo público.
                      </p>

                      <form onSubmit={handleAddCity} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                            Nombre de la Zona / Ciudad
                          </label>
                          <input 
                            type="text"
                            required
                            value={newCityInput}
                            onChange={(e) => setNewCityInput(e.target.value)}
                            placeholder="Ej: Los Naranjos, El Hatillo..."
                            className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>REGISTRAR ZONA</span>
                        </button>
                      </form>
                    </div>

                    {/* Listado de Zonas Existentes */}
                    <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D8]">
                        <div>
                          <h3 className="text-base font-serif-luxury font-bold text-[#111111]">
                            Zonas Activas en el Sistema
                          </h3>
                          <p className="text-xs text-[#555555]">
                            Variables de búsqueda geográfica disponibles actualmente
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#9E7D4E] bg-[#FDFBF7] px-3 py-1 rounded-full border border-[#E5E1D8]">
                          {cities.length} Registradas
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cities.map((city) => {
                          const count = properties.filter(p => p.city === city || p.location.includes(city)).length;
                          return (
                            <div 
                              key={city}
                              className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-2xl border border-[#E5E1D8] hover:border-[#9E7D4E] transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E]">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-[#111111]">{city}</h4>
                                  <p className="text-[10px] text-[#7A7570]">{count} propiedades asignadas</p>
                                </div>
                              </div>

                              <button 
                                onClick={() => handleDeleteCity(city)}
                                className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar zona"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* CONTENIDO PESTAÑA 3: CATEGORÍAS Y TIPOS DE OPERACIÓN */}
                {adminActiveTab === 'categories' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Formulario Añadir Categoría */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-4">
                      <div className="flex items-center space-x-2 pb-3 border-b border-[#E5E1D8]">
                        <Layers className="w-5 h-5 text-[#9E7D4E]" />
                        <h3 className="text-base font-serif-luxury font-bold text-[#111111]">
                          Nueva Categoría / Operación
                        </h3>
                      </div>
                      <p className="text-xs text-[#555555] leading-relaxed">
                        Permite añadir nuevos filtros de operación comercial (ej. Traspasos, Preventa, Terrenos).
                      </p>

                      <form onSubmit={handleAddCategory} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                            Nombre de la Categoría
                          </label>
                          <input 
                            type="text"
                            required
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Ej: En Preventa, Terrenos..."
                            className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                            Identificador Único (Opcional)
                          </label>
                          <input 
                            type="text"
                            value={newCategoryId}
                            onChange={(e) => setNewCategoryId(e.target.value)}
                            placeholder="Ej: preventa"
                            className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>REGISTRAR CATEGORÍA</span>
                        </button>
                      </form>
                    </div>

                    {/* Listado de Categorías Existentes */}
                    <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D8]">
                        <div>
                          <h3 className="text-base font-serif-luxury font-bold text-[#111111]">
                            Tipos de Operación Activos
                          </h3>
                          <p className="text-xs text-[#555555]">
                            Clasificación de inmuebles en catálogo y formularios
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#9E7D4E] bg-[#FDFBF7] px-3 py-1 rounded-full border border-[#E5E1D8]">
                          {propertyTypes.length} Categorías
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {propertyTypes.map((type) => {
                          const count = properties.filter(p => p.type === type.id).length;
                          return (
                            <div 
                              key={type.id}
                              className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-2xl border border-[#E5E1D8] hover:border-[#9E7D4E] transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E]">
                                  <Key className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-[#111111]">{type.name}</h4>
                                  <p className="text-[10px] text-[#7A7570]">Código: {type.id} • {count} inmuebles</p>
                                </div>
                              </div>

                              <button 
                                onClick={() => handleDeleteCategory(type.id)}
                                className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar categoría"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* CONTENIDO PESTAÑA 4: CITAS Y SOLICITUDES */}
                {adminActiveTab === 'appointments' && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D8]">
                      <div>
                        <h3 className="text-base font-serif-luxury font-bold text-[#111111]">
                          Solicitudes de Cita y Contacto de Clientes
                        </h3>
                        <p className="text-xs text-[#555555]">
                          Requerimientos enviados a través del formulario de asesoría
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#9E7D4E] bg-[#FDFBF7] px-3 py-1 rounded-full border border-[#E5E1D8]">
                        {appointmentsList.length} Solicitudes
                      </span>
                    </div>

                    {appointmentsList.length === 0 ? (
                      <div className="text-center py-12 text-[#7A7570] text-xs">
                        No hay solicitudes de cita pendientes en este momento.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {appointmentsList.map((item) => (
                          <div 
                            key={item.id}
                            className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#E5E1D8] flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-[#111111]">{item.name}</span>
                                <span className="text-[10px] bg-[#9E7D4E]/10 text-[#9E7D4E] font-semibold px-2 py-0.5 rounded-md">
                                  {item.service}
                                </span>
                                <span className="text-[10px] text-[#7A7570]">Fecha deseada: {item.date}</span>
                              </div>

                              <p className="text-xs text-[#333333] italic bg-white p-2.5 rounded-xl border border-[#E5E1D8]/60">
                                "{item.message}"
                              </p>

                              <div className="flex flex-wrap items-center gap-4 text-xs text-[#555555]">
                                <span className="flex items-center space-x-1">
                                  <Phone className="w-3.5 h-3.5 text-[#9E7D4E]" />
                                  <a href={`tel:${item.phone}`} className="hover:underline font-medium text-[#111111]">{item.phone}</a>
                                </span>
                                {item.email && (
                                  <span className="flex items-center space-x-1">
                                    <Mail className="w-3.5 h-3.5 text-[#9E7D4E]" />
                                    <a href={`mailto:${item.email}`} className="hover:underline font-medium text-[#111111]">{item.email}</a>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 self-end md:self-center">
                              <a 
                                href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1 shadow-xs transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>

                              <button 
                                onClick={() => handleDeleteAppointment(item.id)}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* ----------------- VISTA 7: DASHBOARD DE USUARIO (NO POP-UP) ----------------- */}
      {currentView === 'user-dashboard' && (
        <div className="py-12 bg-[#FDFBF7] min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Breadcrumb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-[#7A7570] tracking-wider uppercase">
                <button onClick={() => setCurrentView('home')} className="hover:text-[#C5A880] cursor-pointer">Inicio</button>
                <span>/</span>
                <span className="text-[#111111] font-semibold">Mi Cuenta y Perfil</span>
              </div>
              <button 
                onClick={() => setCurrentView('home')}
                className="text-xs uppercase font-bold tracking-wider text-[#9E7D4E] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>← Volver al Inicio</span>
              </button>
            </div>

            {!user ? (
              /* Si no ha iniciado sesión */
              <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-[#E5E1D8] shadow-xl p-8 sm:p-10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E]">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-serif-luxury font-bold text-[#111111] mb-2">
                  Inicia Sesión en tu Cuenta
                </h2>
                <p className="text-xs text-[#555555] leading-relaxed mb-6">
                  Accede a tu panel para ver tus datos personales, actualizar tu correo, cambiar tu contraseña y revisar tus solicitudes de citas inmobiliarias.
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full bg-gradient-to-r from-[#C5A880] via-[#B3966D] to-[#9E7D4E] hover:opacity-95 text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    INICIAR SESIÓN
                  </button>
                  <button 
                    onClick={() => setIsRegisterOpen(true)}
                    className="w-full bg-white hover:bg-gray-50 border border-[#E5E1D8] text-[#111111] text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl transition-all cursor-pointer"
                  >
                    CREAR CUENTA
                  </button>
                </div>
              </div>
            ) : (
              /* Panel de Usuario Autenticado */
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {/* Header Superior del Perfil */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E1D8] shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-[#C5A880] to-[#9E7D4E] flex items-center justify-center text-white shadow-md shrink-0">
                      <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                        <span className="text-2xl font-bold font-serif-luxury text-[#9E7D4E]">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-serif-luxury font-bold text-[#111111]">
                          {user.name}
                        </h1>
                        <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                          Cliente Registrado
                        </span>
                      </div>
                      <p className="text-xs text-[#555555] mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5 text-[#9E7D4E]" />
                          <span>{user.email}</span>
                        </span>
                        {user.phone && (
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3.5 h-3.5 text-[#9E7D4E]" />
                            <span>{user.phone}</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => { setCurrentView('properties'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="inline-flex items-center space-x-1.5 bg-[#FDFBF7] hover:bg-[#F5F1EB] text-[#111111] border border-[#E5E1D8] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <Home className="w-3.5 h-3.5 text-[#9E7D4E]" />
                      <span>Ver Inmuebles</span>
                    </button>
                    <button 
                      onClick={() => { setUser(null); setCurrentView('home'); }}
                      className="inline-flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>

                {/* Notificación Toast del Perfil */}
                {userProfileToast && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{userProfileToast}</span>
                  </div>
                )}

                {/* Formularios en Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Tarjeta 1: Actualizar Datos Personales */}
                  <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-[#E5E1D8]">
                      <div className="w-10 h-10 rounded-xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E]">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-serif-luxury font-bold text-[#111111]">
                          Información Personal
                        </h2>
                        <p className="text-xs text-[#555555]">
                          Actualiza tu nombre, correo y teléfono de contacto
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateUserProfile} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                          Nombre Completo
                        </label>
                        <input 
                          type="text"
                          required
                          value={userProfileName}
                          onChange={(e) => setUserProfileName(e.target.value)}
                          placeholder="Tu nombre completo"
                          className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                          Correo Electrónico
                        </label>
                        <input 
                          type="email"
                          required
                          value={userProfileEmail}
                          onChange={(e) => setUserProfileEmail(e.target.value)}
                          placeholder="correo@ejemplo.com"
                          className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                          Teléfono / WhatsApp
                        </label>
                        <input 
                          type="tel"
                          value={userProfilePhone}
                          onChange={(e) => setUserProfilePhone(e.target.value)}
                          placeholder="+58 412 0000000"
                          className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#C5A880] via-[#B3966D] to-[#9E7D4E] hover:opacity-95 text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>GUARDAR DATOS PERSONALES</span>
                      </button>
                    </form>
                  </div>

                  {/* Tarjeta 2: Cambio de Contraseña */}
                  <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-[#E5E1D8]">
                      <div className="w-10 h-10 rounded-xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E]">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-serif-luxury font-bold text-[#111111]">
                          Seguridad y Contraseña
                        </h2>
                        <p className="text-xs text-[#555555]">
                          Cambia tu clave de acceso directo sin confirmación por correo
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateUserProfile} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                          Nueva Contraseña
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E7D4E]" />
                          <input 
                            type="password"
                            value={userProfileNewPassword}
                            onChange={(e) => setUserProfileNewPassword(e.target.value)}
                            placeholder="Introduce tu nueva contraseña"
                            className="w-full bg-[#FDFBF7] border border-[#E5E1D8] pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                          />
                        </div>
                        <p className="text-[10px] text-[#7A7570] mt-1.5">
                          El cambio de clave se sincroniza inmediatamente con tu cuenta.
                        </p>
                      </div>

                      <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#E5E1D8]/80 text-xs text-[#555555] space-y-2">
                        <div className="flex items-center space-x-2 text-[#111111] font-semibold">
                          <ShieldCheck className="w-4 h-4 text-[#9E7D4E]" />
                          <span>Seguridad Garantizada</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          Tus credenciales están protegidas. Puedes modificar tu acceso cuantas veces desees.
                        </p>
                      </div>

                      <button 
                        type="submit"
                        disabled={!userProfileNewPassword.trim()}
                        className={`w-full text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 ${
                          userProfileNewPassword.trim()
                            ? 'bg-[#111111] hover:bg-[#222222] text-white cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                        <span>ACTUALIZAR CONTRASEÑA</span>
                      </button>
                    </form>
                  </div>

                </div>

                {/* Tarjeta 3: Mis Citas y Solicitudes */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E1D8]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E]">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-serif-luxury font-bold text-[#111111]">
                          Mis Solicitudes de Citas Inmobiliarias
                        </h2>
                        <p className="text-xs text-[#555555]">
                          Historial de requerimientos y visitas solicitadas
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsAppointmentOpen(true)}
                      className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-[#C5A880] to-[#9E7D4E] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Agendar Nueva Cita</span>
                    </button>
                  </div>

                  {appointmentsList.filter(a => 
                    (user.email && a.email && a.email.toLowerCase() === user.email.toLowerCase()) || 
                    (user.phone && a.phone && a.phone.includes(user.phone))
                  ).length === 0 ? (
                    <div className="text-center py-10 bg-[#FDFBF7] rounded-2xl border border-dashed border-[#E5E1D8] space-y-3">
                      <Calendar className="w-10 h-10 mx-auto text-[#C5A880]" />
                      <p className="text-xs text-[#7A7570]">
                        No tienes solicitudes de cita registradas con tu correo actual.
                      </p>
                      <button 
                        onClick={() => setIsAppointmentOpen(true)}
                        className="text-xs font-bold text-[#9E7D4E] hover:underline cursor-pointer uppercase tracking-wider"
                      >
                        Solicitar mi primera asesoría personalizada
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointmentsList
                        .filter(a => 
                          (user.email && a.email && a.email.toLowerCase() === user.email.toLowerCase()) || 
                          (user.phone && a.phone && a.phone.includes(user.phone))
                        )
                        .map((item) => (
                          <div 
                            key={item.id}
                            className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#E5E1D8] flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-[#111111]">{item.service}</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                                  En Proceso
                                </span>
                                <span className="text-[10px] text-[#7A7570]">Fecha elegida: {item.date}</span>
                              </div>
                              <p className="text-xs text-[#333333] italic bg-white p-3 rounded-xl border border-[#E5E1D8]/60">
                                "{item.message}"
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                              <a 
                                href="https://wa.me/584128850028"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Consultar Estado</span>
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      )}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E5E1D8] my-8 p-6 sm:p-8 relative animate-in fade-in zoom-95 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setIsPropertyModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E5E1D8]">
              <div className="w-10 h-10 rounded-xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif-luxury font-bold text-[#111111]">
                  {editingPropertyId ? 'Editar Inmueble' : 'Añadir Nuevo Inmueble al Catálogo'}
                </h2>
                <p className="text-xs text-[#555555]">
                  Complete la información para publicar la propiedad en el catálogo general.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-5">
              
              {/* Título y Tipo */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Título de la Propiedad *
                  </label>
                  <input 
                    type="text"
                    required
                    value={propertyForm.title}
                    onChange={(e) => setPropertyForm({...propertyForm, title: e.target.value})}
                    placeholder="Ej: Casa de Lujo en Las Mercedes"
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Tipo de Operación *
                  </label>
                  <select 
                    value={propertyForm.type}
                    onChange={(e) => setPropertyForm({...propertyForm, type: e.target.value})}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs font-semibold uppercase text-[#111111] focus:outline-none focus:border-[#9E7D4E]"
                  >
                    {propertyTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Precios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Precio Formateado (Texto a Mostrar) *
                  </label>
                  <input 
                    type="text"
                    required
                    value={propertyForm.price}
                    onChange={(e) => setPropertyForm({...propertyForm, price: e.target.value})}
                    placeholder="Ej: $ 850.000 o $ 2.500 / mes"
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Valor Numérico (Para Filtro de Precio)
                  </label>
                  <input 
                    type="number"
                    value={propertyForm.rawPrice || ''}
                    onChange={(e) => setPropertyForm({...propertyForm, rawPrice: Number(e.target.value)})}
                    placeholder="Ej: 850000"
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                  />
                </div>
              </div>

              {/* Ubicación y Ciudad/Zona */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Ubicación Completa *
                  </label>
                  <input 
                    type="text"
                    required
                    value={propertyForm.location}
                    onChange={(e) => setPropertyForm({...propertyForm, location: e.target.value})}
                    placeholder="Ej: Las Mercedes, Caracas"
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Zona / Ciudad (Filtro) *
                  </label>
                  <select 
                    value={propertyForm.city}
                    onChange={(e) => setPropertyForm({...propertyForm, city: e.target.value})}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs font-semibold text-[#111111] focus:outline-none focus:border-[#9E7D4E]"
                  >
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Habitaciones, Baños, Metros */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Habitaciones
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={propertyForm.beds}
                    onChange={(e) => setPropertyForm({...propertyForm, beds: Number(e.target.value)})}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Baños
                  </label>
                  <input 
                    type="number"
                    step="0.5"
                    min="0"
                    value={propertyForm.baths}
                    onChange={(e) => setPropertyForm({...propertyForm, baths: Number(e.target.value)})}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Metros (m²)
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={propertyForm.sqm}
                    onChange={(e) => setPropertyForm({...propertyForm, sqm: Number(e.target.value)})}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                  />
                </div>
              </div>

              {/* Imagen Principal */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Enlace de Imagen Principal (URL)
                </label>
                <input 
                  type="url"
                  value={propertyForm.image}
                  onChange={(e) => setPropertyForm({...propertyForm, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                />
              </div>

              {/* Galería de Imágenes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Galería de Fotos (Una URL por cada línea)
                </label>
                <textarea 
                  rows={3}
                  value={propertyForm.imagesInput}
                  onChange={(e) => setPropertyForm({...propertyForm, imagesInput: e.target.value})}
                  placeholder="https://imagen1.jpg&#10;https://imagen2.jpg"
                  className="w-full bg-[#FDFBF7] border border-[#E5E1D8] p-3 rounded-xl text-xs font-mono focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                ></textarea>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Enlace de Video Recorrido (YouTube Embed o Enlace)
                </label>
                <input 
                  type="text"
                  value={propertyForm.videoUrl}
                  onChange={(e) => setPropertyForm({...propertyForm, videoUrl: e.target.value})}
                  placeholder="https://www.youtube.com/embed/ScMzIvxBSi4"
                  className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Descripción Detallada
                </label>
                <textarea 
                  rows={3}
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                  placeholder="Detalles sobre espacios, vistas, acabados, comodidades..."
                  className="w-full bg-[#FDFBF7] border border-[#E5E1D8] p-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                ></textarea>
              </div>

              {/* Características / Amenidades */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Características y Amenidades (Separadas por comas)
                </label>
                <input 
                  type="text"
                  value={propertyForm.featuresInput}
                  onChange={(e) => setPropertyForm({...propertyForm, featuresInput: e.target.value})}
                  placeholder="Seguridad 24/7, Tanque de agua, Vista al Ávila, Pisos de mármol"
                  className="w-full bg-[#FDFBF7] border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#9E7D4E] text-[#111111]"
                />
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-[#E5E1D8] flex items-center justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-6 py-3 rounded-xl text-xs font-bold uppercase text-[#555555] bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#C5A880] via-[#B3966D] to-[#9E7D4E] hover:opacity-95 shadow-lg transition-all cursor-pointer flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>GUARDAR INMUEBLE</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-[#1A1816] text-[#E5E1D8] py-16 border-t border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-[#333]">
            
            <div className="space-y-4 md:col-span-1">
              <img 
                src="https://i.postimg.cc/3R3wvxwt/logoweb2.png" 
                alt="Distinción Inmobiliaria Tavares" 
                className="h-16 w-auto object-contain drop-shadow-md"
              />
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Tu confianza, nuestro mayor logro. Excelencia inmobiliaria y seguridad jurídica.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C5A880] mb-4">Navegación</h4>
              <ul className="space-y-2 text-xs font-light text-gray-300">
                <li><button onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Inicio</button></li>
                <li><button onClick={() => { setCurrentView('properties'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Catálogo Propiedades</button></li>
                <li><button onClick={() => { setCurrentView('team'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Nuestro Equipo</button></li>
                <li><button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors cursor-pointer">Servicios</button></li>
                <li><button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors cursor-pointer">Contacto</button></li>
                <li><button onClick={() => { setCurrentView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1 text-[#C5A880]"><span>Panel de Control</span></button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C5A880] mb-4">Servicios</h4>
              <ul className="space-y-2 text-xs font-light text-gray-300">
                <li><button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors cursor-pointer">Captación y Comercialización</button></li>
                <li><button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors cursor-pointer">Alquileres y Administración</button></li>
                <li><button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors cursor-pointer">Auditoría Documental</button></li>
                <li><button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors cursor-pointer">Trámites Legales</button></li>
                <li><button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors cursor-pointer">Cierre de Operaciones</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C5A880] mb-4">Síguenos</h4>
              <div className="flex space-x-3 mb-6">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#C5A880] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#C5A880] transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#C5A880] transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[11px] text-gray-400 font-light">
                Tu confianza, nuestro mayor logro.
              </p>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-light">
            <p>© 2025 Distinción Inmobiliaria Tavares. Todos los derechos reservados.</p>
            <p className="mt-4 sm:mt-0">Diseñado con excelencia y respaldo legal.</p>
          </div>
        </div>
      </footer>

      {/* ----------------- MODALS ----------------- */}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-white/60 w-full max-w-md rounded-3xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100/80 p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <img 
                src="https://i.postimg.cc/3R3wvxwt/logoweb2.png" 
                alt="Logo" 
                className="h-12 w-auto mx-auto mb-3 object-contain"
              />
              <h3 className="text-2xl font-serif-luxury font-bold text-[#2C2A29]">Iniciar Sesión</h3>
              <p className="text-xs text-gray-500 mt-1">Acceda a su cuenta para gestionar sus propiedades y citas.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Correo electrónico</label>
                <input 
                  type="email" 
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-white/80 border border-[#E5E1D8] px-4 py-3.5 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  placeholder="su.correo@ejemplo.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium uppercase text-[#5A5550]">Contraseña</label>
                  <button 
                    type="button"
                    onClick={() => { setIsLoginOpen(false); setIsForgotPasswordOpen(true); setForgotEmail(authEmail); }}
                    className="text-[11px] text-[#9E7D4E] hover:underline cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input 
                  type="password" 
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-white/80 border border-[#E5E1D8] px-4 py-3.5 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#C5A880] hover:bg-[#B3966D] text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                ENTRAR A MI CUENTA
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-[#E5E1D8] text-xs text-gray-500">
              ¿No tienes una cuenta?{' '}
              <button 
                onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}
                className="text-[#C5A880] font-semibold hover:underline ml-1 cursor-pointer"
              >
                Regístrate aquí
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal (Sin confirmación de email) */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-white/60 w-full max-w-md rounded-3xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setIsForgotPasswordOpen(false); setForgotError(''); setForgotSuccess(''); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100/80 p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#9E7D4E]/10 flex items-center justify-center text-[#9E7D4E]">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif-luxury font-bold text-[#2C2A29]">Restablecer Clave</h3>
              <p className="text-xs text-gray-500 mt-1">
                Ingresa tu correo y define tu nueva contraseña directamente.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {forgotError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">
                    Correo Electrónico Registrado
                  </label>
                  <input 
                    type="email" 
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-white/80 border border-[#E5E1D8] px-4 py-3.5 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    placeholder="su.correo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">
                    Nueva Contraseña
                  </label>
                  <input 
                    type="password" 
                    required
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full bg-white/80 border border-[#E5E1D8] px-4 py-3.5 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>ACTUALIZAR Y ENTRAR</span>
                </button>
              </form>
            )}

            <div className="text-center mt-6 pt-4 border-t border-[#E5E1D8] text-xs text-gray-500">
              <button 
                onClick={() => { setIsForgotPasswordOpen(false); setIsLoginOpen(true); }}
                className="text-[#C5A880] font-semibold hover:underline cursor-pointer"
              >
                ← Volver a Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-white/60 w-full max-w-md rounded-3xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100/80 p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <img 
                src="https://i.postimg.cc/3R3wvxwt/logoweb2.png" 
                alt="Logo" 
                className="h-12 w-auto mx-auto mb-3 object-contain"
              />
              <h3 className="text-2xl font-serif-luxury font-bold text-[#2C2A29]">Crear Nueva Cuenta</h3>
              <p className="text-xs text-gray-500 mt-1">Únete a nuestra plataforma exclusiva inmobiliaria.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Nombre completo</label>
                <input 
                  type="text" 
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-white/80 border border-[#E5E1D8] px-4 py-3.5 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  placeholder="Ej. Carlos Mendoza"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Correo electrónico</label>
                <input 
                  type="email" 
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-white/80 border border-[#E5E1D8] px-4 py-3.5 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  placeholder="su.correo@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Contraseña</label>
                <input 
                  type="password" 
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-white/80 border border-[#E5E1D8] px-4 py-3.5 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#C5A880] hover:bg-[#B3966D] text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                REGISTRARSE
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-[#E5E1D8] text-xs text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <button 
                onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
                className="text-[#C5A880] font-semibold hover:underline ml-1 cursor-pointer"
              >
                Ingresa aquí
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment / Agenda Modal */}
      {isAppointmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-white/60 w-full max-w-lg rounded-3xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAppointmentOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100/80 p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <span className="text-[#C5A880] text-xs font-semibold tracking-widest uppercase block mb-1">ATENCIÓN EXCLUSIVA</span>
              <h3 className="text-2xl font-serif-luxury font-bold text-[#2C2A29]">Agenda una Cita</h3>
              <p className="text-xs text-gray-500 mt-1">Converse con uno de nuestros asesores expertos.</p>
            </div>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl flex items-center space-x-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">¡Cita Solicitada con Éxito!</h4>
                  <p className="text-xs text-emerald-700 mt-1">Le contactaremos en breve para confirmar el horario.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Nombre y Apellido</label>
                    <input 
                      type="text" 
                      required
                      value={appointmentForm.name}
                      onChange={(e) => setAppointmentForm({...appointmentForm, name: e.target.value})}
                      className="w-full bg-white border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                      placeholder="Su nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      required
                      value={appointmentForm.phone}
                      onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value})}
                      className="w-full bg-white border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                      placeholder="+58 412 0000000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      required
                      value={appointmentForm.email}
                      onChange={(e) => setAppointmentForm({...appointmentForm, email: e.target.value})}
                      className="w-full bg-white border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Fecha Preferida</label>
                    <input 
                      type="date" 
                      required
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                      className="w-full bg-white border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase text-[#5A5550] mb-1">Servicio o Motivo</label>
                  <select 
                    value={appointmentForm.service}
                    onChange={(e) => setAppointmentForm({...appointmentForm, service: e.target.value})}
                    className="w-full bg-white border border-[#E5E1D8] px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  >
                    <option>Captación y Comercialización</option>
                    <option>Alquileres y Administración</option>
                    <option>Auditoría Documental</option>
                    <option>Trámites Registrales y Legales</option>
                    <option>Acompañamiento y Cierre</option>
                    <option>Compra de Propiedad</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#C5A880] hover:bg-[#B3966D] text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>CONFIRMAR CITA</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ----------------- BOTÓN FLOTANTE: AGENDA TU CITA (Resplandeciente) ----------------- */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center justify-center group">
        {/* Anillo de resplandor expansivo */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37] via-[#C5A880] to-[#B3966D] rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-ring pointer-events-none"></div>
        <div className="absolute -inset-1 bg-[#C5A880] rounded-full blur-md opacity-60 animate-pulse pointer-events-none"></div>
        
        <button
          onClick={() => setIsAppointmentOpen(true)}
          className="relative bg-gradient-to-r from-[#C5A880] via-[#B3966D] to-[#9E7D4E] hover:from-[#d2b68e] hover:to-[#a98555] text-white text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase px-5 sm:px-7 py-3.5 sm:py-4 rounded-full shadow-[0_0_25px_rgba(197,168,128,0.85)] hover:shadow-[0_0_35px_rgba(212,175,55,1)] flex items-center space-x-2.5 sm:space-x-3 transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95 cursor-pointer border border-white/40 animate-radiant-glow"
          aria-label="Agenda tu cita"
        >
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <span className="font-bold whitespace-nowrap">AGENDA TU CITA</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
