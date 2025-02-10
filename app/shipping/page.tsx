export default function ShippingPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-quicksand font-bold text-eggplant mb-8 text-center">Shipping Information</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">Shipping Coverage</h2>
          <p className="text-gray-600">
            We ship to all 50 states in the USA! However, please note that our frozen products (including our signature ice cream) are not available for shipping due to their temperature-sensitive nature.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">Processing Time</h2>
          <p className="text-gray-600">
            Orders are typically processed within 1-2 business days. Once shipped, you&apos;ll receive a tracking number to monitor your delivery.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">Shipping Methods</h2>
          <p className="text-gray-600">
            We offer standard ground shipping (5-7 business days) and expedited shipping (2-3 business days) options at checkout.
          </p>
        </div>

        <div className="bg-creamsicle/20 p-4 rounded-lg">
          <p className="text-eggplant font-bold">
            Please Note: Our frozen treats are only available for purchase at our Brooklyn pop-up locations to ensure the best quality and experience for your pup!
          </p>
        </div>
      </div>
    </div>
  )
} 