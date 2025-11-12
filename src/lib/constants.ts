// Constants for Motiva App
import { CategoryInfo, Quote } from './types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'foco',
    name: { pt: 'Foco', es: 'Enfoque' },
    icon: 'Target',
    color: '#5B4BFF'
  },
  {
    id: 'disciplina',
    name: { pt: 'Disciplina', es: 'Disciplina' },
    icon: 'Zap',
    color: '#FF6B6B'
  },
  {
    id: 'autoestima',
    name: { pt: 'Autoestima', es: 'Autoestima' },
    icon: 'Heart',
    color: '#FF8C42'
  },
  {
    id: 'sucesso',
    name: { pt: 'Sucesso', es: 'Éxito' },
    icon: 'TrendingUp',
    color: '#4ECDC4'
  },
  {
    id: 'fitness',
    name: { pt: 'Fitness', es: 'Fitness' },
    icon: 'Dumbbell',
    color: '#95E1D3'
  },
  {
    id: 'calma',
    name: { pt: 'Calma', es: 'Calma' },
    icon: 'Sparkles',
    color: '#A8E6CF'
  }
];

// Parse CSV quotes data
const quotesCSV = `pt,Foco,Começa pequeno hoje; amanhã agradecerás a consistência que construíste.,false
pt,Foco,Dez minutos focado vale mais que duas horas distraído.,false
pt,Foco,Desliga as notificações e dá-te uma hora de atenção plena.,false
pt,Foco,Cada vez que voltas ao foco, treinas o teu cérebro.,false
pt,Foco,Foco não é fazer tudo; é fazer o que importa agora.,false
pt,Foco,Escolhe uma tarefa e termina-a antes de começar outra.,false
pt,Foco,O teu telemóvel pode esperar; o teu objetivo não.,false
pt,Foco,Concentração é um músculo: quanto mais usas, mais forte fica.,false
pt,Foco,Faz uma lista curta e risca tudo antes do almoço.,false
pt,Foco,Quando dispersares, respira fundo e volta ao essencial.,false
pt,Foco,Trabalha em blocos de vinte minutos com pausas de cinco.,false
pt,Foco,O multitasking é um mito; foca-te numa coisa de cada vez.,false
pt,Foco,Guarda a manhã para o que exige mais concentração.,false
pt,Foco,Menos distrações hoje significa mais resultados amanhã.,false
pt,Foco,Pergunta-te: isto aproxima-me do meu objetivo ou afasta-me?,false
pt,Foco,Foco é dizer não a mil coisas boas para dizer sim à melhor.,false
pt,Foco,Cada minuto focado é um investimento no teu futuro.,false
pt,Foco,Cria um ritual antes de trabalhar: café, música, foco.,false
pt,Foco,Quando tudo parece urgente, escolhe o que é importante.,false
pt,Foco,O foco não aparece; tu crias as condições para ele.,false
pt,Disciplina,Disciplina é fazer mesmo sem vontade; começa por dois minutos.,false
pt,Disciplina,A motivação começa; a disciplina termina o trabalho.,false
pt,Disciplina,Faz hoje o que o teu eu futuro agradecerá.,false
pt,Disciplina,Pequenos hábitos diários constroem grandes transformações.,false
pt,Disciplina,Não esperes pela vontade perfeita; age agora.,false
pt,Disciplina,Disciplina é liberdade: quanto mais tens, mais escolhes.,false
pt,Disciplina,Começa antes de te sentires pronto; a ação cria impulso.,false
pt,Disciplina,Faz o mínimo nos dias difíceis; mantém a sequência viva.,false
pt,Disciplina,A consistência vence o talento quando o talento não é consistente.,false
pt,Disciplina,Cada dia que cumpres, reforças a confiança em ti.,false
pt,Disciplina,Disciplina não é punição; é o caminho para o que queres.,false
pt,Disciplina,Faz o que prometeste a ti mesmo, mesmo que ninguém veja.,false
pt,Disciplina,Os teus hábitos de hoje desenham a tua vida de amanhã.,false
pt,Disciplina,Não negocies contigo nos dias difíceis; aparece sempre.,false
pt,Disciplina,A disciplina começa com uma decisão e repete-se com ação.,false
pt,Disciplina,Faz o básico bem feito todos os dias; os resultados virão.,false
pt,Disciplina,Quando não tens vontade, lembra-te porque começaste.,false
pt,Disciplina,A disciplina é silenciosa mas os resultados são ruidosos.,false
pt,Disciplina,Cada pequena vitória diária alimenta a tua disciplina.,false
pt,Disciplina,Compromete-te com o processo e os resultados seguem-te.,false
pt,Autoestima,Trata-te como tratarias o teu melhor amigo.,false
pt,Autoestima,O teu valor não depende da opinião de ninguém.,false
pt,Autoestima,Celebra as pequenas vitórias; elas constroem confiança.,false
pt,Autoestima,És suficiente exatamente como és neste momento.,false
pt,Autoestima,Fala contigo com a mesma gentileza que mereces.,false
pt,Autoestima,Os teus erros não te definem; definem-te as tuas tentativas.,false
pt,Autoestima,Respeita os teus limites; não são fraqueza, são sabedoria.,false
pt,Autoestima,Cada dia que cuidas de ti é um ato de amor próprio.,false
pt,Autoestima,Não te compares com ninguém; cada caminho é único.,false
pt,Autoestima,A tua voz interior merece ser gentil e encorajadora.,false
pt,Autoestima,Aceita os teus defeitos; eles fazem parte da tua história.,false
pt,Autoestima,Mereces descanso, alegria e tempo para ti.,false
pt,Autoestima,O teu progresso não precisa de ser perfeito para ser válido.,false
pt,Autoestima,Dá-te permissão para falhar e para recomeçar.,false
pt,Autoestima,A tua presença no mundo tem valor e propósito.,false
pt,Autoestima,Cuida do teu corpo e da tua mente com carinho.,false
pt,Autoestima,Não precisas de provar nada a ninguém; vive para ti.,false
pt,Autoestima,Os teus sentimentos são válidos e merecem ser ouvidos.,false
pt,Autoestima,Escolhe pessoas que te elevam e afasta-te de quem te diminui.,false
pt,Autoestima,A tua jornada é tua; não deixes ninguém escrever por ti.,false
pt,Sucesso,Sucesso é progredir um pouco todos os dias.,false
pt,Sucesso,Define o que é sucesso para ti, não para os outros.,false
pt,Sucesso,Cada pequeno passo conta; não desvalorizes o teu progresso.,false
pt,Sucesso,O sucesso começa quando sais da zona de conforto.,false
pt,Sucesso,Falhar faz parte do caminho; aprende e segue em frente.,false
pt,Sucesso,Celebra as vitórias pequenas; elas somam-se às grandes.,false
pt,Sucesso,O sucesso não é destino; é o caminho que percorres diariamente.,false
pt,Sucesso,Investe em ti; és o teu melhor projeto.,false
pt,Sucesso,Não esperes pelo momento perfeito; cria-o com ação.,false
pt,Sucesso,O sucesso é construído em privado e celebrado em público.,false
pt,Sucesso,Aprende com quem já chegou onde queres estar.,false
pt,Sucesso,Cada obstáculo superado torna-te mais forte e preparado.,false
pt,Sucesso,O sucesso exige paciência; as árvores não crescem num dia.,false
pt,Sucesso,Foca-te no que podes controlar e age sobre isso.,false
pt,Sucesso,O teu sucesso não diminui o de ninguém; há espaço para todos.,false
pt,Sucesso,Trabalha em silêncio e deixa os resultados falarem por ti.,false
pt,Sucesso,O sucesso é a soma de pequenas decisões certas repetidas.,false
pt,Sucesso,Não tenhas medo de pedir ajuda; ninguém vence sozinho.,false
pt,Sucesso,O sucesso começa quando decides não desistir.,false
pt,Sucesso,Cada dia é uma nova oportunidade para te aproximares dos teus sonhos.,false
pt,Fitness,Mexe o corpo hoje; a tua mente agradece.,false
pt,Fitness,Não precisa de ser perfeito; basta começar e ser consistente.,false
pt,Fitness,Dez minutos de movimento são melhores que zero.,false
pt,Fitness,O teu corpo é capaz de mais do que imaginas.,false
pt,Fitness,Cada treino é um investimento na tua saúde futura.,false
pt,Fitness,Não treinas para punir o corpo; treinas para celebrá-lo.,false
pt,Fitness,A energia que gastas no treino volta multiplicada.,false
pt,Fitness,Começa devagar e aumenta o ritmo com o tempo.,false
pt,Fitness,O exercício não é luxo; é necessidade para viver bem.,false
pt,Fitness,Sente-te orgulhoso por cada movimento que fazes hoje.,false
pt,Fitness,O cansaço passa; a satisfação de treinar fica.,false
pt,Fitness,Não compares o teu corpo com o de ninguém; respeita o teu ritmo.,false
pt,Fitness,Cada repetição aproxima-te da melhor versão de ti.,false
pt,Fitness,O treino mais difícil é o que mais te transforma.,false
pt,Fitness,Cuida do teu corpo; é o único lugar onde vives.,false
pt,Fitness,A dor temporária do treino vale a força permanente que ganhas.,false
pt,Fitness,Mexe-te hoje e sente a diferença no teu humor.,false
pt,Fitness,O teu corpo agradece cada escolha saudável que fazes.,false
pt,Fitness,Não desistas no dia difícil; faz o mínimo e mantém o hábito.,false
pt,Fitness,Fitness não é destino; é um estilo de vida que escolhes diariamente.,false
pt,Calma,Respira fundo três vezes; o momento passa.,false
pt,Calma,Não podes controlar tudo; foca-te no que está nas tuas mãos.,false
pt,Calma,A ansiedade mente; tu és mais forte do que pensas.,false
pt,Calma,Dá-te permissão para parar e simplesmente respirar.,false
pt,Calma,Cada tempestade passa; esta também passará.,false
pt,Calma,A calma não é ausência de caos; é paz no meio dele.,false
pt,Calma,Quando tudo acelera, tu podes escolher abrandar.,false
pt,Calma,Não precisas de resolver tudo hoje; um passo de cada vez.,false
pt,Calma,A tua paz mental vale mais que qualquer urgência.,false
pt,Calma,Desliga-te do mundo por dez minutos e reconecta-te contigo.,false
pt,Calma,O silêncio cura; dá-te momentos de quietude.,false
pt,Calma,Quando a mente acelera, volta ao corpo e sente a respiração.,false
pt,Calma,Não tens de ter todas as respostas agora; confia no processo.,false
pt,Calma,A calma é uma escolha que fazes momento a momento.,false
pt,Calma,Deixa ir o que não podes controlar; liberta-te.,false
pt,Calma,A pressa raramente traz bons resultados; vai com calma.,false
pt,Calma,Cada respiração profunda acalma o teu sistema nervoso.,false
pt,Calma,Não precisas de estar sempre produtivo; descansar também é produtivo.,false
pt,Calma,A natureza ensina-nos calma; passa tempo ao ar livre.,false
pt,Calma,Quando tudo parece urgente, para e pergunta: é mesmo?,false
es,Foco,Empieza pequeño hoy; mañana agradecerás la consistencia que construiste.,false
es,Foco,Diez minutos enfocado valen más que dos horas distraído.,false
es,Foco,Apaga las notificaciones y date una hora de atención plena.,false
es,Foco,Cada vez que vuelves al foco, entrenas tu cerebro.,false
es,Foco,Foco no es hacer todo; es hacer lo que importa ahora.,false
es,Foco,Elige una tarea y termínala antes de empezar otra.,false
es,Foco,Tu móvil puede esperar; tu objetivo no.,false
es,Foco,La concentración es un músculo: cuanto más lo usas, más fuerte se vuelve.,false
es,Foco,Haz una lista corta y táchalo todo antes del almuerzo.,false
es,Foco,Cuando te disperses, respira hondo y vuelve a lo esencial.,false
es,Foco,Trabaja en bloques de veinte minutos con pausas de cinco.,false
es,Foco,El multitasking es un mito; enfócate en una cosa a la vez.,false
es,Foco,Guarda la mañana para lo que exige más concentración.,false
es,Foco,Menos distracciones hoy significa más resultados mañana.,false
es,Foco,Pregúntate: esto me acerca a mi objetivo o me aleja?,false
es,Foco,Foco es decir no a mil cosas buenas para decir sí a la mejor.,false
es,Foco,Cada minuto enfocado es una inversión en tu futuro.,false
es,Foco,Crea un ritual antes de trabajar: café, música, foco.,false
es,Foco,Cuando todo parece urgente, elige lo que es importante.,false
es,Foco,El foco no aparece; tú creas las condiciones para él.,false
es,Disciplina,Disciplina es hacer incluso sin ganas; empieza por dos minutos.,false
es,Disciplina,La motivación empieza; la disciplina termina el trabajo.,false
es,Disciplina,Haz hoy lo que tu yo futuro agradecerá.,false
es,Disciplina,Pequeños hábitos diarios construyen grandes transformaciones.,false
es,Disciplina,No esperes las ganas perfectas; actúa ahora.,false
es,Disciplina,Disciplina es libertad: cuanto más tienes, más eliges.,false
es,Disciplina,Empieza antes de sentirte listo; la acción crea impulso.,false
es,Disciplina,Haz lo mínimo en los días difíciles; mantén la racha viva.,false
es,Disciplina,La consistencia vence al talento cuando el talento no es consistente.,false
es,Disciplina,Cada día que cumples, refuerzas la confianza en ti.,false
es,Disciplina,Disciplina no es castigo; es el camino hacia lo que quieres.,false
es,Disciplina,Haz lo que te prometiste, aunque nadie lo vea.,false
es,Disciplina,Tus hábitos de hoy dibujan tu vida de mañana.,false
es,Disciplina,No negocies contigo en los días difíciles; aparece siempre.,false
es,Disciplina,La disciplina empieza con una decisión y se repite con acción.,false
es,Disciplina,Haz lo básico bien hecho todos los días; los resultados vendrán.,false
es,Disciplina,Cuando no tengas ganas, recuerda por qué empezaste.,false
es,Disciplina,La disciplina es silenciosa pero los resultados son ruidosos.,false
es,Disciplina,Cada pequeña victoria diaria alimenta tu disciplina.,false
es,Disciplina,Comprométete con el proceso y los resultados te seguirán.,false
es,Autoestima,Trátate como tratarías a tu mejor amigo.,false
es,Autoestima,Tu valor no depende de la opinión de nadie.,false
es,Autoestima,Celebra las pequeñas victorias; construyen confianza.,false
es,Autoestima,Eres suficiente exactamente como eres en este momento.,false
es,Autoestima,Háblate con la misma amabilidad que mereces.,false
es,Autoestima,Tus errores no te definen; te definen tus intentos.,false
es,Autoestima,Respeta tus límites; no son debilidad, son sabiduría.,false
es,Autoestima,Cada día que cuidas de ti es un acto de amor propio.,false
es,Autoestima,No te compares con nadie; cada camino es único.,false
es,Autoestima,Tu voz interior merece ser amable y alentadora.,false
es,Autoestima,Acepta tus defectos; forman parte de tu historia.,false
es,Autoestima,Mereces descanso, alegría y tiempo para ti.,false
es,Autoestima,Tu progreso no necesita ser perfecto para ser válido.,false
es,Autoestima,Date permiso para fallar y para volver a empezar.,false
es,Autoestima,Tu presencia en el mundo tiene valor y propósito.,false
es,Autoestima,Cuida tu cuerpo y tu mente con cariño.,false
es,Autoestima,No necesitas demostrar nada a nadie; vive para ti.,false
es,Autoestima,Tus sentimientos son válidos y merecen ser escuchados.,false
es,Autoestima,Elige personas que te eleven y aléjate de quien te disminuye.,false
es,Autoestima,Tu camino es tuyo; no dejes que nadie escriba por ti.,false
es,Sucesso,El éxito es progresar un poco todos los días.,false
es,Sucesso,Define qué es el éxito para ti, no para los demás.,false
es,Sucesso,Cada pequeño paso cuenta; no desvalorices tu progreso.,false
es,Sucesso,El éxito empieza cuando sales de la zona de confort.,false
es,Sucesso,Fallar es parte del camino; aprende y sigue adelante.,false
es,Sucesso,Celebra las victorias pequeñas; se suman a las grandes.,false
es,Sucesso,El éxito no es destino; es el camino que recorres diariamente.,false
es,Sucesso,Invierte en ti; eres tu mejor proyecto.,false
es,Sucesso,No esperes el momento perfecto; créalo con acción.,false
es,Sucesso,El éxito se construye en privado y se celebra en público.,false
es,Sucesso,Aprende de quien ya llegó donde quieres estar.,false
es,Sucesso,Cada obstáculo superado te hace más fuerte y preparado.,false
es,Sucesso,El éxito exige paciencia; los árboles no crecen en un día.,false
es,Sucesso,Enfócate en lo que puedes controlar y actúa sobre ello.,false
es,Sucesso,Tu éxito no disminuye el de nadie; hay espacio para todos.,false
es,Sucesso,Trabaja en silencio y deja que los resultados hablen por ti.,false
es,Sucesso,El éxito es la suma de pequeñas decisiones correctas repetidas.,false
es,Sucesso,No tengas miedo de pedir ayuda; nadie gana solo.,false
es,Sucesso,El éxito empieza cuando decides no rendirte.,false
es,Sucesso,Cada día es una nueva oportunidad para acercarte a tus sueños.,false
es,Fitness,Mueve el cuerpo hoy; tu mente lo agradece.,false
es,Fitness,No necesita ser perfecto; basta empezar y ser consistente.,false
es,Fitness,Diez minutos de movimiento son mejores que cero.,false
es,Fitness,Tu cuerpo es capaz de más de lo que imaginas.,false
es,Fitness,Cada entrenamiento es una inversión en tu salud futura.,false
es,Fitness,No entrenas para castigar el cuerpo; entrenas para celebrarlo.,false
es,Fitness,La energía que gastas en el entrenamiento vuelve multiplicada.,false
es,Fitness,Empieza despacio y aumenta el ritmo con el tiempo.,false
es,Fitness,El ejercicio no es lujo; es necesidad para vivir bien.,false
es,Fitness,Siéntete orgulloso por cada movimiento que haces hoy.,false
es,Fitness,El cansancio pasa; la satisfacción de entrenar queda.,false
es,Fitness,No compares tu cuerpo con el de nadie; respeta tu ritmo.,false
es,Fitness,Cada repetición te acerca a la mejor versión de ti.,false
es,Fitness,El entrenamiento más difícil es el que más te transforma.,false
es,Fitness,Cuida tu cuerpo; es el único lugar donde vives.,false
es,Fitness,El dolor temporal del entrenamiento vale la fuerza permanente que ganas.,false
es,Fitness,Muévete hoy y siente la diferencia en tu humor.,false
es,Fitness,Tu cuerpo agradece cada elección saludable que haces.,false
es,Fitness,No te rindas en el día difícil; haz lo mínimo y mantén el hábito.,false
es,Fitness,Fitness no es destino; es un estilo de vida que eliges diariamente.,false
es,Calma,Respira hondo tres veces; el momento pasa.,false
es,Calma,No puedes controlar todo; enfócate en lo que está en tus manos.,false
es,Calma,La ansiedad miente; eres más fuerte de lo que piensas.,false
es,Calma,Date permiso para parar y simplemente respirar.,false
es,Calma,Cada tormenta pasa; esta también pasará.,false
es,Calma,La calma no es ausencia de caos; es paz en medio de él.,false
es,Calma,Cuando todo acelera, tú puedes elegir ir más despacio.,false
es,Calma,No necesitas resolver todo hoy; un paso a la vez.,false
es,Calma,Tu paz mental vale más que cualquier urgencia.,false
es,Calma,Desconéctate del mundo por diez minutos y reconecta contigo.,false
es,Calma,El silencio cura; date momentos de quietud.,false
es,Calma,Cuando la mente acelera, vuelve al cuerpo y siente la respiración.,false
es,Calma,No tienes que tener todas las respuestas ahora; confía en el proceso.,false
es,Calma,La calma es una elección que haces momento a momento.,false
es,Calma,Suelta lo que no puedes controlar; libérate.,false
es,Calma,La prisa rara vez trae buenos resultados; ve con calma.,false
es,Calma,Cada respiración profunda calma tu sistema nervioso.,false
es,Calma,No necesitas estar siempre productivo; descansar también es productivo.,false
es,Calma,La naturaleza nos enseña calma; pasa tiempo al aire libre.,false
es,Calma,Cuando todo parece urgente, para y pregunta: lo es realmente?,false`;

