import React, { useState, useEffect } from 'react';

import {
  View,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { RectButton } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';

import axios from 'axios';

import { Feather as Icon } from '@expo/vector-icons';

import { UF, City } from '../../models';

interface SelecteItems {
  value: string;
  label: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [UFs, setUFs] = useState<SelecteItems[]>([] as SelecteItems[]);
  const [cities, setCities] = useState<SelecteItems[]>([] as SelecteItems[]);

  const [selectedUF, setSelectedUF] = useState<UF>();
  const [selectedCity, setSelectedCity] = useState<City>();

  useEffect(() => {
    axios
      .get<UF[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
      )
      .then((respose) => {
        const UFs = respose.data.map((UF: UF) => {
          return {
            value: UF.sigla,
            label: UF.sigla,
          };
        });
        setUFs(UFs);
      });
  }, []);

  useEffect(() => {
    if (selectedUF === null) {
      setCities([]);
    }
    axios
      .get<City[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      )
      .then((respose) => {
        const cities = respose.data.map((city: City) => {
          return {
            value: city.nome,
            label: city.nome,
          };
        });
        setCities(cities);
      });
  }, [selectedUF]);

  const handkeNavigationToPoints = () => {
    if (selectedCity && selectedUF) {
      navigation.navigate('Points', {
        city: selectedCity,
        UF: selectedUF,
      });
    } else {
      Alert.alert(
        'Campos incompletos',
        'Informe o estado e a cidade para localizar os pontos de coleta'
      );
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ height: 368, width: 274 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View>
        <RNPickerSelect
          onValueChange={(value) => setSelectedUF(value)}
          placeholder={{ label: 'Estado', value: null }}
          items={UFs}
        />

        <RNPickerSelect
          onValueChange={(value) => setSelectedCity(value)}
          placeholder={{ label: 'Cidade', value: null }}
          items={cities}
        />
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handkeNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  locationSelect: {
    justifyContent: 'space-between',
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

export default Home;
