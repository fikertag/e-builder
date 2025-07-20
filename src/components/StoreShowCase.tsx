export default function StoreShowcase() {
  return (
    <section className="bg-background py-16 px-4">
      <h2 className="text-3xl min-[450px]:text-4xl sm:text-5xl md:text-6xl font-semibold text-center mb-10 text-primary underline underline-offset-8">
        See Ethify In Action
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
