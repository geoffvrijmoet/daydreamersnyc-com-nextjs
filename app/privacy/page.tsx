export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-quicksand font-bold text-eggplant mb-8 text-center">Privacy Policy</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <p className="text-gray-600 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">1. Introduction</h2>
          <p className="text-gray-600">
            Daydreamers respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">2. Information We Collect</h2>
          <p className="text-gray-600">
            We collect information you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Name and contact information</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information</li>
            <li>Order history</li>
            <li>Communication preferences</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">3. How We Use Your Information</h2>
          <p className="text-gray-600">
            We use your information to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about orders and services</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">4. Information Sharing</h2>
          <p className="text-gray-600">
            We do not sell your personal information. We may share your information with service providers who assist in our operations, such as payment processors and shipping companies. These providers are bound by confidentiality agreements.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">5. Data Security</h2>
          <p className="text-gray-600">
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">6. Cookies and Tracking</h2>
          <p className="text-gray-600">
            We use cookies and similar technologies to improve your browsing experience and analyze website traffic. You can control cookie settings through your browser preferences.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">7. Your Rights</h2>
          <p className="text-gray-600">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">8. Children&apos;s Privacy</h2>
          <p className="text-gray-600">
            Our website is not intended for children under 13. We do not knowingly collect or maintain information from children under 13.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">9. Changes to Privacy Policy</h2>
          <p className="text-gray-600">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-quicksand font-bold text-eggplant mb-3">10. Contact Us</h2>
          <p className="text-gray-600">
            For questions about this Privacy Policy, please contact us at:<br />
            Email: info@daydreamersnyc.com<br />
            Phone: (541) 359-5481
          </p>
        </div>
      </div>
    </div>
  )
} 