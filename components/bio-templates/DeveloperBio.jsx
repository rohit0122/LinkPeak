export function DeveloperBio({ bio, links }) {
  return (
    <div className="bg-[#0e0e10] text-[#e0e0e0] min-h-screen p-8 font-mono">
      <h1 className="sr-only">{bio.name} — Developer Links</h1>

      <img
        src={bio.profilePic}
        alt={`${bio.name} profile`}
        loading="lazy"
        className="w-24 h-24 rounded-full mx-auto border-2 border-accent"
      />

      <p className="text-center text-xl font-bold mt-2">{bio.name}</p>

      <div className="mt-6 space-y-3">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            aria-label={link.title}
            className="block bg-[#17171b] p-4 rounded-lg border-l-4 border-secondary hover:bg-[#1f1f24] transition"
          >
            <code className="text-sm text-accent">
              $ {link.title.toLowerCase().replace(/ /g, "-")}
            </code>
          </a>
        ))}
      </div>
    </div>
  );
}
