import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { Text, Button } from "react-native-elements";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { useNavigation } from "@react-navigation/native";
import { size } from "lodash";
import { screen, db } from "../../../utils";
import { styles } from "./BtnReserve.styles";

export function BtnReserve(props) {
  const { idTelo } = props;

  const [isReserve, setIsReserve] = useState(undefined);

  const auth = getAuth();

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const response = await getReserve();
      if (size(response) > 0) {
        setIsReserve(true);
      } else {
        setIsReserve(false);
      }
    })();
  }, [idTelo]);

  const getReserve = async () => {
    const q = query(
      collection(db, "reserves"),
      where("idTelo", "==", idTelo),
      where("idUser", "==", auth.currentUser.uid)
    );

    const result = await getDocs(q);

    return result.docs;
  };

  const addReserve = async () => {
    try {
      const idReserve = uuid();

      const generateCode = () => {
        let code = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const codeLength = 6;

        for (let i = 0; i < codeLength; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters[randomIndex];
        }

        return code;
      };

      const code = generateCode();

      const data = {
        id: idReserve,
        idTelo,
        idUser: auth.currentUser.uid,
        code: generateCode(),
      };
      await setDoc(doc(db, "reserves", idReserve), data);

      Alert.alert(
        "Código de reserva",
        `Presentá este código ${data.code} en el establecimiento para efectivizar tu reserva`,
        [
          {
            text: "",
          },
          {
            text: "¡Anotado!",
            onPress: () => console.log("PRESSED"),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [hasLogged, setHasLogged] = useState(false);

  const [hasReserve, setHasReserve] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setHasLogged(user ? true : false);
    });
  }, []);

  useEffect(() => {
    if (hasLogged) {
      const q = query(
        collection(db, "reserves"),
        where("idTelo", "==", idTelo),
        where("idUser", "==", auth.currentUser.uid)
      );
      onSnapshot(q, (snapshot) => {
        if (size(snapshot.docs) > 0) setHasReserve(true);
      });
    }
  }, [hasLogged]);

  if (hasLogged && hasReserve) {
    return (
      <View style={styles.content}>
        <Text style={styles.textSendedReview}>
          Ya tenés una reserva sobre este esteblecimiento
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      {hasLogged ? (
        <Button
          title="Hacé tu reserva"
          icon={{
            type: "material-community",
            name: "calendar-check-outline",
            color: "#ccc",
          }}
          buttonStyle={styles.btnReview}
          onPress={addReserve}
        />
      ) : (
        ""
      )}
    </View>
  );
}
