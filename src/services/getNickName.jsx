import { getDatabase, ref, set,get, remove,update, limitToFirst, query ,orderByChild, startAt , endAt } from "firebase/database";

export default async function getNickName({ userId, amigoId }) {
  const db = getDatabase();
  const amigoRef = ref(db, `usuarios/${userId}/amigos/${amigoId}/nickname`);
  const snapshot = await get(amigoRef);
  if (snapshot.exists()) {
    return snapshot.val().nickname;
  } else {
    return;
  }
}