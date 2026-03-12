import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

const BANCO_PALAVRAS = [
  { palavra: 'ESCOLA', dica: 'Lugar onde se aprende' },
  { palavra: 'BANANA', dica: 'Fruta amarela e curva' },
  { palavra: 'COMPUTADOR', dica: 'Máquina que processa dados' },
  { palavra: 'GIRAFA', dica: 'Animal com pescoço longo' },
  { palavra: 'BRASIL', dica: 'País do futebol e samba' },
];

export default function App() {
  const [palavraAtual, setPalavraAtual] = useState('');
  const [dicaAtual, setDicaAtual] = useState('');
  const [letrasDescobertas, setLetrasDescobertas] = useState([]);
  const [vidas, setVidas] = useState(5);
  
  const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    sortearPalavra();
  }, []);

  useEffect(() => {
    if (!palavraAtual) return;

    if (vidas <= 0) {
      Alert.alert("Game Over!", `A palavra era: ${palavraAtual}`, [
        { text: "Tentar De Novo", onPress: sortearPalavra }
      ]);
      return;
    }

    const ganhou = palavraAtual.split('').every(letra => letrasDescobertas.includes(letra));
    
    if (ganhou) {
      Alert.alert("Parabéns! 🎉", "Você acertou a palavra!", [
        { text: "Próxima Palavra", onPress: sortearPalavra }
      ]);
    }

  }, [vidas, letrasDescobertas]);

  function sortearPalavra() {

    const indiceAleatorio = Math.floor(Math.random() * BANCO_PALAVRAS.length);
    const sorteada = BANCO_PALAVRAS[indiceAleatorio];

    setPalavraAtual(sorteada.palavra);
    setDicaAtual(sorteada.dica);
    setLetrasDescobertas([]); 
    setVidas(5); 
  }

  function adivinharLetra(letra) {
    if (vidas <= 0) return; 
    if (letrasDescobertas.includes(letra)) return;

    setLetrasDescobertas([...letrasDescobertas, letra]);

    if (!palavraAtual.includes(letra)) {
      setVidas(vidas - 1);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>EduForca 🎓</Text>
      
      {}
      <View style={styles.placar}>
        <Text style={styles.textoVidas}>Vidas: {'❤️'.repeat(vidas)}</Text>
      </View>

      <View style={styles.areaDica}>
        <Text style={styles.textoDica}>DICA: {dicaAtual}</Text>
      </View>

      <View style={styles.caixaPalavra}>
        {palavraAtual.split('').map((letra, index) => {
          const letraFoiDescoberta = letrasDescobertas.includes(letra);
          return (
            <Text key={index} style={[styles.letra, !letraFoiDescoberta && styles.traco]}>
              {letraFoiDescoberta ? letra : '_'}
            </Text>
          );
        })}
      </View>

      <View style={styles.teclado}>
        {alfabeto.map((letra) => {
          const foiClicado = letrasDescobertas.includes(letra);
          const acertou = palavraAtual.includes(letra);
          
          let estiloBotao = styles.botaoLetra;
          if (foiClicado && acertou) estiloBotao = [styles.botaoLetra, styles.botaoCerto];
          if (foiClicado && !acertou) estiloBotao = [styles.botaoLetra, styles.botaoErrado];

          return (
            <TouchableOpacity 
              key={letra} 
              style={estiloBotao}
              onPress={() => adivinharLetra(letra)}
              disabled={foiClicado || vidas <= 0}
            >
              <Text style={styles.textoBotaoLetra}>{letra}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.botaoReiniciar} onPress={sortearPalavra}>
        <Text style={styles.textoBotaoReiniciar}>Pular Palavra</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  placar: {
    marginBottom: 20,
  },
  textoVidas: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  areaDica: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
  },
  textoDica: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e67e22',
    textAlign: 'center',
  },
  caixaPalavra: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  letra: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#34495e',
    minWidth: 30, 
    textAlign: 'center',
  },
  traco: {
    color: '#bdc3c7',
  },
  teclado: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  botaoLetra: {
    backgroundColor: '#3498db',
    width: 38,
    height: 38,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoCerto: { backgroundColor: '#2ecc71' },
  botaoErrado: { backgroundColor: '#e74c3c' },
  textoBotaoLetra: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoReiniciar: {
    marginTop: 20,
    padding: 10,
  },
  textoBotaoReiniciar: {
    color: '#7f8c8d',
    textDecorationLine: 'underline',
  }
});