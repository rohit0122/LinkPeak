export function StreamerBio({ bio, links }) {
  return (
    <div className="bg-black text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center neon">{bio.name}</h1>

      <div className="grid grid-cols-2 gap-4 mt-8">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            aria-label={link.title}
            className="border-2 border-accent p-4 text-center hover:bg-accent hover:text-black transition"
          >
            {link.icon && <span className="text-3xl">{link.icon}</span>}
            <span className="block mt-2 font-bold">{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
