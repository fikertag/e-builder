export default function StoreShowcase() {
  return (
    <section className="bg-background py-10 px-4">
      <h2 className="text-6xl text-primary font-semibold text-center mb-10">
        See E-Comzy In Action
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-card border rounded-lg p-4">
            <div className="h-40 bg-muted mb-4" />
            <p className="text-center text-sm text-muted-foreground">Demo Store #{n}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
