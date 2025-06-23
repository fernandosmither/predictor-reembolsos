import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PredictionForm } from '../components/PredictionForm';
import { 
  LogisticRegressionCard, 
  BayesianNetworkCard, 
  GMMCard 
} from '../components/PredictionCard';
import { Button } from '../components/ui/Button';
import type { PredictionResponse } from '../types/api';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handlePrediction = (data: PredictionResponse) => {
    setPrediction(data);
    setError(null);
    setShowResults(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setPrediction(null);
    setShowResults(false);
  };

  const handleReset = () => {
    setPrediction(null);
    setError(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Form Section */}
        <div className="mb-12">
          <PredictionForm
            onPrediction={handlePrediction}
            onError={handleError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-top duration-500">
            <div className="rounded-xl border border-red-500/50 bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-lg font-semibold text-red-100">Error en la predicción</h3>
                  <p className="text-red-200 mt-1">{error}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className="text-red-300 border-red-500/30 hover:border-red-400/50"
                >
                  Intentar nuevamente
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && prediction && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom duration-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Resultados de la Predicción
              </h2>
              <p className="text-slate-400 text-lg">
                Análisis completo de tres modelos de inteligencia artificial
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
              <LogisticRegressionCard 
                data={prediction.logistic_regression} 
                isVisible={showResults}
              />
              <BayesianNetworkCard 
                data={prediction.bayesian_network} 
                isVisible={showResults}
              />
              <GMMCard 
                data={prediction.gmm} 
                isVisible={showResults}
              />
            </div>

            {/* Reset button */}
            <div className="text-center">
              <Button
                variant="secondary"
                onClick={handleReset}
                className="animate-in fade-in duration-1000 delay-1000"
              >
                Nueva Predicción
              </Button>
            </div>
          </div>
        )}

        {/* Loading state with particles effect */}
        {isLoading && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full border-4 border-cyan-500/20 animate-spin">
                  <div className="absolute inset-2 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" style={{ animationDirection: 'reverse' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-cyan-400 rounded-full animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-cyan-100 mb-2">
                Analizando con IA...
              </h3>
              <p className="text-slate-400">
                Procesando tu información con múltiples modelos
              </p>
              <div className="flex justify-center gap-1 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
