import { Mail, Phone } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="w-full max-w-sm">
      <h2 className="text-xl font-bold text-gray-900">Get in Touch</h2>

      <div className="mt-6 flex items-start gap-4 border-b border-gray-100 pb-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-blue-400 text-blue-500">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-gray-900">Email Us</p>
          <p className="text-sm text-gray-500">support@internlink.com</p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-il-orange/15 text-il-orange">
          <Phone className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-gray-900">Call Us</p>
          <p className="text-sm text-gray-500">+94 70 123 4567</p>
          <p className="text-sm text-gray-500">Mon - Fri: 9:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>
  );
}
