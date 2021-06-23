/*
 * @flow
 */
/* eslint-disable import/prefer-default-export */
import { en, es } from './Languages';

export const REGIONAL_OFFICE_CONTACTS_URL = 'https://www.cdss.ca.gov/Portals/9/CCLD/CCP%20Documents/CCLD_CCL_RO_Contacts.pdf';

export const FAQS :Object = {
  FAQS_TITLE: {
    [en]: 'FAQs for Mychildcare.ca.gov',
    [es]: 'Preguntas frecuentes sobre Mychildcare.ca.gov'
  },
  FAQS_SUBTITLE: {
    [en]: 'Users will need to use Google Chrome web browser to access the link https://mychildcare.ca.gov/.',
    [es]: 'Habrá que usar el navegador Google Chrome para acceder al enlace https://mychildcare.ca.gov/.'
  },
  FREQUENTLY_ASKED_QUESTIONS: {
    [en]: 'Frequently Asked Questions (FAQ)',
    [es]: 'Preguntas frecuentes (FAQ)'
  },
  PARENTS: {
    [en]: 'Parents',
    [es]: 'Padres'
  },
  PROVIDERS: {
    [en]: 'Providers',
    [es]: 'Proveedores'
  },
  COMPLAINT_HOTLINE_TITLE: {
    [en]: 'CCLD Complaint Hotline',
    [es]: 'Línea directa de quejas de la CCLD'
  },
  COMPLAINT_HOTLINE_SUBTITLE: {
    [en]: 'IF YOU SEE SOMETHING, LET US NO!\nTo file a complaint regarding a state '
    + 'licensed community care facility or child care facility, Contact Us:',
    [es]: '¡SI VE ALGO, HÁGANOS SABER!\nPara presentar una queja sobre un establecimiento '
    + 'para el cuidado en la comunidad (community care facility) o establecimiento de '
    + 'cuidado infantil con licencia del Estado , comuníquese con nosotros:'
  },
  COMPLAINT_HOTLINE_CONTACT: {
    [en]: 'Community Care Licensing Division Complaint Hotline\nPhone: 1-844-LET-US-NO '
    + '(1-844-538-8766)\nEmail: letusno@dss.ca.gov',
    [es]: 'Línea directa de la División de Licenciamiento para Ofrecer Cuidado en la '
    + '(Comunidad (Community Care Licensing Division Complaint Hotline)\nTeléfono: '
    + '1-844-LET-US-NO (1-844-538-8766)\nCorreo electrónico: letusno@dss.ca.gov'
  },
  COMPLAINT_HOTLINE_BLOCK_1: {
    [en]: 'Remember, when you report suspected violations, you not only protect individuals in care '
    + 'facilities, but also perform a service to your community. ',
    [es]: 'Recordatorio: cuando usted reporta sospechas de infracciones, no solamente protege a las '
    + 'personas en los establecimientos de cuidado, sino que también brinda un servicio a su comunidad.'
  },
  COMPLAINT_HOTLINE_BLOCK_2: {
    [en]: 'You may also call or write the appropriate regional office and explain your complaint. '
    + 'Your name will remain anonymous unless you give us permission to use it.',
    [es]: 'También puede llamar o escribir a la oficina regional pertinente y explicarle su queja. '
    + 'Su nombre permanecerá anónimo a menos que nos dé permiso para usarlo.'
  },
  COMPLAINT_HOTLINE_QUESTION_1: {
    [en]: 'Who do I contact for complaints against Community Care Facilities?',
    [es]: '¿Con quién me comunico para reportar quejas sobre los centros para el cuidado en la comunidad?'
  },
  COMPLAINT_HOTLINE_QUESTION_2: {
    [en]: 'How will my complaint be handled?',
    [es]: '¿Cómo se manejará mi queja? '
  },
  COMPLAINT_HOTLINE_ANSWER_1: {
    [en]: [
      'First, try to resolve minor concerns or differences with the provider.',
      'If your concerns are still not addressed and you believe that the provider is breaking licensing laws, '
      + 'a complaint should be filed through any of the above contacts. Your name will remain anonymous '
      + 'unless you give us permission to use it.',
      'If you believe there is physical or sexual abuse involved, you should also report it to local law enforcement.'
    ],
    [es]: [
      'Primero, intente resolver las pequeñas inquietudes o diferencias con el proveedor',
      'Si aún no se resuelven sus inquietudes y cree que el proveedor está infringiendo las leyes de '
      + 'licenciamiento, debería presentar una queja a través de cualquiera de los métodos de contacto '
      + 'mencionados anteriormente. Su nombre permanecerá anónimo a menos que nos dé permiso para usarlo.',
      'Si su sospecha se trata del abuso físico o sexual, también debería reportarlo a la policía local.'
    ]
  },
  COMPLAINT_HOTLINE_ANSWER_2: {
    [en]: [
      'It is the responsibility of the licensing agency, the parents or other responsible party, '
      + 'and the provider to ensure that licensed Community Care Facilities are providing safe care. '
      + 'Community Care Facilities are required by state law and regulation to follow basic '
      + 'health and safety practices.',
      'The licensing agency will make an unannounced visit to the facility to investigate the '
      + 'complaint within 10 days of receipt of the complaint.',
      'You will be informed of the results of the investigation.',
      'In the interim, should you have any questions or concerns, you may contact the local regional office.'
    ],
    [es]: [
      'Es la responsabilidad de la agencia de licenciamiento, los padres u otra parte '
      + 'responsable y el proveedor asegurarse de que los establecimientos para el cuidado '
      + 'en la comunidad con licencia proporcionen cuidado seguro. La ley y los reglamentos '
      + 'estatales exigen que los establecimientos para el cuidado en la comunidad sigan '
      + 'las prácticas básicas de salud y seguridad.',
      'La agencia de licenciamiento realizará una visita al establecimiento sin previo '
      + 'aviso para investigar la queja dentro de 10 días de recibir la queja.',
      'Se le informará sobre los resultados de la investigación.',
      'Mientras tanto, si tiene alguna pregunta o inquietud, puede comunicarse con la oficina regional local.'
    ]
  },
  REGIONAL_OFFICE_CONTACTS: {
    [en]: 'Regional Office Contacts: Child Care Regional Offices',
    [es]: 'Información de contacto para oficinas regionales: Oficinas regionales de cuidado infantil '
    + '(PDF solo disponible en inglés)'
  },
};

