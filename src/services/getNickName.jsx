import { getDatabase, ref, set,get, remove,update, limitToFirst, query ,orderByChild, startAt , endAt } from "firebase/database";

export default async function getNickName({ userId, amigoId }) {
  const db = getDatabase();
  const amigoRef = ref(db, `usuarios/${userId}/amigos/${amigoId}/nickname`);
  const snapshot = await get(amigoRef);
  if (snapshot.exists()) {
    console.log(`Nickname for amigoId ${amigoId} found:`, snapshot.val());
    return snapshot.val().nickname;
  } else {
    return;
  }
}