import { StatsCard } from "@/components/card/Card"

const cardsData = [
  {
    title: "Nombre total prospects",
    value: "683",
    change: "-0.03%",
    isPositive: false,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Nouveaux prospects ce mois-ci",
    value: "120",
    change: "+0.15%",
    isPositive: true,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Taux de conversion",
    value: "5.4%",
    change: "+0.02%",
    isPositive: true,
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "Revenu mensuel récurrent",
    value: "$12,400",
    change: "+0.10%",
    isPositive: true,
    gradient: "from-yellow-500 to-orange-600",
  },
]

export default function Dashboard() {
  return (
    <div>
      <div className="py-8">
        <h1 className="text-3xl font-bold">Dashboard Page</h1>
        <p>Suivi, analyse et pilotage de vos leads et deals</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsData.map((card) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            change={card.change}
            isPositive={card.isPositive}
            gradient={card.gradient}
          />
        ))}
      </div>
    </div>
  )
}