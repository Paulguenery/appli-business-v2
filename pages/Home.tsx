import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Search, TrendingUp, Star, MessageSquare, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuestAccessPromo } from '@/components/home/GuestAccessPromo';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
                Trouvez votre match professionnel
              </h1>
              <p className="mt-4 text-xl text-blue-100">
                Connectez-vous avec des co-fondateurs, investisseurs et talents pour construire le futur ensemble.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  <Link to="/auth" className="flex items-center gap-2">
                    Commencer maintenant
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link to="/guest">
                    Explorer sans compte
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Collaboration professionnelle" 
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Types Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pour qui est Mymate ?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Briefcase className="h-16 w-16 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Porteurs de projet</h3>
              <p className="text-gray-600 mb-4">
                Trouvez les talents parfaits pour concrétiser votre vision et faire avancer votre projet.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/guest/talents">Découvrir des talents</Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <Search className="h-16 w-16 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Chercheurs de projet</h3>
              <p className="text-gray-600 mb-4">
                Rejoignez des projets passionnants qui correspondent à vos compétences et aspirations.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/guest/projects">Découvrir des projets</Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="h-48 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <TrendingUp className="h-16 w-16 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Investisseurs</h3>
              <p className="text-gray-600 mb-4">
                Découvrez des opportunités d'investissement dans des projets innovants à fort potentiel.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/guest/investor">Voir les opportunités</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités clés</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Matching intelligent</h3>
              <p className="text-gray-600">
                Notre algorithme vous connecte avec les profils les plus pertinents pour votre projet ou vos compétences.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Communication intégrée</h3>
              <p className="text-gray-600">
                Échangez facilement avec vos matches via notre système de messagerie et d'appels vidéo.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Géolocalisation</h3>
              <p className="text-gray-600">
                Trouvez des opportunités près de chez vous ou élargissez votre recherche à d'autres régions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Access Promo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <GuestAccessPromo />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à trouver votre match professionnel ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Rejoignez notre communauté de porteurs de projets, talents et investisseurs dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              <Link to="/auth">
                Créer un compte
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/guest">
                Explorer sans compte
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}