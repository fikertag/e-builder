export default function WhyChoose() {
  const features = [
    { title: "AI Branding", desc: "Instant color palette & typography." },
    { title: "Fast Checkout", desc: "Stripe-powered secure payments." },
    { title: "Mobile Ready", desc: "Responsive across all devices." },
    { title: "Custom Domains", desc: "Use your own or a subdomain." },
  ];

  return (
    <section className="bg-gray-50 py-16 px-4">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Why <span className="text-[#5fde10]">Choose E-Comzy?</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className="p-4 border rounded-lg text-center">
            <h3 className="font-bold text-[#5fde10]">{f.title}</h3>
            <p className="text-gray-700 mt-2 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