// Parse CSV and create Quote objects
const parseQuotes = (): Quote[] => {
  const lines = quotesCSV.trim().split('\n');
  const quotesByLanguage: { [key: string]: { [key: string]: string } } = {};
  
  lines.forEach((line, index) => {
    const [lang, category, text, isPremium] = line.split(',').map(s => s.trim());
    const categoryLower = category.toLowerCase() as 'foco' | 'disciplina' | 'autoestima' | 'sucesso' | 'fitness' | 'calma';
    
    // Create unique key for matching PT and ES versions
    const quoteKey = `${categoryLower}-${Math.floor(index / 2)}`;
    
    if (!quotesByLanguage[quoteKey]) {
      quotesByLanguage[quoteKey] = {};
    }
    
    quotesByLanguage[quoteKey][lang] = text;
    quotesByLanguage[quoteKey].category = categoryLower;
    quotesByLanguage[quoteKey].isPremium = isPremium === 'true';
  });
  
  // Convert to Quote array
  return Object.entries(quotesByLanguage).map(([key, data], index) => ({
    id: String(index + 1),
    text: {
      pt: data.pt || '',
      es: data.es || ''
    },
    category: data.category as any,
    isPremium: data.isPremium || false
  }));
};

export const QUOTES: Quote[] = parseQuotes();

