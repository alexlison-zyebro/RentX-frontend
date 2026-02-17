import React, { useState } from 'react';
import { Building2, ArrowRight, Sparkles, TrendingUp, Users, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <div className="min-h-screen bg-white">

            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                                <Building2 className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-black text-gray-900">Rent<span className="text-orange-600">X</span></span>
                        </div>

                        <div className="hidden lg:flex items-center gap-8">
                            <Link href="/home" className="text-base font-medium text-gray-700 hover:text-orange-600 transition-colors">Home</Link>
                            <a href="#features" className="text-base font-medium text-gray-700 hover:text-orange-600 transition-colors">Features</a>
                            <a href="#how-it-works" className="text-base font-medium text-gray-700 hover:text-orange-600 transition-colors">How It Works</a>
                            <a href="#contact" className="text-base font-medium text-gray-700 hover:text-orange-600 transition-colors">Contact</a>
                        </div>

                        <div className="hidden lg:flex items-center gap-4">
                            <Link to="/login" className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-orange-600 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/registration" className="px-6 py-2.5 text-base bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-md">
                                Sign Up
                            </Link>
                        </div>

                        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenu(!mobileMenu)}>
                            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {mobileMenu && (
                        <div className="lg:hidden py-4 space-y-1 border-t bg-white">
                            <a href="#home" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Home</a>
                            <a href="#features" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Features</a>
                            <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">How It Works</a>
                            <a href="#contact" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Contact</a>
                            <div className="border-t pt-2 mt-2">
                                <a href="/signin" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors">Sign In</a>
                                <a href="/signup" onClick={() => setMobileMenu(false)} className="block mx-4 my-2 px-4 py-3 text-center bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors">Sign Up</a>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <section id="home" className="mx-6 pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-6">
                                <Sparkles className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-semibold text-orange-600">Trusted by 1000+ Users</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                                Rent Power Tools
                                <span className="block text-orange-600">Near You</span>
                            </h1>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Access professional-grade power tools without the commitment. Rent from verified local sellers and complete your projects efficiently.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/browse-tools" className="px-8 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 group">
                                    Browse Tools
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a href="/list-tools" className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center">
                                    List Your Tools
                                </a>
                            </div>

                            <div className="flex items-center gap-8 mt-10">
                                <div>
                                    <div className="text-3xl font-black text-gray-900">500+</div>
                                    <div className="text-sm text-gray-600">Tools Available</div>
                                </div>
                                <div className="w-px h-12 bg-gray-200"></div>
                                <div>
                                    <div className="text-3xl font-black text-gray-900">50+</div>
                                    <div className="text-sm text-gray-600">Cities</div>
                                </div>
                                <div className="w-px h-12 bg-gray-200"></div>
                                <div>
                                    <div className="text-3xl font-black text-gray-900">1000+</div>
                                    <div className="text-sm text-gray-600">Happy Users</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-[460px] mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl transform rotate-2"></div>

                            <div className="relative bg-white rounded-2xl shadow-2xl p-10 transform -rotate-1">
                                <div className="h-80 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-32 h-32 bg-orange-600 rounded-full mx-auto mb-5 flex items-center justify-center">
                                            <Building2 className="w-16 h-16 text-white" />
                                        </div>

                                        <div className="text-3xl font-bold text-gray-900">RentX</div>
                                        <div className="text-base text-gray-600">PowerTools Marketplace</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section id="features" className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Why Choose RentX?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to rent or list power tools seamlessly</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                                <TrendingUp className="w-7 h-7 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Save Money</h3>
                            <p className="text-gray-600 leading-relaxed">Rent tools only when you need them. No upfront costs, no maintenance fees.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-7 h-7 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Verified Sellers</h3>
                            <p className="text-gray-600 leading-relaxed">All sellers are verified with Aadhaar. Rent with complete peace of mind.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                                <Sparkles className="w-7 h-7 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Quick & Easy</h3>
                            <p className="text-gray-600 leading-relaxed">Find tools near you, book instantly, and pick up the same day.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600">Get started in three simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-black text-2xl">1</div>
                            <h3 className="text-xl font-bold mb-3">Sign Up</h3>
                            <p className="text-gray-600">Create your free account in minutes</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-black text-2xl">2</div>
                            <h3 className="text-xl font-bold mb-3">Browse & Book</h3>
                            <p className="text-gray-600">Find tools near you and book instantly</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-black text-2xl">3</div>
                            <h3 className="text-xl font-bold mb-3">Pick Up & Use</h3>
                            <p className="text-gray-600">Collect from seller and complete your project</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 bg-gradient-to-br from-orange-600 to-orange-700">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Get Started?</h2>
                    <p className="text-xl text-orange-100 mb-8">Join thousands of users renting and listing power tools</p>
                    <a href="/signup" className="inline-block px-10 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl">
                        Create Free Account
                    </a>
                </div>
            </section>

            <footer id="contact" className="bg-gray-900 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black">Rent<span className="text-orange-600">X</span></span>
                        </div>
                        <p className="text-gray-400">Your trusted powertools marketplace</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <div className="space-y-2 text-gray-400">
                            <a href="/about" className="block hover:text-white">About Us</a>
                            <a href="/how-it-works" className="block hover:text-white">How It Works</a>
                            <a href="/faq" className="block hover:text-white">FAQ</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <div className="space-y-2 text-gray-400">
                            <a href="/contact" className="block hover:text-white">Contact</a>
                            <a href="/terms" className="block hover:text-white">Terms</a>
                            <a href="/privacy" className="block hover:text-white">Privacy</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Contact</h4>
                        <div className="space-y-2 text-gray-400">
                            <div>support@rentx.com</div>
                            <div>+91 1234567890</div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>© 2026 RentX. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;