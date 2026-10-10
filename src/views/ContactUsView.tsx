import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Compass, 
  CheckCircle2, 
  Building2, 
  HelpCircle,
  Navigation
} from 'lucide-react';
import { calculateDistanceMiles, formatDistance } from '../utils/geolocation';

export const ContactUsView: React.FC = () => {
  const { 
    userLocation, 
    requestUserLocation, 
    isLocating, 
    locationError,
    showToast 
  } = useApp();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // FreshFind Community Hub Headquarters Coordinates
  const HUB_LAT = 45.5175;
  const HUB_LNG = -122.6750;
  const HUB_ADDRESS = "400 Greenways Boulevard, Suite 210, Metropolis, OR 97201";

  const hubDistance = userLocation ? calculateDistanceMiles(
    userLocation.latitude,
    userLocation.longitude,
    HUB_LAT,
    HUB_LNG
  ) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    setSubmitted(true);
    showToast('Thank you! Your message has been received by the FreshFind team.', 'success');
  };

  const handleResetForm = () => {
    setFormState({
      name: '',
      email: '',
      subject: 'General Question',
      message: ''
    });
    setSubmitted(false);
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=${HUB_LAT},${HUB_LNG}&hl=en&z=15&output=embed`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
      
      {/* Page Header */}
      <div className="border-b border-emerald-100 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
          <Mail className="w-4 h-4 text-emerald-600" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 mt-1">
          Contact Us &amp; Community Hub
        </h1>
        <p className="text-stone-600 text-sm mt-1 max-w-2xl">
          Have inquiries about partnering as a grower, suggesting a new farmers market location, or volunteering? Reach out to our community coordinators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 cols: Contact Info & Live Location Detector */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Static Contact Details Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-serif text-stone-900">
              FreshFind Headquarters
            </h2>

            <div className="space-y-4 text-sm text-stone-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Metropolis Community Hub</span>
                  <p>{HUB_ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Community Hotline</span>
                  <p>(503) 555-0100 (Mon–Fri, 9:00 AM – 5:00 PM)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Direct Email</span>
                  <p>hello@freshfind-egreen.org</p>
                  <p className="text-xs text-stone-400">growers@freshfind-egreen.org (For vendor inquiries)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Walk-In Help Desk Hours</span>
                  <p>Tuesday &amp; Thursday: 10:00 AM – 3:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Geolocation Widget (SRS Requirement) */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Live Geolocation Feature</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h3 className="text-lg font-bold font-serif text-white">
              Check Your Proximity to Our Hub
            </h3>

            <p className="text-xs text-stone-300 leading-relaxed">
              Use your device&apos;s real-time GPS coordinates to verify your location relative to the FreshFind Community Hub.
            </p>

            {userLocation ? (
              <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-200">
                  <span>Detected Coordinates:</span>
                  <span className="font-mono font-semibold text-white">
                    {userLocation.latitude.toFixed(4)}°, {userLocation.longitude.toFixed(4)}°
                  </span>
                </div>
                <div className="flex items-center justify-between text-emerald-200">
                  <span>Distance to Community Hub:</span>
                  <span className="font-bold text-amber-300 text-sm">
                    {formatDistance(hubDistance)}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 pt-1">
                  ✓ Proximity calculations active across all directory listings.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800 text-xs text-stone-300">
                GPS not calibrated yet. Click below to detect your current coordinates.
              </div>
            )}

            <button
              onClick={requestUserLocation}
              disabled={isLocating}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Acquiring GPS Signal...' : userLocation ? 'Recalibrate GPS Location' : 'Detect My Live Coordinates'}</span>
            </button>
          </div>

        </div>

        {/* Right 7 cols: Map & Contact Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Map showing live location / hub (SRS Requirement) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <span>Metropolis Community Hub Location Map</span>
              </h2>
              <span className="text-xs text-stone-500 font-mono">
                {HUB_LAT}, {HUB_LNG}
              </span>
            </div>

            <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-stone-200 shadow-inner bg-stone-100">
              <iframe
                title="FreshFind Metropolis Community Hub Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact / Inquiry Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Send a Message to FreshFind
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                We respond to community inquiries within 1-2 business days.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h3 className="text-base font-bold text-emerald-950 font-serif">Message Dispatched!</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Thank you, {formState.name}. Our eGreen Basket team has logged your note and will be in touch shortly.
                </p>
                <button
                  onClick={handleResetForm}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={e => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Robin Banks"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={e => setFormState({ ...formState, email: e.target.value })}
                      placeholder="you@domain.org"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Inquiry Topic</label>
                  <select
                    value={formState.subject}
                    onChange={e => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="General Question">General Platform Question</option>
                    <option value="Market Organizer">Farmers Market Organizer / Update Schedule</option>
                    <option value="Farmer / Grower">Local Grower / Farm Verification</option>
                    <option value="Volunteering">Community Ambassador / Volunteering</option>
                    <option value="Technical Feedback">Technical Feedback / Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    value={formState.message}
                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                    placeholder="How can we help your local farmers market journey?"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Team</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
