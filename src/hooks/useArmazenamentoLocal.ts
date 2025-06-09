
import { useState, useEffect } from 'react';

export function useArmazenamentoLocal<T>(chave: string, valorInicial: T) {
  // Função para ler do localStorage
  const lerValor = (): T => {
    if (typeof window === 'undefined') {
      return valorInicial;
    }

    try {
      const item = window.localStorage.getItem(chave);
      return item ? JSON.parse(item) : valorInicial;
    } catch (erro) {
      console.warn(`Erro ao ler localStorage chave "${chave}":`, erro);
      return valorInicial;
    }
  };

  const [valorArmazenado, setValorArmazenado] = useState<T>(lerValor);

  // Função para salvar no localStorage
  const definirValor = (valor: T | ((val: T) => T)) => {
    try {
      const valorParaArmazenar = valor instanceof Function ? valor(valorArmazenado) : valor;
      setValorArmazenado(valorParaArmazenar);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(chave, JSON.stringify(valorParaArmazenar));
      }
    } catch (erro) {
      console.warn(`Erro ao salvar localStorage chave "${chave}":`, erro);
    }
  };

  // Sincronizar com localStorage quando a chave mudar
  useEffect(() => {
    setValorArmazenado(lerValor());
  }, [chave]);

  return [valorArmazenado, definirValor] as const;
}
