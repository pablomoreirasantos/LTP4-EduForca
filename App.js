import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// --- BANCO DE DADOS PEDAGÓGICO ---
const DADOS_DISCIPLINAS = {
  Ciências: [
    { palavra: 'FOTOSSINTESE', dica: 'Processo pelo qual as plantas produzem seu próprio alimento usando a luz do sol.' },
    { palavra: 'GRAVIDADE', dica: 'Força que nos mantém no chão e faz a maçã cair da árvore.' },
  ],
  Geografia: [
    { palavra: 'CONTINENTE', dica: 'Uma grande extensão de terra. O Brasil fica no Americano.' },
    { palavra: 'EQUADOR', dica: 'Linha imaginária que divide o planeta Terra ao meio.' },
  ],
  Português: [
    { palavra: 'ADJETIVO', dica: 'Palavra que dá uma qualidade ou característica a algo (ex: bonito, rápido).' },
    { palavra: 'ALFABETO', dica: 'Conjunto de todas as letras que usamos para escrever.' },
  ]
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu" component={TelaMenu} options={{ headerShown: false }} />
        <Stack.Screen name="Jogo" component={TelaJogo} options={{ title: 'Hora de Aprender!' }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

// ==========================================
// TELA 1: MENU PRINCIPAL
// ==========================================
function TelaMenu({ navigation }) {
  const disciplinas = Object.keys(DADOS_DISCIPLINAS);

  return (
    <View style={styles.containerMenu}>
      <View style={styles.headerMenu}>
        <Text style={styles.tituloMenu}>AcessoSaber</Text>
        <Text style={styles.subtituloMenu}>Aprender é uma descoberta!</Text>
      </View>
      
      <Text style={styles.instrucaoMenu}>Escolha a matéria de hoje:</Text>
      
      <View style={styles.listaBotoes}>
        {disciplinas.map((disciplina) => (
          <TouchableOpacity 
            key={disciplina} 
            style={styles.botaoDisciplina}
            onPress={() => navigation.navigate('Jogo', { materiaSelecionada: disciplina })}
          >
            <Text style={styles.textoBotaoDisciplina}>{disciplina}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ==========================================
// TELA 2: O JOGO
// ==========================================
function TelaJogo({ route, navigation }) {
  const { materiaSelecionada } = route.params;
  const listaPalavras = DADOS_DISCIPLINAS[materiaSelecionada];

  const [palavraAtual, setPalavraAtual] = useState(listaPalavras[0]);
  const [letrasDescobertas, setLetrasDescobertas] = useState([]);
  const [vidas, setVidas] = useState(5);
  
  const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    sortearPalavra();
  }, [materiaSelecionada]);

  useEffect(() => {
    if (!palavraAtual) return;

    if (vidas <= 0) {
      Alert.alert("Não foi dessa vez! 😢", `A palavra correta era: ${palavraAtual.palavra}`, [
        { text: "Tentar de Novo", onPress: sortearPalavra },
        { text: "Voltar ao Menu", onPress: () => navigation.goBack() }
      ]);
      return;
    }

    const ganhou = palavraAtual.palavra.split('').every(letra => letrasDescobertas.includes(letra));
    if (ganhou && letrasDescobertas.length > 0) {
      Alert.alert("Parabéns! 🎉", "Você mandou muito bem!", [
        { text: "Próxima Palavra", onPress: sortearPalavra },
        { text: "Voltar ao Menu", onPress: () => navigation.goBack() }
      ]);
    }
  }, [vidas, letrasDescobertas]);

  function sortearPalavra() {
    const indiceAleatorio = Math.floor(Math.random() * listaPalavras.length);
    setPalavraAtual(listaPalavras[indiceAleatorio]);
    setLetrasDescobertas([]);
    setVidas(5);
  }

  function adivinharLetra(letra) {
    if (vidas <= 0 || letrasDescobertas.includes(letra)) return;
    setLetrasDescobertas([...letrasDescobertas, letra]);
    if (!palavraAtual.palavra.includes(letra)) {
      setVidas(vidas - 1);
    }
  }

  if (!palavraAtual) return null;

  return (
    <View style={styles.containerJogo}>
      <Text style={styles.textoVidas}>Tentativas: {'❤️'.repeat(vidas)}</Text>
      
      <View style={styles.cardDica}>
        <Text style={styles.textoDica}>{palavraAtual.dica}</Text>
      </View>

      <View style={styles.caixaPalavra}>
        {palavraAtual.palavra.split('').map((letra, index) => {
          const revelada = letrasDescobertas.includes(letra);
          return (
            <Text key={index} style={[styles.letra, !revelada && styles.traco]}>
              {revelada ? letra : '_'}
            </Text>
          );
        })}
      </View>

      <View style={styles.teclado}>
        {alfabeto.map((letra) => {
          const clicada = letrasDescobertas.includes(letra);
          const certa = palavraAtual.palavra.includes(letra);
          
          let estiloTecla = styles.tecla;
          if (clicada && certa) estiloTecla = [styles.tecla, styles.teclaCerta];
          if (clicada && !certa) estiloTecla = [styles.tecla, styles.teclaErrada];

          return (
            <TouchableOpacity 
              key={letra} style={estiloTecla} 
              onPress={() => adivinharLetra(letra)} disabled={clicada || vidas <= 0}
            >
              <Text style={styles.textoTecla}>{letra}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// --- ESTILOS VISUAIS (Foco em Acessibilidade) ---
const styles = StyleSheet.create({
  // Menu
  containerMenu: { flex: 1, backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center', padding: 20 },
  headerMenu: { marginBottom: 40, alignItems: 'center' },
  tituloMenu: { fontSize: 42, fontWeight: 'bold', color: '#1565C0' },
  subtituloMenu: { fontSize: 18, color: '#546E7A', marginTop: 5 },
  instrucaoMenu: { fontSize: 22, fontWeight: '600', color: '#37474F', marginBottom: 20 },
  listaBotoes: { width: '100%', alignItems: 'center' },
  botaoDisciplina: { backgroundColor: '#42A5F5', paddingVertical: 18, paddingHorizontal: 30, borderRadius: 15, marginBottom: 15, width: '80%', alignItems: 'center', elevation: 3 },
  textoBotaoDisciplina: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },

  // Jogo
  containerJogo: { flex: 1, backgroundColor: '#FAFAFA', alignItems: 'center', padding: 20 },
  textoVidas: { fontSize: 24, color: '#D32F2F', marginBottom: 15, fontWeight: 'bold' },
  cardDica: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, width: '100%', alignItems: 'center', elevation: 4, marginBottom: 30, borderWidth: 2, borderColor: '#FFF9C4' },
  textoDica: { fontSize: 20, color: '#F57F17', textAlign: 'center', fontWeight: 'bold' },
  caixaPalavra: { flexDirection: 'row', gap: 10, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' },
  letra: { fontSize: 36, fontWeight: 'bold', color: '#263238', minWidth: 35, textAlign: 'center' },
  traco: { color: '#B0BEC5' },
  
  // Teclado
  teclado: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  tecla: { backgroundColor: '#90CAF9', width: 45, height: 45, borderRadius: 8, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  teclaCerta: { backgroundColor: '#66BB6A' },
  teclaErrada: { backgroundColor: '#EF5350' },
  textoTecla: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
});