export const TRANSLATIONS = {
  pt: {
    welcome: 'Bem-vindo ao Motiva',
    chooseLanguage: 'Escolha o seu idioma',
    slogan: 'A tua dose diária de motivação',
    quoteOfTheDay: 'Frase do Dia',
    listen: 'Ouvir',
    share: 'Partilhar',
    favorite: 'Favoritar',
    unfavorite: 'Remover',
    explore: 'Explorar',
    favorites: 'Favoritos',
    premium: 'Premium',
    settings: 'Definições',
    categories: 'Categorias',
    noFavorites: 'Ainda não tens frases favoritas',
    addFavorites: 'Explora e adiciona as tuas frases preferidas',
    premiumTitle: 'Motiva Premium',
    premiumFeature1: 'Sem anúncios',
    premiumFeature2: 'Frases exclusivas',
    premiumFeature3: 'Áudio diário',
    subscribe: 'Subscrever Premium',
    language: 'Idioma',
    notifications: 'Notificações',
    about: 'Sobre',
    version: 'Versão 1.0.0',
    madeWith: 'Feito com',
    by: 'por Lasy AI'
  },
  es: {
    welcome: 'Bienvenido a Motiva',
    chooseLanguage: 'Elige tu idioma',
    slogan: 'Tu dosis diaria de motivación',
    quoteOfTheDay: 'Frase del Día',
    listen: 'Escuchar',
    share: 'Compartir',
    favorite: 'Favorito',
    unfavorite: 'Quitar',
    explore: 'Explorar',
    favorites: 'Favoritos',
    premium: 'Premium',
    settings: 'Ajustes',
    categories: 'Categorías',
    noFavorites: 'Aún no tienes frases favoritas',
    addFavorites: 'Explora y añade tus frases preferidas',
    premiumTitle: 'Motiva Premium',
    premiumFeature1: 'Sin anuncios',
    premiumFeature2: 'Frases exclusivas',
    premiumFeature3: 'Audio diario',
    subscribe: 'Suscribirse a Premium',
    language: 'Idioma',
    notifications: 'Notificaciones',
    about: 'Acerca de',
    version: 'Versión 1.0.0',
    madeWith: 'Hecho con',
    by: 'por Lasy AI'
  }
};
