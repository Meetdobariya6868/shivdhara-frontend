import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/common/PageContainer';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/profile')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                <Shield className="text-blue-600" size={28} />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Privacy & Policy
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-6">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We collect information that you provide directly to us, including when you create
                  an account, place an order, or contact our support team. This may include your
                  name, email address, phone number, and other contact information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your account and orders</li>
                  <li>Improve our services and user experience</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  3. Information Sharing
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We do not sell or rent your personal information to third parties. We may share
                  your information with service providers who assist us in operating our platform,
                  conducting business, or serving you, as long as those parties agree to keep this
                  information confidential.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  4. Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your
                  personal information against unauthorized access, alteration, disclosure, or
                  destruction. However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  5. Your Rights
                </h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Lodge a complaint with a supervisory authority</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  6. Cookies and Tracking
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our service
                  and hold certain information. You can instruct your browser to refuse all cookies
                  or to indicate when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  7. Children's Privacy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Our service is not intended for children under the age of 13. We do not knowingly
                  collect personal information from children under 13. If you are a parent or
                  guardian and believe your child has provided us with personal information, please
                  contact us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  8. Changes to This Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the "Last
                  Updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  9. Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-3 p-4 bg-blue-50 rounded-xl">
                  <p className="text-gray-800">
                    <strong>Email:</strong> privacy@shivdhara.com<br />
                    <strong>Phone:</strong> +91 XXXX XXXXXX
                  </p>
                </div>
              </section>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Last Updated: February 16, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
