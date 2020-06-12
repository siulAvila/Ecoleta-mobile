import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

import { Point, RouteParams } from '../../models';

import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

const Detail = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [point, setPoint] = useState<Point>({} as Point);

  const handleComposeMail = () => {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [point.email],
    });
  };

  const handleWhatsapp = () => {
    Linking.openURL(
      `whatsapp://send?phone=${point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`
    );
  };

  useEffect(() => {
    api.get(`points/${routeParams.id}`).then((response) => {
      setPoint(response.data);
    });
  }, []);

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  return (
    <>
      {!point?.id ? (
        <ActivityIndicator style={styles.spinner} size={48} color="#34cb79" />
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
              <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
            </TouchableOpacity>

            <Image
              style={styles.pointImage}
              source={{
                uri: point?.image,
              }}
            ></Image>

            <Text style={styles.pointName}>{point?.name}</Text>
            <Text style={styles.pointItems}>
              {point?.items
                ?.map((item) => {
                  return item.title;
                })
                .join(', ')}
            </Text>

            <View style={styles.address}>
              <Text style={styles.addressTitle}>Endereço</Text>
              <Text style={styles.addressContent}>
                {point?.city} - {point?.uf}
              </Text>
            </View>
          </View>
          <View style={styles.footer}>
            <RectButton style={styles.button} onPress={handleWhatsapp}>
              <FontAwesome name="whatsapp" size={20} color="#fff" />
              <Text style={styles.buttonText}>Whatsapp</Text>
            </RectButton>

            <RectButton style={styles.button} onPress={handleComposeMail}>
              <Icon name="mail" size={20} color="#fff"></Icon>
              <Text style={styles.buttonText}>E-mail</Text>
            </RectButton>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 32,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 0,
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;
