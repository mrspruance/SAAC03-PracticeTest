/**
 * Banco de preguntas SAA-C03
 * Basado en los dominios oficiales del examen y en la documentación de AWS.
 *
 * Estructura de cada pregunta:
 * {
 *   domain: string,             // Dominio del examen
 *   text: string,               // Enunciado
 *   options: [{ text, correct, explanation }],
 *   multiple: boolean,          // true si hay más de una respuesta correcta
 *   doc: string                 // URL a documentación oficial de AWS
 * }
 */
const QUESTIONS = [
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa necesita otorgar a una aplicación que se ejecuta en instancias EC2 acceso a un bucket de S3, sin almacenar credenciales de larga duración en las instancias. ¿Qué solución cumple este requisito de forma más segura?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html",
    options: [
      {
        text: "Adjuntar un rol de IAM a las instancias EC2 mediante un instance profile.",
        correct: true,
        explanation: "Correcto. Un rol de IAM asociado a la instancia entrega credenciales temporales rotadas automáticamente por AWS a través del metadata service, evitando almacenar claves de larga duración."
      },
      {
        text: "Crear un usuario de IAM y guardar sus access keys en un archivo dentro de la instancia.",
        correct: false,
        explanation: "Incorrecto. Guardar access keys de larga duración en la instancia es inseguro: si la instancia se ve comprometida, las claves quedan expuestas y deben rotarse manualmente."
      },
      {
        text: "Codificar las credenciales directamente en el código de la aplicación.",
        correct: false,
        explanation: "Incorrecto. Codificar credenciales (hardcoding) es la práctica más riesgosa: quedan expuestas en el repositorio y son difíciles de rotar."
      },
      {
        text: "Almacenar las claves en las variables de entorno del sistema operativo.",
        correct: false,
        explanation: "Incorrecto. Aunque es mejor que hardcodear, siguen siendo credenciales de larga duración expuestas en la instancia; un rol de IAM es la práctica recomendada."
      }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una aplicación debe cifrar datos en reposo en Amazon S3 y la empresa requiere control total sobre la rotación de las claves y una pista de auditoría de su uso. ¿Qué opción cumple estos requisitos?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html",
    options: [
      {
        text: "SSE-KMS con una clave administrada por el cliente (customer managed key) en AWS KMS.",
        correct: true,
        explanation: "Correcto. Las customer managed keys en KMS permiten definir políticas, habilitar rotación y registrar cada uso mediante AWS CloudTrail, cumpliendo el control y la auditoría requeridos."
      },
      {
        text: "SSE-S3 con claves administradas completamente por Amazon S3.",
        correct: false,
        explanation: "Incorrecto. SSE-S3 cifra los datos pero AWS administra las claves; no ofrece control sobre la rotación ni auditoría detallada del uso de la clave."
      },
      {
        text: "Cifrado del lado del cliente sin usar ningún servicio de AWS.",
        correct: false,
        explanation: "Incorrecto. Es técnicamente posible, pero traslada toda la gestión de claves a la empresa y no aprovecha la auditoría integrada de KMS/CloudTrail que se solicita."
      },
      {
        text: "Habilitar solo el versionado del bucket de S3.",
        correct: false,
        explanation: "Incorrecto. El versionado protege contra sobrescrituras y borrados, pero no cifra los datos ni aporta gestión de claves."
      }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una base de datos Amazon RDS debe seguir disponible aunque falle la zona de disponibilidad primaria, con el menor esfuerzo operativo. ¿Qué configuración se debe usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html",
    options: [
      {
        text: "Habilitar una implementación Multi-AZ, que mantiene una réplica en espera (standby) en otra AZ con failover automático.",
        correct: true,
        explanation: "Correcto. RDS Multi-AZ crea una réplica en espera sincrónica en otra AZ y realiza failover automático ante fallas, sin necesidad de intervención operativa."
      },
      {
        text: "Crear una réplica de lectura (read replica) en la misma AZ.",
        correct: false,
        explanation: "Incorrecto. Las read replicas escalan lecturas y son asíncronas; no proporcionan failover automático y una réplica en la misma AZ no protege ante la falla de esa zona."
      },
      {
        text: "Programar snapshots manuales cada hora y restaurarlos si ocurre una falla.",
        correct: false,
        explanation: "Incorrecto. Restaurar snapshots es un proceso manual y lento, lo que implica alto esfuerzo operativo y mayor tiempo de recuperación."
      },
      {
        text: "Aumentar el tamaño de la instancia (escalado vertical).",
        correct: false,
        explanation: "Incorrecto. Escalar verticalmente mejora el rendimiento, pero no aporta alta disponibilidad frente a la falla de una AZ."
      }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Un sistema desacoplado procesa pedidos. Se requiere que ningún mensaje se pierda si los consumidores fallan y que cada pedido se procese una sola vez, en orden. ¿Qué servicio es el más adecuado?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html",
    options: [
      {
        text: "Amazon SQS FIFO queue.",
        correct: true,
        explanation: "Correcto. Las colas FIFO de SQS garantizan el orden y el procesamiento exactly-once, y retienen los mensajes hasta que un consumidor los procese y elimine."
      },
      {
        text: "Amazon SNS con notificaciones por correo.",
        correct: false,
        explanation: "Incorrecto. SNS es un servicio de pub/sub que entrega mensajes a suscriptores, pero no garantiza el orden ni retiene mensajes para procesamiento posterior por consumidores fallidos."
      },
      {
        text: "Amazon SQS Standard queue.",
        correct: false,
        explanation: "Incorrecto. La cola Standard ofrece alto rendimiento pero solo entrega 'at-least-once' y orden 'best-effort', por lo que puede duplicar o desordenar mensajes."
      },
      {
        text: "Amazon Kinesis Data Firehose.",
        correct: false,
        explanation: "Incorrecto. Firehose entrega streams a destinos como S3 o Redshift; no está diseñado como cola de trabajo con orden y exactly-once para consumidores de pedidos."
      }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Un sitio web estático servido desde S3 tiene usuarios globales y sufre alta latencia en regiones lejanas. ¿Qué servicio reduce la latencia entregando el contenido desde ubicaciones cercanas al usuario?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
    options: [
      {
        text: "Amazon CloudFront como CDN frente al bucket de S3.",
        correct: true,
        explanation: "Correcto. CloudFront almacena en caché el contenido en edge locations globales, reduciendo la latencia al servir desde el punto más cercano al usuario."
      },
      {
        text: "Aumentar la clase de almacenamiento de S3 a S3 Standard-IA.",
        correct: false,
        explanation: "Incorrecto. Las clases de almacenamiento afectan costo y disponibilidad, no la latencia geográfica de entrega."
      },
      {
        text: "Habilitar Transfer Acceleration en S3 para las descargas.",
        correct: false,
        explanation: "Incorrecto. Transfer Acceleration optimiza principalmente la carga (uploads) hacia S3 usando edge locations, no es la solución típica de CDN para servir un sitio estático con caché."
      },
      {
        text: "Replicar el bucket en varias regiones con Cross-Region Replication.",
        correct: false,
        explanation: "Incorrecto. CRR mejora la durabilidad y cercanía a nivel de región, pero requiere lógica de enrutamiento adicional y no cachea en edge locations como una CDN."
      }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación web experimenta lecturas repetidas muy frecuentes sobre una base de datos relacional, causando alta carga. ¿Qué solución mejora el rendimiento de lectura con menor cambio arquitectónico?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/Strategies.html",
    options: [
      {
        text: "Agregar una capa de caché en memoria con Amazon ElastiCache.",
        correct: true,
        explanation: "Correcto. ElastiCache (Redis/Memcached) almacena en memoria los resultados de consultas frecuentes, descargando lecturas de la base de datos y reduciendo la latencia."
      },
      {
        text: "Migrar la base de datos a una instancia más pequeña.",
        correct: false,
        explanation: "Incorrecto. Reducir la instancia empeora el rendimiento bajo carga alta."
      },
      {
        text: "Deshabilitar los índices de la base de datos.",
        correct: false,
        explanation: "Incorrecto. Los índices aceleran las lecturas; deshabilitarlos degradaría el rendimiento."
      },
      {
        text: "Convertir todas las consultas de lectura en escrituras para forzar caché del SO.",
        correct: false,
        explanation: "Incorrecto. No tiene sentido técnico y aumentaría la carga de escritura sobre la base de datos."
      }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una carga de trabajo por lotes es tolerante a interrupciones y puede reiniciarse. Se busca el menor costo de cómputo posible en EC2. ¿Qué opción de compra elegir?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html",
    options: [
      {
        text: "Instancias Spot.",
        correct: true,
        explanation: "Correcto. Las instancias Spot ofrecen hasta ~90% de descuento frente a On-Demand y son ideales para cargas tolerantes a interrupciones que pueden reiniciarse."
      },
      {
        text: "Instancias On-Demand.",
        correct: false,
        explanation: "Incorrecto. On-Demand es flexible pero la opción más cara por hora; no optimiza costo para cargas interrumpibles."
      },
      {
        text: "Instancias reservadas (Reserved Instances) por 3 años.",
        correct: false,
        explanation: "Incorrecto. Las RI reducen costo para cargas estables y continuas con compromiso a largo plazo, no para lotes esporádicos e interrumpibles."
      },
      {
        text: "Hosts dedicados (Dedicated Hosts).",
        correct: false,
        explanation: "Incorrecto. Los Dedicated Hosts son más caros y se usan por requisitos de licenciamiento o cumplimiento, no para minimizar costo en batch."
      }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Se almacenan logs en S3 a los que rara vez se accede tras 30 días, pero deben conservarse 7 años por cumplimiento y recuperarse en horas si se auditan. ¿Qué estrategia optimiza costos?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html",
    options: [
      {
        text: "Una regla de ciclo de vida que transicione los objetos a S3 Glacier Flexible Retrieval tras 30 días.",
        correct: true,
        explanation: "Correcto. Glacier Flexible Retrieval tiene muy bajo costo de almacenamiento y permite recuperaciones en minutos a horas, adecuado para archivos de cumplimiento poco accedidos."
      },
      {
        text: "Mantener todos los logs en S3 Standard indefinidamente.",
        correct: false,
        explanation: "Incorrecto. S3 Standard es el más costoso para datos rara vez accedidos durante 7 años; desperdicia presupuesto."
      },
      {
        text: "Eliminar los logs después de 30 días.",
        correct: false,
        explanation: "Incorrecto. Viola el requisito de retención de 7 años por cumplimiento."
      },
      {
        text: "Transicionar de inmediato a S3 Glacier Deep Archive el día 1.",
        correct: false,
        explanation: "Incorrecto. Deep Archive es más barato pero su recuperación tarda hasta 12 horas y no conviene mover al día 1 si aún puede haber accesos frecuentes en los primeros 30 días."
      }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa quiere permitir tráfico HTTPS entrante a instancias EC2 en una subred privada solo desde un Application Load Balancer en subredes públicas. ¿Cómo se debe configurar la seguridad de red? (Selecciona 2)",
    multiple: true,
    doc: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html",
    options: [
      {
        text: "En el security group de las instancias EC2, permitir el puerto 443 con origen el security group del ALB.",
        correct: true,
        explanation: "Correcto. Referenciar el security group del ALB como origen permite solo el tráfico proveniente del balanceador, sin exponer rangos de IP amplios."
      },
      {
        text: "En el security group del ALB, permitir el puerto 443 (HTTPS) desde Internet.",
        correct: true,
        explanation: "Correcto. El ALB, ubicado en subredes públicas, debe aceptar el tráfico HTTPS de los clientes en el puerto 443."
      },
      {
        text: "Abrir el puerto 443 al 0.0.0.0/0 directamente en las instancias EC2 privadas.",
        correct: false,
        explanation: "Incorrecto. Exponer las instancias privadas a todo Internet elimina el beneficio de tenerlas en una subred privada detrás del ALB."
      },
      {
        text: "Deshabilitar todos los security groups para simplificar la conectividad.",
        correct: false,
        explanation: "Incorrecto. Los security groups son obligatorios y esenciales para el control de acceso; deshabilitarlos no es una opción segura ni válida."
      }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación necesita almacenamiento de archivos compartido que pueda ser montado simultáneamente por múltiples instancias EC2 Linux y que escale automáticamente. ¿Qué servicio se debe usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html",
    options: [
      {
        text: "Amazon EFS (Elastic File System).",
        correct: true,
        explanation: "Correcto. EFS es un sistema de archivos NFS totalmente administrado, montable por múltiples instancias EC2 Linux a la vez y escala automáticamente."
      },
      {
        text: "Amazon EBS con un volumen adjuntado a cada instancia.",
        correct: false,
        explanation: "Incorrecto. Un volumen EBS estándar se adjunta a una sola instancia a la vez (salvo Multi-Attach io1/io2 con limitaciones) y no ofrece un sistema de archivos compartido escalable como EFS."
      },
      {
        text: "Almacenamiento de instancia (instance store).",
        correct: false,
        explanation: "Incorrecto. El instance store es efímero y local a una sola instancia; se pierde al detenerla y no es compartido."
      },
      {
        text: "Amazon S3 montado como sistema de archivos POSIX nativo.",
        correct: false,
        explanation: "Incorrecto. S3 es almacenamiento de objetos; no es un sistema de archivos POSIX nativo y no está pensado para montajes compartidos de baja latencia como EFS."
      }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación necesita una base de datos NoSQL totalmente administrada con latencia de milisegundos de un dígito a cualquier escala y sin administración de servidores. ¿Cuál es la mejor opción?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
    options: [
      {
        text: "Amazon DynamoDB.",
        correct: true,
        explanation: "Correcto. DynamoDB es una base NoSQL serverless que ofrece latencia de milisegundos de un dígito a cualquier escala, sin administrar servidores."
      },
      {
        text: "Amazon RDS for MySQL.",
        correct: false,
        explanation: "Incorrecto. RDS es relacional (SQL) y requiere gestionar instancias; no es NoSQL serverless."
      },
      {
        text: "Amazon Redshift.",
        correct: false,
        explanation: "Incorrecto. Redshift es un data warehouse para analítica OLAP, no una base NoSQL de baja latencia para cargas transaccionales."
      },
      {
        text: "Amazon Aurora Serverless.",
        correct: false,
        explanation: "Incorrecto. Aurora es relacional (compatible con MySQL/PostgreSQL); aunque escala, no es NoSQL como pide el requisito."
      }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una organización con múltiples cuentas de AWS quiere aplicar de forma centralizada políticas que impidan a las cuentas usar regiones no aprobadas. ¿Qué característica lo permite?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
    options: [
      {
        text: "Service Control Policies (SCP) en AWS Organizations.",
        correct: true,
        explanation: "Correcto. Las SCP definen los permisos máximos permitidos para las cuentas de una organización y pueden restringir el uso de regiones a nivel central."
      },
      {
        text: "Políticas de IAM aplicadas usuario por usuario en cada cuenta.",
        correct: false,
        explanation: "Incorrecto. Aplicar políticas de IAM en cada cuenta manualmente no es centralizado ni escalable, y los administradores locales podrían modificarlas."
      },
      {
        text: "Security groups a nivel de VPC.",
        correct: false,
        explanation: "Incorrecto. Los security groups controlan tráfico de red de instancias, no restringen el uso de regiones ni gobiernan cuentas."
      },
      {
        text: "AWS WAF aplicado globalmente.",
        correct: false,
        explanation: "Incorrecto. WAF protege aplicaciones web contra ataques HTTP; no gobierna el uso de regiones entre cuentas."
      }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación de tres capas debe escalar automáticamente su capa web según la demanda y reemplazar instancias no saludables. ¿Qué combinación de servicios cumple esto?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html",
    options: [
      {
        text: "Un Auto Scaling Group con health checks detrás de un Application Load Balancer.",
        correct: true,
        explanation: "Correcto. El Auto Scaling Group ajusta la cantidad de instancias según la demanda y, con health checks, reemplaza instancias no saludables; el ALB distribuye el tráfico."
      },
      {
        text: "Una única instancia EC2 grande sin balanceo.",
        correct: false,
        explanation: "Incorrecto. Una sola instancia no escala automáticamente ni ofrece tolerancia a fallos."
      },
      {
        text: "Snapshots de EBS programados cada 5 minutos.",
        correct: false,
        explanation: "Incorrecto. Los snapshots son para respaldo de datos, no para escalado automático ni reemplazo de instancias."
      },
      {
        text: "Amazon CloudFront delante de una instancia estática.",
        correct: false,
        explanation: "Incorrecto. CloudFront cachea contenido en el edge pero no escala ni reemplaza las instancias de cómputo de la capa web."
      }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa ejecuta cargas de producción estables y predecibles en EC2 durante los próximos 3 años y quiere reducir costos comprometiéndose de forma flexible entre familias de instancias y regiones. ¿Qué opción conviene?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html",
    options: [
      {
        text: "Compute Savings Plans.",
        correct: true,
        explanation: "Correcto. Los Compute Savings Plans ofrecen descuentos importantes a cambio de un compromiso de gasto por 1 o 3 años, con flexibilidad entre familias, tamaños, regiones y servicios como Fargate y Lambda."
      },
      {
        text: "Instancias Spot para toda la producción.",
        correct: false,
        explanation: "Incorrecto. Spot puede interrumpirse en cualquier momento; no es adecuado para producción estable que requiere disponibilidad continua."
      },
      {
        text: "Solo On-Demand sin ningún compromiso.",
        correct: false,
        explanation: "Incorrecto. On-Demand es la opción más cara para cargas estables y predecibles; no aprovecha descuentos por compromiso."
      },
      {
        text: "EC2 Instance Savings Plans limitados a una sola familia y región.",
        correct: false,
        explanation: "Parcialmente válido pero no óptimo. Los EC2 Instance Savings Plans dan mayor descuento pero atan a una familia/región; el requisito pide flexibilidad entre familias y regiones, por lo que Compute Savings Plans encaja mejor."
      }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa necesita procesar imágenes cuando se suben a un bucket de S3, sin administrar servidores y pagando solo por la ejecución. ¿Qué arquitectura es la más adecuada?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html",
    options: [
      {
        text: "Configurar una notificación de evento de S3 que invoque una función AWS Lambda al subir el objeto.",
        correct: true,
        explanation: "Correcto. Las notificaciones de evento de S3 pueden disparar Lambda de forma serverless, procesando cada imagen bajo demanda y pagando solo por la ejecución."
      },
      {
        text: "Ejecutar una instancia EC2 encendida 24/7 que sondee (polling) el bucket cada minuto.",
        correct: false,
        explanation: "Incorrecto. Una instancia encendida siempre genera costo constante y el polling es ineficiente frente a una arquitectura basada en eventos."
      },
      {
        text: "Usar Amazon Redshift para transformar las imágenes.",
        correct: false,
        explanation: "Incorrecto. Redshift es un data warehouse analítico; no procesa imágenes."
      },
      {
        text: "Descargar manualmente las imágenes y procesarlas en un servidor on-premises.",
        correct: false,
        explanation: "Incorrecto. Es un proceso manual, no escalable ni serverless, y añade latencia y esfuerzo operativo."
      }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Se necesita una base de datos relacional con alta disponibilidad, tolerancia a fallos y hasta 15 réplicas de lectura de baja latencia, compatible con MySQL y PostgreSQL. ¿Qué servicio elegir?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html",
    options: [
      {
        text: "Amazon Aurora.",
        correct: true,
        explanation: "Correcto. Aurora es compatible con MySQL y PostgreSQL, ofrece almacenamiento distribuido en múltiples AZ, failover automático y hasta 15 réplicas de lectura de baja latencia."
      },
      {
        text: "Amazon DynamoDB.",
        correct: false,
        explanation: "Incorrecto. DynamoDB es NoSQL; el requisito pide una base relacional compatible con MySQL/PostgreSQL."
      },
      {
        text: "Amazon RDS for SQL Server con una sola AZ.",
        correct: false,
        explanation: "Incorrecto. Una sola AZ no ofrece alta disponibilidad, y el requisito especifica compatibilidad con MySQL/PostgreSQL y muchas réplicas de baja latencia, propio de Aurora."
      },
      {
        text: "Amazon Neptune.",
        correct: false,
        explanation: "Incorrecto. Neptune es una base de datos de grafos, no relacional compatible con MySQL/PostgreSQL."
      }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una aplicación necesita almacenar y rotar automáticamente las credenciales de una base de datos, recuperándolas mediante llamadas a la API en tiempo de ejecución. ¿Qué servicio es el más apropiado?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html",
    options: [
      {
        text: "AWS Secrets Manager.",
        correct: true,
        explanation: "Correcto. Secrets Manager almacena secretos de forma segura, permite rotación automática integrada (por ejemplo con RDS) y su recuperación mediante API."
      },
      {
        text: "Guardar las credenciales en un archivo de texto en S3 sin cifrar.",
        correct: false,
        explanation: "Incorrecto. Almacenar credenciales en texto plano es inseguro y no ofrece rotación automática."
      },
      {
        text: "Definir las credenciales en variables de entorno de Lambda sin cifrar.",
        correct: false,
        explanation: "Incorrecto. Las variables de entorno sin cifrar exponen el secreto y no proveen rotación automática."
      },
      {
        text: "Amazon CloudWatch Logs.",
        correct: false,
        explanation: "Incorrecto. CloudWatch Logs es para registros y monitoreo; almacenar credenciales allí sería una fuga de seguridad."
      }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa migra un data warehouse local para ejecutar consultas analíticas complejas sobre petabytes de datos estructurados. ¿Qué servicio de AWS está optimizado para este caso?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html",
    options: [
      {
        text: "Amazon Redshift.",
        correct: true,
        explanation: "Correcto. Redshift es un data warehouse en columnas y con procesamiento masivamente paralelo (MPP), optimizado para consultas analíticas complejas sobre grandes volúmenes."
      },
      {
        text: "Amazon RDS for MySQL.",
        correct: false,
        explanation: "Incorrecto. RDS está orientado a cargas transaccionales (OLTP), no a analítica a escala de petabytes."
      },
      {
        text: "Amazon DynamoDB.",
        correct: false,
        explanation: "Incorrecto. DynamoDB es NoSQL para acceso por clave con baja latencia, no para consultas analíticas complejas tipo warehouse."
      },
      {
        text: "Amazon ElastiCache.",
        correct: false,
        explanation: "Incorrecto. ElastiCache es una caché en memoria; no es un almacén analítico de petabytes."
      }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa quiere una estrategia de recuperación ante desastres con el menor RTO y RPO posibles para una aplicación crítica, aunque implique mayor costo. ¿Qué estrategia de DR debe elegir?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
    options: [
      {
        text: "Multi-site active/active (hot standby en varias regiones).",
        correct: true,
        explanation: "Correcto. Una arquitectura activa/activa multi-región procesa tráfico en varios sitios simultáneamente, logrando el menor RTO y RPO (cercanos a cero) a mayor costo."
      },
      {
        text: "Backup and restore.",
        correct: false,
        explanation: "Incorrecto. Backup y restore es la opción más económica pero con el mayor RTO/RPO, ya que hay que restaurar desde respaldos."
      },
      {
        text: "Pilot light.",
        correct: false,
        explanation: "Incorrecto. Pilot light mantiene un núcleo mínimo encendido; reduce RTO frente a backup/restore pero no logra el menor posible como active/active."
      },
      {
        text: "Warm standby.",
        correct: false,
        explanation: "Incorrecto. Warm standby mantiene una versión reducida siempre activa; mejora sobre pilot light pero no alcanza el RTO/RPO casi nulo de una arquitectura activa/activa."
      }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Un equipo no sabe con qué frecuencia se accederá a distintos objetos de un bucket de S3 y quiere reducir costos automáticamente sin impacto en el rendimiento ni tarifas de recuperación. ¿Qué clase de almacenamiento conviene?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
    options: [
      {
        text: "S3 Intelligent-Tiering.",
        correct: true,
        explanation: "Correcto. Intelligent-Tiering mueve automáticamente los objetos entre niveles de acceso según su uso, optimizando costos sin tarifas de recuperación ni impacto en el rendimiento, ideal cuando el patrón de acceso es desconocido."
      },
      {
        text: "S3 Standard.",
        correct: false,
        explanation: "Incorrecto. S3 Standard no reduce costos automáticamente para objetos poco accedidos."
      },
      {
        text: "S3 One Zone-IA.",
        correct: false,
        explanation: "Incorrecto. One Zone-IA reduce costo pero almacena en una sola AZ (menor durabilidad) y cobra por recuperación; no ajusta automáticamente según el acceso."
      },
      {
        text: "S3 Glacier Deep Archive.",
        correct: false,
        explanation: "Incorrecto. Deep Archive es para archivado a muy largo plazo con recuperación de horas; no sirve si algunos objetos se acceden con frecuencia."
      }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Instancias EC2 en una subred privada necesitan descargar actualizaciones de software desde Internet sin permitir conexiones entrantes desde Internet. ¿Qué componente se debe usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html",
    options: [
      { text: "Un NAT Gateway en una subred pública.", correct: true, explanation: "Correcto. El NAT Gateway permite tráfico saliente iniciado desde la subred privada hacia Internet, sin admitir conexiones entrantes no solicitadas." },
      { text: "Un Internet Gateway asociado directamente a la subred privada.", correct: false, explanation: "Incorrecto. Asignar un IGW a la subred la convertiría en pública y permitiría tráfico entrante no deseado." },
      { text: "Un VPC peering hacia otra VPC.", correct: false, explanation: "Incorrecto. El peering conecta VPCs entre sí, no da salida a Internet." },
      { text: "Un endpoint de tipo gateway para S3.", correct: false, explanation: "Incorrecto. Un gateway endpoint solo da acceso privado a S3/DynamoDB, no a repositorios de actualizaciones en Internet en general." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una aplicación en EC2 debe acceder a Amazon S3 sin que el tráfico salga a la red pública de Internet. ¿Qué solución cumple este requisito?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html",
    options: [
      { text: "Un VPC Gateway Endpoint para S3.", correct: true, explanation: "Correcto. Un gateway endpoint permite acceso privado a S3 desde la VPC usando la red de AWS, sin pasar por Internet." },
      { text: "Un NAT Gateway.", correct: false, explanation: "Incorrecto. El NAT Gateway enruta el tráfico a través de Internet, lo que no cumple el requisito de tráfico privado." },
      { text: "Un Internet Gateway.", correct: false, explanation: "Incorrecto. El IGW envía el tráfico por la red pública de Internet." },
      { text: "Una VPN Site-to-Site.", correct: false, explanation: "Incorrecto. La VPN conecta redes on-premises con la VPC; no es el mecanismo para acceso privado a S3." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa necesita distribuir contenido web protegido y bloquear ataques comunes como inyección SQL y cross-site scripting a nivel de la capa de aplicación. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html",
    options: [
      { text: "AWS WAF asociado a CloudFront o al ALB.", correct: true, explanation: "Correcto. AWS WAF filtra tráfico HTTP/HTTPS y permite reglas contra SQL injection y XSS a nivel de aplicación (capa 7)." },
      { text: "Security groups en las instancias.", correct: false, explanation: "Incorrecto. Los security groups filtran por IP/puerto (capa 3/4), no inspeccionan el contenido HTTP contra XSS o SQLi." },
      { text: "Network ACLs en la subred.", correct: false, explanation: "Incorrecto. Las NACL operan a nivel de red, no inspeccionan payloads de aplicación." },
      { text: "AWS Shield Standard únicamente.", correct: false, explanation: "Incorrecto. Shield protege contra DDoS, no filtra ataques de capa de aplicación como SQLi/XSS." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa necesita detectar de forma continua actividad maliciosa o comportamiento no autorizado en sus cuentas de AWS analizando logs de CloudTrail, VPC Flow Logs y DNS. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html",
    options: [
      { text: "Amazon GuardDuty.", correct: true, explanation: "Correcto. GuardDuty es un servicio de detección de amenazas que analiza CloudTrail, VPC Flow Logs y logs de DNS para identificar actividad maliciosa." },
      { text: "AWS Config.", correct: false, explanation: "Incorrecto. Config evalúa el cumplimiento de la configuración de recursos, no detecta amenazas en tiempo real." },
      { text: "AWS Trusted Advisor.", correct: false, explanation: "Incorrecto. Trusted Advisor da recomendaciones de buenas prácticas, no detección continua de amenazas." },
      { text: "Amazon Inspector.", correct: false, explanation: "Incorrecto. Inspector evalúa vulnerabilidades de EC2/ECR, no analiza esos logs para detectar comportamiento malicioso." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una organización quiere que todas las llamadas a la API de AWS queden registradas para auditoría y gobernanza en todas las cuentas. ¿Qué servicio provee este registro?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
    options: [
      { text: "AWS CloudTrail.", correct: true, explanation: "Correcto. CloudTrail registra las llamadas a la API de AWS, quién las hizo, cuándo y desde dónde, para auditoría y gobernanza." },
      { text: "Amazon CloudWatch Metrics.", correct: false, explanation: "Incorrecto. CloudWatch Metrics recolecta métricas de rendimiento, no un registro de llamadas a la API." },
      { text: "AWS X-Ray.", correct: false, explanation: "Incorrecto. X-Ray traza solicitudes dentro de aplicaciones distribuidas, no audita llamadas a la API de la cuenta." },
      { text: "VPC Flow Logs.", correct: false, explanation: "Incorrecto. Flow Logs registran tráfico de red IP, no las llamadas a la API de AWS." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una API pública necesita ser gestionada con throttling, autorización y caché sin administrar servidores, integrándose con funciones Lambda. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html",
    options: [
      { text: "Amazon API Gateway.", correct: true, explanation: "Correcto. API Gateway es un servicio administrado para crear y operar APIs con throttling, autorización, caché e integración nativa con Lambda." },
      { text: "Application Load Balancer con instancias EC2.", correct: false, explanation: "Incorrecto. El ALB balancea carga pero no ofrece las capacidades de gestión de API (planes de uso, claves, throttling por consumidor) ni es serverless con EC2." },
      { text: "Amazon Route 53.", correct: false, explanation: "Incorrecto. Route 53 es DNS; no gestiona APIs." },
      { text: "AWS Direct Connect.", correct: false, explanation: "Incorrecto. Direct Connect es conectividad de red dedicada, no gestión de APIs." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación de mensajería en tiempo real ingiere millones de eventos por segundo y necesita procesarlos en streaming con múltiples consumidores. ¿Qué servicio es el más adecuado?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/streams/latest/dev/introduction.html",
    options: [
      { text: "Amazon Kinesis Data Streams.", correct: true, explanation: "Correcto. Kinesis Data Streams ingiere datos en streaming a gran escala y permite que múltiples consumidores procesen el mismo stream en tiempo real." },
      { text: "Amazon SQS Standard.", correct: false, explanation: "Incorrecto. SQS es una cola de trabajo punto a punto; no está diseñada para replay ni múltiples consumidores independientes del mismo mensaje como un stream." },
      { text: "Amazon RDS.", correct: false, explanation: "Incorrecto. RDS es una base de datos relacional, no una plataforma de streaming de alta ingesta." },
      { text: "Amazon Athena.", correct: false, explanation: "Incorrecto. Athena consulta datos en S3 con SQL; no ingiere streams en tiempo real." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Un equipo quiere ejecutar consultas SQL ad-hoc directamente sobre archivos almacenados en S3 sin cargar los datos en una base de datos ni administrar infraestructura. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/athena/latest/ug/what-is.html",
    options: [
      { text: "Amazon Athena.", correct: true, explanation: "Correcto. Athena es un servicio serverless que ejecuta consultas SQL directamente sobre datos en S3, pagando por consulta." },
      { text: "Amazon Redshift con carga previa (COPY).", correct: false, explanation: "Incorrecto. Redshift requiere cargar los datos y administrar el clúster; el requisito pide consultas ad-hoc sobre S3 sin infraestructura." },
      { text: "Amazon RDS.", correct: false, explanation: "Incorrecto. RDS requiere importar los datos a la base y administrar la instancia." },
      { text: "AWS Glue DataBrew.", correct: false, explanation: "Incorrecto. DataBrew es para preparación visual de datos, no para consultas SQL ad-hoc sobre S3." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación necesita distribuir tráfico entrante hacia contenedores usando enrutamiento basado en la ruta y el host de las solicitudes HTTP. ¿Qué balanceador de carga usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html",
    options: [
      { text: "Application Load Balancer (ALB).", correct: true, explanation: "Correcto. El ALB opera en capa 7 y admite enrutamiento avanzado por path y host, ideal para microservicios y contenedores." },
      { text: "Network Load Balancer (NLB).", correct: false, explanation: "Incorrecto. El NLB opera en capa 4 (TCP/UDP) y no realiza enrutamiento por path/host HTTP." },
      { text: "Classic Load Balancer.", correct: false, explanation: "Incorrecto. El CLB es una generación anterior con capacidades de enrutamiento limitadas frente al ALB." },
      { text: "Gateway Load Balancer.", correct: false, explanation: "Incorrecto. El GWLB se usa para insertar appliances de red (firewalls); no enruta por path/host de aplicación." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una carga de trabajo TCP de latencia ultrabaja necesita manejar millones de solicitudes por segundo y preservar la IP de origen del cliente. ¿Qué balanceador usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html",
    options: [
      { text: "Network Load Balancer (NLB).", correct: true, explanation: "Correcto. El NLB opera en capa 4, ofrece latencia ultrabaja, escala a millones de solicitudes por segundo y puede preservar la IP de origen." },
      { text: "Application Load Balancer (ALB).", correct: false, explanation: "Incorrecto. El ALB es capa 7 y añade mayor latencia que un NLB para tráfico TCP puro de alto rendimiento." },
      { text: "Amazon CloudFront.", correct: false, explanation: "Incorrecto. CloudFront es una CDN para contenido HTTP/S en el edge, no un balanceador TCP de baja latencia." },
      { text: "Route 53.", correct: false, explanation: "Incorrecto. Route 53 es DNS; distribuye por resolución de nombres, no balancea conexiones TCP con baja latencia." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa quiere transferir 80 TB de datos desde un centro de datos on-premises hacia S3, pero su enlace de Internet es lento. ¿Qué servicio minimiza el tiempo y el costo de transferencia?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/snowball/latest/developer-guide/whatissnowball.html",
    options: [
      { text: "AWS Snowball Edge.", correct: true, explanation: "Correcto. Snowball Edge es un dispositivo físico para transferir grandes volúmenes de datos offline, evitando saturar un enlace de Internet lento." },
      { text: "Cargar los datos directamente por Internet con la CLI.", correct: false, explanation: "Incorrecto. Con un enlace lento, transferir 80 TB por Internet tomaría demasiado tiempo y podría costar más en ancho de banda." },
      { text: "Configurar una VPN Site-to-Site.", correct: false, explanation: "Incorrecto. La VPN sigue usando el enlace de Internet lento; no acelera una transferencia masiva." },
      { text: "Usar S3 Transfer Acceleration sobre el enlace existente.", correct: false, explanation: "Incorrecto. Transfer Acceleration ayuda con la latencia geográfica, pero sigue limitado por el ancho de banda del enlace lento local." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Un equipo de desarrollo usa instancias EC2 solo en horario laboral (de lunes a viernes, 9 a 18 h). ¿Qué estrategia reduce costos sin comprometer el ambiente?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-state.html",
    options: [
      { text: "Automatizar el apagado y encendido de las instancias fuera del horario laboral.", correct: true, explanation: "Correcto. Detener las instancias cuando no se usan (por ejemplo con schedulers de Systems Manager o Lambda + EventBridge) evita pagar cómputo ocioso." },
      { text: "Comprar Reserved Instances de 3 años para desarrollo.", correct: false, explanation: "Incorrecto. Las RI convienen para uso continuo 24/7; para uso solo en horario laboral se paga por tiempo no utilizado." },
      { text: "Migrar a instancias más grandes.", correct: false, explanation: "Incorrecto. Instancias más grandes aumentan el costo por hora." },
      { text: "Dejar las instancias encendidas para evitar tiempos de arranque.", correct: false, explanation: "Incorrecto. Mantenerlas encendidas fuera de horario genera costo innecesario." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación web necesita enrutar a los usuarios al endpoint saludable más cercano geográficamente y hacer failover automático si una región falla. ¿Qué combinación de Route 53 usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html",
    options: [
      { text: "Políticas de enrutamiento por latencia/geolocalización con health checks y failover.", correct: true, explanation: "Correcto. Route 53 puede enrutar por latencia o geolocalización y, combinado con health checks, redirige el tráfico ante fallas de un endpoint o región." },
      { text: "Solo enrutamiento simple (simple routing) a una IP fija.", correct: false, explanation: "Incorrecto. El enrutamiento simple no evalúa salud ni cercanía; no ofrece failover." },
      { text: "Un registro CNAME estático sin health checks.", correct: false, explanation: "Incorrecto. Sin health checks no hay failover automático." },
      { text: "Weighted routing sin health checks.", correct: false, explanation: "Incorrecto. El enrutamiento ponderado reparte tráfico por pesos, pero sin health checks no detecta fallas ni prioriza cercanía." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Se necesita una conexión de red dedicada y consistente entre un centro de datos on-premises y AWS con ancho de banda estable y menor latencia que Internet. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html",
    options: [
      { text: "AWS Direct Connect.", correct: true, explanation: "Correcto. Direct Connect provee una conexión de red dedicada y privada hacia AWS con ancho de banda consistente y menor latencia que Internet." },
      { text: "VPN Site-to-Site sobre Internet.", correct: false, explanation: "Parcialmente válido, pero la VPN usa Internet y su rendimiento/latencia es variable; el requisito pide una conexión dedicada consistente." },
      { text: "VPC Peering.", correct: false, explanation: "Incorrecto. El peering conecta VPCs entre sí, no una red on-premises con AWS." },
      { text: "Internet Gateway.", correct: false, explanation: "Incorrecto. El IGW da salida a Internet; no es una conexión dedicada on-premises." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa desea una copia de seguridad centralizada y automatizada de recursos como EBS, RDS, DynamoDB y EFS con políticas de retención. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html",
    options: [
      { text: "AWS Backup.", correct: true, explanation: "Correcto. AWS Backup centraliza y automatiza respaldos de múltiples servicios (EBS, RDS, DynamoDB, EFS, etc.) con políticas de retención." },
      { text: "Scripts manuales de snapshots por servicio.", correct: false, explanation: "Incorrecto. Los scripts manuales son propensos a errores y no ofrecen gestión centralizada de políticas." },
      { text: "S3 Versioning.", correct: false, explanation: "Incorrecto. El versionado aplica solo a objetos de S3, no respalda EBS/RDS/DynamoDB/EFS de forma centralizada." },
      { text: "CloudFormation.", correct: false, explanation: "Incorrecto. CloudFormation provisiona infraestructura como código; no es un servicio de respaldo de datos." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación necesita ejecutar contenedores sin administrar ni aprovisionar los servidores subyacentes y pagar solo por los recursos usados por las tareas. ¿Qué opción usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html",
    options: [
      { text: "AWS Fargate con Amazon ECS o EKS.", correct: true, explanation: "Correcto. Fargate ejecuta contenedores de forma serverless: no gestionas EC2 y pagas por la vCPU y memoria que consumen las tareas." },
      { text: "Amazon ECS con el tipo de lanzamiento EC2 autogestionado.", correct: false, explanation: "Incorrecto. Con el tipo EC2 debes aprovisionar y administrar las instancias subyacentes, lo contrario al requisito." },
      { text: "Instalar Docker en instancias EC2 manuales.", correct: false, explanation: "Incorrecto. Requiere administrar por completo los servidores." },
      { text: "AWS Lambda con imágenes de más de 15 minutos de ejecución.", correct: false, explanation: "Incorrecto. Lambda tiene un límite de 15 minutos por ejecución y no es un runtime de contenedores de larga duración." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Un bucket de S3 con datos sensibles fue expuesto accidentalmente. La empresa quiere prevenir de forma preventiva cualquier acceso público a todos los buckets de la cuenta. ¿Qué configuración usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html",
    options: [
      { text: "Habilitar S3 Block Public Access a nivel de cuenta.", correct: true, explanation: "Correcto. Block Public Access a nivel de cuenta anula ACLs y políticas que otorguen acceso público, previniendo exposiciones accidentales en todos los buckets." },
      { text: "Aplicar cifrado SSE-S3 a los objetos.", correct: false, explanation: "Incorrecto. El cifrado protege los datos en reposo, pero no impide el acceso público si las políticas lo permiten." },
      { text: "Habilitar el versionado del bucket.", correct: false, explanation: "Incorrecto. El versionado no controla el acceso público." },
      { text: "Mover los objetos a Glacier.", correct: false, explanation: "Incorrecto. Cambiar la clase de almacenamiento no impide el acceso público." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa quiere visualizar, analizar y recibir alertas sobre sus costos y uso de AWS a lo largo del tiempo. ¿Qué herramientas debe usar? (Selecciona 2)",
    multiple: true,
    doc: "https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html",
    options: [
      { text: "AWS Cost Explorer.", correct: true, explanation: "Correcto. Cost Explorer permite visualizar y analizar tendencias de costo y uso a lo largo del tiempo." },
      { text: "AWS Budgets.", correct: true, explanation: "Correcto. AWS Budgets permite definir presupuestos y recibir alertas cuando el costo o uso supera umbrales." },
      { text: "Amazon Inspector.", correct: false, explanation: "Incorrecto. Inspector evalúa vulnerabilidades de seguridad, no costos." },
      { text: "AWS Shield.", correct: false, explanation: "Incorrecto. Shield protege contra DDoS; no gestiona costos." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación desacoplada necesita entregar el mismo mensaje a varios sistemas suscritos (fan-out) simultáneamente. ¿Qué arquitectura es la adecuada?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/sns/latest/dg/welcome.html",
    options: [
      { text: "Amazon SNS con múltiples colas SQS suscritas (patrón fan-out).", correct: true, explanation: "Correcto. SNS publica el mensaje a todos los suscriptores; con varias colas SQS suscritas se logra un fan-out desacoplado y durable." },
      { text: "Una única cola SQS Standard con un consumidor.", correct: false, explanation: "Incorrecto. Una sola cola con un consumidor no distribuye el mensaje a múltiples sistemas de forma independiente." },
      { text: "Amazon Kinesis Data Firehose hacia S3.", correct: false, explanation: "Incorrecto. Firehose entrega a destinos de almacenamiento/análisis, no realiza fan-out de mensajes a múltiples suscriptores como SNS." },
      { text: "Un ALB distribuyendo a instancias.", correct: false, explanation: "Incorrecto. El ALB balancea solicitudes; no replica un mensaje a múltiples sistemas suscritos." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Un volumen de arranque de EC2 con una base de datos requiere alto IOPS sostenido y rendimiento predecible. ¿Qué tipo de volumen EBS es el más adecuado?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html",
    options: [
      { text: "SSD de IOPS aprovisionados (io1/io2).", correct: true, explanation: "Correcto. Los volúmenes io1/io2 permiten aprovisionar un nivel de IOPS específico y consistente, ideal para bases de datos exigentes." },
      { text: "HDD optimizado para throughput (st1).", correct: false, explanation: "Incorrecto. st1 está pensado para cargas de throughput secuencial (big data, logs), no para alto IOPS aleatorio de base de datos." },
      { text: "HDD en frío (sc1).", correct: false, explanation: "Incorrecto. sc1 es el más económico y de menor rendimiento, para datos poco accedidos; no cumple el requisito de IOPS." },
      { text: "Instance store efímero.", correct: false, explanation: "Incorrecto. El instance store es efímero; no es adecuado para un volumen de base de datos persistente." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Se requiere permitir acceso temporal a recursos de AWS a usuarios autenticados mediante un proveedor de identidad corporativo (SAML) sin crear un usuario de IAM por persona. ¿Qué mecanismo usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_saml.html",
    options: [
      { text: "Federación de identidades con roles de IAM asumidos vía AWS STS.", correct: true, explanation: "Correcto. La federación SAML permite a los usuarios corporativos asumir roles de IAM y obtener credenciales temporales vía STS, sin usuarios de IAM individuales." },
      { text: "Crear un usuario de IAM con access keys para cada empleado.", correct: false, explanation: "Incorrecto. No escala y contradice el requisito de no crear un usuario por persona." },
      { text: "Compartir un único usuario de IAM entre todos.", correct: false, explanation: "Incorrecto. Compartir credenciales es una mala práctica de seguridad y elimina la trazabilidad individual." },
      { text: "Usar la cuenta raíz para todos los accesos.", correct: false, explanation: "Incorrecto. La cuenta raíz nunca debe usarse para operaciones diarias." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación crítica debe soportar la falla completa de una zona de disponibilidad sin interrupción del servicio. ¿Cuál es el principio de diseño clave?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html",
    options: [
      { text: "Desplegar los recursos en múltiples zonas de disponibilidad (Multi-AZ).", correct: true, explanation: "Correcto. Distribuir cómputo y datos en varias AZ garantiza que la falla de una zona no interrumpa el servicio." },
      { text: "Concentrar todos los recursos en una sola AZ para simplificar.", correct: false, explanation: "Incorrecto. Concentrar en una AZ crea un punto único de falla." },
      { text: "Usar instancias más grandes en una sola AZ.", correct: false, explanation: "Incorrecto. El escalado vertical no protege ante la falla de la AZ." },
      { text: "Realizar solo backups diarios.", correct: false, explanation: "Incorrecto. Los backups ayudan en recuperación, pero no evitan la interrupción ante la falla de una AZ." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa mueve archivos de un sistema NFS local a AWS de forma recurrente y automatizada, con verificación de integridad. ¿Qué servicio simplifica esta transferencia continua?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html",
    options: [
      { text: "AWS DataSync.", correct: true, explanation: "Correcto. DataSync automatiza y acelera la transferencia de datos entre almacenamiento on-premises (NFS/SMB) y servicios de AWS, con verificación de integridad." },
      { text: "AWS Snowball para cada transferencia diaria.", correct: false, explanation: "Incorrecto. Snowball es para migraciones offline puntuales de gran volumen, no para transferencias recurrentes automatizadas." },
      { text: "Copiar manualmente con la AWS CLI en un cron.", correct: false, explanation: "Incorrecto. Es propenso a errores y carece de la optimización, verificación y monitoreo integrados de DataSync." },
      { text: "AWS Transfer Family solo con SFTP manual.", correct: false, explanation: "Incorrecto. Transfer Family expone endpoints SFTP/FTPS; no automatiza la sincronización de un NFS local como DataSync." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una tabla de DynamoDB con tráfico impredecible y con picos repentinos necesita evitar el aprovisionamiento manual de capacidad. ¿Qué modo de capacidad elegir?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html",
    options: [
      { text: "Modo On-Demand (bajo demanda).", correct: true, explanation: "Correcto. El modo On-Demand escala automáticamente para adaptarse a tráfico impredecible y picos, cobrando por solicitud sin aprovisionar capacidad." },
      { text: "Capacidad aprovisionada fija sin auto scaling.", correct: false, explanation: "Incorrecto. La capacidad fija puede quedar corta en picos (throttling) o sobrar en valles (costo)." },
      { text: "Migrar la tabla a RDS.", correct: false, explanation: "Incorrecto. Cambiar de servicio no responde al requisito y RDS no escala igual para este patrón NoSQL." },
      { text: "Usar índices secundarios locales para escalar.", correct: false, explanation: "Incorrecto. Los índices facilitan consultas, no resuelven la elección del modo de capacidad ante picos." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Un requisito de cumplimiento exige que los objetos de S3 no puedan ser eliminados ni sobrescritos durante un período determinado (WORM). ¿Qué característica cumple esto?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html",
    options: [
      { text: "S3 Object Lock en modo Compliance.", correct: true, explanation: "Correcto. S3 Object Lock aplica un modelo WORM: en modo Compliance ni siquiera la cuenta raíz puede eliminar o modificar el objeto hasta que expire la retención." },
      { text: "Solo habilitar el versionado.", correct: false, explanation: "Incorrecto. El versionado conserva versiones, pero no impide eliminaciones/sobrescrituras a nivel WORM por sí solo." },
      { text: "Cifrado con KMS.", correct: false, explanation: "Incorrecto. El cifrado protege confidencialidad, no la inmutabilidad temporal de los objetos." },
      { text: "Una política de ciclo de vida.", correct: false, explanation: "Incorrecto. Las reglas de ciclo de vida gestionan transiciones y expiración, no imponen inmutabilidad WORM." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación monolítica se está desacoplando. Se necesita orquestar múltiples pasos (con reintentos, ramas y estados de error) entre funciones Lambda y servicios de AWS. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html",
    options: [
      { text: "AWS Step Functions.", correct: true, explanation: "Correcto. Step Functions orquesta flujos de trabajo con estados, reintentos, ramificaciones y manejo de errores entre Lambda y otros servicios." },
      { text: "Una sola función Lambda con toda la lógica secuencial.", correct: false, explanation: "Incorrecto. Concentrar toda la orquestación en una Lambda dificulta el manejo de reintentos, estados y límites de tiempo." },
      { text: "Amazon SQS únicamente.", correct: false, explanation: "Incorrecto. SQS desacopla mensajes pero no orquesta un flujo con estados y ramas." },
      { text: "Amazon CloudWatch Alarms.", correct: false, explanation: "Incorrecto. Las alarmas notifican sobre métricas; no orquestan flujos de trabajo." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa necesita acelerar el rendimiento global de una aplicación TCP/UDP dirigiendo a los usuarios a la región óptima a través de la red troncal de AWS con IPs estáticas de anycast. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
    options: [
      { text: "AWS Global Accelerator.", correct: true, explanation: "Correcto. Global Accelerator usa IPs estáticas anycast y la red troncal de AWS para enrutar el tráfico al endpoint óptimo, mejorando rendimiento y disponibilidad para tráfico TCP/UDP." },
      { text: "Amazon CloudFront.", correct: false, explanation: "Incorrecto. CloudFront acelera contenido HTTP/S cacheable; Global Accelerator es mejor para tráfico TCP/UDP no cacheable con IPs estáticas." },
      { text: "Route 53 con enrutamiento simple.", correct: false, explanation: "Incorrecto. Route 53 resuelve DNS pero no provee IPs anycast ni enruta por la red troncal de AWS." },
      { text: "Un NAT Gateway.", correct: false, explanation: "Incorrecto. El NAT Gateway da salida a Internet a subredes privadas; no acelera tráfico global." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Se debe garantizar que solo instancias con roles específicos puedan leer secretos, aplicando el principio de mínimo privilegio. ¿Qué práctica de IAM es correcta?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
    options: [
      { text: "Otorgar políticas con permisos mínimos y específicos por recurso a cada rol.", correct: true, explanation: "Correcto. El mínimo privilegio implica conceder solo los permisos necesarios sobre los recursos requeridos, reduciendo la superficie de riesgo." },
      { text: "Adjuntar la política AdministratorAccess a todos los roles.", correct: false, explanation: "Incorrecto. Dar acceso de administrador viola el mínimo privilegio." },
      { text: "Usar '*' en Action y Resource para simplificar.", correct: false, explanation: "Incorrecto. Los comodines amplios otorgan más permisos de los necesarios." },
      { text: "Compartir un rol con todos los servicios de la cuenta.", correct: false, explanation: "Incorrecto. Un rol demasiado amplio y compartido contradice el mínimo privilegio." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa con muchas cuentas quiere consolidar la facturación y obtener descuentos por volumen agregado. ¿Qué característica usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html",
    options: [
      { text: "Consolidated Billing en AWS Organizations.", correct: true, explanation: "Correcto. La facturación consolidada agrega el uso de todas las cuentas de la organización en una sola factura y permite alcanzar niveles de descuento por volumen." },
      { text: "Crear una factura manual por cuenta.", correct: false, explanation: "Incorrecto. Facturas separadas no agregan volumen ni consolidan descuentos." },
      { text: "Usar Cost Explorer para pagar.", correct: false, explanation: "Incorrecto. Cost Explorer analiza costos, no consolida la facturación." },
      { text: "Aplicar Savings Plans en una sola cuenta.", correct: false, explanation: "Incorrecto. Un Savings Plan aislado no consolida la facturación de múltiples cuentas ni agrega volumen entre ellas." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una base de datos DynamoDB necesita disponibilidad y baja latencia de lectura/escritura en varias regiones simultáneamente para usuarios globales. ¿Qué característica usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html",
    options: [
      { text: "DynamoDB Global Tables.", correct: true, explanation: "Correcto. Las Global Tables replican los datos entre varias regiones con multi-master, ofreciendo baja latencia local y disponibilidad regional." },
      { text: "Una tabla en una sola región con caché local.", correct: false, explanation: "Incorrecto. Una sola región no da baja latencia de escritura global ni resiliencia multi-región." },
      { text: "Read replicas de RDS.", correct: false, explanation: "Incorrecto. Las read replicas son de RDS (relacional), no de DynamoDB, y son de solo lectura." },
      { text: "Copias periódicas con Data Pipeline.", correct: false, explanation: "Incorrecto. Copias periódicas no ofrecen replicación continua multi-master de baja latencia." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación de lecturas intensivas sobre DynamoDB necesita reducir la latencia a microsegundos con una caché totalmente administrada específica para DynamoDB. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html",
    options: [
      { text: "Amazon DynamoDB Accelerator (DAX).", correct: true, explanation: "Correcto. DAX es una caché en memoria administrada, específica para DynamoDB, que reduce la latencia de lectura de milisegundos a microsegundos sin cambios en el código." },
      { text: "Amazon RDS Read Replica.", correct: false, explanation: "Incorrecto. Las read replicas son de RDS, no aceleran DynamoDB." },
      { text: "Amazon CloudFront.", correct: false, explanation: "Incorrecto. CloudFront cachea contenido HTTP en el edge, no consultas a DynamoDB." },
      { text: "S3 Transfer Acceleration.", correct: false, explanation: "Incorrecto. Aplica a transferencias hacia S3, no a DynamoDB." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa necesita descubrir y proteger datos sensibles (PII) almacenados en buckets de S3 de forma automatizada usando machine learning. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html",
    options: [
      { text: "Amazon Macie.", correct: true, explanation: "Correcto. Macie usa machine learning para descubrir, clasificar y proteger datos sensibles como PII en S3." },
      { text: "Amazon GuardDuty.", correct: false, explanation: "Incorrecto. GuardDuty detecta amenazas de seguridad, no clasifica datos sensibles en S3." },
      { text: "AWS Config.", correct: false, explanation: "Incorrecto. Config evalúa configuración de recursos, no descubre PII." },
      { text: "Amazon Inspector.", correct: false, explanation: "Incorrecto. Inspector evalúa vulnerabilidades, no clasifica datos sensibles." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa necesita evaluar continuamente si sus recursos cumplen con políticas internas (por ejemplo, que todos los volúmenes EBS estén cifrados) y registrar los cambios de configuración. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html",
    options: [
      { text: "AWS Config con reglas de cumplimiento.", correct: true, explanation: "Correcto. AWS Config registra el historial de configuración de recursos y evalúa el cumplimiento frente a reglas (managed o personalizadas)." },
      { text: "AWS CloudTrail.", correct: false, explanation: "Incorrecto. CloudTrail registra llamadas a la API, pero no evalúa el cumplimiento del estado de configuración de los recursos." },
      { text: "Amazon CloudWatch Logs.", correct: false, explanation: "Incorrecto. CloudWatch Logs almacena registros, no evalúa cumplimiento de configuración." },
      { text: "AWS WAF.", correct: false, explanation: "Incorrecto. WAF filtra tráfico web; no evalúa cumplimiento de configuración." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una carga de trabajo de computación de alto rendimiento (HPC) necesita comunicación entre nodos con muy baja latencia y alto ancho de banda dentro de una AZ. ¿Qué opción de red y ubicación usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html",
    options: [
      { text: "Cluster placement group con adaptador EFA.", correct: true, explanation: "Correcto. Un cluster placement group agrupa instancias cerca dentro de una AZ y, con Elastic Fabric Adapter (EFA), ofrece baja latencia y alto ancho de banda para HPC." },
      { text: "Distribuir las instancias en múltiples regiones.", correct: false, explanation: "Incorrecto. Separar en regiones aumenta la latencia entre nodos, contrario al requisito de HPC." },
      { text: "Spread placement group en distintas AZ.", correct: false, explanation: "Incorrecto. El spread placement group maximiza aislamiento de fallas, pero no minimiza la latencia entre nodos." },
      { text: "Colocar cada instancia en una AZ diferente.", correct: false, explanation: "Incorrecto. La comunicación entre AZ tiene más latencia que dentro de una misma AZ." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa ejecuta cargas de misión crítica que no pueden interrumpirse, con uso constante 24/7 durante 1 año en un tipo de instancia fijo. ¿Qué opción de compra minimiza el costo?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html",
    options: [
      { text: "Reserved Instances estándar de 1 año.", correct: true, explanation: "Correcto. Para uso constante 24/7 en un tipo de instancia fijo, las Reserved Instances estándar ofrecen un descuento significativo frente a On-Demand." },
      { text: "Instancias Spot.", correct: false, explanation: "Incorrecto. Spot puede interrumpirse; no es adecuado para cargas que no pueden interrumpirse." },
      { text: "On-Demand permanente.", correct: false, explanation: "Incorrecto. On-Demand es más caro para uso constante prolongado." },
      { text: "Dedicated Hosts.", correct: false, explanation: "Incorrecto. Los Dedicated Hosts son más costosos y se usan por licenciamiento/cumplimiento, no para minimizar costo en este caso." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación stateless en EC2 detrás de un ALB debe manejar sesiones de usuario sin depender de una instancia específica. ¿Dónde se debe almacenar el estado de sesión?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html",
    options: [
      { text: "En un almacén externo compartido como ElastiCache o DynamoDB.", correct: true, explanation: "Correcto. Externalizar el estado de sesión a ElastiCache o DynamoDB permite que cualquier instancia atienda al usuario, habilitando escalado y tolerancia a fallos." },
      { text: "En la memoria local de cada instancia.", correct: false, explanation: "Incorrecto. Guardar la sesión localmente ata al usuario a una instancia; si esta falla, se pierde la sesión." },
      { text: "En el disco efímero de la instancia.", correct: false, explanation: "Incorrecto. El disco efímero es local y se pierde al terminar la instancia." },
      { text: "En variables de entorno de la instancia.", correct: false, explanation: "Incorrecto. Las variables de entorno son locales y estáticas; no sirven para almacenar sesiones dinámicas compartidas." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa quiere proteger su aplicación web contra ataques DDoS de gran escala con protección avanzada y soporte especializado. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html",
    options: [
      { text: "AWS Shield Advanced.", correct: true, explanation: "Correcto. Shield Advanced ofrece protección DDoS mejorada, detección de ataques a nivel de aplicación, mitigación y acceso al equipo de respuesta DDoS." },
      { text: "AWS Config.", correct: false, explanation: "Incorrecto. Config gestiona cumplimiento de configuración, no mitiga DDoS." },
      { text: "Amazon Macie.", correct: false, explanation: "Incorrecto. Macie clasifica datos sensibles, no mitiga DDoS." },
      { text: "Amazon Cognito.", correct: false, explanation: "Incorrecto. Cognito gestiona identidad de usuarios de aplicaciones, no protección DDoS." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación web y móvil necesita registro e inicio de sesión de usuarios, con soporte para proveedores sociales y federación, sin construir la gestión de identidades desde cero. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html",
    options: [
      { text: "Amazon Cognito.", correct: true, explanation: "Correcto. Cognito provee user pools para autenticación y registro, con soporte para proveedores sociales y federación de identidades." },
      { text: "AWS IAM Users para cada usuario final.", correct: false, explanation: "Incorrecto. IAM está pensado para identidades de AWS de administradores/servicios, no para millones de usuarios finales de una app." },
      { text: "Amazon RDS con una tabla de usuarios propia.", correct: false, explanation: "Incorrecto. Construir la autenticación desde cero contradice el requisito de no reinventar la gestión de identidades." },
      { text: "AWS Directory Service únicamente.", correct: false, explanation: "Incorrecto. Directory Service se orienta a directorios corporativos tipo Active Directory, no a la identidad de usuarios de apps web/móviles con proveedores sociales." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación de comercio genera picos de tráfico impredecibles. Se necesita desacoplar la capa web de la de procesamiento para absorber los picos y evitar pérdida de solicitudes. ¿Qué patrón aplicar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
    options: [
      { text: "Introducir una cola SQS entre la capa web y los workers, que escalan según la profundidad de la cola.", correct: true, explanation: "Correcto. La cola SQS amortigua los picos: la capa web encola solicitudes y los workers las procesan a su ritmo, escalando según la longitud de la cola sin perder mensajes." },
      { text: "Conectar la capa web directamente a la base de datos sin buffer.", correct: false, explanation: "Incorrecto. Sin desacople, un pico puede saturar la base de datos y perder solicitudes." },
      { text: "Aumentar el tamaño de la única instancia web.", correct: false, explanation: "Incorrecto. El escalado vertical tiene límites y no absorbe picos de forma elástica ni desacopla." },
      { text: "Servir errores 503 durante los picos.", correct: false, explanation: "Incorrecto. Rechazar solicitudes degrada la experiencia; el objetivo es absorber los picos sin perder trabajo." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Los objetos de un bucket se acceden con frecuencia solo los primeros 30 días, luego rara vez durante un año, y casi nunca después. Deben conservarse. ¿Qué ciclo de vida es óptimo?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html",
    options: [
      { text: "Standard → Standard-IA a los 30 días → Glacier a los ~395 días.", correct: true, explanation: "Correcto. Este ciclo alinea la clase de almacenamiento al patrón de acceso: acceso frecuente en Standard, poco frecuente en Standard-IA y archivado en Glacier, minimizando costo." },
      { text: "Mantener todo en S3 Standard indefinidamente.", correct: false, explanation: "Incorrecto. Standard es caro para datos poco accedidos con el tiempo." },
      { text: "Mover a Glacier Deep Archive el día 1.", correct: false, explanation: "Incorrecto. Los primeros 30 días hay acceso frecuente; Deep Archive tiene recuperaciones lentas y no conviene al inicio." },
      { text: "Eliminar los objetos a los 30 días.", correct: false, explanation: "Incorrecto. Deben conservarse; eliminarlos viola el requisito." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa exige control de las claves de cifrado con módulos de hardware dedicados de un solo inquilino y certificación FIPS 140-2 nivel 3. ¿Qué servicio cumple esto?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/cloudhsm/latest/userguide/introduction.html",
    options: [
      { text: "AWS CloudHSM.", correct: true, explanation: "Correcto. CloudHSM proporciona módulos de seguridad de hardware (HSM) dedicados de un solo inquilino con certificación FIPS 140-2 nivel 3 y control total de las claves." },
      { text: "AWS KMS con claves administradas por AWS.", correct: false, explanation: "Incorrecto. KMS usa HSM multi-tenant; el requisito específico de HSM dedicado de un solo inquilino apunta a CloudHSM." },
      { text: "AWS Secrets Manager.", correct: false, explanation: "Incorrecto. Secrets Manager almacena secretos, no es un HSM dedicado." },
      { text: "AWS Certificate Manager.", correct: false, explanation: "Incorrecto. ACM gestiona certificados TLS, no HSM de un solo inquilino." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa necesita un sistema de archivos totalmente administrado de alto rendimiento para cargas HPC y machine learning, con integración a S3. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html",
    options: [
      { text: "Amazon FSx for Lustre.", correct: true, explanation: "Correcto. FSx for Lustre ofrece un sistema de archivos paralelo de alto rendimiento para HPC y ML, con integración nativa a S3." },
      { text: "Amazon EFS Standard.", correct: false, explanation: "Incorrecto. EFS es NFS de propósito general; para HPC/ML de altísimo rendimiento y throughput, FSx for Lustre es la opción específica." },
      { text: "Amazon S3 montado como disco.", correct: false, explanation: "Incorrecto. S3 es almacenamiento de objetos, no un sistema de archivos paralelo de alto rendimiento." },
      { text: "Volúmenes EBS gp2.", correct: false, explanation: "Incorrecto. EBS es almacenamiento de bloques adjunto a una instancia, no un sistema de archivos compartido de alto rendimiento para clústeres." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación en contenedores en Kubernetes debe ejecutarse administrada por AWS, con el plano de control gestionado. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html",
    options: [
      { text: "Amazon EKS (Elastic Kubernetes Service).", correct: true, explanation: "Correcto. EKS ejecuta Kubernetes administrado por AWS, gestionando el plano de control con alta disponibilidad." },
      { text: "Amazon EC2 con Kubernetes autoinstalado sin soporte.", correct: false, explanation: "Incorrecto. Autoinstalar Kubernetes implica gestionar el plano de control manualmente, lo contrario al requisito." },
      { text: "AWS Lambda.", correct: false, explanation: "Incorrecto. Lambda ejecuta funciones event-driven, no orquesta clústeres Kubernetes." },
      { text: "Amazon Lightsail.", correct: false, explanation: "Incorrecto. Lightsail simplifica VPS y apps sencillas; no es un servicio administrado de Kubernetes." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa quiere aprovisionar y administrar certificados SSL/TLS públicos para su dominio y renovarlos automáticamente, sin costo adicional por el certificado. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html",
    options: [
      { text: "AWS Certificate Manager (ACM).", correct: true, explanation: "Correcto. ACM provisiona certificados TLS públicos gratuitos para usar con ELB, CloudFront y API Gateway, y los renueva automáticamente." },
      { text: "AWS KMS.", correct: false, explanation: "Incorrecto. KMS gestiona claves de cifrado, no certificados TLS públicos." },
      { text: "AWS Secrets Manager.", correct: false, explanation: "Incorrecto. Secrets Manager almacena secretos; no emite ni renueva certificados TLS públicos." },
      { text: "Amazon Route 53.", correct: false, explanation: "Incorrecto. Route 53 es DNS; puede validar dominios pero no emite los certificados: eso es ACM." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una aplicación serverless con Lambda tiene un tráfico muy variable. La empresa quiere pagar solo por el tiempo de ejecución real. ¿Qué afirmación sobre el modelo de costos de Lambda es correcta?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-billing.html",
    options: [
      { text: "Se cobra por número de solicitudes y por la duración/memoria de cada ejecución, sin costo por tiempo ocioso.", correct: true, explanation: "Correcto. Lambda cobra por invocaciones y por GB-segundo de ejecución; no hay cargo por capacidad ociosa, ideal para tráfico variable." },
      { text: "Se cobra una tarifa fija mensual independientemente del uso.", correct: false, explanation: "Incorrecto. Lambda no tiene tarifa fija; su costo depende del uso real." },
      { text: "Se cobra por instancia EC2 subyacente encendida 24/7.", correct: false, explanation: "Incorrecto. Lambda es serverless; no pagas instancias encendidas continuamente." },
      { text: "No tiene costo bajo ninguna circunstancia.", correct: false, explanation: "Incorrecto. Existe una capa gratuita, pero más allá de ella se cobra por solicitudes y duración." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa necesita provisionar toda su infraestructura de forma repetible y versionada como código, con capacidad de rollback si algo falla. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html",
    options: [
      { text: "AWS CloudFormation.", correct: true, explanation: "Correcto. CloudFormation define la infraestructura como código en plantillas, provisiona de forma repetible y realiza rollback automático ante errores de un stack." },
      { text: "Configurar cada recurso manualmente en la consola.", correct: false, explanation: "Incorrecto. La configuración manual no es repetible, versionada ni ofrece rollback controlado." },
      { text: "AWS CloudTrail.", correct: false, explanation: "Incorrecto. CloudTrail audita llamadas a la API; no provisiona infraestructura." },
      { text: "Amazon CloudWatch.", correct: false, explanation: "Incorrecto. CloudWatch monitorea; no provisiona infraestructura como código." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa quiere reducir el tiempo de subida de archivos grandes de usuarios distribuidos globalmente hacia un bucket de S3. ¿Qué característica de S3 usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html",
    options: [
      { text: "S3 Transfer Acceleration.", correct: true, explanation: "Correcto. Transfer Acceleration usa las edge locations de CloudFront para acelerar las cargas de larga distancia hacia el bucket de S3." },
      { text: "S3 Cross-Region Replication.", correct: false, explanation: "Incorrecto. CRR replica objetos entre regiones tras cargarlos; no acelera la subida inicial del usuario." },
      { text: "S3 Intelligent-Tiering.", correct: false, explanation: "Incorrecto. Intelligent-Tiering optimiza costo de almacenamiento, no la velocidad de carga." },
      { text: "S3 Object Lock.", correct: false, explanation: "Incorrecto. Object Lock impone inmutabilidad WORM; no afecta la velocidad de subida." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una función Lambda dentro de una VPC necesita acceder a una base de datos RDS privada y también a Internet para llamar a una API externa. ¿Qué configuración de red se requiere?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html",
    options: [
      { text: "Colocar la Lambda en subredes privadas de la VPC y enrutar su salida a Internet a través de un NAT Gateway.", correct: true, explanation: "Correcto. Una Lambda en VPC en subredes privadas alcanza RDS de forma privada; para salir a Internet necesita un NAT Gateway en una subred pública." },
      { text: "Asignar una IP pública directamente a la función Lambda.", correct: false, explanation: "Incorrecto. Las funciones Lambda en VPC no reciben IP pública; la salida a Internet se hace vía NAT Gateway." },
      { text: "Poner la Lambda en una subred pública con un Internet Gateway.", correct: false, explanation: "Incorrecto. Una Lambda en VPC no obtiene acceso a Internet solo por estar en subred pública; requiere NAT Gateway para salida." },
      { text: "Deshabilitar la configuración de VPC de la Lambda.", correct: false, explanation: "Incorrecto. Sin VPC no podría acceder de forma privada a la RDS del requisito." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa necesita conectar cientos de VPCs y redes on-premises de forma centralizada y escalable, evitando una malla compleja de conexiones peering. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html",
    options: [
      { text: "AWS Transit Gateway.", correct: true, explanation: "Correcto. Transit Gateway actúa como un hub central que interconecta múltiples VPCs y redes on-premises, simplificando la topología frente a un mallado de peerings." },
      { text: "Múltiples conexiones de VPC Peering entre cada par de VPCs.", correct: false, explanation: "Incorrecto. El peering no es transitivo y a gran escala se vuelve una malla difícil de administrar." },
      { text: "Un Internet Gateway compartido.", correct: false, explanation: "Incorrecto. El IGW da salida a Internet; no interconecta VPCs entre sí de forma privada." },
      { text: "Un NAT Gateway por VPC.", correct: false, explanation: "Incorrecto. El NAT Gateway gestiona salida a Internet, no la interconexión centralizada de VPCs." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa quiere permitir que una cuenta de AWS de un socio acceda a un rol específico en su cuenta de forma segura, exigiendo un identificador adicional para evitar el problema del 'confused deputy'. ¿Qué se debe usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html",
    options: [
      { text: "Un rol entre cuentas (cross-account) con una condición de External ID en la política de confianza.", correct: true, explanation: "Correcto. El External ID en la trust policy mitiga el problema del confused deputy al exigir un identificador acordado para asumir el rol entre cuentas." },
      { text: "Compartir las access keys del usuario raíz con el socio.", correct: false, explanation: "Incorrecto. Compartir credenciales, y menos las de root, es una grave falla de seguridad." },
      { text: "Crear un usuario de IAM para el socio con acceso total.", correct: false, explanation: "Incorrecto. Viola el mínimo privilegio y no usa el mecanismo seguro de roles entre cuentas con External ID." },
      { text: "Abrir el recurso al público con una política de bucket.", correct: false, explanation: "Incorrecto. Exponer públicamente el recurso es inseguro y no cumple el requisito de acceso controlado por el socio." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa recopila streaming de datos y necesita entregarlos casi en tiempo real a S3 y Redshift con transformación mínima y sin administrar infraestructura. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html",
    options: [
      { text: "Amazon Kinesis Data Firehose.", correct: true, explanation: "Correcto. Firehose captura, transforma opcionalmente y entrega streaming de datos a destinos como S3, Redshift y OpenSearch sin administrar infraestructura." },
      { text: "Amazon SQS.", correct: false, explanation: "Incorrecto. SQS es una cola de mensajes, no un servicio de entrega de streaming a destinos analíticos." },
      { text: "AWS Glue únicamente.", correct: false, explanation: "Incorrecto. Glue es ETL por lotes/serverless; Firehose es la vía nativa para entrega near-real-time a S3/Redshift." },
      { text: "Amazon EMR.", correct: false, explanation: "Incorrecto. EMR es para procesamiento big data con clústeres; requiere más administración y no es la entrega directa near-real-time descrita." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una aplicación con base de datos relacional tiene uso intermitente e impredecible, con largos períodos inactivos. Se quiere pagar solo por el cómputo usado. ¿Qué opción conviene?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html",
    options: [
      { text: "Amazon Aurora Serverless.", correct: true, explanation: "Correcto. Aurora Serverless escala la capacidad de cómputo automáticamente según la demanda y reduce costos en cargas intermitentes o impredecibles." },
      { text: "Una instancia RDS grande siempre encendida.", correct: false, explanation: "Incorrecto. Pagar una instancia grande 24/7 con uso intermitente desperdicia dinero en tiempos inactivos." },
      { text: "DynamoDB con capacidad aprovisionada fija.", correct: false, explanation: "Incorrecto. Cambia el modelo de datos y la capacidad fija no optimiza el uso intermitente; además el requisito es relacional." },
      { text: "Redshift.", correct: false, explanation: "Incorrecto. Redshift es un data warehouse analítico, no una base transacional relacional con escalado por uso." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una arquitectura debe reintentar automáticamente los mensajes que fallan al procesarse y aislar los que fallan repetidamente para inspección posterior. ¿Qué característica de SQS usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
    options: [
      { text: "Una Dead-Letter Queue (DLQ) asociada a la cola principal.", correct: true, explanation: "Correcto. La DLQ recibe los mensajes que superan el máximo de reintentos, aislándolos para análisis sin bloquear el procesamiento del resto." },
      { text: "Eliminar de inmediato los mensajes que fallan.", correct: false, explanation: "Incorrecto. Eliminar mensajes fallidos pierde información valiosa para depurar." },
      { text: "Aumentar indefinidamente el visibility timeout.", correct: false, explanation: "Incorrecto. Un timeout muy alto retrasa el reprocesamiento pero no aísla los mensajes problemáticos." },
      { text: "Usar una cola FIFO obligatoriamente.", correct: false, explanation: "Incorrecto. FIFO controla orden y duplicados, pero el aislamiento de fallos repetidos lo provee la DLQ, disponible también en colas Standard." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa necesita un firewall de red administrado y con estado para filtrar tráfico a nivel de la VPC con reglas personalizadas e inspección profunda. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html",
    options: [
      { text: "AWS Network Firewall.", correct: true, explanation: "Correcto. Network Firewall es un firewall administrado con estado para VPCs, que permite reglas personalizadas e inspección de tráfico a escala." },
      { text: "Security groups únicamente.", correct: false, explanation: "Incorrecto. Los security groups son stateful pero simples (IP/puerto); no ofrecen inspección profunda ni reglas avanzadas de firewall." },
      { text: "AWS WAF.", correct: false, explanation: "Incorrecto. WAF protege aplicaciones web (capa 7 HTTP), no realiza filtrado general de red a nivel de VPC." },
      { text: "Amazon GuardDuty.", correct: false, explanation: "Incorrecto. GuardDuty detecta amenazas, no filtra ni bloquea tráfico como un firewall en línea." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa necesita búsqueda y análisis de logs a gran escala con dashboards casi en tiempo real. ¿Qué servicio administrado usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html",
    options: [
      { text: "Amazon OpenSearch Service.", correct: true, explanation: "Correcto. OpenSearch Service permite indexar, buscar y analizar logs a gran escala y visualizarlos en dashboards casi en tiempo real." },
      { text: "Amazon RDS.", correct: false, explanation: "Incorrecto. RDS es relacional; no está optimizado para búsqueda full-text y analítica de logs a gran escala." },
      { text: "Amazon Redshift.", correct: false, explanation: "Incorrecto. Redshift es un data warehouse para SQL analítico por lotes, no búsqueda de logs near-real-time." },
      { text: "Amazon S3 Select.", correct: false, explanation: "Incorrecto. S3 Select filtra contenido de un objeto; no ofrece indexación de búsqueda ni dashboards." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa quiere recibir recomendaciones automáticas para optimizar costos, rendimiento, seguridad y tolerancia a fallos en su cuenta. ¿Qué herramienta usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html",
    options: [
      { text: "AWS Trusted Advisor.", correct: true, explanation: "Correcto. Trusted Advisor analiza la cuenta y da recomendaciones en categorías como optimización de costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio." },
      { text: "AWS CloudTrail.", correct: false, explanation: "Incorrecto. CloudTrail registra actividad de API; no genera recomendaciones de optimización." },
      { text: "Amazon Inspector.", correct: false, explanation: "Incorrecto. Inspector evalúa vulnerabilidades de seguridad, no da recomendaciones amplias de costo/rendimiento." },
      { text: "AWS Config.", correct: false, explanation: "Incorrecto. Config evalúa cumplimiento de configuración según reglas, no ofrece el conjunto de recomendaciones de Trusted Advisor." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación necesita que las lecturas escalen horizontalmente en una base de datos RDS sin afectar la instancia primaria de escritura. ¿Qué solución usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html",
    options: [
      { text: "Crear read replicas y dirigir el tráfico de lectura hacia ellas.", correct: true, explanation: "Correcto. Las read replicas de RDS descargan las lecturas de la instancia primaria, escalando horizontalmente la capacidad de lectura." },
      { text: "Habilitar Multi-AZ para escalar lecturas.", correct: false, explanation: "Incorrecto. Multi-AZ es para alta disponibilidad; el standby no atiende lecturas de la aplicación." },
      { text: "Aumentar el tamaño de la instancia primaria únicamente.", correct: false, explanation: "Parcialmente ayuda, pero es escalado vertical con límites; no escala horizontalmente como las read replicas." },
      { text: "Migrar a instance store.", correct: false, explanation: "Incorrecto. El instance store es efímero y no aplica a bases de datos RDS administradas." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa procesa grandes volúmenes de datos por lotes con frameworks como Apache Spark y Hadoop, y quiere un servicio administrado que aprovisione y escale los clústeres. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html",
    options: [
      { text: "Amazon EMR.", correct: true, explanation: "Correcto. EMR ejecuta frameworks big data (Spark, Hadoop, Hive) en clústeres administrados que escalan, y se integra con S3." },
      { text: "Amazon Athena.", correct: false, explanation: "Incorrecto. Athena consulta datos en S3 con SQL, pero no ejecuta trabajos Spark/Hadoop personalizados a gran escala como EMR." },
      { text: "Amazon QuickSight.", correct: false, explanation: "Incorrecto. QuickSight es visualización BI, no procesamiento big data." },
      { text: "AWS Lambda.", correct: false, explanation: "Incorrecto. Lambda tiene límites de tiempo/recursos y no es ideal para trabajos big data prolongados en clúster." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa necesita distribuir de forma segura parámetros de configuración y secretos simples (no rotados) a sus aplicaciones, con cifrado opcional y jerarquía. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html",
    options: [
      { text: "AWS Systems Manager Parameter Store.", correct: true, explanation: "Correcto. Parameter Store almacena parámetros de configuración y secretos (SecureString cifrado con KMS) de forma jerárquica y económica." },
      { text: "Guardar todo en un archivo dentro del código.", correct: false, explanation: "Incorrecto. Hardcodear configuración/secretos es inseguro y difícil de gestionar." },
      { text: "Amazon S3 sin cifrado.", correct: false, explanation: "Incorrecto. Un bucket sin cifrar no es apropiado para secretos ni ofrece la jerarquía de parámetros de SSM." },
      { text: "Amazon CloudWatch Logs.", correct: false, explanation: "Incorrecto. CloudWatch Logs es para registros; guardar configuración/secretos ahí no es adecuado." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Un requisito exige que, ante la terminación de una instancia en un Auto Scaling Group, se reemplace automáticamente para mantener siempre la capacidad deseada. ¿Qué característica lo garantiza?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html",
    options: [
      { text: "La capacidad deseada del ASG con health checks que reemplazan instancias no saludables.", correct: true, explanation: "Correcto. El Auto Scaling Group mantiene la capacidad deseada: si una instancia termina o falla el health check, lanza una nueva automáticamente." },
      { text: "Un ALB sin Auto Scaling Group.", correct: false, explanation: "Incorrecto. El ALB distribuye tráfico pero no lanza ni reemplaza instancias por sí solo." },
      { text: "Un snapshot programado de EBS.", correct: false, explanation: "Incorrecto. Los snapshots respaldan datos; no reemplazan instancias." },
      { text: "Una Elastic IP asignada a la instancia.", correct: false, explanation: "Incorrecto. La EIP mantiene una IP fija, pero no reemplaza instancias terminadas." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa quiere que los datos que se acceden con poca frecuencia pero requieren acceso inmediato (milisegundos) se almacenen a menor costo que S3 Standard, tolerando el almacenamiento en una sola AZ. ¿Qué clase usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
    options: [
      { text: "S3 One Zone-IA.", correct: true, explanation: "Correcto. One Zone-IA cuesta menos que Standard-IA para datos de acceso poco frecuente pero inmediato, a cambio de almacenarse en una sola AZ (menor durabilidad)." },
      { text: "S3 Standard.", correct: false, explanation: "Incorrecto. Standard es más caro y está pensado para acceso frecuente." },
      { text: "S3 Glacier Deep Archive.", correct: false, explanation: "Incorrecto. Deep Archive tiene recuperación de horas; no ofrece acceso inmediato en milisegundos." },
      { text: "S3 Glacier Flexible Retrieval.", correct: false, explanation: "Incorrecto. Glacier Flexible Retrieval no da acceso inmediato en milisegundos por defecto; sus recuperaciones tardan minutos a horas." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación con contenido dinámico y estático necesita mejorar el rendimiento sirviendo lo estático desde caché y enviando lo dinámico al origen. ¿Qué solución usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ConfiguringCaching.html",
    options: [
      { text: "Amazon CloudFront con comportamientos de caché (cache behaviors) según la ruta.", correct: true, explanation: "Correcto. CloudFront permite definir cache behaviors por patrón de ruta, cacheando contenido estático y reenviando el dinámico al origen, mejorando el rendimiento." },
      { text: "Un NLB delante del origen.", correct: false, explanation: "Incorrecto. El NLB balancea TCP; no cachea contenido estático en el edge." },
      { text: "Guardar todo el contenido dinámico en S3 estático.", correct: false, explanation: "Incorrecto. El contenido dinámico se genera por solicitud; no puede servirse como estático desde S3." },
      { text: "Deshabilitar la caché por completo.", correct: false, explanation: "Incorrecto. Sin caché se pierde el beneficio de rendimiento para el contenido estático." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa quiere automatizar el aprovisionamiento seguro y consistente de nuevas cuentas de AWS con guardrails y una zona de aterrizaje (landing zone) preconfigurada. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html",
    options: [
      { text: "AWS Control Tower.", correct: true, explanation: "Correcto. Control Tower configura una landing zone segura y multi-cuenta con guardrails, aprovisionando nuevas cuentas de forma consistente." },
      { text: "Crear cada cuenta manualmente sin guardrails.", correct: false, explanation: "Incorrecto. La creación manual no aplica guardrails consistentes ni escala bien." },
      { text: "AWS Config en una sola cuenta.", correct: false, explanation: "Incorrecto. Config evalúa cumplimiento, pero no aprovisiona una landing zone multi-cuenta." },
      { text: "Amazon Cognito.", correct: false, explanation: "Incorrecto. Cognito gestiona identidad de usuarios de apps, no zonas de aterrizaje de cuentas." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa necesita replicar automáticamente los objetos de un bucket de S3 a otra región para cumplimiento y recuperación ante desastres. ¿Qué característica usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html",
    options: [
      { text: "S3 Cross-Region Replication (CRR).", correct: true, explanation: "Correcto. CRR replica automáticamente los objetos nuevos a un bucket en otra región, apoyando cumplimiento y DR." },
      { text: "S3 Transfer Acceleration.", correct: false, explanation: "Incorrecto. Transfer Acceleration acelera cargas, no replica objetos entre regiones." },
      { text: "S3 Intelligent-Tiering.", correct: false, explanation: "Incorrecto. Intelligent-Tiering optimiza costo entre clases dentro de una región, no replica a otra región." },
      { text: "S3 Object Lock.", correct: false, explanation: "Incorrecto. Object Lock impone inmutabilidad; no replica objetos a otra región." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa necesita ejecutar código de baja latencia lo más cerca posible de los usuarios finales, en las edge locations de CloudFront, para personalizar respuestas HTTP. ¿Qué opción usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html",
    options: [
      { text: "Lambda@Edge o CloudFront Functions.", correct: true, explanation: "Correcto. Lambda@Edge y CloudFront Functions ejecutan lógica en las edge locations de CloudFront, personalizando o filtrando respuestas con baja latencia cerca del usuario." },
      { text: "Una instancia EC2 en una sola región.", correct: false, explanation: "Incorrecto. Una instancia en una región no está cerca de todos los usuarios globales ni corre en el edge." },
      { text: "Amazon RDS.", correct: false, explanation: "Incorrecto. RDS es una base de datos, no ejecuta lógica en el edge." },
      { text: "Amazon SQS.", correct: false, explanation: "Incorrecto. SQS es una cola de mensajes; no procesa solicitudes HTTP en el edge." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa migra servidores on-premises a AWS y quiere descubrir su inventario, dependencias y dimensionar (right-sizing) las instancias destino para optimizar costos. ¿Qué servicio ayuda a planificar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/application-discovery/latest/userguide/what-is-appdiscovery.html",
    options: [
      { text: "AWS Application Discovery Service (con Migration Hub).", correct: true, explanation: "Correcto. Application Discovery Service recopila datos de utilización y dependencias on-premises para planificar la migración y dimensionar correctamente, ayudando a optimizar costos." },
      { text: "Amazon QuickSight.", correct: false, explanation: "Incorrecto. QuickSight es BI/visualización; no descubre inventario ni dependencias de servidores." },
      { text: "AWS Budgets.", correct: false, explanation: "Incorrecto. Budgets alerta sobre presupuestos; no descubre ni dimensiona servidores." },
      { text: "Amazon Inspector.", correct: false, explanation: "Incorrecto. Inspector evalúa vulnerabilidades; no realiza descubrimiento para right-sizing de migración." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una política de seguridad exige que el tráfico entre una instancia y S3 nunca atraviese Internet y que se puedan aplicar políticas de endpoint para restringir a qué buckets se accede. ¿Qué combinación usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html",
    options: [
      { text: "Un VPC endpoint para S3 con una endpoint policy restrictiva.", correct: true, explanation: "Correcto. El VPC endpoint mantiene el tráfico dentro de la red de AWS y su endpoint policy limita a qué buckets/acciones se puede acceder." },
      { text: "Un NAT Gateway con reglas de security group.", correct: false, explanation: "Incorrecto. El NAT Gateway enruta por Internet y no ofrece endpoint policies para S3." },
      { text: "Una VPN Site-to-Site.", correct: false, explanation: "Incorrecto. La VPN conecta on-premises con la VPC; no es el mecanismo de acceso privado y controlado a S3." },
      { text: "Un Internet Gateway con una política de bucket.", correct: false, explanation: "Incorrecto. El IGW envía tráfico por Internet, incumpliendo el requisito de no atravesar Internet." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa quiere reducir el impacto de la falla de una sola instancia crítica distribuyendo instancias en hardware subyacente distinto dentro de la misma región. ¿Qué estrategia de placement usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html",
    options: [
      { text: "Spread placement group.", correct: true, explanation: "Correcto. El spread placement group coloca instancias en hardware distinto, reduciendo el riesgo de falla simultánea de instancias críticas." },
      { text: "Cluster placement group.", correct: false, explanation: "Incorrecto. El cluster placement group agrupa instancias cerca para baja latencia, aumentando la correlación de fallos, contrario al objetivo." },
      { text: "Todas las instancias en un solo host dedicado.", correct: false, explanation: "Incorrecto. Concentrarlas en un host crea un punto único de falla." },
      { text: "Instancias Spot en una sola AZ.", correct: false, explanation: "Incorrecto. Spot puede interrumpirse y una sola AZ no distribuye el hardware para aislar fallos." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa necesita entregar transmisiones de video en vivo y bajo demanda a una audiencia global con baja latencia. ¿Qué servicio de entrega usar como base?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/on-demand-streaming-video.html",
    options: [
      { text: "Amazon CloudFront.", correct: true, explanation: "Correcto. CloudFront distribuye contenido de video (en vivo y bajo demanda) desde edge locations globales con baja latencia y alto throughput." },
      { text: "Amazon S3 sin CDN.", correct: false, explanation: "Incorrecto. Servir video directo desde S3 sin CDN implica mayor latencia para audiencias lejanas." },
      { text: "Amazon RDS.", correct: false, explanation: "Incorrecto. RDS es una base de datos; no entrega streaming de video." },
      { text: "AWS Direct Connect.", correct: false, explanation: "Incorrecto. Direct Connect es conectividad privada on-premises, no distribución de video a audiencias globales." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa tiene una flota de EC2 con carga variable que combina una base estable y picos ocasionales. ¿Qué estrategia de compra combinada optimiza el costo?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-reservation-models/cost-optimization-reservation-models.html",
    options: [
      { text: "Cubrir la base con Savings Plans/Reserved y los picos con On-Demand o Spot.", correct: true, explanation: "Correcto. Combinar compromisos (Savings Plans/RI) para la carga base con On-Demand o Spot para los picos maximiza el ahorro sin sobrecomprometerse." },
      { text: "Comprar Reserved Instances para cubrir incluso el pico máximo.", correct: false, explanation: "Incorrecto. Reservar para el pico máximo desperdicia capacidad reservada la mayor parte del tiempo." },
      { text: "Usar solo On-Demand para toda la flota.", correct: false, explanation: "Incorrecto. On-Demand para la base estable es más caro que usar compromisos." },
      { text: "Usar solo Spot para toda la flota, incluida la base.", correct: false, explanation: "Incorrecto. Spot puede interrumpirse; la carga base estable no debería depender solo de Spot." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una aplicación web pública necesita autenticar usuarios y luego autorizar el acceso a una API. Además, se requiere MFA para cuentas privilegiadas de AWS. ¿Qué afirmaciones son correctas? (Selecciona 2)",
    multiple: true,
    doc: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html",
    options: [
      { text: "Habilitar MFA en las cuentas de IAM privilegiadas añade una capa adicional de seguridad.", correct: true, explanation: "Correcto. MFA exige un segundo factor además de la contraseña, reduciendo el riesgo ante credenciales comprometidas." },
      { text: "Amazon Cognito puede gestionar la autenticación y autorización de los usuarios finales de la aplicación.", correct: true, explanation: "Correcto. Cognito provee autenticación de usuarios y puede emitir tokens para autorizar el acceso a las APIs." },
      { text: "Se debe compartir la contraseña del usuario raíz con el equipo para agilizar el acceso.", correct: false, explanation: "Incorrecto. Nunca se debe compartir la contraseña de root; se recomienda protegerla con MFA y no usarla a diario." },
      { text: "Deshabilitar MFA simplifica y mejora la seguridad.", correct: false, explanation: "Incorrecto. Deshabilitar MFA reduce la seguridad." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa migra una base de datos comercial a AWS con cambios mínimos y necesita convertir el esquema desde un motor distinto al destino. ¿Qué combinación de servicios usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html",
    options: [
      { text: "AWS Database Migration Service (DMS) junto con Schema Conversion Tool (SCT).", correct: true, explanation: "Correcto. DMS migra los datos con mínima interrupción y SCT convierte el esquema entre motores heterogéneos." },
      { text: "Copiar archivos con la AWS CLI manualmente.", correct: false, explanation: "Incorrecto. Copiar archivos no migra ni convierte esquemas de bases de datos en línea." },
      { text: "Amazon Athena.", correct: false, explanation: "Incorrecto. Athena consulta S3; no migra bases de datos entre motores." },
      { text: "Amazon QuickSight.", correct: false, explanation: "Incorrecto. QuickSight es BI; no migra ni convierte bases de datos." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa necesita almacenar datos de series temporales de sensores IoT con altísima frecuencia de escritura y consultas por rangos de tiempo. ¿Qué servicio está optimizado para esto?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/timestream/latest/developerguide/what-is-timestream.html",
    options: [
      { text: "Amazon Timestream.", correct: true, explanation: "Correcto. Timestream es una base de datos de series temporales administrada, optimizada para ingestar y consultar datos con marca de tiempo a gran escala, como los de IoT." },
      { text: "Amazon RDS for SQL Server.", correct: false, explanation: "Incorrecto. Una relacional tradicional no está optimizada para la escala y consultas de series temporales como Timestream." },
      { text: "Amazon Redshift.", correct: false, explanation: "Incorrecto. Redshift es un data warehouse analítico, no una base de series temporales de ingesta continua." },
      { text: "Amazon Neptune.", correct: false, explanation: "Incorrecto. Neptune es una base de grafos, no de series temporales." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa quiere evaluar automáticamente las instancias EC2 y las imágenes de contenedores en busca de vulnerabilidades de software y exposición de red. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html",
    options: [
      { text: "Amazon Inspector.", correct: true, explanation: "Correcto. Inspector escanea automáticamente EC2 e imágenes de ECR en busca de vulnerabilidades conocidas (CVE) y problemas de exposición de red." },
      { text: "Amazon Macie.", correct: false, explanation: "Incorrecto. Macie clasifica datos sensibles en S3, no escanea vulnerabilidades de software." },
      { text: "AWS Config.", correct: false, explanation: "Incorrecto. Config evalúa cumplimiento de configuración, no vulnerabilidades de software." },
      { text: "AWS CloudTrail.", correct: false, explanation: "Incorrecto. CloudTrail audita llamadas a la API; no escanea vulnerabilidades." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una aplicación crítica necesita conmutación por error automática de una IP entre instancias en caso de falla, dentro de una arquitectura activa/pasiva en una VPC. ¿Qué recurso facilita esto?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html",
    options: [
      { text: "Reasignar una Elastic IP a la instancia sana mediante automatización.", correct: true, explanation: "Correcto. Una Elastic IP puede reasignarse programáticamente a la instancia sana, redirigiendo el tráfico en un esquema activo/pasivo." },
      { text: "Usar una IP privada fija sin ninguna automatización.", correct: false, explanation: "Incorrecto. Una IP privada sin mecanismo de reasignación no realiza failover automático." },
      { text: "Cambiar la región de la VPC manualmente en cada falla.", correct: false, explanation: "Incorrecto. Cambiar de región manualmente es lento y no es un failover automático." },
      { text: "Eliminar y recrear la VPC en cada incidente.", correct: false, explanation: "Incorrecto. Recrear la VPC es destructivo y no resuelve un failover rápido de IP." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa detecta que paga por muchas instancias EC2 con baja utilización. ¿Cuál es la acción de optimización de costos más adecuada?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-rightsizing.html",
    options: [
      { text: "Realizar right-sizing: reducir el tamaño o consolidar las instancias infrautilizadas.", correct: true, explanation: "Correcto. Ajustar el tamaño a la demanda real (right-sizing) elimina capacidad ociosa y reduce costos sin afectar el rendimiento requerido." },
      { text: "Aumentar el tamaño de todas las instancias.", correct: false, explanation: "Incorrecto. Aumentar el tamaño de instancias infrautilizadas incrementa el costo." },
      { text: "Comprar más instancias On-Demand.", correct: false, explanation: "Incorrecto. Añadir capacidad no resuelve la baja utilización existente." },
      { text: "Ignorar la utilización y mantener todo igual.", correct: false, explanation: "Incorrecto. No actuar perpetúa el gasto innecesario." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una tienda en línea necesita un motor de caché en memoria que soporte estructuras de datos avanzadas, persistencia opcional y réplicas para lectura. ¿Qué motor de ElastiCache elegir?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html",
    options: [
      { text: "ElastiCache for Redis.", correct: true, explanation: "Correcto. Redis soporta estructuras de datos avanzadas, replicación, persistencia opcional y alta disponibilidad, superando a Memcached en funcionalidad." },
      { text: "ElastiCache for Memcached.", correct: false, explanation: "Incorrecto. Memcached es más simple (solo clave-valor, sin persistencia ni réplicas); no cumple los requisitos avanzados descritos." },
      { text: "Amazon RDS.", correct: false, explanation: "Incorrecto. RDS es una base relacional en disco, no una caché en memoria." },
      { text: "Amazon DynamoDB.", correct: false, explanation: "Incorrecto. DynamoDB es NoSQL persistente; no es una caché en memoria con estructuras de datos de Redis." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa necesita que una aplicación on-premises se autentique con AWS usando credenciales temporales en lugar de claves de larga duración. ¿Qué servicio emite esas credenciales temporales?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html",
    options: [
      { text: "AWS Security Token Service (STS).", correct: true, explanation: "Correcto. STS emite credenciales temporales de acceso (por ejemplo al asumir un rol), evitando distribuir claves de larga duración." },
      { text: "AWS KMS.", correct: false, explanation: "Incorrecto. KMS gestiona claves de cifrado, no emite credenciales de acceso temporales." },
      { text: "Amazon Cognito Identity Pools solamente para servidores.", correct: false, explanation: "Incorrecto. Cognito se orienta a usuarios de aplicaciones; el mecanismo base de credenciales temporales al asumir roles es STS." },
      { text: "AWS Secrets Manager.", correct: false, explanation: "Incorrecto. Secrets Manager almacena secretos; no emite credenciales temporales de sesión de IAM." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa necesita mover automáticamente instancias a hardware sano y notificar eventos programados de mantenimiento o degradación del hardware. ¿Qué característica ayuda a la resiliencia operativa?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-instances-status-check.html",
    options: [
      { text: "EC2 status checks y eventos programados con recuperación automática (auto recovery).", correct: true, explanation: "Correcto. Los status checks detectan problemas de la instancia/hardware y la recuperación automática puede reiniciar la instancia en hardware sano, mejorando la resiliencia." },
      { text: "Deshabilitar el monitoreo para evitar reinicios.", correct: false, explanation: "Incorrecto. Deshabilitar el monitoreo impide detectar y reaccionar ante fallos." },
      { text: "Usar solo instancias Spot para tolerar fallos.", correct: false, explanation: "Incorrecto. Spot añade riesgo de interrupción; no es un mecanismo de recuperación ante fallo de hardware." },
      { text: "Ignorar los eventos programados de mantenimiento.", correct: false, explanation: "Incorrecto. Ignorar los eventos puede provocar interrupciones no planificadas." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa quiere crear cuadros de mando (dashboards) interactivos de business intelligence sobre sus datos en Redshift y S3 sin administrar servidores de BI. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/quicksight/latest/user/welcome.html",
    options: [
      { text: "Amazon QuickSight.", correct: true, explanation: "Correcto. QuickSight es un servicio de BI serverless para crear dashboards interactivos sobre múltiples fuentes como Redshift, S3 y RDS." },
      { text: "Amazon Athena.", correct: false, explanation: "Incorrecto. Athena ejecuta consultas SQL sobre S3, pero no es una herramienta de dashboards de BI." },
      { text: "Amazon EMR.", correct: false, explanation: "Incorrecto. EMR procesa big data; no crea dashboards de BI." },
      { text: "AWS Glue.", correct: false, explanation: "Incorrecto. Glue es ETL; prepara datos pero no visualiza dashboards." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa transfiere grandes volúmenes de datos SALIENTES desde AWS hacia Internet y busca reducir esos costos de egreso. ¿Qué acción ayuda a reducir el costo de transferencia de datos?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
    options: [
      { text: "Servir el contenido mediante Amazon CloudFront para aprovechar tarifas de transferencia más bajas y caché.", correct: true, explanation: "Correcto. Entregar contenido vía CloudFront reduce la transferencia de datos saliente desde el origen y suele tener tarifas de egreso más favorables, además de mejorar el rendimiento." },
      { text: "Transferir todo directamente desde EC2 a Internet sin CDN.", correct: false, explanation: "Incorrecto. El egreso directo desde EC2/S3 sin CDN suele ser más caro y no aprovecha caché." },
      { text: "Aumentar el tamaño de las instancias EC2.", correct: false, explanation: "Incorrecto. El tamaño de la instancia no reduce el costo de transferencia de datos saliente." },
      { text: "Habilitar el versionado de S3.", correct: false, explanation: "Incorrecto. El versionado no afecta el costo de egreso de datos." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa necesita que ciertos datos en DynamoDB se cifren en reposo cumpliendo con normas internas, sin cambios en la aplicación. ¿Qué afirmación es correcta?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EncryptionAtRest.html",
    options: [
      { text: "DynamoDB cifra los datos en reposo por defecto usando AWS KMS, y se puede elegir una clave administrada por el cliente.", correct: true, explanation: "Correcto. DynamoDB aplica cifrado en reposo por defecto con KMS; se puede optar por una customer managed key para mayor control, sin cambios en la aplicación." },
      { text: "DynamoDB no admite cifrado en reposo.", correct: false, explanation: "Incorrecto. DynamoDB cifra en reposo de forma predeterminada." },
      { text: "Se requiere reescribir la aplicación para cifrar cada elemento manualmente.", correct: false, explanation: "Incorrecto. El cifrado en reposo es transparente; no requiere cambios en la aplicación." },
      { text: "El cifrado solo es posible exportando a S3.", correct: false, explanation: "Incorrecto. DynamoDB cifra los datos en su propio almacenamiento sin necesidad de exportarlos." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa necesita exponer un servicio alojado en su VPC a otras VPCs de clientes de forma privada, sin exponerlo a Internet ni usar peering. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html",
    options: [
      { text: "AWS PrivateLink con un VPC endpoint service.", correct: true, explanation: "Correcto. PrivateLink permite exponer un servicio de forma privada a otras VPCs mediante interface endpoints, sin exposición a Internet ni peering." },
      { text: "Un Internet Gateway público.", correct: false, explanation: "Incorrecto. El IGW expondría el servicio a Internet, contrario al requisito." },
      { text: "VPC Peering con cada cliente.", correct: false, explanation: "Incorrecto. El peering conecta redes completas y no escala tan bien como PrivateLink para exponer un solo servicio a muchos consumidores." },
      { text: "Un NAT Gateway.", correct: false, explanation: "Incorrecto. El NAT Gateway es para salida a Internet, no para exponer un servicio de forma privada a otras VPCs." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación necesita procesar de forma escalable trabajos por lotes que se envían a colas, aprovisionando y escalando automáticamente el cómputo (EC2/Fargate) según la cantidad de trabajos. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html",
    options: [
      { text: "AWS Batch.", correct: true, explanation: "Correcto. AWS Batch gestiona colas de trabajos por lotes y aprovisiona/escala automáticamente el cómputo (EC2 o Fargate) según la carga." },
      { text: "Amazon API Gateway.", correct: false, explanation: "Incorrecto. API Gateway gestiona APIs, no orquesta trabajos por lotes con escalado de cómputo." },
      { text: "Amazon Route 53.", correct: false, explanation: "Incorrecto. Route 53 es DNS; no ejecuta trabajos por lotes." },
      { text: "Amazon CloudFront.", correct: false, explanation: "Incorrecto. CloudFront es una CDN; no procesa trabajos por lotes." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa ejecuta un sitio web sencillo y una pequeña base de datos, y quiere un precio mensual predecible con lo mínimo para administrar. ¿Qué servicio simplifica esto a bajo costo?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/lightsail/latest/userguide/what-is-amazon-lightsail.html",
    options: [
      { text: "Amazon Lightsail.", correct: true, explanation: "Correcto. Lightsail ofrece instancias, bases de datos y balanceadores con precios mensuales predecibles y configuración simplificada, ideal para cargas pequeñas." },
      { text: "Un clúster de Amazon EKS.", correct: false, explanation: "Incorrecto. EKS añade complejidad y costo innecesarios para un sitio sencillo." },
      { text: "Amazon Redshift.", correct: false, explanation: "Incorrecto. Redshift es un data warehouse costoso; sobredimensionado para un sitio sencillo." },
      { text: "AWS Outposts.", correct: false, explanation: "Incorrecto. Outposts lleva infraestructura de AWS on-premises; es costoso y para casos muy específicos." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa quiere reaccionar automáticamente a eventos de AWS (por ejemplo, cambios de estado de EC2 o programaciones) y enrutarlos a múltiples destinos como Lambda o SQS. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html",
    options: [
      { text: "Amazon EventBridge.", correct: true, explanation: "Correcto. EventBridge es un bus de eventos serverless que enruta eventos (de AWS, SaaS o propios) a destinos como Lambda, SQS o Step Functions según reglas." },
      { text: "Amazon RDS.", correct: false, explanation: "Incorrecto. RDS es una base de datos; no enruta eventos." },
      { text: "AWS Direct Connect.", correct: false, explanation: "Incorrecto. Direct Connect es conectividad de red; no gestiona eventos." },
      { text: "Amazon S3 Select.", correct: false, explanation: "Incorrecto. S3 Select filtra contenido de objetos; no enruta eventos." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa necesita que dos instancias EC2 en la misma AZ compartan un mismo volumen de bloques para un clúster de alta disponibilidad. ¿Qué característica de EBS lo permite?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes-multi.html",
    options: [
      { text: "EBS Multi-Attach en volúmenes io1/io2.", correct: true, explanation: "Correcto. Multi-Attach permite adjuntar un volumen io1/io2 a varias instancias en la misma AZ, útil para aplicaciones de clúster que gestionan el acceso concurrente." },
      { text: "Adjuntar un volumen gp2 a dos instancias sin más.", correct: false, explanation: "Incorrecto. Los volúmenes gp2 no soportan Multi-Attach; un volumen estándar se adjunta a una sola instancia." },
      { text: "Usar instance store compartido.", correct: false, explanation: "Incorrecto. El instance store es local y efímero de cada instancia; no se comparte." },
      { text: "Montar S3 como volumen de bloques.", correct: false, explanation: "Incorrecto. S3 es almacenamiento de objetos, no de bloques compartidos." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa quiere controlar el tráfico entrante y saliente a nivel de subred de forma sin estado (stateless), como capa adicional a los security groups. ¿Qué recurso usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html",
    options: [
      { text: "Network ACLs (NACL) en la subred.", correct: true, explanation: "Correcto. Las NACL operan a nivel de subred, son sin estado (stateless) y actúan como una capa de defensa adicional a los security groups." },
      { text: "Security groups adicionales.", correct: false, explanation: "Incorrecto. Los security groups son con estado (stateful) y operan a nivel de instancia; la capa stateless a nivel de subred son las NACL." },
      { text: "AWS WAF.", correct: false, explanation: "Incorrecto. WAF filtra tráfico HTTP de aplicaciones, no controla tráfico a nivel de subred." },
      { text: "Route tables.", correct: false, explanation: "Incorrecto. Las tablas de rutas determinan el enrutamiento, no filtran tráfico permitido/denegado." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa necesita ejecutar servicios de AWS con baja latencia dentro de su propio centro de datos por requisitos de residencia de datos y latencia local. ¿Qué solución usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/outposts/latest/userguide/what-is-outposts.html",
    options: [
      { text: "AWS Outposts.", correct: true, explanation: "Correcto. Outposts lleva infraestructura y servicios de AWS al centro de datos del cliente para cargas que requieren baja latencia local o residencia de datos on-premises." },
      { text: "Una región de AWS lejana.", correct: false, explanation: "Incorrecto. Una región lejana no cumple los requisitos de latencia local ni residencia on-premises." },
      { text: "Amazon CloudFront.", correct: false, explanation: "Incorrecto. CloudFront cachea contenido en el edge, no ejecuta servicios dentro del centro de datos del cliente." },
      { text: "AWS Lambda en la nube pública.", correct: false, explanation: "Incorrecto. Lambda en la nube pública no cumple la residencia de datos on-premises requerida." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación serverless necesita que una función Lambda escale para atender miles de solicitudes concurrentes con arranques predecibles y baja latencia en horas pico. ¿Qué característica ayuda?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html",
    options: [
      { text: "Provisioned Concurrency para mantener instancias inicializadas y evitar cold starts.", correct: true, explanation: "Correcto. Provisioned Concurrency mantiene un número de entornos de ejecución preinicializados, eliminando los cold starts y dando latencia predecible en picos." },
      { text: "Reducir la memoria de la función al mínimo.", correct: false, explanation: "Incorrecto. Menos memoria puede reducir el rendimiento y no soluciona los cold starts." },
      { text: "Migrar la función a una única instancia EC2.", correct: false, explanation: "Incorrecto. Una sola instancia no escala a miles de concurrencias como Lambda." },
      { text: "Deshabilitar el escalado automático de Lambda.", correct: false, explanation: "Incorrecto. Lambda escala automáticamente; deshabilitarlo no es una opción y perjudicaría la concurrencia." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa quiere que los datos archivados con acceso muy esporádico tengan el menor costo de almacenamiento posible y tolera una recuperación de hasta 12 horas. ¿Qué clase de S3 usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
    options: [
      { text: "S3 Glacier Deep Archive.", correct: true, explanation: "Correcto. Deep Archive es la clase de menor costo de S3 para archivado a largo plazo, con tiempos de recuperación estándar de hasta 12 horas." },
      { text: "S3 Standard.", correct: false, explanation: "Incorrecto. Standard es de los más caros y está pensado para acceso frecuente." },
      { text: "S3 Standard-IA.", correct: false, explanation: "Incorrecto. Standard-IA es para acceso poco frecuente pero inmediato; cuesta más que Deep Archive." },
      { text: "S3 Intelligent-Tiering nivel frecuente.", correct: false, explanation: "Incorrecto. El nivel frecuente de Intelligent-Tiering equivale a Standard en costo; no es el más barato para archivado profundo." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa quiere garantizar que las políticas de IAM y las de recursos se combinen correctamente para permitir el acceso solo cuando ambas lo autoricen. ¿Qué afirmación sobre la evaluación de permisos es correcta?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
    options: [
      { text: "Un Deny explícito siempre prevalece, y el acceso se concede solo si existe un Allow y ningún Deny aplicable.", correct: true, explanation: "Correcto. En la lógica de evaluación de IAM, cualquier Deny explícito tiene prioridad; sin un Allow aplicable, la solicitud se deniega por defecto (deny implícito)." },
      { text: "Un Allow explícito anula cualquier Deny explícito.", correct: false, explanation: "Incorrecto. El Deny explícito siempre gana sobre el Allow." },
      { text: "Si no hay ninguna política, el acceso se permite por defecto.", correct: false, explanation: "Incorrecto. Por defecto todo está denegado (implicit deny) si no hay un Allow." },
      { text: "Las políticas de recurso se ignoran si existe una política de IAM.", correct: false, explanation: "Incorrecto. Ambas se evalúan en conjunto; no se ignora la política de recurso." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa necesita almacenar mensajes que deben procesarse en un orden estricto, evitando duplicados, con un rendimiento moderado. ¿Qué configuración de SQS FIFO respalda esto?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html",
    options: [
      { text: "Cola FIFO con Message Group ID y deduplicación habilitada.", correct: true, explanation: "Correcto. En colas FIFO, el Message Group ID preserva el orden por grupo y la deduplicación (content-based o Deduplication ID) evita duplicados." },
      { text: "Cola Standard con orden garantizado.", correct: false, explanation: "Incorrecto. La cola Standard no garantiza el orden estricto ni evita duplicados de forma nativa." },
      { text: "Amazon SNS con orden global.", correct: false, explanation: "Incorrecto. SNS estándar no garantiza orden; solo los FIFO topics con FIFO queues lo hacen, pero el mecanismo de orden/dedupe es propio de FIFO." },
      { text: "Kinesis Firehose con orden por partición.", correct: false, explanation: "Incorrecto. Firehose entrega a destinos de almacenamiento; no es una cola de trabajo con dedupe como SQS FIFO." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa necesita catalogar y transformar datos de múltiples fuentes de forma serverless antes de analizarlos con Athena o Redshift. ¿Qué servicio de ETL usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html",
    options: [
      { text: "AWS Glue.", correct: true, explanation: "Correcto. Glue es un servicio ETL serverless con un Data Catalog que descubre, cataloga y transforma datos para su análisis con Athena, Redshift, etc." },
      { text: "Amazon QuickSight.", correct: false, explanation: "Incorrecto. QuickSight visualiza datos; no realiza ETL ni catálogo." },
      { text: "Amazon Route 53.", correct: false, explanation: "Incorrecto. Route 53 es DNS; no hace ETL." },
      { text: "Amazon SNS.", correct: false, explanation: "Incorrecto. SNS es mensajería pub/sub; no cataloga ni transforma datos." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa observa altos costos de datos entre AZ por tráfico entre servicios. ¿Qué recomendación reduce este costo sin sacrificar disponibilidad de forma inaceptable?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-laying-the-foundation/aws-data-transfer-costs.html",
    options: [
      { text: "Mantener el tráfico intensivo entre componentes dentro de la misma AZ cuando sea posible, conservando redundancia multi-AZ para la resiliencia.", correct: true, explanation: "Correcto. El tráfico entre AZ tiene costo; ubicar componentes de comunicación intensiva en la misma AZ reduce el egreso entre zonas, manteniendo aún redundancia multi-AZ donde importa." },
      { text: "Enviar todo el tráfico interno por Internet pública.", correct: false, explanation: "Incorrecto. El tráfico por Internet suele ser más caro e inseguro; no optimiza el costo entre AZ." },
      { text: "Colocar todos los recursos en una sola AZ sin ninguna redundancia.", correct: false, explanation: "Incorrecto. Eliminar toda la redundancia sacrifica la disponibilidad de forma inaceptable." },
      { text: "Aumentar el tamaño de las instancias para reducir el tráfico.", correct: false, explanation: "Incorrecto. El tamaño de la instancia no reduce el costo del tráfico entre AZ." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa quiere gestionar de forma centralizada las reglas de firewall de aplicación web (WAF) y proteger recursos en varias cuentas de la organización. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/waf/latest/developerguide/fms-chapter.html",
    options: [
      { text: "AWS Firewall Manager.", correct: true, explanation: "Correcto. Firewall Manager administra de forma centralizada reglas de AWS WAF, Shield Advanced y grupos de seguridad en todas las cuentas de una organización." },
      { text: "AWS Config.", correct: false, explanation: "Incorrecto. Config evalúa cumplimiento; no administra reglas de WAF centralmente." },
      { text: "Amazon Inspector.", correct: false, explanation: "Incorrecto. Inspector escanea vulnerabilidades; no gestiona reglas de firewall." },
      { text: "AWS CloudTrail.", correct: false, explanation: "Incorrecto. CloudTrail audita la API; no administra políticas de WAF." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa quiere que su aplicación tolere el fallo de una región completa, con datos y cómputo listos para asumir la carga con mínima intervención. ¿Qué enfoque es adecuado si busca equilibrio costo/RTO?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
    options: [
      { text: "Warm standby: una versión reducida pero funcional siempre corriendo en otra región, escalable ante failover.", correct: true, explanation: "Correcto. Warm standby mantiene una copia reducida y activa en otra región que puede escalar rápidamente ante un desastre, equilibrando costo y RTO." },
      { text: "Backup and restore como única estrategia para una app crítica multi-región.", correct: false, explanation: "Parcialmente válido para tolerar la pérdida, pero su RTO alto no encaja con 'mínima intervención' ni con una asunción rápida de carga." },
      { text: "Concentrar todo en una sola región.", correct: false, explanation: "Incorrecto. Una sola región no tolera el fallo regional completo." },
      { text: "No tener plan de DR para ahorrar costos.", correct: false, explanation: "Incorrecto. Carecer de DR expone la aplicación crítica a interrupciones prolongadas." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación de análisis necesita leer solo un subconjunto de columnas de archivos grandes en S3 para reducir datos escaneados y mejorar rendimiento/costo de consultas. ¿Qué formato/técnica ayuda?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/athena/latest/ug/columnar-storage.html",
    options: [
      { text: "Almacenar los datos en formato columnar comprimido como Parquet u ORC.", correct: true, explanation: "Correcto. Los formatos columnares (Parquet/ORC) permiten leer solo las columnas necesarias y comprimen mejor, reduciendo los datos escaneados por Athena/Redshift Spectrum y el costo." },
      { text: "Guardar todo en archivos de texto plano sin comprimir.", correct: false, explanation: "Incorrecto. El texto plano obliga a escanear todo el archivo, aumentando datos leídos y costo." },
      { text: "Convertir los datos a imágenes.", correct: false, explanation: "Incorrecto. No tiene sentido para consultas analíticas SQL." },
      { text: "Un único archivo enorme sin particionar.", correct: false, explanation: "Incorrecto. La falta de particionamiento y de formato columnar aumenta el escaneo; particionar y usar columnar es la mejor práctica." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa quiere reducir el costo de un gran número de solicitudes pequeñas a DynamoDB que consultan los mismos datos repetidamente. ¿Qué enfoque reduce costo y latencia?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html",
    options: [
      { text: "Añadir DynamoDB Accelerator (DAX) para cachear lecturas repetidas.", correct: true, explanation: "Correcto. DAX cachea las lecturas frecuentes, reduciendo las unidades de lectura consumidas en DynamoDB (menor costo) y la latencia." },
      { text: "Aumentar indefinidamente la capacidad de lectura aprovisionada.", correct: false, explanation: "Incorrecto. Aumentar capacidad eleva el costo sin resolver la repetición de lecturas idénticas." },
      { text: "Migrar a Redshift.", correct: false, explanation: "Incorrecto. Redshift es analítico; no encaja con lecturas transaccionales por clave de DynamoDB." },
      { text: "Convertir cada lectura en un scan de la tabla.", correct: false, explanation: "Incorrecto. Los scans son costosos e ineficientes frente a lecturas por clave o al cacheo con DAX." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa necesita que las credenciales de acceso a una API de terceros usadas por varias aplicaciones se almacenen cifradas, con auditoría de acceso y rotación programada. ¿Qué servicio elegir?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html",
    options: [
      { text: "AWS Secrets Manager con rotación automática programada.", correct: true, explanation: "Correcto. Secrets Manager cifra los secretos con KMS, permite rotación automática (incluida rotación personalizada con Lambda) y registra el acceso vía CloudTrail." },
      { text: "Un archivo compartido en S3 con acceso público de lectura.", correct: false, explanation: "Incorrecto. El acceso público expondría el secreto; es una grave falla de seguridad." },
      { text: "Variables de entorno en texto plano.", correct: false, explanation: "Incorrecto. El texto plano no cifra el secreto ni ofrece rotación ni auditoría." },
      { text: "Amazon CloudWatch Logs.", correct: false, explanation: "Incorrecto. CloudWatch Logs es para registros; almacenar secretos allí es inseguro." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa necesita que las cargas de un Auto Scaling Group aumenten anticipadamente antes de picos conocidos (por ejemplo, campañas a horas fijas). ¿Qué tipo de escalado configurar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scaling-plan.html",
    options: [
      { text: "Scheduled scaling (escalado programado) para los horarios conocidos.", correct: true, explanation: "Correcto. El scheduled scaling ajusta la capacidad en horarios predefinidos, anticipándose a picos conocidos como campañas planificadas." },
      { text: "Solo escalado dinámico reactivo por CPU.", correct: false, explanation: "Parcialmente útil, pero el escalado reactivo actúa tras detectar la carga; para picos conocidos con antelación conviene el escalado programado (o predictivo)." },
      { text: "No usar Auto Scaling y sobredimensionar siempre.", correct: false, explanation: "Incorrecto. Sobredimensionar de forma permanente desperdicia costo fuera de los picos." },
      { text: "Apagar el ASG durante los picos.", correct: false, explanation: "Incorrecto. Apagar el grupo durante los picos causaría indisponibilidad." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación de gran escala necesita un almacén clave-valor y de documentos totalmente administrado con backups continuos y recuperación a un punto en el tiempo. ¿Qué característica de DynamoDB cubre la recuperación puntual?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html",
    options: [
      { text: "Point-in-Time Recovery (PITR) de DynamoDB.", correct: true, explanation: "Correcto. PITR realiza backups continuos y permite restaurar la tabla a cualquier segundo dentro de los últimos 35 días." },
      { text: "S3 Versioning.", correct: false, explanation: "Incorrecto. El versionado aplica a objetos de S3, no a tablas de DynamoDB." },
      { text: "RDS Automated Backups.", correct: false, explanation: "Incorrecto. Esa característica es de RDS, no de DynamoDB." },
      { text: "EBS Snapshots.", correct: false, explanation: "Incorrecto. Los snapshots de EBS aplican a volúmenes de bloques, no a DynamoDB." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa necesita analizar en detalle qué servicios, etiquetas y cuentas generan el mayor gasto para tomar decisiones de optimización. ¿Qué práctica y herramienta facilitan este análisis?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html",
    options: [
      { text: "Aplicar cost allocation tags y analizarlas en Cost Explorer.", correct: true, explanation: "Correcto. Etiquetar recursos con cost allocation tags permite desglosar y analizar el gasto por proyecto, equipo o servicio en Cost Explorer para optimizar." },
      { text: "No etiquetar recursos y revisar solo la factura total.", correct: false, explanation: "Incorrecto. Sin etiquetas ni desglose es difícil identificar dónde optimizar." },
      { text: "Usar Amazon Inspector para analizar costos.", correct: false, explanation: "Incorrecto. Inspector evalúa vulnerabilidades, no costos." },
      { text: "Eliminar recursos al azar para reducir gasto.", correct: false, explanation: "Incorrecto. Eliminar sin análisis puede afectar servicios en producción." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa quiere que solo CloudFront pueda acceder a los objetos de un bucket de S3 privado que sirve como origen, impidiendo el acceso directo al bucket. ¿Qué mecanismo usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html",
    options: [
      { text: "Origin Access Control (OAC) de CloudFront con una política de bucket que solo permita a CloudFront.", correct: true, explanation: "Correcto. OAC permite que solo la distribución de CloudFront acceda al bucket privado; la política de bucket bloquea el acceso directo de los usuarios a S3." },
      { text: "Hacer el bucket completamente público.", correct: false, explanation: "Incorrecto. Un bucket público permite el acceso directo, contrario al requisito." },
      { text: "Compartir las access keys de un usuario en CloudFront.", correct: false, explanation: "Incorrecto. No es el mecanismo; OAC/OAI es la forma recomendada y no requiere claves." },
      { text: "Usar un NAT Gateway entre CloudFront y S3.", correct: false, explanation: "Incorrecto. El NAT Gateway no controla el acceso de CloudFront a S3 ni impide el acceso directo al bucket." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa quiere separar los entornos y limitar el radio de impacto de fallos y errores humanos entre producción y desarrollo. ¿Cuál es una buena práctica arquitectónica?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html",
    options: [
      { text: "Usar cuentas de AWS separadas por entorno dentro de AWS Organizations.", correct: true, explanation: "Correcto. Separar producción y desarrollo en cuentas distintas limita el radio de impacto, mejora la seguridad y facilita la gobernanza con Organizations." },
      { text: "Ejecutar todo en una sola cuenta y región sin separación.", correct: false, explanation: "Incorrecto. Mezclar entornos aumenta el riesgo de que un error afecte producción." },
      { text: "Compartir las mismas credenciales entre entornos.", correct: false, explanation: "Incorrecto. Compartir credenciales entre entornos es inseguro y difumina el aislamiento." },
      { text: "Desactivar los controles de acceso en desarrollo.", correct: false, explanation: "Incorrecto. Desactivar controles crea brechas de seguridad." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una aplicación necesita enviar notificaciones push a dispositivos móviles, SMS y correos electrónicos a millones de suscriptores desde un único servicio. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/sns/latest/dg/welcome.html",
    options: [
      { text: "Amazon SNS.", correct: true, explanation: "Correcto. SNS entrega notificaciones a gran escala a múltiples tipos de suscriptores: push móvil, SMS, correo, colas SQS y funciones Lambda." },
      { text: "Amazon SQS.", correct: false, explanation: "Incorrecto. SQS es una cola punto a punto; no envía push/SMS/email a suscriptores directamente." },
      { text: "Amazon Kinesis.", correct: false, explanation: "Incorrecto. Kinesis es para streaming de datos, no notificaciones multicanal." },
      { text: "AWS Lambda por sí sola.", correct: false, explanation: "Incorrecto. Lambda ejecuta código, pero no es el servicio de entrega multicanal masiva; SNS lo es." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa necesita conectar de forma segura su red on-premises con AWS de forma rápida y económica sobre Internet, con cifrado IPsec. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html",
    options: [
      { text: "AWS Site-to-Site VPN.", correct: true, explanation: "Correcto. La Site-to-Site VPN establece túneles IPsec cifrados sobre Internet entre la red on-premises y la VPC, de forma rápida y económica." },
      { text: "AWS Direct Connect exclusivamente.", correct: false, explanation: "Parcialmente válido, pero Direct Connect requiere aprovisionar un enlace dedicado (más tiempo y costo); para una conexión rápida y económica cifrada, la VPN es la respuesta." },
      { text: "VPC Peering.", correct: false, explanation: "Incorrecto. El peering conecta VPCs entre sí, no una red on-premises." },
      { text: "Un Internet Gateway.", correct: false, explanation: "Incorrecto. El IGW da salida a Internet; no crea un túnel cifrado a on-premises." }
    ]
  },
  {
    domain: "Dominio 4 · Optimización de costos",
    text: "Una empresa quiere garantizar la disponibilidad de capacidad Spot para cargas flexibles combinando varios tipos de instancia y AZ para reducir interrupciones. ¿Qué característica usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet.html",
    options: [
      { text: "Un EC2 Fleet / Spot Fleet con diversificación entre múltiples tipos de instancia y AZ.", correct: true, explanation: "Correcto. Diversificar entre tipos de instancia y AZ en un Spot Fleet aumenta la probabilidad de mantener la capacidad y reduce el impacto de interrupciones Spot." },
      { text: "Un solo tipo de instancia Spot en una sola AZ.", correct: false, explanation: "Incorrecto. Concentrarse en un tipo y AZ aumenta el riesgo de interrupción por falta de capacidad." },
      { text: "Reserved Instances para cargas flexibles interrumpibles.", correct: false, explanation: "Incorrecto. Las RI convienen para uso estable; para cargas flexibles y menor costo se usa Spot diversificado." },
      { text: "On-Demand para todo, ignorando Spot.", correct: false, explanation: "Incorrecto. On-Demand es más caro; el requisito busca aprovechar Spot minimizando interrupciones." }
    ]
  },
  {
    domain: "Dominio 2 · Arquitecturas resilientes",
    text: "Una empresa necesita un sistema de archivos totalmente administrado compatible con Windows y el protocolo SMB para aplicaciones .NET. ¿Qué servicio usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html",
    options: [
      { text: "Amazon FSx for Windows File Server.", correct: true, explanation: "Correcto. FSx for Windows File Server ofrece un sistema de archivos SMB totalmente administrado, compatible con Windows y con integración a Active Directory." },
      { text: "Amazon EFS.", correct: false, explanation: "Incorrecto. EFS usa NFS, orientado a Linux; para SMB/Windows nativo se usa FSx for Windows." },
      { text: "Amazon S3.", correct: false, explanation: "Incorrecto. S3 es almacenamiento de objetos, no un file server SMB." },
      { text: "Un volumen EBS compartido por SMB.", correct: false, explanation: "Incorrecto. EBS es almacenamiento de bloques para una instancia; no es un servicio de archivos SMB administrado." }
    ]
  },
  {
    domain: "Dominio 3 · Alto rendimiento",
    text: "Una empresa necesita reducir la latencia de una base de datos relacional que enfrenta muchas conexiones simultáneas de funciones Lambda, evitando agotar las conexiones. ¿Qué solución usar?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html",
    options: [
      { text: "Amazon RDS Proxy para agrupar y reutilizar conexiones (connection pooling).", correct: true, explanation: "Correcto. RDS Proxy multiplexa y reutiliza conexiones, evitando el agotamiento de conexiones ante muchas Lambdas concurrentes y mejorando la resiliencia." },
      { text: "Abrir una nueva conexión directa por cada invocación de Lambda.", correct: false, explanation: "Incorrecto. Abrir muchas conexiones directas agota rápidamente el límite de conexiones de la base de datos." },
      { text: "Migrar a S3.", correct: false, explanation: "Incorrecto. S3 es almacenamiento de objetos; no reemplaza una base relacional con conexiones." },
      { text: "Aumentar el timeout de la aplicación.", correct: false, explanation: "Incorrecto. Un timeout mayor no resuelve el agotamiento de conexiones concurrentes." }
    ]
  },
  {
    domain: "Dominio 1 · Arquitecturas seguras",
    text: "Una empresa requiere que los datos en tránsito entre el cliente y la aplicación estén siempre cifrados. ¿Qué medida asegura el cifrado en tránsito?",
    multiple: false,
    doc: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html",
    options: [
      { text: "Terminar TLS/HTTPS en el balanceador con un certificado de ACM y forzar HTTPS.", correct: true, explanation: "Correcto. Usar listeners HTTPS con certificados de ACM cifra el tráfico en tránsito; redirigir HTTP a HTTPS garantiza que todo el tráfico use TLS." },
      { text: "Servir la aplicación solo por HTTP en el puerto 80.", correct: false, explanation: "Incorrecto. HTTP no cifra el tráfico en tránsito." },
      { text: "Cifrar solo los datos en reposo.", correct: false, explanation: "Incorrecto. El cifrado en reposo no protege los datos mientras viajan por la red." },
      { text: "Deshabilitar TLS para mejorar el rendimiento.", correct: false, explanation: "Incorrecto. Deshabilitar TLS elimina el cifrado en tránsito, exponiendo los datos." }
    ]
  }
];
