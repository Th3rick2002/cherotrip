export const metadata = {
  title: "Sobre Cherotrip",
}

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Sobre Cherotrip
      </h1>
      <p className="text-base leading-relaxed text-muted-foreground">
        Cherotrip es una plataforma informativa y logística para descubrir
        eventos y lugares del oriente de El Salvador. Publicamos solo
        información verificada por el equipo: fechas, horarios, transporte,
        precios y cómo contactar.
      </p>
      <p className="text-base leading-relaxed text-muted-foreground">
        Nuestro objetivo es reducir la fricción al organizar una salida —
        conectándote con el comercio o anfitrión por WhatsApp cuando estés
        listo.
      </p>
    </div>
  )
}
