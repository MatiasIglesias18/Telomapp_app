import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Icon, Text, Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import {
  doc,
  deleteDoc,
  query,
  getDocs,
  collection,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, screen } from "../../../utils";
import { styles } from "./TeloReserve.styles";

export function TeloReserve(props) {
  const { telo } = props;

  const navigation = useNavigation();

  const [code, setCode] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const fetchReserve = async () => {
      const q = query(
        collection(db, "reserves"),
        where("idTelo", "==", telo.id),
        where("idUser", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setCode("");
      } else {
        const reserveDoc = querySnapshot.docs[0];
        setCode(reserveDoc.data().code);
      }
    };
    fetchReserve();
  }, [telo.id]);

  console.log(code);

  const goToTelo = () => {
    navigation.navigate(screen.telo.tab, {
      screen: screen.telo.telo,
      params: {
        id: telo.id,
      },
    });
  };

  const onRemoveAlert = () => {
    Alert.alert(
      "Cancelar reserva",
      `¿Estás seguro de cancelar la reserva?`,
      [
        {
          text: "No",
        },
        {
          text: "Si",
          onPress: () => onRemoveReserve(),
        },
      ],
      { cancelable: false }
    );
  };

  const onRemoveReserve = async () => {
    try {
      await deleteDoc(doc(db, "reserves", telo.idReserve));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity onPress={goToTelo}>
      <View style={styles.content}>
        <Image source={{ uri: telo.images[0] }} style={styles.image} />
        <View style={styles.infoContent}>
          <Text style={styles.name}>{telo.name}</Text>
          <Text>Tu código de reserva es: {code} </Text>
          <Icon
            type="material-community"
            name="calendar-check-outline"
            color="#F760A2"
            size={35}
            containerStyle={styles.iconContent}
            onPress={() => onRemoveAlert()}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
