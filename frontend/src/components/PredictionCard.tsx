import { useEffect, useState } from 'react';
import { Brain, TrendingUp, BarChart3, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { 
  LogisticRegressionResponse, 
  BayesianNetworkResponse, 
  GMMResponse 
} from '../types/api';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

function AnimatedNumber({ 
  value, 
  duration = 1000, 
  decimals = 0, 
  prefix = '', 
  suffix = '' 
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easeOut);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

function CircularProgress({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  className,
  children 
}: CircularProgressProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercentage(percentage), 200);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-cyan-400 transition-all duration-1000 ease-out"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.6))'
          }}
        />
      </svg>
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

interface LogisticRegressionCardProps {
  data: LogisticRegressionResponse;
  isVisible: boolean;
}

export function LogisticRegressionCard({ data, isVisible }: LogisticRegressionCardProps) {
  const probability = Math.round(data.probability * 100);
  const isApproved = data.chosen_class;

  return (
    <div className={cn(
      'rounded-xl border border-slate-600/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50',
      'backdrop-blur-sm p-6 transition-all duration-700 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      'transform hover:scale-105',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-cyan-100">Regresión Logística</h3>
          <p className="text-sm text-slate-400">Clasificación binaria</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <CircularProgress percentage={probability} size={100}>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-100">
              <AnimatedNumber value={probability} suffix="%" />
            </div>
            <div className="text-xs text-slate-400">Probabilidad</div>
          </div>
        </CircularProgress>

        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            {isApproved ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={cn(
              'font-medium',
              isApproved ? 'text-green-400' : 'text-red-400'
            )}>
              {isApproved ? 'Aprobado' : 'Rechazado'}
            </span>
          </div>
          <div className="text-sm text-slate-400">
            Predicción del modelo
          </div>
        </div>
      </div>
    </div>
  );
}

interface BayesianNetworkCardProps {
  data: BayesianNetworkResponse;
  isVisible: boolean;
}

export function BayesianNetworkCard({ data, isVisible }: BayesianNetworkCardProps) {
  const probability = Math.round(data.probability * 100);

  return (
    <div className={cn(
      'rounded-xl border border-slate-600/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50',
      'backdrop-blur-sm p-6 transition-all duration-700 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      'transform hover:scale-105 delay-150',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-cyan-100">Red Bayesiana</h3>
          <p className="text-sm text-slate-400">Análisis probabilístico</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CircularProgress percentage={probability} size={80}>
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-100">
              <AnimatedNumber value={probability} suffix="%" />
            </div>
            <div className="text-xs text-slate-400">Prob.</div>
          </div>
        </CircularProgress>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-700/50">
            <div className="text-lg font-bold text-green-400">
              $<AnimatedNumber 
                value={data.expected_reimbursement} 
                decimals={0}
                duration={1200}
              />
            </div>
            <div className="text-xs text-slate-400">Reembolso esperado</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-700/50">
            <div className="text-lg font-bold text-yellow-400">
              <AnimatedNumber 
                value={data.expected_wait} 
                decimals={1}
                duration={1000}
              /> días
            </div>
            <div className="text-xs text-slate-400">Tiempo de espera</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GMMCardProps {
  data: GMMResponse;
  isVisible: boolean;
}

export function GMMCard({ data, isVisible }: GMMCardProps) {
  const probability = Math.round(data.probability * 100);

  return (
    <div className={cn(
      'rounded-xl border border-slate-600/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50',
      'backdrop-blur-sm p-6 transition-all duration-700 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      'transform hover:scale-105 delay-300',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-cyan-100">Modelo Gaussiano</h3>
          <p className="text-sm text-slate-400">Análisis de distribución</p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <CircularProgress percentage={probability} size={120}>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-100">
              <AnimatedNumber value={probability} suffix="%" />
            </div>
            <div className="text-sm text-slate-400 mt-1">Probabilidad</div>
            <div className="text-xs text-slate-500">de aprobación</div>
          </div>
        </CircularProgress>
      </div>
    </div>
  );
} 