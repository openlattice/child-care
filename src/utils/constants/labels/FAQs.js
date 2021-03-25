/*
 * @flow
 */
/* eslint-disable import/prefer-default-export */
import { en, es } from './Languages';

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
  }
};

export const Q_AND_A = {
  PARENTS: [
    {
      Q: {
        [en]: 'As a parent looking for care, how can I search by a specific type of care '
        + '(i.e. home-based care or child care center)?',
        [es]: 'Busco cuidado infantil para mi hijo. ¿Cómo busco un tipo de cuidado específico '
        + '(i. e., un centro de cuidado infantil o un hogar familiar)?'
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
        + 'de <i>Contacto</i> está disponible, podrá comunicarse directamente con el proveedor. Si esa '
        + 'información no está disponible, seleccione <i>Remisión</i>. Las oficinas que figuran en esa '
        + 'sección tendrán la información de <i>Contacto</i> pertinente y podrán contestar sus preguntas '
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
        [es]: 'La Community Care Licensing Division ha publicado en línea varios videos gratuitos e '
        + 'informativos sobre el cuidado infantil con licencia y lo que usted debería tener en cuenta '
        + 'a la hora de elegir un establecimiento con licencia.'
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
        [es]: 'La Community Care Licensing Division tiene un video gratuito que proporciona información '
        + 'sobre el proceso de presentar una queja al Child Care Licensing Program. También puede llamarnos '
        + 'al 1-800- Let-Us-No (1-844-538-8766) para hacer una pregunta general o presentar una queja '
        + 'relacionada con un establecimiento de cuidado infantil con licencia.'
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
        [es]: 'Soy proveedor de cuidado infantil. ¿Cómo cambio mi <i>Disponibilidad</i> de '
        + '<i>Lleno</i> a <i>Plazas disponibles</i>? ¿Cómo cambio mi horario de operaciones?'
      },
      A: {
        [en]: 'As a child care provider, please contact your resource and referral agency for assistance.',
        [es]: 'Puede cambiar estas dos cosas contactando con su oficina de recursos e información (resource '
        + 'and referral agency).'
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
