import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { LoadingModal } from "../../../components/Shared";
import { ListTelos } from "../../../components/Telos";
import { screen, db } from "../../../utils";
import { styles } from "./TelosScreen.styles";

export function TelosScreen(props) {
  const { navigation } = props;

  const [currentUser, setCurrentUser] = useState(null);

  const [telos, setTelos] = useState(null);

  /*BUENOBUENO
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);
*/

  const [userRol, setUserRol] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, where("uid", "==", user.uid));
        console.log(user.uid);

        onSnapshot(q, (snapshot) => {
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            setUserRol(data.rol);
          });
        });
      } else {
        setUserRol(null);
      }
    });
  }, []);

  /*
  const [userRol, setUserRol] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const usersRef = collection(db, "usuarios");
        const userQuery = query(usersRef, where("uid", "==", user.uid));
        onSnapshot(userQuery, (snapshot) => {
          if (snapshot.size > 0) {
            const userData = snapshot.docs[0].data();
            setUserRol(userData.rol);
          }
          console.log(usersRef);
        });
      }
    });
  }, []);
  */

  useEffect(() => {
    const q = query(collection(db, "telos"), orderBy("createAt", "desc"));

    onSnapshot(q, (snapshot) => {
      setTelos(snapshot.docs);
    });
  }, []);

  const goToAddTelo = () => {
    navigation.navigate(screen.telo.addTelo);
  };

  return (
    <View style={styles.content}>
      {!telos ? (
        <LoadingModal show text="Cargando" />
      ) : (
        <ListTelos telos={telos} />
      )}

      {currentUser && userRol !== "user" && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#F760A2"
          containerStyle={styles.btnContainer}
          onPress={goToAddTelo}
        />
      )}
    </View>
  );
}
