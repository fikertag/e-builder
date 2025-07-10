export default function HowItWorks() {
  return (
    <section className="text-center py-16 px-4">
      <h2 className="text-3xl font-semibold mb-4">
        How <span className="text-[#5fde10]">E-Comzy</span> Works
      </h2>
      <p className="text-gray-600 max-w-xl mx-auto mb-10">
        The all-in-one platform to launch, manage, and grow your e-commerce
        store. No tech skills required.
      </p>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <Step
          title="Create Your Store"
          description="Choose a name, layout, and brand style."
        />
        <Step
          title="Add Products"
          description="Upload product photos, descriptions, and prices."
        />
        <Step
          title="Start Selling"
          description="Publish your store and start accepting payments."
        />
      </div>
    </section>
  );
}

function Step({ title, description }: { title: string; description: string }) {
  return (
    <div className="border rounded-lg p-6 w-full max-w-sm">
      <h3 className="text-xl font-bold mb-2 text-[#5fde10]">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
