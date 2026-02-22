const players = Array.from({ length: 5 }).map((_, i) => ({
  name: "Jake T.",
  level: "AA",
  year: "2015",
  contact: "jake***@gmail.com",
  status: "Confirmed",
  date: "Jan 3, 2026",
}));

export function RSVPTable() {
  return (
    <div className="mt-6 rounded-2xl bg-secondary-foreground/60 backdrop-blur-md border border-white/10 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm text-gray-200">
          <thead className="bg-white/5 text-xs uppercase">
            <tr>
              <th className="p-4 text-left">Player Name</th>
              <th className="p-4 text-left">Player Details</th>
              <th className="p-4 text-left">Parent Contact</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">RSVP Date</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {players.map((p, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="p-4">{p.name}</td>
                <td className="p-4">
                  Level: {p.level} • Year: {p.year}
                </td>
                <td className="p-4">
                  <button className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs">
                    Request contact
                  </button>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-xs">{p.date}</td>
                <td className="p-4">
                  <a className="text-red-400 hover:underline cursor-pointer">
                    View Profile
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-white/10">
        {players.map((p, i) => (
          <div key={i} className="p-4 text-sm text-gray-200">
            <div className="flex justify-between">
              <p className="font-semibold">{p.name}</p>
              <span className="text-green-400 text-xs">{p.status}</span>
            </div>

            <p className="mt-1 text-xs opacity-80">
              Level {p.level} • Year {p.year}
            </p>

            <div className="mt-3 flex justify-between items-center">
              <button className="px-3 py-1 rounded-md bg-white/10 text-xs">
                Request contact
              </button>
              <span className="text-xs">{p.date}</span>
            </div>

            <a className="mt-2 inline-block text-red-400 text-xs">
              View Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
