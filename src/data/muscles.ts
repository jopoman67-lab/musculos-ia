import type { Muscle, MuscleGroup } from "./types";

export const SOURCE_PDF = "Músculos Completos.pdf";

export const GROUPS: MuscleGroup[] = [
  {
    id: "mimica",
    name: "Músculos Faciales o de la mímica",
    shortName: "Mímica",
    accent: "steel",
  },
  {
    id: "auriculares",
    name: "Músculos Auriculares",
    shortName: "Auriculares",
    accent: "teal",
  },
  {
    id: "masticadores",
    name: "Músculos Masticadores",
    shortName: "Masticadores",
    accent: "navy",
  },
  {
    id: "suprahioideos",
    name: "Músculos del cuello (Región anterior) — Suprahioideos",
    shortName: "Suprahioideos",
    accent: "slate",
  },
  {
    id: "infrahioideos",
    name: "Músculos del cuello (Región anterior) — Infrahioideos",
    shortName: "Infrahioideos",
    accent: "teal",
  },
  {
    id: "cuello-lateral",
    name: "Músculos del cuello (Región Lateral)",
    shortName: "Cuello lateral",
    accent: "steel",
  },
  {
    id: "prevertebrales",
    name: "Músculos del cuello-Prevertebrales (Región anterior)- Profunda",
    shortName: "Prevertebrales",
    accent: "navy",
  },
  {
    id: "posteriores",
    name: "Músculos del cuello (Región Posterior)-Dorso-nuca",
    shortName: "Posteriores / dorso-nuca",
    accent: "slate",
  },
];

function m(
  partial: Omit<Muscle, "source" | "group"> & { groupId: string },
): Muscle {
  const group = GROUPS.find((g) => g.id === partial.groupId);
  if (!group) throw new Error(`Unknown group ${partial.groupId}`);
  return {
    ...partial,
    group: group.name,
    source: SOURCE_PDF,
  };
}

