import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { cn } from '@/lib/utils';
import { api } from '../lib/api';
import { 
  ISAPRE_OPTIONS, 
  TIPO_OPTIONS,
  type IsapreOption,
  type TipoOption,
  type FormData,
  type FormErrors,
  type PredictionResponse
} from '../types/api';

interface PredictionFormProps {
  onPrediction: (data: PredictionResponse) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function PredictionForm({ 
  onPrediction, 
  onError, 
  isLoading, 
  setIsLoading 
}: PredictionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    isapre: '',
    tipo: '',
    total: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  // Convert arrays to select options
  const isapreOptions = ISAPRE_OPTIONS.map(value => ({ value, label: value }));
  const tipoOptions = TIPO_OPTIONS.map(value => ({ value, label: value }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.isapre) {
      newErrors.isapre = 'Debes seleccionar una Isapre';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'Debes seleccionar un tipo de atención';
    }

    if (!formData.total) {
      newErrors.total = 'Debes ingresar un monto';
    } else {
      const amount = parseInt(formData.total.replace(/\./g, ''));
      if (isNaN(amount) || amount <= 0) {
        newErrors.total = 'El monto debe ser mayor a 0';
      } else if (amount > 10000000) {
        newErrors.total = 'El monto parece demasiado alto';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ isapre: true, tipo: true, total: true });
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const total = parseInt(formData.total.replace(/\./g, ''));
      
      const response = await api.predict({
        isapre: formData.isapre as IsapreOption,
        tipo: formData.tipo as TipoOption,
        total
      });

      onPrediction(response);
    } catch (error) {
      console.error('Prediction error:', error);
      onError(error instanceof Error ? error.message : 'Error al realizar la predicción');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const isFormValid = formData.isapre && formData.tipo && formData.total && Object.keys(errors).length === 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Predictor de Reembolsos
          </h1>
        </div>
        <p className="text-slate-400 text-lg">
          Utiliza inteligencia artificial para predecir tu reembolso médico
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={cn(
          'rounded-2xl border border-slate-600/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50',
          'backdrop-blur-sm p-8 transition-all duration-500',
          'hover:border-cyan-500/30 hover:shadow-[0_0_50px_rgba(6,182,212,0.1)]'
        )}>
          <div className="space-y-6">
            {/* Isapre Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-200">
                Isapre / Seguro de Salud
              </label>
              <Select
                options={isapreOptions}
                value={formData.isapre}
                onChange={(value) => handleFieldChange('isapre', value)}
                placeholder="Selecciona tu Isapre..."
                error={touched.isapre && !!errors.isapre}
                className="w-full"
              />
              {touched.isapre && errors.isapre && (
                <p className="text-sm text-red-400 animate-in fade-in duration-200">
                  {errors.isapre}
                </p>
              )}
            </div>

            {/* Tipo Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-200">
                Tipo de Atención Médica
              </label>
              <Select
                options={tipoOptions}
                value={formData.tipo}
                onChange={(value) => handleFieldChange('tipo', value)}
                placeholder="Selecciona el tipo de atención..."
                error={touched.tipo && !!errors.tipo}
                className="w-full"
              />
              {touched.tipo && errors.tipo && (
                <p className="text-sm text-red-400 animate-in fade-in duration-200">
                  {errors.tipo}
                </p>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Input
                label="Monto Total (CLP)"
                value={formData.total}
                onChange={(value) => handleFieldChange('total', value)}
                onBlur={() => handleFieldBlur('total')}
                placeholder="Ingresa el monto..."
                currency
                                 error={touched.total ? errors.total : undefined}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="xl"
            loading={isLoading}
            disabled={!isFormValid || isLoading}
            className={cn(
              'min-w-[200px] group',
              'transform transition-all duration-300',
              isFormValid && !isLoading
            )}
          >
            {isLoading ? (
              'Analizando...'
            ) : (
              <>
                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                Predecir Reembolso
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 