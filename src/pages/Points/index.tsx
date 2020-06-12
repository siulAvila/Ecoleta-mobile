import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';

import { Feather as Icon } from '@expo/vector-icons';

import * as Location from 'expo-location';

import api from '../../services/api';

import { Point, Item } from '../../models';

interface Region {
  city: string;
  UF: string;
}

const Points = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { params } = route;

  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  const [region, setRegion] = useState<Region>(params as Region);

  const [inicialPosition, setinIcialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([
    1,
    2,
    3,
    4,
    5,
    6,
  ]);

  useEffect(() => {
    api.get<Item[]>('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<Item[]>('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get<Point[]>('points', {
        params: { ...region, items: selectedItems },
      })
      .then((response) => {
        setPoints(response.data);
      });
  }, [selectedItems]);

  useEffect(() => {
    const loadPosition = async () => {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'opooopss...',
          'Precisamos de sua permissão para obter a localização'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setinIcialPosition([latitude, longitude]);
    };
    loadPosition();
  }, []);

  const handleItemPress = (selected: number) => {
    const indexOfItem = selectedItems.findIndex((item) => item === selected);

    if (indexOfItem >= 0) {
      const filtred = selectedItems.filter((item) => item !== selected);
      setSelectedItems(filtred);
    } else {
      setSelectedItems([...selectedItems, selected]);
    }
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const navigateToDetail = (pointId: number) => {
    navigation.navigate('Detail', { id: pointId });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          {inicialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              loadingEnabled={inicialPosition[0] === 0}
              initialRegion={{
                latitude: inicialPosition[0],
                longitude: inicialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map((point) => (
                <Marker
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  style={styles.mapMarker}
                  onPress={() => navigateToDetail(point.id)}
                  key={String(point.id)}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image,
                      }}
                    ></Image>
                    <Text style={styles.mapMarkerTitle}>Mercado</Text>
                  </View>
                  <View style={styles.triangle} />
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 30 }}
        >
          {items.map((item) => {
            return (
              <TouchableOpacity
                key={String(item.id)}
                style={[
                  styles.item,
                  selectedItems.includes(item.id) ? styles.selectedItem : {},
                ]}
                onPress={() => {
                  handleItemPress(item.id);
                }}
                activeOpacity={0.6}
              >
                <SvgUri width={42} height={42} uri={item.image_url}></SvgUri>
                <Text style={styles.itemTitle}> {item.title} </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
    alignItems: 'center',
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },

  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: '#34CB79',
    borderLeftWidth: 8,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
});

export default Points;