export const MUSCLES: Muscle[] = [
  m({
    id: "frontal",
    name: "Frontal",
    groupId: "mimica",
    subregion: "Del cuero cabelludo",
    origen: "Aponeurosis epicraneal",
    insercion: "Piel superior del reborde supraorbitario",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Oftálmica",
    funcion: "Eleva las cejas, arruga la piel de la frente",
    page: 1,
  }),
  m({
    id: "occipital",
    name: "Occipital",
    groupId: "mimica",
    subregion: "Del cuero cabelludo",
    origen: "Línea nucal suprema",
    insercion: "Aponeurosis epicraneal",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Occipital",
    funcion: "Tensar la Aponeurosis epicraneal",
    page: 1,
  }),
  m({
    id: "orbicular-ojo",
    name: "Orbicular del Ojo",
    groupId: "mimica",
    subregion: "De la órbita y ceja",
    origen:
      "Orbitaria: borde medial de la órbita. Palpebral: ligamento palpebral medial. Lagrimal: hueso lagrimal.",
    insercion: "Borde circular que rodea la órbita",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Oftálmica",
    funcion: "Cierra el ojo",
    page: 1,
  }),
  m({
    id: "corrugador-superciliar",
    name: "Corrugador superciliar",
    groupId: "mimica",
    subregion: "De la órbita y ceja",
    origen: "Arco superciliar del Frontal",
    insercion: "Tercio medio de la piel de la ceja",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Oftálmica",
    funcion: "Eleva y deprime las cejas",
    page: 1,
  }),
  m({
    id: "depressor-ceja",
    name: "Depresor de la ceja",
    groupId: "mimica",
    subregion: "De la órbita y ceja",
    origen: "Porción nasal del frontal",
    insercion: "Tercio medio de la ceja",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria oftálmica",
    funcion: "Depresión de la piel (frente y cejas)",
    page: 1,
  }),
  m({
    id: "procer",
    name: "Prócer",
    groupId: "mimica",
    subregion: "Nasal",
    origen: "Hueso nasal (borde inferomedial)",
    insercion: "Piel de la glabela",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Facial",
    funcion: "Deprime las cejas y frente",
    page: 1,
  }),
  m({
    id: "nasal",
    name: "Nasal (transversa y alar)",
    groupId: "mimica",
    subregion: "Nasal",
    origen: "Transversa: dorso de la nariz. Alar: ala de la nariz.",
    insercion: "Fosa canina. Borde lateral de la narina.",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria temporofacial. Arteria facial.",
    funcion: "Depresión del tabique nasal y desplaza el ala lateralmente",
    page: 1,
  }),
  m({
    id: "mirtiforme",
    name: "Depresor del tabique nasal o Mirtiforme",
    groupId: "mimica",
    subregion: "Nasal",
    origen: "Arco alveolar (eminencia alveolar del incisivo medial)",
    insercion: "Cartílago alar mayor",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Facial",
    funcion: "Es constrictor del orificio de las narinas",
    page: 1,
  }),
  m({
    id: "orbicular-boca",
    name: "Orbicular de la Boca",
    groupId: "mimica",
    subregion: "Bucal",
    origen: "Fibras que rodean la abertura de la boca",
    insercion: "Labios",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Facial",
    funcion: "Cierra la boca y protruye y frunce los labios",
    page: 1,
  }),
  m({
    id: "buccinador",
    name: "Buccinador",
    groupId: "mimica",
    subregion: "Bucal",
    origen:
      "Apófisis alveolar del maxilar y fosa retromolar de la mandíbula",
    insercion: "La comisura de los labios",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Bucal",
    funcion: "Aumentos de la presión en la cavidad bucal (soplar)",
    page: 1,
  }),
  m({
    id: "elevador-labio-ala",
    name: "Elevador del labio superior y ala de la nariz",
    groupId: "mimica",
    subregion: "Bucal",
    origen: "Apófisis frontal del maxilar",
    insercion: "Labio superior y alas de la nariz",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Facial",
    funcion: "Eleva el ala nasal y el labio superior",
    page: 2,
  }),
  m({
    id: "elevador-labio-superior",
    name: "Elevador propio del labio superior",
    groupId: "mimica",
    subregion: "Bucal",
    origen: "Borde infraorbitario y apófisis cigomática del maxilar",
    insercion: "Labio superior",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Facial",
    funcion: "Eleva el labio superior",
    page: 2,
  }),
  m({
    id: "elevador-angulo-boca",
    name: "Elevador del ángulo de la boca",
    groupId: "mimica",
    subregion: "Bucal",
    origen: "Fosa canina del maxilar",
    insercion: "Ángulo de la boca",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria Facial",
    funcion: "Eleva la comisura labial",
    page: 2,
  }),
  m({
    id: "cigomatico-menor",
    name: "Cigomático menor",
    groupId: "mimica",
    subregion: "Bucal",
    origen: "Hueso cigomático",
    insercion: "Labio superior y ángulo de la boca",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria labial superior",
    funcion: "Levanta el labio superior",
    page: 2,
  }),
  m({
    id: "cigomatico-mayor",
    name: "Cigomático mayor",
    groupId: "mimica",
    subregion: "Bucal",
    origen: "Hueso cigomático",
    insercion: "Piel del ángulo de la boca y orbicular de la boca",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria labial superior",
    funcion: "Arrastra el ángulo de la boca como al sonreír",
    page: 2,
  }),
  m({
    id: "risorio",
    name: "Risorio",
    groupId: "mimica",
    subregion: "Bucal",
    origen: "Fascia que recubre la glándula parótida",
    insercion: "Piel del ángulo de la boca",
    inervacion: "Nervio Facial (VII)",
    irrigacion: "Arteria facial - labial superior",
    funcion: "Arrastra en sentido lateral el ángulo de la boca",
    page: 2,
  }),
  m({
    id: "depressor-angulo-boca",
    name: "Depresor del ángulo de la boca",
    groupId: "mimica",
    subregion: "Bucal",
    origen: "Base de la mandíbula",
    insercion: "Ángulo de la boca y comisura de los labios",
    inervacion: "Nervio Facial (VII) - rama mandibular",
    irrigacion: "Arteria facial - rama de la arteria labial inferior",
    funcion: "Desciende la comisura labial (tristeza)",
    page: 2,
  }),
  m({
    id: "depressor-labio-inferior",
    name: "Depresor del labio inferior",
    groupId: "mimica",
    subregion: "Bucal",
    origen:
      "Base mandibular, región inferomedial al foramen mentoniano",
    insercion: "Labio inferior",
    inervacion: "Nervio Facial",
    irrigacion: "Arteria facial - rama de la arteria labial inferior",
    funcion: "Descender la comisura labial",
    page: 2,
  }),
  m({
    id: "mentoniano",
    name: "Mentoniano",
    groupId: "mimica",
    subregion: "Bucal",
    origen: "Mandíbula",
    insercion: "Piel del mentón",
    inervacion: "Nervio facial (VII)",
    irrigacion: "Arteria facial - rama de la arteria labial inferior",
    funcion: "Eleva y protruye el labio inferior",
    page: 2,
  }),
  m({
    id: "auricular-anterior",
    name: "Auricular anterior",
    groupId: "auriculares",
    subregion: "",
    origen: "Fascia temporal",
    insercion: "Hélix mayor (anterior)",
    inervacion: "Rama temporal del nervio facial (VII)",
    irrigacion:
      "Arterias auriculares anteriores (de la temporal superficial)",
    funcion: "Tracciona la oreja anteriormente",
    page: 3,
  }),
  m({
    id: "auricular-superior",
    name: "Auricular superior",
    groupId: "auriculares",
    subregion: "",
    origen: "Fascia temporal",
    insercion: "Hélix mayor (superior)",
    inervacion: "Nervio auricular posterior del nervio facial (VII)",
    irrigacion: "Arteria auricular posterior",
    funcion: "Tracciona la oreja superiormente",
    page: 3,
  }),
  m({
    id: "auricular-posterior",
    name: "Auricular posterior",
    groupId: "auriculares",
    subregion: "",
    origen: "Apófisis mastoidea",
    insercion: "Hélix mayor (posterior)",
    inervacion: "Nervio auricular posterior del nervio facial (VII)",
    irrigacion: "Arteria auricular posterior",
    funcion: "Tracciona la oreja posteriormente",
    page: 3,
  }),
  m({
    id: "temporoparietal",
    name: "Temporoparietal",
    groupId: "auriculares",
    subregion: "",
    origen: "Hélix y músculos auriculares",
    insercion: "Aponeurosis epicraneal",
    inervacion: "Rama temporal del nervio facial (VII)",
    irrigacion: "Ramas de la arteria temporal superficial",
    funcion: "Ayuda con los gestos faciales",
    page: 3,
  }),
  m({
    id: "masetero",
    name: "Masetero",
    groupId: "masticadores",
    subregion: "",
    origen: "Arco cigomático",
    insercion: "Tuberosidad maseterina, ángulo y rama de la mandíbula",
    inervacion: "Nervio trigémino (V3, rama mandibular)",
    irrigacion: "Arteria maxilar — rama: arteria maseterina",
    funcion: "Elevación de la mandíbula",
    page: 3,
  }),
  m({
    id: "temporal",
    name: "Temporal",
    groupId: "masticadores",
    subregion: "",
    origen: "Fosa temporal, línea curva inferior",
    insercion:
      "Apófisis coronoides de la mandíbula. Borde anterior de la rama ascendente de la mandíbula.",
    inervacion:
      "Nervio trigémino (V3, rama mandibular). Rama del nervio temporal profundo.",
    irrigacion: "Arteria maxilar — rama: arteria temporal",
    funcion: "Eleva y retrae la mandíbula",
    page: 3,
  }),
  m({
    id: "pterigoideo-medial",
    name: "Pterigoideo medial",
    groupId: "masticadores",
    subregion: "",
    origen:
      "Porción interna de la lámina de la apófisis pterigoidea del esfenoides",
    insercion:
      "Fosa pterigoidea o cara interna del ángulo de la mandíbula",
    inervacion: "Nervio trigémino (V3, rama mandibular)",
    irrigacion: "Arteria maxilar — rama: arteria pterigoidea",
    funcion:
      "Eleva y protruye la mandíbula y la mueve de lado a lado",
    page: 3,
  }),
  m({
    id: "pterigoideo-lateral",
    name: "Pterigoideo lateral",
    groupId: "masticadores",
    subregion: "",
    origen:
      "Ala mayor y superficie lateral de la parte lateral de la apófisis pterigoides del esfenoides",
    insercion: "Cóndilo de la mandíbula o ATM",
    inervacion: "Nervio trigémino (V3, rama mandibular)",
    irrigacion: "Arteria maxilar — rama: arteria pterigoidea",
    funcion:
      "Protruye y eleva la mandíbula, como al abrir la boca, y mueve la mandíbula de lado a lado",
    page: 3,
  }),
  m({
    id: "digastrico",
    name: "Digástrico",
    groupId: "suprahioideos",
    subregion: "Suprahioideos",
    origen:
      "Vientre posterior: apófisis mastoides. Vientre anterior: tendón intermedio.",
    insercion:
      "Tendón intermedio. Fosita digástrica de la mandíbula.",
    inervacion:
      "Nervio facial (VII). Rama mandibular del nervio trigémino (V).",
    irrigacion:
      "Ramas de la arteria auricular posterior y la arteria occipital, ambas de la carótida externa. Rama submentoniana de la arteria facial.",
    funcion:
      "Elevan el hueso hioides y deprimen la mandíbula al abrir la boca",
    page: 4,
  }),
  m({
    id: "estilohioideo",
    name: "Estilohioideo",
    groupId: "suprahioideos",
    subregion: "Suprahioideos",
    origen: "Apófisis estiloides del temporal",
    insercion: "Cuerpo del hueso hioides",
    inervacion: "Nervio facial (VII), ramo estilohioideo",
    irrigacion:
      "Ramas de la arteria carótida externa: arteria facial, arteria occipital y arteria auricular posterior",
    funcion:
      "Eleva el hueso hioides y lo arrastra hacia atrás (alarga el piso de la boca)",
    page: 4,
  }),
  m({
    id: "milohioideo",
    name: "Milohioideo",
    groupId: "suprahioideos",
    subregion: "Suprahioideos",
    origen: "Línea milohioidea (superficie interna de la mandíbula)",
    insercion:
      "Rafe tendinoso medio milohioideo y cuerpo del hueso hioides",
    inervacion:
      "Rama mandibular del nervio trigémino (V) — rama milohioidea",
    irrigacion:
      "Rama sublingual de la arteria lingual, rama submentoniana de la arteria facial",
    funcion:
      "Soporta y eleva el suelo de la boca. Eleva y mueve hacia delante el hioides.",
    page: 4,
  }),
  m({
    id: "genihioideo",
    name: "Genihioideo",
    groupId: "suprahioideos",
    subregion: "Suprahioideos",
    origen:
      "Apófisis geni de la mandíbula, o espina mentoniana inferior",
    insercion: "Cuerpo del hueso hioides",
    inervacion: "Primer nervio espinal cervical (C1). Nervio hipogloso (XII).",
    irrigacion: "Rama sublingual de la arteria lingual",
    funcion:
      "Acorta el piso de la boca, lleva el hueso hioides hacia adelante",
    page: 4,
  }),
  m({
    id: "esternohioideo",
    name: "Esternohioideo",
    groupId: "infrahioideos",
    subregion: "Infrahioideos",
    origen:
      "Extremo medial de la clavícula y dorso del manubrio del esternón",
    insercion: "Cuerpo del hueso hioides",
    inervacion:
      "Ramos de los nervios espinales (C1-C3) y rama del nervio hipogloso (XII)",
    irrigacion:
      "Ramas de la arteria tiroidea superior, rama de la arteria carótida externa",
    funcion:
      "Desciende el hioides y la laringe durante la deglución y fonación",
    page: 4,
  }),
  m({
    id: "esternotiroideo",
    name: "Esternotiroideo",
    groupId: "infrahioideos",
    subregion: "Infrahioideos",
    origen: "Dorso del manubrio del esternón",
    insercion: "Línea oblicua del cartílago tiroides de la laringe",
    inervacion:
      "Ramos de los nervios espinales (C1-C3) y rama del nervio hipogloso (XII)",
    irrigacion:
      "Ramas de la arteria tiroidea superior y, en menor medida, de la arteria lingual. Son colaterales de la carótida externa.",
    funcion:
      "Desciende el hioides y la laringe durante la deglución y fonación",
    page: 5,
  }),
  m({
    id: "tirohioideo",
    name: "Tirohioideo",
    groupId: "infrahioideos",
    subregion: "Infrahioideos",
    origen: "Línea oblicua del cartílago tiroides de la laringe",
    insercion: "Asta mayor del hueso hioides",
    inervacion:
      "Rama directa de C1-C2 que se unieron al hipogloso, lo usan como carril y luego se separan para inervar este músculo",
    irrigacion: "Rama hioidea de la arteria tiroidea superior",
    funcion:
      "Desciende el hioides y la laringe durante la deglución y fonación",
    page: 5,
  }),
  m({
    id: "omohioideo",
    name: "Omohioideo",
    groupId: "infrahioideos",
    subregion: "Infrahioideos",
    origen: "Borde superior de la escápula",
    insercion: "Cuerpo del hueso hioides",
    inervacion:
      "Ramos de los nervios espinales (C1-C3) y rama del nervio hipogloso (XII)",
    irrigacion:
      "Rama de la arteria tiroidea superior (rama de la carótida externa) y la arteria tiroidea inferior (rama del tronco tirocervical)",
    funcion:
      "Desciende el hioides y la laringe durante la deglución y fonación",
    page: 5,
  }),
  m({
    id: "platisma",
    name: "Platisma",
    groupId: "cuello-lateral",
    subregion: "",
    origen: "Piel del deltoides y pectoral mayor",
    insercion:
      "Borde inferior de la mandíbula. Línea oblicua mandibular. Piel de la región mentoniana.",
    inervacion: "Rama cervical del nervio facial",
    irrigacion:
      "Ramos suministrados por las arterias submentoniana y escapular superior",
    funcion: "Tensar la piel del cuello",
    page: 6,
  }),
  m({
    id: "esternocleidomastoideo",
    name: "Esternocleidomastoideo",
    groupId: "cuello-lateral",
    subregion: "",
    origen:
      "Cabeza redondeada: cara anterior del manubrio del esternón. Cabeza acintada: tercio interno o medial de la clavícula.",
    insercion: "Apófisis mastoides del temporal",
    inervacion:
      "Nervio accesorio (CN XI), ramas del plexo cervical (C2-C3)",
    irrigacion: "Arteria occipital, tiroidea media e inferior",
    funcion:
      "Contracción bilateral: flexiona la cabeza. Contracción unilateral: gira la cabeza.",
    page: 6,
  }),
  m({
    id: "escaleno-anterior",
    name: "Escaleno anterior",
    groupId: "cuello-lateral",
    subregion: "",
    origen:
      "Tubérculos anteriores de las apófisis transversas de las vértebras cervicales C3, C4, C5 y C6",
    insercion: "Primera costilla (tubérculo escalénico)",
    inervacion:
      "Ramas anteriores de los nervios cervicales inferiores (C4, C5 y C6)",
    irrigacion:
      "Arteria cervical ascendente (rama del tronco tirocervical). Origen en arteria subclavia.",
    funcion:
      "Flexión lateral del cuello y eleva la primera costilla en la inspiración",
    page: 6,
  }),
  m({
    id: "escaleno-medio",
    name: "Escaleno medio",
    groupId: "cuello-lateral",
    subregion: "",
    origen:
      "Tubérculos posteriores de las apófisis transversas de las vértebras cervicales (C2-C7)",
    insercion: "Cara superior de la primera costilla",
    inervacion: "Ramas anteriores de los nervios espinales C3-C8",
    irrigacion:
      "Arteria cervical ascendente (rama del tronco tirocervical). Origen en arteria subclavia.",
    funcion:
      "Flexión lateral del cuello y eleva la primera costilla en la inspiración",
    page: 6,
  }),
  m({
    id: "escaleno-posterior",
    name: "Escaleno posterior",
    groupId: "cuello-lateral",
    subregion: "",
    origen:
      "Tubérculos posteriores de las apófisis transversas de las vértebras cervicales (C5-C7)",
    insercion: "Borde externo de la segunda costilla",
    inervacion: "Ramas anteriores de los nervios espinales C6-C8",
    irrigacion:
      "Arteria cervical ascendente (rama del tronco tirocervical). Origen en arteria subclavia.",
    funcion:
      "Elevar la segunda costilla en la inspiración; realiza la flexión lateral del cuello",
    page: 6,
  }),
  m({
    id: "recto-lateral-cabeza",
    name: "Recto lateral de la cabeza",
    groupId: "prevertebrales",
    subregion: "",
    origen: "Apófisis transversa del atlas",
    insercion: "Apófisis yugular del hueso occipital",
    inervacion: "Ramas anteriores de los nervios espinales (C1-C2)",
    irrigacion:
      "Ramas de la arteria vertebral, la arteria occipital y la arteria faríngea ascendente",
    funcion: "Flexión lateral de la cabeza",
    page: 7,
  }),
  m({
    id: "recto-anterior-cabeza",
    name: "Recto anterior de la cabeza",
    groupId: "prevertebrales",
    subregion: "",
    origen: "Apófisis transversa del atlas",
    insercion: "Porción basilar del hueso occipital",
    inervacion:
      "Ramas anteriores de los nervios espinales cervicales C1 y C2",
    irrigacion: "Arteria faríngea ascendente y arteria vertebral",
    funcion:
      "Flexiona la cabeza sobre el cuello en la articulación atlantooccipital",
    page: 7,
  }),
  m({
    id: "largo-cabeza",
    name: "Largo de la cabeza",
    groupId: "prevertebrales",
    subregion: "",
    origen:
      "Tubérculos anteriores de las apófisis transversas de C3 a C6",
    insercion: "Porción basilar del hueso occipital",
    inervacion:
      "Ramos anteriores de los nervios espinales cervicales C1 a C3 (y a veces C4)",
    irrigacion:
      "Arteria cervical ascendente, tiroidea inferior, faríngea ascendente y arteria vertebral",
    funcion: "Flexionar la cabeza y la parte superior del cuello",
    page: 7,
  }),
  m({
    id: "largo-cuello",
    name: "Largo del cuello",
    groupId: "prevertebrales",
    subregion: "",
    origen: "Vértebras cervicales y dorsales",
    insercion: "Vértebras cervicales",
    inervacion: "Nervios espinales cervicales C2 a C6",
    irrigacion:
      "Arteria vertebral, arteria tiroidea inferior y arteria faríngea ascendente",
    funcion: "Flexiona la columna cervical",
    page: 7,
  }),
  m({
    id: "trapecio",
    name: "Trapecio",
    groupId: "posteriores",
    subregion: "Superficiales",
    origen:
      "Línea curva superior del hueso occipital, protuberancia occipital externa, ligamento nucal, apófisis espinosas C7-T12",
    insercion:
      "Tercio lateral de la clavícula, acromion de la escápula, espina de la escápula",
    inervacion:
      "Nervio accesorio (XI). Ramas del plexo cervical anterior (C3-C4).",
    irrigacion:
      "Arteria cervical transversa, arteria occipital y arteria dorsal de la escápula",
    funcion: "Rotación y elevar la escápula",
    page: 8,
  }),
  m({
    id: "romboides-mayor",
    name: "Romboides mayor",
    groupId: "posteriores",
    subregion: "Intermedio",
    origen: "Columna vertebral (apófisis espinosas D2-D5)",
    insercion: "Borde medial de la escápula",
    inervacion: "Ramas del plexo braquial (nervio escapular dorsal)",
    irrigacion:
      "Arteria dorsal de la escápula (rama del tronco tirocervical). Arteria subclavia.",
    funcion:
      "Aducción, elevación y rotación de la escápula (llevar los hombros hacia atrás)",
    page: 8,
  }),
  m({
    id: "romboides-menor",
    name: "Romboides menor",
    groupId: "posteriores",
    subregion: "Intermedio",
    origen: "Columna vertebral (apófisis espinosas C7, C8, D1)",
    insercion: "Borde medial de la escápula",
    inervacion: "Ramas del plexo braquial (nervio escapular dorsal)",
    irrigacion:
      "Arteria dorsal de la escápula (rama del tronco tirocervical). Arteria subclavia.",
    funcion: "Aducción, elevación y rotación de la escápula",
    page: 8,
  }),
  m({
    id: "serrato-posterior-superior",
    name: "Serrato posterior superior",
    groupId: "posteriores",
    subregion: "Intermedio",
    origen:
      "Ligamento nucal, apófisis espinosas de las vértebras cervicales inferiores y torácicas superiores (C7-T3)",
    insercion: "Borde superior de las costillas 2-5",
    inervacion: "Ramas anteriores de los nervios torácicos (T2-T5)",
    irrigacion: "Arterias intercostales posteriores (ramas dorsales)",
    funcion: "Eleva las costillas 2.ª a 5.ª",
    page: 8,
  }),
  m({
    id: "espinoso-cabeza",
    name: "Espinoso de la cabeza",
    groupId: "posteriores",
    subregion: "Erectores de la columna (masa común interna)",
    origen:
      "Se fusiona en las apófisis espinosas de las vértebras cervicales inferiores (C7-T1)",
    insercion:
      "Hueso occipital entre la línea nucal superior e inferior",
    inervacion: "Ramos posteriores de los nervios espinales",
    irrigacion:
      "Ramas musculares de la arteria occipital, arteria cervical profunda y ramas de la arteria vertebral",
    funcion: "Extensión y flexión lateral de la cabeza",
    page: 8,
  }),
  m({
    id: "espinoso-cuello",
    name: "Espinoso del cuello",
    groupId: "posteriores",
    subregion: "Erectores de la columna (masa común interna)",
    origen: "Parte inferior del ligamento nucal y apófisis espinosa C7",
    insercion: "Apófisis espinosas de C2 (axis)",
    inervacion: "Ramos posteriores de los nervios espinales",
    irrigacion:
      "Ramas de la arteria cervical profunda, ramas dorsales de las arterias intercostales superiores y ramas musculares de las arterias vertebrales",
    funcion: "Extensión de la columna y flexión lateral de la columna",
    page: 9,
  }),
  m({
    id: "longuisimo-cabeza",
    name: "Longuísimo de la cabeza",
    groupId: "posteriores",
    subregion: "Erectores de la columna (masa común interna)",
    origen:
      "Apófisis espinosas de las vértebras dorsales superiores y cervicales inferiores",
    insercion: "Borde posterior de la apófisis mastoides",
    inervacion: "Ramos posteriores de los nervios espinales",
    irrigacion:
      "Arteria vertebral, arteria cervical profunda, ramas descendentes de la arteria occipital y ramas de la arteria cervical transversa",
    funcion: "Extensión de la columna y flexión lateral de la columna",
    page: 9,
  }),
  m({
    id: "longuisimo-cuello",
    name: "Longuísimo del cuello",
    groupId: "posteriores",
    subregion: "Erectores de la columna (masa común interna)",
    origen: "Apófisis transversas de las vértebras (T1-T5)",
    insercion:
      "Tubérculos posteriores de las apófisis transversas de las vértebras (C2-C6)",
    inervacion: "Ramos posteriores de los nervios espinales",
    irrigacion:
      "Ramas de la arteria vertebral, la arteria cervical profunda, las ramas descendentes de la arteria occipital y la rama profunda de la arteria cervical transversa",
    funcion: "Extensión de la columna y flexión lateral de la columna",
    page: 9,
  }),
  m({
    id: "iliocostal-cervical",
    name: "Iliocostal cervical",
    groupId: "posteriores",
    subregion: "Erectores de la columna (masa común interna)",
    origen: "Ángulo de las costillas (tercera a sexta)",
    insercion: "Apófisis transversas de las vértebras cervicales (C4-C6)",
    inervacion: "Ramos posteriores de los nervios espinales",
    irrigacion:
      "Ramas de las arterias occipital, cervical profunda y vertebral",
    funcion: "Extensión de la columna y flexión lateral de la columna",
    page: 9,
  }),
  m({
    id: "esplenio-cabeza",
    name: "Esplenio de la cabeza",
    groupId: "posteriores",
    subregion: "",
    origen: "Apófisis espinosa de la vértebra (C7-T4) y ligamento nucal",
    insercion:
      "Apófisis mastoides, parte lateral del hueso occipital por debajo de la línea nucal superior",
    inervacion: "Ramos posteriores de los nervios cervicales",
    irrigacion:
      "Ramas musculares de la arteria occipital, arteria cervical profunda y ramas de la arteria vertebral",
    funcion: "Extensión del cuello y la cabeza",
    page: 9,
  }),
  m({
    id: "esplenio-cuello",
    name: "Esplenio del cuello",
    groupId: "posteriores",
    subregion: "",
    origen:
      "Apófisis espinosas de las vértebras dorsales superiores (T3-T6)",
    insercion: "Apófisis transversas de C1-C3",
    inervacion: "Ramos posteriores de los nervios cervicales",
    irrigacion:
      "Ramas de la arteria occipital, la arteria cervical profunda y la arteria cervical transversa",
    funcion: "Extensión del cuello y flexión lateral del cuello",
    page: 10,
  }),
  m({
    id: "semiespinoso-cabeza",
    name: "Semiespinoso de la cabeza",
    groupId: "posteriores",
    subregion: "",
    origen:
      "Apófisis articulares de C4-C7 y apófisis transversas de C7-T6",
    insercion:
      "Zona medial entre líneas nucales superior e inferior del hueso occipital",
    inervacion: "Ramos posteriores de los nervios espinales",
    irrigacion:
      "Arteria occipital, aporte de la arteria cervical profunda y la arteria intercostal superior",
    funcion:
      "Extensión del cuello y la cabeza, flexión lateral y rotación del cuello",
    page: 10,
  }),
  m({
    id: "semiespinoso-cuello",
    name: "Semiespinoso del cuello",
    groupId: "posteriores",
    subregion: "",
    origen: "Apófisis transversas de C7-T6",
    insercion: "Apófisis espinosas de C2-C5",
    inervacion: "Ramos posteriores de los nervios espinales",
    irrigacion:
      "Arteria cervical profunda, arteria vertebral y ramas dorsales de las arterias intercostales posteriores",
    funcion:
      "Extensión de la columna, flexión lateral y rotación contralateral del cuello",
    page: 10,
  }),
  m({
    id: "recto-posterior-menor",
    name: "Recto posterior menor de la cabeza",
    groupId: "posteriores",
    subregion: "Profundos",
    origen: "Tubérculo posterior del atlas (C1)",
    insercion: "Línea nucal o curva inferior del hueso occipital",
    inervacion: "Ramos posteriores de C1",
    irrigacion:
      "Arteria vertebral y ramas descendentes profundas de la arteria occipital",
    funcion: "Extensión de la cabeza",
    page: 10,
  }),
  m({
    id: "recto-posterior-mayor",
    name: "Recto posterior mayor de la cabeza",
    groupId: "posteriores",
    subregion: "Profundos",
    origen: "Apófisis espinosa del axis (C2)",
    insercion: "Línea nucal o curva inferior del hueso occipital",
    inervacion: "Ramos posteriores de C1",
    irrigacion:
      "Arteria vertebral y ramas descendentes profundas de la arteria occipital",
    funcion: "Extensión y rotación de la cabeza",
    page: 10,
  }),
  m({
    id: "oblicuo-inferior",
    name: "Oblicuo inferior (mayor)",
    groupId: "posteriores",
    subregion: "Profundos",
    origen: "Apófisis espinosa del axis (C2)",
    insercion: "Apófisis transversa del atlas (C1)",
    inervacion: "Ramos posteriores de C1",
    irrigacion:
      "Arteria vertebral y ramas descendentes profundas de la arteria occipital",
    funcion:
      "Extensión, rotación y estabilidad de la cabeza (articulación atlantooccipital)",
    page: 10,
  }),
  m({
    id: "oblicuo-superior",
    name: "Oblicuo superior (menor)",
    groupId: "posteriores",
    subregion: "Profundos",
    origen: "Apófisis transversa del atlas",
    insercion:
      "Hueso occipital entre las líneas nucales superior e inferior",
    inervacion: "Ramos posteriores de C1",
    irrigacion:
      "Ramas descendentes profundas de la arteria occipital",
    funcion: "Rotación y mantener posición de la cabeza",
    page: 10,
  }),
];

export const TOTAL_MUSCLES = MUSCLES.length;

export const MUSCLE_BY_ID: Record<string, Muscle> = Object.fromEntries(
  MUSCLES.map((muscle) => [muscle.id, muscle]),
);

export function musclesInGroup(groupId: string): Muscle[] {
  return MUSCLES.filter((muscle) => muscle.groupId === groupId);
}

export function indexOfMuscle(id: string): number {
  return MUSCLES.findIndex((muscle) => muscle.id === id);
}
