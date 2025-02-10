export default function TermsPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-quicksand font-bold text-eggplant mb-8 text-center">Terms of Service</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <p className="text-gray-600 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing and using Daydreamers&apos; website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">2. Products and Services</h2>
          <p className="text-gray-600">
            Daydreamers provides ice cream and treats specifically formulated for dogs. While we strive to ensure the safety and quality of all our products, we recommend consulting with your veterinarian regarding your dog&apos;s specific dietary needs.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">3. Ordering and Payment</h2>
          <p className="text-gray-600">
            All prices are in USD. We reserve the right to modify prices at any time. Payment must be made at the time of purchase. We accept major credit cards and other payment methods as indicated at checkout.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">4. Shipping and Delivery</h2>
          <p className="text-gray-600">
            We ship to all 50 U.S. states, except for frozen products which are only available at our Brooklyn locations. Delivery times are estimates and not guaranteed. Risk of loss and title for items pass to you upon delivery.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">5. Returns and Refunds</h2>
          <p className="text-gray-600">
            We offer a hassle-free return policy. However, for food safety reasons, we cannot accept returns on frozen products or opened food items. Please contact us for specific return instructions.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">6. Intellectual Property</h2>
          <p className="text-gray-600">
            All content on this website, including text, graphics, logos, and images, is the property of Daydreamers and protected by applicable copyright and trademark laws.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">7. Limitation of Liability</h2>
          <p className="text-gray-600">
            Daydreamers is not liable for any damages arising from the use or inability to use our products or services. We recommend following feeding guidelines and consulting with your veterinarian as needed.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">8. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services constitutes acceptance of these changes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">9. Contact Information</h2>
          <p className="text-gray-600">
            For questions about these Terms of Service, please contact us at:<br />
            Email: info@daydreamersnyc.com<br />
            Phone: (541) 359-5481
          </p>
        </div>
      </div>
    </div>
  )
} 