export const Q_AND_A = {
  PARENTS: [
    {
      Q: {
        [en]: 'As a parent looking for care, how can I search by a specific type of care '
        + '(i.e. home-based care or child care center)?',
        [es]: 'Busco cuidado infantil para mi hijo. ¿Cómo busco un tipo de cuidado específico '
        + '(i.e., un centro de cuidado infantil o un hogar familiar)?'
      },
      A: {
        [en]: 'At the home screen, click on refine search located just below the map on the '
        + 'right-side of the page, then click on type of care and it will give you the option '
        + 'to select between the two child care types.',
        [es]: 'En la página principal, seleccione <i>Refinar la búsqueda</i>, que está debajo del mapa, a la derecha. '
        + 'Luego, elija <i>Tipo de cuidado</i>; esto le permitirá escoger entre dos tipos de cuidado infantil.'
      }
    },
    {
      Q: {
        [en]: 'As a parent looking for care, how can I look for additional information for small family homes?',
        [es]: 'Busco cuidado infantil para mi hijo. ¿Cómo obtengo más información sobre las casas familiares pequeñas?'
      },
      A: {
        [en]: 'Once you find the small family child care home that you are interested in, click on the home. '
        + 'It will take you to a screen with several options: availability, capacity, health & safety, and referral. '
        + 'Click on referral. There it should list the agency that has all the information on the child care home '
        + 'that you may need.',
        [es]: 'Una vez que encuentre una casa familiar pequeña que le interesa, selecciónela. '
        + 'Esto le llevará a una pantalla con varias opciones: <i>Disponibilidad</i>, <i>Capacidad</i>, <i>Salud '
        + 'y seguridad</i> y <i>Remisión</i>. Elegir <i>Remisión</i> le enseñará el nombre de la oficina que tiene '
        + 'más información sobre esa casa familiar.'
      }
    },
    {
      Q: {
        [en]: 'As a parent looking for care, how can I review a Child Care Program’s detailed '
        + 'records and verify health and Safety compliance?',
        [es]: 'Busco cuidado infantil para mi hijo. ¿Cómo reviso los registros sobre un programa '
        + 'de cuidado infantil para determinar si está cumpliendo con todos los requisitos de salud '
        + 'y seguridad?'
      },
      A: {
        [en]: 'Once you find the facility that you are interested in, click on the listing. It will take '
        + 'you to a screen with several options: availability, capacity, contact (on some facilities that '
        + 'can list their information), health & safety, and referral. Click on health & safety. In this section '
        + 'you will find a facility number that is underlined. Clicking the facility number will take you to the '
        + 'Department’s Child Care Transparency Website. Here you can explore the facility’s history and '
        + 'associated reports.',
        [es]: 'Una vez que encuentre un establecimiento que le interesa, selecciónelo. Esto le llevará '
        + 'a una pantalla con varias opciones: <i>Disponibilidad</i>, <i>Capacidad</i>, <i>Contacto</i> '
        + '(en algunos casos), <i>Salud y seguridad</i> y <i>Remisión</i>. Elegir <i>Salud y seguridad</i> '
        + 'le enseñará el número del establecimiento en letra subrayada. Si selecciona ese número, '
        + 'el navegador le llevará al sitio web de transparencia del CDSS, donde podrá revisar el historial '
        + 'del establecimiento y todos los informes pertinentes.'
      }
    },
    {
      Q: {
        [en]: 'As a parent looking for care, I am interested in a child care program that is '
        + 'currently booked. Is there a waiting list?',
        [es]: 'Busco cuidado infantil para mi hijo. Me interesa un programa de cuidado infantil, '
        + 'pero actualmente está lleno. ¿Hay una lista de espera?'
      },
      A: {
        [en]: 'Once you find the facility that you are interested in, click on the listing. It will '
        + 'take you to a screen with several options: availability, capacity, contact (on some facilities '
        + 'that can list their information), health & safety, and referral. Click on contact. If the '
        + 'contact information is present, you can reach out to the provider directly. If this option is '
        + 'not available, click on the referral tab. These agencies have all the contact information available '
        + 'and will be able to assist you with your waitlist questions.',
        [es]: 'Una vez que encuentre un establecimiento que le interesa, selecciónelo. Esto '
        + 'le llevará a una pantalla con varias opciones: <i>Disponibilidad</i>, <i>Capacidad</i>, <i>Contacto</i> '
        + '(en algunos casos), <i>Salud y seguridad</i> y <i>Remisión</i>. Elija <i>Contacto</i>. Si la información '
        + 'de contacto está disponible, podrá comunicarse directamente con el proveedor. Si esa '
        + 'información no está disponible, seleccione <i>Remisión</i>. Las oficinas que figuran en esa '
        + 'sección tendrán la información de contacto pertinente y podrán contestar sus preguntas '
        + 'sobre la lista de espera.'
      }
    },
    {
      Q: {
        [en]: 'As a parent looking for care, do any of the Child Care Programs on this site '
        + 'have educational support such as tutoring and help with homework?',
        [es]: 'Busco cuidado infantil para mi hijo. ¿Cómo determino si un programa de cuidado '
        + 'infantil ofrece apoyo educativo, como ayuda con la tarea o clases particulares?'
      },
      A: {
        [en]: 'Once you have selected the facility or home that you are interested in, you will have to '
        + 'contact the provider to discuss what services they provide.',
        [es]: 'Una vez que encuentre un centro o una casa que le interesa, tendrá que contactar '
        + 'con el proveedor para saber qué servicios ofrece.'
      }
    },
    {
      Q: {
        [en]: 'As a parent looking for care, I qualify for Child Action Subsidized Child Care. '
        + 'Are there any services that help with child care transportation?',
        [es]: 'Busco cuidado infantil para mi hijo y califico para cuidado infantil subvencionado '
        + 'mediante la organización Child Action. ¿Hay servicios que me puedan ayudar con el transporte '
        + 'de/al cuidado infantil?'
      },
      A: {
        [en]: 'Once you have selected the facility or home that you are interested in, you will have '
        + 'to contact the provider to discuss what services they provide.',
        [es]: 'Una vez que encuentre un centro o una casa que le interesa, tendrá que contactar con '
        + 'el proveedor para saber qué servicios ofrece.'
      }
    },
    {
      Q: {
        [en]: 'As a parent looking for care, what can I expect if I choose to enroll my child in a '
        + 'licensed child care facility?',
        [es]: 'Busco cuidado infantil para mi hijo. Si elijo inscribirlo en un establecimiento de '
        + 'cuidado infantil con licencia, ¿qué puedo esperar?'
      },
      A: {
        [en]: 'Community Care Licensing offers free online videos that provide information on licensed '
        + 'child care and what to look for when choosing a licensed child care facility.',
        [es]: 'La <span lang="en">Community Care Licensing Division</span> ha publicado '
        + 'en línea varios videos gratuitos e informativos sobre el cuidado infantil con '
        + 'licencia y lo que usted debería tener en cuenta a la hora de elegir un establecimiento con licencia.'
      }
    },
    {
      Q: {
        [en]: 'As a parent, I have general questions about licensed child care. Also, where may I '
        + 'file a complaint if needed?',
        [es]: 'Soy padre y tengo preguntas generales sobre el cuidado infantil con licencia. También '
        + 'quisiera saber cuál es el proceso para presentar una queja, si es necesario hacerlo.'
      },
      A: {
        [en]: 'Community Care Licensing offers a free video that provides information on how to file '
        + 'a complaint with licensing. You can also call 1-800-Let-Us-No (or 1-844-538-8766) to file a '
        + 'complaint regarding a licensed child care facility or to ask general licensing questions.',
        [es]: 'La <span lang="en">Community Care Licensing Division</span> tiene un video gratuito '
        + 'que proporciona información sobre el proceso de presentar una queja al Child Care Licensing '
        + 'Program. También puede llamarnos al 1-800- Let-Us-No (1-844-538-8766) para hacer una pregunta '
        + 'general o presentar una queja relacionada con un establecimiento de cuidado infantil con licencia.'
      }
    }
  ],
  PROVIDERS: [
    {
      Q: {
        [en]: 'I am a child care provider and I need to know how can I change my telephone number on this website?',
        [es]: 'Soy proveedor de cuidado infantil. ¿Cómo cambio mi número de teléfono en este sitio web?'
      },
      A: {
        [en]: 'As a child care provider, please contact your assigned Licensed Program Analyst (LPA) at your local '
        + 'Regional Office and submit changes.',
        [es]: 'Puede cambiarlo contactando con su analista de licenciamiento (LPA) en su oficina regional local.'
      }
    },
    {
      Q: {
        [en]: 'I am a child care provider and I need to know how can I change my email address on this website?',
        [es]: 'Soy proveedor de cuidado infantil. ¿Cómo cambio mi dirección de correo electrónico en este sitio web?'
      },
      A: {
        [en]: 'As a child care provider, please contact your assigned Licensed Program Analyst (LPA) at '
        + 'your local Regional Office and submit changes.',
        [es]: 'Puede cambiarlo contactando con su analista de licenciamiento (LPA) en su oficina regional local.'
      }
    },
    {
      Q: {
        [en]: 'I am a child care provider and I need to know how I can change my status from Booked to Spots Open '
        + 'or my hours of availability?',
        [es]: 'Soy proveedor de cuidado infantil. ¿Cómo cambio mi disponibilidad de '
        + '<i>Lleno</i> a <i>Plazas disponibles</i>? ¿Cómo cambio mi horario de operaciones?'
      },
      A: {
        [en]: 'As a child care provider, please contact your resource and referral agency for assistance.',
        [es]: 'Puede cambiar estas dos cosas contactando con su oficina de recursos e información '
        + '(<i lang="en">resource and referral agency</i>).'
      }
    },
    {
      Q: {
        [en]: 'I am a child care provider and I need to know how I can change my status from Closed to Open?',
        [es]: 'Soy proveedor de cuidado infantil. ¿Cómo cambio el estado de mi establecimiento de <i>Cerrado</i> a '
        + '<i>Abierto?</i>'
      },
      A: {
        [en]: 'As a child care provider, please contact your assigned Licensed Program Analyst (LPA) at your '
        + 'local Regional Office and submit changes.',
        [es]: 'Puede cambiar estas dos cosas contactando con su analista de licenciamiento (LPA) en su oficina '
        + 'regional local.'
      }
    },
    {
      Q: {
        [en]: 'I am a small family home child care provider and I need to know why my information, such as '
        + 'phone number, address, and location on the map is not showing?',
        [es]: 'Soy proveedor de cuidado infantil en una casa familiar pequeña. ¿Me pueden explicar por qué '
        + 'no aparece mi información (número de teléfono, dirección, ubicación en el mapa, etc.)?'
      },
      A: {
        [en]: 'The phone number and address for small family child care homes are confidential. All other child '
        + 'care types such as large family child care homes will list their phone number.',
        [es]: 'No se divulga la dirección ni el número de teléfono de las casas familiares pequeñas. Los demás '
        + 'tipos de cuidado infantil, como las casas familiares grandes, incluirán su número de teléfono.'
      }
    }
  ]
};
