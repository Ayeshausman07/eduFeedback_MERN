// src/pages/Landing.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaComments, FaChartLine, FaUserFriends, FaQuoteLeft, FaLock, FaShieldAlt, FaRocket, FaHeart } from 'react-icons/fa';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';


export default function Landing() {
  useEffect(() => {
    // Add scroll animation effect
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    };
    

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-72 h-72 bg-emerald-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-20 w-72 h-72 bg-teal-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      {/* <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FaGraduationCap className="h-8 w-8 text-green-400 transition-transform hover:scale-110" />
              <span className="ml-2 text-xl font-bold text-green-100">EduFeedback</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-green-200 hover:text-green-400 font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-500 transition-colors duration-200 shadow-md"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Navigation */}
<nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-green-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      <div className="flex items-center">
        <FaGraduationCap className="h-8 w-8 text-green-400 transition-transform hover:scale-110" />
        <span className="ml-2 text-xl font-bold text-green-100">EduFeedback</span>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 text-green-200 hover:text-green-400 font-medium transition-colors duration-200"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-500 transition-colors duration-200 shadow-md"
        >
          Register
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-green-200 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
        >
          {isMenuOpen ? (
            <FaTimes className="block h-6 w-6" />
          ) : (
            <FaBars className="block h-6 w-6" />
          )}
        </button>
      </div>
    </div>

    {/* Mobile Navigation Menu */}
    {isMenuOpen && (
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/95 rounded-lg mt-2 border border-green-800/50">
          <Link
            to="/login"
            className="block px-3 py-2 text-green-200 hover:text-green-400 font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block px-3 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-500 transition-colors duration-200 shadow-md mt-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Register
          </Link>
        </div>
      </div>
    )}
  </div>
</nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left side - Content */}
          <div className="w-full md:w-1/2 text-center md:text-left animate-on-scroll opacity-0 transition-all duration-700">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-100 leading-tight">
              Your Feedback
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">Shapes Education</span>
            </h1>
            <p className="mt-6 text-lg text-green-200 max-w-xl">
              Join thousands of students who are actively shaping their educational experience. Your constructive feedback helps educators improve teaching quality and create better learning environments for everyone.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-500 transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-900/30 shadow-green-900/20"
              >
                Get Started
                <FaRocket className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-gray-800 text-green-400 font-medium rounded-md border border-green-700 hover:bg-gray-700 transition-colors duration-200 shadow-sm"
              >
                Sign In
              </Link>
            </div>
            
            {/* Additional stats element for credibility */}
            <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6 text-center">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-green-400">5,000+</span>
                <span className="text-sm text-green-300 mt-1">Active Students</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-green-400">92%</span>
                <span className="text-sm text-green-300 mt-1">Feedback Implemented</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-green-400">200+</span>
                <span className="text-sm text-green-300 mt-1">Educators</span>
              </div>
            </div>
          </div>

          {/* Right side - Image container */}
          <div className="w-full md:w-1/2 flex justify-center animate-on-scroll opacity-0 transition-all duration-700 delay-100">
            <div className="relative">
              <div className="absolute -inset-4 bg-black opacity-30 blur-xl rounded-lg"></div>
              <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-green-800/50">
                <img 
                  src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUybDBsNms4dm1kN2VjM3k4M3lia3dpd2kxdWNxMGNpYnhkcHowOWVyOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WRirZDh1EYZl31NcK2/giphy.gif" 
                  alt="Student feedback animation" 
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-900/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-on-scroll opacity-0 transition-all duration-700">
            <h2 className="text-3xl font-bold text-green-100">Why Your Feedback Matters</h2>
            <p className="mt-4 text-lg text-green-200 max-w-2xl mx-auto">
              Our platform empowers students to make a difference in their educational journey.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="feature-card animate-on-scroll opacity-0 bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-800/30">
              <div className="w-14 h-14 bg-green-900/40 rounded-full flex items-center justify-center mb-4">
                <FaComments className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-100 mb-2">Anonymous Feedback</h3>
              <p className="text-green-200">
                Share your honest opinions without concerns about identification. Your privacy is our priority.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card animate-on-scroll opacity-0 delay-100 bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-800/30">
              <div className="w-14 h-14 bg-green-900/40 rounded-full flex items-center justify-center mb-4">
                <FaChartLine className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-100 mb-2">Impactful Results</h3>
              <p className="text-green-200">
                Your feedback leads to real improvements in teaching methods and course content.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card animate-on-scroll opacity-0 delay-200 bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-800/30">
              <div className="w-14 h-14 bg-green-900/40 rounded-full flex items-center justify-center mb-4">
                <FaLock className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-100 mb-2">Secure Platform</h3>
              <p className="text-green-200">
                Enterprise-grade security ensures your data and feedback remain completely confidential.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card animate-on-scroll opacity-0 delay-300 bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-800/30">
              <div className="w-14 h-14 bg-green-900/40 rounded-full flex items-center justify-center mb-4">
                <FaUserFriends className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-100 mb-2">Community Building</h3>
              <p className="text-green-200">
                Contribute to creating a better learning environment for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-900/70 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-on-scroll opacity-0 transition-all duration-700">
            <h2 className="text-3xl font-bold text-green-100">How It Works</h2>
            <p className="mt-4 text-lg text-green-200 max-w-2xl mx-auto">
              Providing feedback has never been easier
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-green-800/30 animate-on-scroll opacity-0 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-green-800/50 shadow-lg">
                <img 
                  src="https://cdn-icons-gif.flaticon.com/8717/8717910.gif" 
                  alt="Sign up process" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-green-100 mb-2">Sign Up</h3>
              <p className="text-green-200">
                Create your account using your educational institution email. It only takes a minute.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-green-800/30 animate-on-scroll opacity-0 delay-100 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-green-800/50 shadow-lg">
                <img 
                  src="https://cdn-icons-gif.flaticon.com/9583/9583344.gif" 
                  alt="Provide feedback" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-green-100 mb-2">Provide Feedback</h3>
              <p className="text-green-200">
                Select your course and share your thoughts through our intuitive feedback forms.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-green-800/30 animate-on-scroll opacity-0 delay-200 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-green-800/50 shadow-lg">
                <img 
                  src="https://cdn-icons-gif.flaticon.com/8819/8819071.gif" 
                  alt="Make an impact" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-green-100 mb-2">Make an Impact</h3>
              <p className="text-green-200">
                Your feedback is anonymously delivered to educators, helping improve education quality.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Developer Section */}
      <div className="py-16 bg-gray-900/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-on-scroll opacity-0 transition-all duration-700">
            <h2 className="text-3xl font-bold text-green-100">Meet the Developer</h2>
            <p className="mt-4 text-lg text-green-200 max-w-2xl mx-auto">
              Created with passion by a student who understands your needs
            </p>
          </div>

          <div className="mt-12 bg-gray-800/50 rounded-2xl p-8 border border-green-800/30 animate-on-scroll opacity-0">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Developer Image Placeholder */}
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-green-600/50 shadow-2xl mx-auto md:mx-0">
                <div className="w-full h-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">AU</span>
                </div>
                {/* image:
                <img 
                  src="your-image-url-here" 
                  alt="Ayesha Usman" 
                  className="w-full h-full object-cover"
                />
                */}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-green-100 mb-2">Ayesha Usman</h3>
                <p className="text-lg text-green-300 mb-4">MERN Stack Developer & Computer Science Student</p>
                
                <p className="text-green-200 mb-4">
                  "As a student myself, I've experienced firsthand how difficult it can be to provide honest feedback 
                  about courses and teaching methods. That's why I created EduFeedback - to give students a safe, 
                  anonymous platform to share their thoughts and help shape better educational experiences for everyone."
                </p>
                
                <p className="text-green-200">
                  With expertise in modern web technologies including React, Node.js, Express, and MongoDB, 
                  I built this platform to bridge the communication gap between students and educators while 
                  maintaining complete privacy and security.
                </p>
                
                <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-green-900/40 text-green-300 rounded-full text-sm">React.js</span>
                  <span className="px-3 py-1 bg-green-900/40 text-green-300 rounded-full text-sm">Node.js</span>
                  <span className="px-3 py-1 bg-green-900/40 text-green-300 rounded-full text-sm">Express.js</span>
                  <span className="px-3 py-1 bg-green-900/40 text-green-300 rounded-full text-sm">MongoDB</span>
                  <span className="px-3 py-1 bg-green-900/40 text-green-300 rounded-full text-sm">Tailwind CSS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-900/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-on-scroll opacity-0 transition-all duration-700">
            <h2 className="text-3xl font-bold text-green-100">What Students Say</h2>
            <p className="mt-4 text-lg text-green-200 max-w-2xl mx-auto">
              Hear from students who have made a difference
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="testimonial-card animate-on-scroll opacity-0 bg-gray-800 p-6 rounded-xl shadow-md border border-green-800/30">
              <FaQuoteLeft className="text-3xl text-green-500 mb-4" />
              <p className="text-green-200 italic mb-4">"This platform made it so easy to provide constructive feedback. I've already seen changes in my professor's teaching style!"</p>
              <p className="text-green-100 font-medium">- Computer Science Student</p>
            </div>
            <div className="testimonial-card animate-on-scroll opacity-0 delay-100 bg-gray-800 p-6 rounded-xl shadow-md border border-green-800/30">
              <FaQuoteLeft className="text-3xl text-green-500 mb-4" />
              <p className="text-green-200 italic mb-4">"I love that my feedback is anonymous. I can be honest without worrying about affecting my relationship with instructors."</p>
              <p className="text-green-100 font-medium">- Engineering Student</p>
            </div>
            <div className="testimonial-card animate-on-scroll opacity-0 delay-200 bg-gray-800 p-6 rounded-xl shadow-md border border-green-800/30">
              <FaQuoteLeft className="text-3xl text-green-500 mb-4" />
              <p className="text-green-200 italic mb-4">"The interface is intuitive and the process is quick. It takes less than 5 minutes to make a difference in my education."</p>
              <p className="text-green-100 font-medium">- Business Student</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="py-16 bg-gray-900/70 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 animate-on-scroll opacity-0">
              <div className="w-16 h-16 bg-green-900/40 rounded-full flex items-center justify-center mb-6">
                <FaShieldAlt className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-green-100 mb-4">Your Privacy is Protected</h2>
              <p className="text-green-200 mb-4">
                We use advanced encryption and strict privacy protocols to ensure your feedback remains completely anonymous. Educators receive valuable insights without any identifying information.
              </p>
              <ul className="text-green-200 list-disc list-inside space-y-2">
                <li>End-to-end encryption for all feedback data</li>
                <li>No personally identifiable information stored</li>
                <li>Regular security audits and penetration testing</li>
                <li>Compliance with educational data protection standards</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 animate-on-scroll opacity-0 delay-100">
              <div className="bg-gray-800/50 p-6 rounded-xl border border-green-800/30">
                <h3 className="text-xl font-semibold text-green-100 mb-4">Feedback Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-900/40 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-green-400 font-bold">1</span>
                    </div>
                    <p className="text-green-200">You submit feedback through our secure portal</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-900/40 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-green-400 font-bold">2</span>
                    </div>
                    <p className="text-green-200">All identifying information is automatically removed</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-900/40 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-green-400 font-bold">3</span>
                    </div>
                    <p className="text-green-200">Feedback is aggregated with other students' input</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-900/40 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-green-400 font-bold">4</span>
                    </div>
                    <p className="text-green-200">Educators receive comprehensive, anonymous reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-green-800 to-emerald-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-bold text-white animate-on-scroll opacity-0 transition-all duration-700">
            <span className="block">Ready to make your voice heard?</span>
            <span className="text-green-200 text-xl font-normal mt-2 block">Join thousands of students improving education.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 animate-on-scroll opacity-0 transition-all duration-700 delay-100">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-green-800 font-medium rounded-md hover:bg-green-50 transition-colors duration-200 flex items-center justify-center"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="px-8 py-3 bg-green-900/40 text-white font-medium rounded-md hover:bg-green-800 transition-colors duration-200 border border-green-700"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-green-200 py-12 border-t border-green-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <FaGraduationCap className="h-8 w-8 text-green-400" />
              <span className="ml-2 text-xl font-bold text-green-100">EduFeedback</span>
            </div>
            <p className="text-green-300 mb-6">
              Empowering students to shape their education through constructive, anonymous feedback.
            </p>
            <div className="flex items-center justify-center mb-4">
              <FaHeart className="text-red-500 mr-2" />
              <p className="text-green-400">
                Made with love by <span className="font-bold text-green-300">Ayesha Usman</span>
              </p>
            </div>
            <p className="text-green-400">
              &copy; {new Date().getFullYear()} EduFeedback. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-on-scroll {
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}